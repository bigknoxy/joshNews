import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { exec } from 'child_process';
import { promisify } from 'util';
import { startTestServer } from '../setup/server';

const execAsync = promisify(exec);

describe('CLI run-fetch', () => {
  let stopServer: () => Promise<void>;

  beforeAll(async () => {
    process.env.TEST_STORAGE = 'memory';
    stopServer = await startTestServer();
  });

  afterAll(async () => {
    await stopServer();
    delete process.env.TEST_STORAGE;
  });

  test('should fetch and persist items to memory adapter', async () => {
    await execAsync('bun run src/cli/index.ts run-fetch');
    const response = await fetch('http://localhost:3000/api/v1/items');
    expect(response.status).toBe(200);
    const items = await response.json();
    expect(Array.isArray(items)).toBe(true);
  });
});
