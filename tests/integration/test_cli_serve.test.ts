import { describe, test, expect } from 'bun:test';
import { spawn } from 'child_process';
import { promisify } from 'util';

const sleep = promisify(setTimeout);

describe('CLI serve', () => {
  test('should start server and respond to /health with ok', async () => {
    // Start the CLI serve command in the background
    const child = spawn('bun', ['run', 'src/cli/index.ts', 'serve'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true,
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    // Wait for server to start (assume it logs something)
    await sleep(2000); // Adjust based on startup time

    try {
      // Check /health endpoint
      const res = await fetch('http://localhost:3000/health');
      expect(res.status).toBe(200);
      const body = await res.text();
      expect(body).toBe('ok');
    } finally {
      // Kill the process
      process.kill(-child.pid!);
    }
  });
});
