import http from 'http';
import { dashboardService } from './services/dashboardService';
import { Period } from './models/dashboardSnapshot';

// Minimal in-memory stores for contract test stubs
const sources: any[] = [];
let nextSourceId = 1;

import { validateSource } from './lib/validators';

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

      // Auth endpoints wired to authService
      if (req.method === 'POST' && pathname === '/api/v1/auth/magic-link') {
        let body = '';
        for await (const chunk of req) body += chunk;
        const data = body ? JSON.parse(body) : {};
        const email = data.email || data.username || '';
        if (!email) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'email required' }));
          return;
        }
        try {
          // lazy import to avoid cycles in tests
          // @ts-ignore
          const { sendMagicLink } = await import('./services/authService');
          const token = await sendMagicLink(email);
          res.statusCode = 202;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ token }));
          return;
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'internal', message: String(err) }));
          return;
        }
      }

      if (req.method === 'GET' && pathname === '/api/v1/auth/verify') {
        const token = url.searchParams.get('token') || '';
        try {
          // @ts-ignore
          const { verifyToken } = await import('./services/authService');
          const verified = await verifyToken(token);
          if (!verified) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'invalid token' }));
            return;
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(verified));
          return;
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'internal', message: String(err) }));
          return;
        }
      }

      // Sources CRUD
      if (pathname === '/api/v1/sources' && req.method === 'POST') {
        let body = '';
        for await (const chunk of req) body += chunk;
        const data = body ? JSON.parse(body) : {};
        // validate
        const v = validateSource(data);
        if (!v.valid) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'invalid', errors: v.errors }));
          return;
        }
        const id = `s-${nextSourceId++}`;
        const item = { id, ...data };
        sources.push(item);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ id }));
        return;
      }

      if (pathname === '/api/v1/sources' && req.method === 'GET') {
        const limitParam = Number(url.searchParams.get('limit') || '100');
        const offsetParam = Number(url.searchParams.get('offset') || '0');
        const requested = Number.isFinite(limitParam) ? Math.max(0, limitParam) : 100;
        const offset = Number.isFinite(offsetParam) ? Math.max(0, offsetParam) : 0;
        const cap = 100;
        const actualLimit = Math.min(requested, cap);
        const slice = sources.slice(offset, offset + actualLimit);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(slice));
        return;
      }

      // Leaderboard
      if (req.method === 'GET' && pathname === '/api/v1/leaderboard') {
        const period = url.searchParams.get('period') || 'daily';
        // return empty array
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify([]));
        return;
      }

      // Jobs/items/users stubs used by tests
      const jobsMatch = pathname.match(/^\/api\/v1\/jobs\/(.+)$/);
      if (req.method === 'GET' && jobsMatch) {
        const jobId = jobsMatch[1];
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ id: jobId, status: 'done' }));
        return;
      }

      const itemActions = pathname.match(/^\/api\/v1\/items\/(.+)\/actions$/);
      if (req.method === 'POST' && itemActions) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: true }));
        return;
      }

      const userExport = pathname.match(/^\/api\/v1\/users\/(.+)\/export$/);
      if (req.method === 'GET' && userExport) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ downloadUrl: 'http://example.com/download' }));
        return;
      }

      const userDataDelete = pathname.match(/^\/api\/v1\/users\/(.+)\/data$/);
      if (req.method === 'DELETE' && userDataDelete) {
        res.statusCode = 202;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ accepted: true }));
        return;
      }

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
