type JobStatus = 'pending' | 'running' | 'done' | 'failed';

export type JobRecord = {
  id: string;
  type?: string;
  payload?: any;
  status: JobStatus;
  result?: any;
  error?: string | { message: string };
  startedAt?: number | null;
  completedAt?: number | null;
  _fn?: (() => Promise<any>) | undefined;
};

type HandlerFn = (payload?: any) => Promise<any>;

export function createJobService(opts?: { concurrency?: number; defaultTimeout?: number; store?: { get: (id: string) => Promise<JobRecord|null> | JobRecord | null; put: (id: string, rec: JobRecord) => Promise<JobRecord>|JobRecord; } }) {
  const concurrency = opts?.concurrency ?? 3;
  const defaultTimeout = opts?.defaultTimeout ?? 5000;
  const store = opts?.store;

  const jobs = new Map<string, JobRecord>();
  const handlers = new Map<string, HandlerFn>();
  const queue: string[] = [];
  let running = 0;
  let next = 1;

  function getJob(id: string) {
    return jobs.get(id) || null;
  }

  function register(type: string, fn: HandlerFn) {
    handlers.set(type, fn);
  }

  async function _persist(id: string, rec: JobRecord, _ttl?: number) {
    // NOTE: in-memory update is synchronous and persistence is fire-and-forget.
    // We set `jobs.set(id, rec)` immediately so callers (e.g. `startJob`) can
    // observe the record synchronously. The optional store.put may be sync or
    // async; we call it inside this async function but callers should use
    // `void _persist(...)` so persistence does not delay control flow.

    jobs.set(id, rec);
    if (store) {
      // store may be sync or async
      try {
        await Promise.resolve(store.put(id, { ...rec } as JobRecord));
      } catch (e) {
        // ignore store errors for now
      }
    }
  }

  function _startNext() {
    if (running >= concurrency) return;
    const id = queue.shift();
    if (!id) return;
    const rec = jobs.get(id);
    if (!rec) return;
    _runJob(rec);
  }

  function _runJob(rec: JobRecord, fnOverride?: () => Promise<any>, timeoutMs?: number) {
    running++;
    rec.status = 'running';
    rec.startedAt = Date.now();
    // persist
    void _persist(rec.id, rec);

    const timeout = timeoutMs ?? defaultTimeout;

    const runPromise = (async () => {
      const fnFromRec = rec._fn;
      const fn = fnOverride ?? fnFromRec ?? (rec.type ? handlers.get(rec.type as string) : undefined);
      if (!fn) throw new Error('no handler');
      const res = await fn(rec.payload);
      return { ok: true, res };
    })();

    const timed = Promise.race([
      runPromise,
      new Promise((_r, rej) => setTimeout(() => rej(new Error('timeout')), timeout)),
    ]);

    timed
      .then((v: any) => {
        rec.status = 'done';
        rec.result = v && v.res !== undefined ? v.res : v;
        rec.completedAt = Date.now();
        // persist final
        void _persist(rec.id, rec, (rec as any).ttl);
      })
      .catch((err: any) => {
        rec.status = 'failed';
        rec.error = err && err.message ? { message: String(err.message) } : String(err);
        rec.completedAt = Date.now();
        void _persist(rec.id, rec, (rec as any).ttl);
      })
      .finally(() => {
        running = Math.max(0, running - 1);
        // schedule next tick to avoid deep recursion
        setTimeout(() => _startNext(), 0);
      });
  }

  function startJob(arg1: any, arg2?: any, arg3?: any) {
    // overloads:
    // startJob(fn)
    // startJob(fn, opts)
    // startJob(type, payload?, opts?)
    const id = `job-${next++}`;
    const rec: JobRecord = { id, status: 'pending', startedAt: null, completedAt: null };
    let fnToRun: (() => Promise<any>) | undefined;
    let timeoutMs: number | undefined;
    let ttl: number | undefined;

    if (typeof arg1 === 'function') {
      fnToRun = arg1 as () => Promise<any>;
      rec._fn = fnToRun;
      if (arg2 && typeof arg2 === 'object') {
        if ('timeout' in arg2) timeoutMs = arg2.timeout;
        if ('ttl' in arg2) ttl = arg2.ttl;
      }
    } else if (typeof arg1 === 'string') {
      rec.type = arg1 as string;
      rec.payload = arg2;
      if (arg3 && typeof arg3 === 'object') {
        if ('timeout' in arg3) timeoutMs = arg3.timeout;
        if ('ttl' in arg3) ttl = arg3.ttl;
      }
    } else {
      throw new Error('invalid startJob args');
    }

    // attach ttl meta for persistence
    (rec as any).ttl = ttl;

    // ensure in-memory map
    jobs.set(id, rec);

    // persist (fire-and-forget)
    void _persist(id, rec, ttl);

    // if we can run now
    if (running < concurrency) {
      if (fnToRun) {
        _runJob(rec, fnToRun, timeoutMs);
      } else {
        _runJob(rec, undefined, timeoutMs);
      }
    } else {
      // enqueue
      queue.push(id);
    }

    return id;
  }

  return { startJob, getJob, register };
}

