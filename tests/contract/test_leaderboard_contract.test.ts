import { describe, it, beforeAll, afterAll, expect } from 'bun:test';

// Contract test stub T018: GET /api/v1/leaderboard?period=daily -> expect 200 and array
// If `tests/setup/server.ts` exists, it can be imported to start the server for tests.
// Fallback: tests expect the server to be running at http://localhost:3000

import { startTestServer, stopTestServer } from '../setup/server'; // test helper to start/stop the app server

describe('Leaderboard contract', () => {
  beforeAll(async () => {
    await startTestServer(3000);
  });

  afterAll(async () => {
    await stopTestServer();
  });

  it('GET /api/v1/leaderboard?period=daily returns 200 and array', async () => {
    const res = await fetch('http://localhost:3000/api/v1/leaderboard?period=daily').catch(
      () => null,
    );

    expect(res).not.toBeNull();
    if (!res) return;
    expect(res.status).toBe(200);

    const json = await res.json().catch(() => null);
    expect(json).not.toBeNull();
    if (!json) return;
    expect(Array.isArray(json)).toBeTruthy();
  });
});
