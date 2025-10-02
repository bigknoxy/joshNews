import { describe, it, beforeAll, afterAll, expect } from 'bun:test';

// Contract test stub T016: GET /api/v1/auth/verify?token=TEST_TOKEN -> expect 200 with userId, sessionToken
// If `tests/setup/server.ts` exists, it can be imported to start the server for tests.
// Fallback: tests expect the server to be running at http://localhost:3000

import { startTestServer, stopTestServer } from '../setup/server'; // test helper to start/stop the app server

describe('Auth contract: verify', () => {
  beforeAll(async () => {
    await startTestServer(3000);
  });

  afterAll(async () => {
    await stopTestServer();
  });

  it('GET /api/v1/auth/verify?token=TEST_TOKEN returns 200 and userId, sessionToken', async () => {
    const res = await fetch('http://localhost:3000/api/v1/auth/verify?token=TEST_TOKEN').catch(
      () => null,
    );

    expect(res).not.toBeNull();
    if (!res) return;
    expect(res.status).toBe(200);

    const json = await res.json().catch(() => null);
    expect(json).not.toBeNull();
    if (!json) return;
    expect(typeof json.userId === 'string' || typeof json.userId === 'number').toBeTruthy();
    expect(typeof json.sessionToken === 'string').toBeTruthy();
  });
});
