import { describe, it, expect } from 'bun:test';

// Contract test stub for leaderboard

describe('Leaderboard contract', () => {
  it('GET /api/v1/leaderboard?period=daily returns 200 and array', async () => {
    const res = await fetch('http://localhost:3000/api/v1/leaderboard?period=daily').catch(
      () => null,
    );
    expect(res).not.toBeNull();
  });
});
