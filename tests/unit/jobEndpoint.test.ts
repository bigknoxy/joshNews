import { describe, it, expect } from 'bun:test';
import { createServer } from '../../src/main';

describe('Job endpoint (unit)', () => {
  it('POST /api/v1/jobs delegates to jobService and returns jobId', async () => {
    const server = createServer();
    await new Promise((r) => server.listen(0, r));
    const addr = server.address();
    const port = typeof addr === 'object' && addr ? addr.port : 3000;
    const res = await fetch(`http://127.0.0.1:${port}/api/v1/jobs`, {
      method: 'POST',
      body: JSON.stringify({ type: 'noop' }),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(202);
    const body = await res.json();
    expect(body.jobId).toBeDefined();
    server.close();
  });
});
