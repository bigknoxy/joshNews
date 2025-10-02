import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { startServer } from '../../src/main';

let serverRef: any = null;

describe('Integration: add-source -> ingest -> snapshot', () => {
  beforeAll(async () => {
    serverRef = await startServer(3001);
  });

  afterAll(async () => {
    if (serverRef) serverRef.close();
  });

  it('adds a source, ingests it, and snapshot contains an item', async () => {
    const post = await fetch('http://127.0.0.1:3001/api/v1/sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'link', value: 'https://int.example/item' }),
    });
    expect(post.status).toBe(201);
    const body = await post.json();
    expect(body.id).toBeDefined();

    // trigger a refresh/ingest
    const refresh = await fetch('http://127.0.0.1:3001/api/v1/dashboards/daily/refresh', {
      method: 'POST',
    });
    expect(refresh.status).toBe(200);

    const snapRes = await fetch('http://127.0.0.1:3001/api/v1/dashboards/daily');
    expect(snapRes.status).toBe(200);
    const snap = await snapRes.json();
    expect(Array.isArray(snap.items)).toBeTruthy();
    // expect at least one item derived from the source we added
    const found = snap.items.some(
      (it: any) =>
        it.signals && it.signals.source && it.signals.source.value === 'https://int.example/item',
    );
    expect(found).toBeTruthy();
  });
});
