import http from 'http';
// Adapter-backed stores for sources
import { createMemoryAdapter } from './adapters/sourcesMemoryAdapter';
import { setSourcesAdapter } from './lib/sourcesStore';

let adapter: any = createMemoryAdapter();
setSourcesAdapter(adapter);

// adapter selection via env var (SOURCES_ADAPTER=file|memory)
if (process.env.SOURCES_ADAPTER === 'file') {
  // lazy-load file adapter when used in server startup
  // the tests will set adapter later if needed
}

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

export function createServer(): http.Server {
  return http.createServer(async (req, res) => {
    // simple health endpoint
    if (
      req.method === 'GET' &&
      req.url &&
      new URL(req.url, `http://${req.headers.host}`).pathname === '/health'
    ) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('ok');
      return;
    }
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

      // Auth endpoints
      if (pathname === '/api/v1/auth/magic-link') {
        const { handleMagicLink } = await import('./routes/auth');
        await handleMagicLink(req, res);
        return;
      }

      if (pathname === '/api/v1/auth/verify') {
        const { handleVerify } = await import('./routes/auth');
        await handleVerify(req, res);
        return;
      }

      // Sources CRUD
      if (pathname === '/api/v1/sources') {
        if (req.method === 'POST') {
          const { handlePostSources } = await import('./routes/sources');
          await handlePostSources(req, res);
          return;
        }
        if (req.method === 'GET') {
          const { handleGetSources } = await import('./routes/sources');
          await handleGetSources(req, res);
          return;
        }
      }

      // Items
      if (req.method === 'GET' && pathname === '/api/v1/items') {
        const { ingestAll } = await import('./services/ingestService');
        const items = await ingestAll();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(items));
        return;
      }

      // Leaderboard
      if (req.method === 'GET' && pathname === '/api/v1/leaderboard') {
        // return empty array
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify([]));
        return;
      }

      // Jobs endpoints using jobService
      const jobsMatch = pathname.match(/^\/api\/v1\/jobs\/(.+)$/);
      if (req.method === 'POST' && pathname === '/api/v1/jobs') {
        // start a job
        let body = '';
        for await (const chunk of req) body += chunk;
        const data = body ? JSON.parse(body) : {};
        const { jobService } = await import('./services/jobRegistry');
        // support starting by type or by inline function
        const jobId = jobService.startJob(
          data.type || (async () => ({ ok: true })),
          data.payload,
          data.options,
        );
        res.statusCode = 202;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ jobId }));
        return;
      }

      if (req.method === 'GET' && jobsMatch) {
        const jobId = jobsMatch[1];
        const { jobService } = await import('./services/jobRegistry');
        const j = jobService.getJob(jobId);
        if (!j) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'not found' }));
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(j));
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

      if (matchGet) {
        const { handleGetDashboard } = await import('./routes/dashboards');
        await handleGetDashboard(req, res);
        return;
      }

      if (matchPost) {
        const { handleRefreshDashboard } = await import('./routes/dashboards');
        await handleRefreshDashboard(req, res);
        return;
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

export async function startServer(port = PORT) {
  // initialize adapter if file-based
  if (process.env.SOURCES_ADAPTER === 'file') {
    const { createFileAdapter } = await import('./adapters/sourcesFileAdapter');
    // choose a default file path
    adapter = await createFileAdapter('./data/sources.json');
  }

  const server = createServer();
  return new Promise<http.Server>((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

if (require.main === module) {
  startServer().then(() => console.log(`Server listening on ${PORT}`));
}
