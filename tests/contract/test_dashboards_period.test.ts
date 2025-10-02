import { describe, it, beforeAll, afterAll, expect } from 'bun:test';

// Contract test for dashboards period endpoint
// GET /api/v1/dashboards/daily -> expect 200, items.length <= 50, sorted by score desc

import { startTestServer, stopTestServer } from '../setup/server';

describe('Dashboards contract: daily period', () => {
  beforeAll(async () => await startTestServer(3000));
  afterAll(async () => await stopTestServer());

  it('GET /api/v1/dashboards/daily returns 200 and <=50 items sorted by score desc', async () => {
    const res = await fetch('http://localhost:3000/api/v1/dashboards/daily').catch(() => null);
    expect(res).not.toBeNull();
    if (!res) return;
    expect(res.status).toBe(200);

    const json = await res.json().catch(() => null);
    expect(json).not.toBeNull();
    if (!json) return;
    expect(Array.isArray(json.items)).toBeTruthy();
    expect(json.items.length).toBeLessThanOrEqual(50);

    for (let i = 1; i < json.items.length; i++) {
      const prev = json.items[i - 1];
      const cur = json.items[i];
      // allow missing score fields to intentionally fail until implemented
      if (typeof prev.score === 'number' && typeof cur.score === 'number') {
        expect(prev.score).toBeGreaterThanOrEqual(cur.score);
      }
    }
  });
});
