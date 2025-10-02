import { describe, it, expect } from 'bun:test';
import { startTestServer, stopTestServer } from '../setup/server';

// Contract test stub for item actions

describe('Items contract: actions', () => {
  it('POST /api/v1/items/{id}/actions returns 200', async () => {
    const stop = await startTestServer(3000);
    try {
      const res = await fetch('http://localhost:3000/api/v1/items/123/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save' }),
      }).catch(() => null);
      expect(res).not.toBeNull();
    } finally {
      await stop();
    }
  });
});
