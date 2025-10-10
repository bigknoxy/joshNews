import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { startTestServer, stopTestServer } from '../setup/server';

describe('Sources contract: pagination and caps', () => {
  beforeAll(async () => await startTestServer(3000));
  afterAll(async () => await stopTestServer());

  it('GET /api/v1/sources supports limit/offset and caps at 100', async () => {
    // ensure there are > 110 items
    for (let i = 0; i < 120; i++) {
      await fetch('http://localhost:3000/api/v1/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'link', value: `https://example.com/${i}` }),
      });
    }

    const res = await fetch('http://localhost:3000/api/v1/sources?limit=150').catch(() => null);
    expect(res).not.toBeNull();
    if (!res) return;
    expect(res.status).toBe(200);
    const json = await res.json().catch(() => null);
    expect(json).not.toBeNull();
    if (!json) return;
    // cap applied at 100
    expect(json.length).toBeLessThanOrEqual(100);

    // test limit/offset
    const r2 = await fetch('http://localhost:3000/api/v1/sources?limit=10&offset=10');
    expect(r2.status).toBe(200);
    const page = await r2.json();
    expect(page.length).toBe(10);
  });
});
