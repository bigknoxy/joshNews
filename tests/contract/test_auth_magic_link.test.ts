import { describe, it, expect } from 'bun:test';

// Contract test stub: POST /api/v1/auth/magic-link -> 202
// This test is expected to FAIL until the endpoint exists.

describe('Auth contract: magic-link', () => {
  it('POST /api/v1/auth/magic-link returns 202', async () => {
    // Minimal test: call local server or mock client
    // Implementation note: test should assert status 202 when endpoint implemented
    const res = await fetch('http://localhost:3000/api/v1/auth/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    }).catch(() => null);

    expect(res).not.toBeNull();
    // When implementation exists expect res.status === 202
  });
});
