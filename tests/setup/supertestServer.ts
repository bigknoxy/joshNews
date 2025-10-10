import request from 'supertest';
import { startTestServer, stopTestServer } from './server';

export async function withTestServer<T>(fn: (url: string) => Promise<T>): Promise<T> {
  const stop = await startTestServer();
  try {
    return await fn('http://127.0.0.1:3000');
  } finally {
    await stopTestServer();
    await stop();
  }
}

export default request; // convenience export for tests using `request(server)` pattern
