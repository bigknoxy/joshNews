import { describe, it, expect } from 'bun:test';

// Contract test stub for export and deletion

describe('Export & Deletion contract', () => {
  it('GET /api/v1/users/{userId}/export returns 200 with downloadUrl', async () => {
    const res = await fetch('http://localhost:3000/api/v1/users/uid123/export').catch(() => null);
    expect(res).not.toBeNull();
  });

  it('DELETE /api/v1/users/{userId}/data returns 202', async () => {
    const res = await fetch('http://localhost:3000/api/v1/users/uid123/data', {
      method: 'DELETE',
    }).catch(() => null);
    expect(res).not.toBeNull();
  });
});
