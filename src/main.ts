import http from 'http';
import { dashboardService } from './services/dashboardService';
import { Period } from './models/dashboardSnapshot';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

export function createServer() {
  return http.createServer(async (req, res) => {
    try {
      if (!req.url || !req.method) {
        res.statusCode = 404;
        res.end();
        return;
      }

      const url = new URL(req.url, `http://${req.headers.host}`);
      const pathname = url.pathname;

      const matchGet = pathname.match(/^\/api\/v1\/dashboards\/(daily|weekly)\/?$/);
      const matchPost = pathname.match(/^\/api\/v1\/dashboards\/(daily|weekly)\/refresh\/?$/);

      if (req.method === 'GET' && matchGet) {
        const period = matchGet[1] as Period;
        const snapshot = await dashboardService.getSnapshot(period);
        if (!snapshot) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'not found' }));
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(snapshot));
        return;
      }

      if (req.method === 'POST' && matchPost) {
        const period = matchPost[1] as Period;
        try {
          const refreshed = await dashboardService.refreshSnapshot(period);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(refreshed));
          return;
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'internal', message: String(err) }));
          return;
        }
      }

      res.statusCode = 404;
      res.end();
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'internal', message: String(err) }));
    }
  });
}

export function startServer(port = PORT) {
  const server = createServer();
  return new Promise<http.Server>((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

if (require.main === module) {
  startServer().then(() => console.log(`Server listening on ${PORT}`));
}
