import { IncomingMessage, ServerResponse } from 'http';

/**
 * Handles GET /api/v1/dashboards/daily
 * Stub implementation: returns placeholder snapshot
 */
export async function handleGetDashboard(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end();
    return;
  }

  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const period = url.pathname.split('/').pop() as 'daily' | 'weekly';

  if (!['daily', 'weekly'].includes(period)) {
    res.statusCode = 404;
    res.end();
    return;
  }

  const { dashboardService } = await import('../services/dashboardService');
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
}

/**
 * Handles POST /api/v1/dashboards/daily/refresh
 * Stub implementation: refreshes snapshot
 */
export async function handleRefreshDashboard(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end();
    return;
  }

  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const parts = url.pathname.split('/');
  const period = parts[parts.length - 2] as 'daily' | 'weekly';

  if (!['daily', 'weekly'].includes(period)) {
    res.statusCode = 404;
    res.end();
    return;
  }

  const { dashboardService } = await import('../services/dashboardService');
  try {
    const refreshed = await dashboardService.refreshSnapshot(period);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(refreshed));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'internal', message: String(err) }));
  }
}
