import { describe, it, expect } from 'bun:test';
import { createJobService } from '../../src/services/jobService';

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

describe('Job service concurrency', () => {
  it('limits concurrency to 1 and queues jobs', async () => {
    const js = createJobService({ concurrency: 1, defaultTimeout: 1000 });
    let running = 0; // tracks concurrent running jobs for assertion

    const longJob = async () => {
      running++;
      expect(running).toBeLessThanOrEqual(1);
      await sleep(50);
      running--;
      return { ok: true };
    };

    const id1 = js.startJob(longJob);
    const id2 = js.startJob(longJob);

    const j1 = js.getJob(id1)!;
    const j2 = js.getJob(id2)!;

    // immediately after starting: first should be running, second pending
    expect(j1.status).toBe('running');
    expect(j2.status).toBe('pending');

    // wait until both complete with a deadline
    const deadline = Date.now() + 2000;
    let j1After: any = null;
    let j2After: any = null;
    while (Date.now() < deadline) {
      j1After = js.getJob(id1)!;
      j2After = js.getJob(id2)!;
      if (j1After.status === 'done' && j2After.status === 'done') break;
      await sleep(10);
    }

    expect(j1After!.status).toBe('done');
    expect(j2After!.status).toBe('done');
  });
});
