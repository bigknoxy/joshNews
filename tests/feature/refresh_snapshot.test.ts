import http from 'http';
import { strict as assert } from 'assert';
import { startServer } from '../../src/main';

let _server: http.Server | null = null;
let baseUrl = 'http://127.0.0.1:3000';

beforeAll(async () => {
  _server = await startServer(0);
  const addr = _server!.address();
  if (addr && typeof addr === 'object') {
    baseUrl = `http://127.0.0.1:${addr.port}`;
  }
});

afterAll(() => {
  if (_server) _server.close();
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

function post(path: string): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.request(baseUrl + path, { method: 'POST' }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () =>
        resolve({ statusCode: res.statusCode || 0, body: Buffer.concat(chunks).toString() }),
      );
    });
    req.on('error', reject);
    req.end();
  });
}

describe('Feature: refresh snapshot', () => {
  it('refreshes daily snapshot and subsequent GET returns updated version', async () => {
    const beforeRes = await get('/api/v1/dashboards/daily');
    assert.equal(beforeRes.statusCode, 200);
    const beforeBody = JSON.parse(beforeRes.body);
    const beforeVersion = beforeBody.version as number;

    const refreshRes = await post('/api/v1/dashboards/daily/refresh');
    assert.equal(refreshRes.statusCode, 200);
    const refreshBody = JSON.parse(refreshRes.body);
    assert.equal(refreshBody.period, 'daily');
    assert.ok(typeof refreshBody.version === 'number');
    assert.ok(refreshBody.version !== beforeVersion, 'version should change after refresh');

    const afterRes = await get('/api/v1/dashboards/daily');
    assert.equal(afterRes.statusCode, 200);
    const afterBody = JSON.parse(afterRes.body);
    assert.equal(afterBody.version, refreshBody.version, 'GET should return refreshed snapshot');
  });
});
