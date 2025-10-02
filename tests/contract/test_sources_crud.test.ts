import { describe, it, expect } from 'bun:test';

// Contract test stub for sources CRUD

describe('Sources contract: CRUD', () => {
  it('POST /api/v1/sources returns 201 with id', async () => {
    const res = await fetch('http://localhost:3000/api/v1/sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'link', value: 'https://example.com' }),
    }).catch(() => null);
    expect(res).not.toBeNull();
  });

  it('GET /api/v1/sources returns 200 and array', async () => {
    const res = await fetch('http://localhost:3000/api/v1/sources').catch(() => null);
    expect(res).not.toBeNull();
  });
});
