import { IncomingMessage, ServerResponse } from 'http';

/**
 * Handles POST /api/v1/auth/magic-link
 * Stub implementation: returns 202 Accepted with no body
 */
export async function handleMagicLink(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end();
    return;
  }

  let body = '';
  for await (const chunk of req) body += chunk;
  const data = body ? JSON.parse(body) : {};

  const email = data.email;
  if (!email || typeof email !== 'string') {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'email required' }));
    return;
  }

  // Stub: just accept and return 202
  res.statusCode = 202;
  res.end();
}

/**
 * Handles GET /api/v1/auth/verify
 * Stub implementation: returns 200 with userId and sessionToken
 */
export async function handleVerify(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end();
    return;
  }

  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const token = url.searchParams.get('token');

  if (!token) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'token required' }));
    return;
  }

  // Stub: return placeholder userId and sessionToken
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      userId: 'user-placeholder',
      sessionToken: 'session-placeholder',
    }),
  );
}
