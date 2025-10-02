import { describe, it, expect } from 'bun:test';
import { createJobService } from '../../src/services/jobService';

describe('Job service (unit)', () => {
  it('creates a job and marks it done after work completes', async () => {
    const js = createJobService();
    const jobId = js.startJob(async () => {
      // simulate work
      await new Promise((r) => setTimeout(r, 10));
      return { result: 'ok' };
    });

    // job should exist
    const pending = js.getJob(jobId);
    expect(pending).not.toBeNull();
    expect(['pending','running']).toContain(pending!.status);

    // wait for completion
    await new Promise((r) => setTimeout(r, 30));
    const done = js.getJob(jobId);
    expect(done).not.toBeNull();
    expect(done!.status).toBe('done');
    expect(done!.result).toBeDefined();
  });
});
