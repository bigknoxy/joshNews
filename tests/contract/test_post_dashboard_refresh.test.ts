import http from 'http';
import { strict as assert } from 'assert';
import { startTestServer, stopTestServer } from '../setup/server';


let baseUrl = 'http://127.0.0.1:3000';

beforeAll(async () => {
  await startTestServer(3000);
  baseUrl = 'http://127.0.0.1:3000';
});

afterAll(async () => {
  await stopTestServer();
});

function post(path: string): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      baseUrl + path,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({ statusCode: res.statusCode || 0, body: Buffer.concat(chunks).toString() }),
        );
      },
    );
    req.on('error', reject);
    req.end();
  });
}

describe('Contract: POST /api/v1/dashboards/{period}/refresh', () => {
  it('returns 200 and refreshed snapshot for daily', async () => {
    const res = await post('/api/v1/dashboards/daily/refresh');
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.period, 'daily');
    assert.ok(body.id, 'missing id');
    assert.ok(typeof body.version === 'number');
  });

  it('returns 400/404 for invalid period', async () => {
    const res = await post('/api/v1/dashboards/invalid/refresh');
    assert.ok(res.statusCode === 400 || res.statusCode === 404, 'expected 400 or 404');
  });
});
