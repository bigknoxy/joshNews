import { describe, it, expect } from 'bun:test';
import { createJobService } from '../../src/services/jobService';

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

describe('Job service timeout', () => {
  it('marks job failed when timeout exceeded', async () => {
    const js = createJobService({ concurrency: 2, defaultTimeout: 5000 });

    const id = js.startJob(async () => {
      await sleep(50);
      return { ok: true };
    }, { timeout: 10 });

    // wait enough for timeout to occur
    await sleep(30);

    const job = js.getJob(id)!;
    expect(job.status).toBe('failed');
    expect(job.error).toBeDefined();
    // error should indicate timeout
    if (typeof job.error === 'string') {
      expect(job.error).toContain('timeout');
    } else if (typeof job.error === 'object') {
      expect(job.error.message).toContain('timeout');
    }
  });
});
