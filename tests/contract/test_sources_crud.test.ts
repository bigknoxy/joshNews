import { describe, it, expect, beforeAll, afterAll } from 'bun:test';

// Contract test stub for sources CRUD
// This file is a contract test (T017) asserting POST returns 201 with { id } and GET returns 200 with an array.
// If `tests/setup/server.ts` exists, import and use it in beforeAll/afterAll. Otherwise ensure the server runs at http://localhost:3000

import { startTestServer, stopTestServer } from '../setup/server';

describe('Sources contract: CRUD', () => {
  beforeAll(async () => await startTestServer(3000));
  afterAll(async () => await stopTestServer());
  it('POST /api/v1/sources returns 201 with id', async () => {
    const res = await fetch('http://localhost:3000/api/v1/sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'link', value: 'https://example.com' }),
    }).catch(() => null);
    expect(res).not.toBeNull();
    if (!res) return;
    expect(res.status).toBe(201);
    const json = await res.json().catch(() => null);
    expect(json).not.toBeNull();
    if (!json) return;
    expect(typeof json.id === 'string' || typeof json.id === 'number').toBeTruthy();
  });

  it('GET /api/v1/sources returns 200 and array', async () => {
    const res = await fetch('http://localhost:3000/api/v1/sources').catch(() => null);
    expect(res).not.toBeNull();
    if (!res) return;
    expect(res.status).toBe(200);
    const json = await res.json().catch(() => null);
    expect(json).not.toBeNull();
    if (!json) return;
    expect(Array.isArray(json)).toBeTruthy();
  });
});
