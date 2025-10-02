// Optional Redis-backed job store. Requires 'ioredis' at runtime if used.
// The implementation avoids importing ioredis at module import time to keep tests fast.
import { JobRecord } from '../jobService';

export function createRedisJobStore(redisClient: any, ttlSeconds = 3600) {
  const prefix = 'jobs:';

  async function get(id: string) {
    const key = prefix + id;
    const raw = await redisClient.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as JobRecord;
    } catch (e) {
      return null;
    }
  }

  async function put(id: string, rec: JobRecord) {
    const key = prefix + id;
    const payload = JSON.stringify(rec);
    await redisClient.set(key, payload, 'EX', ttlSeconds);
    return rec;
  }

  async function list() {
    // not efficient; scan keys
    const keys = await redisClient.keys(prefix + '*');
    const out: JobRecord[] = [];
    for (const k of keys) {
      const raw = await redisClient.get(k);
      if (raw) {
        try {
          out.push(JSON.parse(raw));
        } catch (e) {
          // ignore parse errors for individual keys
        }
      }
    }
    return out;
  }

  return { get, put, list };
}
