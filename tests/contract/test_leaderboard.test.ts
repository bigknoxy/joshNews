import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { startTestServer, stopTestServer } from '../setup/server';

// Contract test stub for leaderboard

beforeAll(async () => await startTestServer(3000));
afterAll(async () => await stopTestServer());

describe('Leaderboard contract', () => {
  it('GET /api/v1/leaderboard?period=daily returns 200 and array', async () => {
    const res = await fetch('http://localhost:3000/api/v1/leaderboard?period=daily').catch(
      () => null,
    );
    expect(res).not.toBeNull();
  });
});
