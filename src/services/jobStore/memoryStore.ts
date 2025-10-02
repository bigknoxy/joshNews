import { JobRecord } from '../jobService';

export type StoreRecord = JobRecord & { ttl?: number };

export function createMemoryJobStore() {
  const map = new Map<string, StoreRecord>();

  // periodic cleanup every 1s
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of map.entries()) {
      if (v.ttl && v.ttl > 0 && v.completedAt) {
        if (v.completedAt + v.ttl < now) {
          map.delete(k);
        }
      }
    }
  }, 1000);

  function get(id: string) {
    return map.get(id) || null;
  }

  function put(id: string, rec: StoreRecord) {
    map.set(id, rec);
    return rec;
  }

  function list() {
    return Array.from(map.values());
  }

  function stop() {
    clearInterval(interval);
  }

  return { get, put, list, stop };
}
