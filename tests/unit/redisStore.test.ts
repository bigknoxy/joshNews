import { describe, it, expect } from 'bun:test';
import { createRedisJobStore } from '../../src/services/jobStore/redisStore';

function createFakeRedis() {
  const map = new Map<string, string>();
  return {
    async get(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    // accept signature set(key, value, ...args)
    async set(key: string, value: string, ..._rest: any[]) {
      map.set(key, value);
      return 'OK';
    },
    async keys(pattern: string) {
      // simple prefix-based matching for tests: pattern ends with '*'
      if (pattern.endsWith('*')) {
        const prefix = pattern.slice(0, -1);
        return Array.from(map.keys()).filter((k) => k.startsWith(prefix));
      }
      return Array.from(map.keys()).filter((k) => k === pattern);
    },
  } as const;
}

describe('Redis job store (unit)', () => {
  it('put/get/list work with a fake redis client', async () => {
    const client = createFakeRedis();
    const store = createRedisJobStore(client, 3600);

    const rec = { id: 'job-x', type: 'noop', status: 'pending' } as any;

    await store.put(rec.id, rec);

    const fetched = await store.get(rec.id);
    expect(fetched).not.toBeNull();
    expect(fetched!.id).toBe(rec.id);

    const all = await store.list();
    const found = all.find((r) => r.id === rec.id);
    expect(found).toBeDefined();
  });
});
