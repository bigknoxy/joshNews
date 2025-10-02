import http from 'http';
import { strict as assert } from 'assert';
import { startServer } from '../../src/main';

let _server: http.Server | null = null;
let baseUrl = 'http://127.0.0.1:3000';

  beforeAll(async () => {
    _server = await startServer(3000);
    const addr = _server.address();
    if (addr && typeof addr === 'object') {
      baseUrl = `http://127.0.0.1:${addr.port}`;
    }
  });

  afterAll(() => {
    if (_server) _server.close();
  });

function get(
  path: string,
): Promise<{ statusCode: number; body: string; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    http
      .get(baseUrl + path, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({
            statusCode: res.statusCode || 0,
            body: Buffer.concat(chunks).toString(),
            headers: res.headers,
          }),
        );
      })
      .on('error', reject);
  });
}

describe('Feature: fetch cached snapshot', () => {
  it('fetches daily snapshot with correct shape', async () => {
    const res = await get('/api/v1/dashboards/daily');
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'application/json');
    const body = JSON.parse(res.body);
    // Required fields
    assert.ok(body.id, 'missing id');
    assert.equal(body.period, 'daily');
    assert.ok(body.startAt, 'missing startAt');
    assert.ok(body.endAt, 'missing endAt');
    assert.ok(Array.isArray(body.items), 'items must be array');
    // Item shape
    if (body.items.length > 0) {
      const item = body.items[0];
      assert.ok(item.contentItemId, 'item missing contentItemId');
      assert.equal(typeof item.score, 'number');
      assert.equal(typeof item.signals, 'object');
    }
  });
});
