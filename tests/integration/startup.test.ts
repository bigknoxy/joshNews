import { test, expect } from 'bun:test';
import type http from 'http';
import { startServer } from '../../src/main';

test('app responds on /health with ok', async () => {
  // start server on ephemeral port (0)
  const server = (await startServer(0)) as unknown as http.Server;
  try {
    const addr = server.address();
    const port = typeof addr === 'object' && addr && 'port' in addr ? (addr as any).port : 3000;

    const res = await fetch(`http://127.0.0.1:${port}/health`);
    const body = await res.text();

    // Expect a healthy 200 OK and body to include 'ok' (this will fail with current code)
    expect(res.status).toBe(200);
    expect(body.toLowerCase()).toContain('ok');
  } finally {
    server.close();
  }
});
