import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startTestServer, stopTestServer } from '../setup/server';

describe('GET /items', () => {
  let stopServer: () => Promise<void>;

  beforeAll(async () => {
    process.env.TEST_STORAGE = 'memory';
    stopServer = await startTestServer();
  });

  afterAll(async () => {
    await stopServer();
    delete process.env.TEST_STORAGE;
  });

  test('should return list of items', async () => {
    const response = await fetch('http://localhost:3000/api/v1/items');
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });
});
