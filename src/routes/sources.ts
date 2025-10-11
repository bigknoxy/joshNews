import { IncomingMessage, ServerResponse } from 'http';

/**
 * Handles POST /api/v1/sources
 * Stub implementation: validates and stores source, returns 201 with id
 */
export async function handlePostSources(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end();
    return;
  }

  let body = '';
  for await (const chunk of req) body += chunk;
  const data = body ? JSON.parse(body) : {};

  // Basic validation
  if (!data.type || !data.value) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'type and value required' }));
    return;
  }

  // Use global adapter
  const { getSourcesAdapter } = await import('../lib/sourcesStore');
  const adapter = getSourcesAdapter();
  const rec = await adapter.addSource(data);

  res.statusCode = 201;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ id: rec.id }));
}

/**
 * Handles GET /api/v1/sources
 * Stub implementation: returns list of sources with pagination
 */
export async function handleGetSources(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end();
    return;
  }

  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const limitParam = Number(url.searchParams.get('limit') || '100');
  const offsetParam = Number(url.searchParams.get('offset') || '0');
  const requested = Number.isFinite(limitParam) ? Math.max(0, limitParam) : 100;
  const offset = Number.isFinite(offsetParam) ? Math.max(0, offsetParam) : 0;
  const cap = 100;
  const actualLimit = Math.min(requested, cap);

  const { getSourcesAdapter } = await import('../lib/sourcesStore');
  const adapter = getSourcesAdapter();
  const list = await adapter.listSources(offset, actualLimit);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(list));
}
