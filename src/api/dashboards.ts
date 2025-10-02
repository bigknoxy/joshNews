import { IncomingMessage, ServerResponse } from 'http';
import { dashboardService } from '../services/dashboardService';
import { Period } from '../models/dashboardSnapshot';

export async function dashboardHandler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  if (!req.url || !req.method) return false;
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
      return true;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(snapshot));
    return true;
  }

  if (req.method === 'POST' && matchPost) {
    const period = matchPost[1] as Period;
    try {
      const refreshed = await dashboardService.refreshSnapshot(period);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(refreshed));
      return true;
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'internal', message: String(err) }));
      return true;
    }
  }

  return false;
}
