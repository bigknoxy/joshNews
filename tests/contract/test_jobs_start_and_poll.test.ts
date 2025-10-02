import { describe, it, expect } from 'bun:test';
import { startServer } from '../../src/main';

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

describe('Jobs API contract', () => {
  it('POST /api/v1/jobs starts a job by type and can poll until done', async () => {
    const server = await startServer(0);
    // get address
    // @ts-expect-error: Server.address typing varies between environments
    const addr = server.address();
    const port = addr.port || (addr as any).address?.port || 3000;
    const base = `http://127.0.0.1:${port}`;

    const res = await fetch(`${base}/api/v1/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'noop' }),
    });
    expect(res.status).toBe(202);
    const data = await res.json();
    expect(data.jobId).toBeTruthy();

    const jobId = data.jobId;

    // poll until done
    let final: any = null;
    const deadline = Date.now() + 2000;
    while (Date.now() < deadline) {
      const r = await fetch(`${base}/api/v1/jobs/${jobId}`);
      if (r.status === 200) {
        const job = await r.json();
        if (job.status === 'done' || job.status === 'failed') {
          final = job;
          break;
        }
      }
      await sleep(20);
    }

    // cleanup
    server.close();

    expect(final).not.toBeNull();
    expect(final.status).toBe('done');
    expect(final.result).toBeDefined();
  });
});
