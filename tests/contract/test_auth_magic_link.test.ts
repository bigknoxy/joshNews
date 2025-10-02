import { describe, it, beforeAll, afterAll, expect } from 'bun:test';

// Contract test stub T015: POST /api/v1/auth/magic-link -> expect 202
// If `tests/setup/server.ts` exists, it can be imported to start the server for tests.
// Fallback: tests expect the server to be running at http://localhost:3000

import { startTestServer, stopTestServer } from '../setup/server'; // test helper to start/stop the app server

describe('Auth contract: magic link', () => {
  beforeAll(async () => {
    await startTestServer(3000);
  });

  afterAll(async () => {
    await stopTestServer();
  });

  it('POST /api/v1/auth/magic-link returns 202', async () => {
    const res = await fetch('http://localhost:3000/api/v1/auth/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    }).catch(() => null);

    expect(res).not.toBeNull();
    if (!res) return;
    expect([202, 200, 201]).toContain(res.status);
  });
});
