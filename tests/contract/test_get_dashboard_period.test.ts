import http from 'http';
import { strict as assert } from 'assert';
import { startTestServer, stopTestServer } from '../setup/server';

// The test will start the server on an ephemeral port and call endpoints.

let server: http.Server | null = null;
let baseUrl = 'http://127.0.0.1:3000';

beforeAll(async () => {
  await startTestServer(3000);
  server = await Promise.resolve(null);
  // server address handling is unnecessary when using startTestServer which binds to the requested port
  baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
});

afterAll(async () => {
  await stopTestServer();
});

function get(path: string): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    http
      .get(baseUrl + path, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({ statusCode: res.statusCode || 0, body: Buffer.concat(chunks).toString() }),
        );
      })
      .on('error', reject);
  });
}

describe('Contract: GET /api/v1/dashboards/{period}', () => {
  it('returns daily snapshot JSON (contract)', async () => {
    const res = await get('/api/v1/dashboards/daily');
    // Contract test should fail if server not implemented
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.ok(body.id, 'snapshot missing id');
    assert.equal(body.period, 'daily');
    assert.ok(Array.isArray(body.items));
  });

  it('returns weekly snapshot JSON (contract)', async () => {
    const res = await get('/api/v1/dashboards/weekly');
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.ok(body.id, 'snapshot missing id');
    assert.equal(body.period, 'weekly');
    assert.ok(Array.isArray(body.items));
  });
});
