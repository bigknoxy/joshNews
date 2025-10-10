import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startTestServer } from '../setup/server';

describe('GET /sources', () => {
  let _stopServer: () => Promise<void>;

  beforeAll(async () => {
    process.env.TEST_STORAGE = 'memory';
    _stopServer = await startTestServer();
  });

  afterAll(async () => {
    await _stopServer();
    delete process.env.TEST_STORAGE;
  });

  test('should return list of sources', async () => {
    const response = await fetch('http://localhost:3000/api/v1/sources');
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });
});
