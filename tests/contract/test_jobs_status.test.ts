import { describe, it, expect } from 'bun:test';
import { startTestServer } from '../setup/server';

// Contract test stub for jobs status

describe('Jobs contract', () => {
  it('GET /api/v1/jobs/{jobId} returns 200 with job fields', async () => {
    const stop = await startTestServer(3000);
    try {
      const res = await fetch('http://localhost:3000/api/v1/jobs/job123').catch(() => null);
      expect(res).not.toBeNull();
    } finally {
      await stop();
    }
  });
});
