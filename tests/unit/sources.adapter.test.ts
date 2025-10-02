import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import fs from 'fs';
import path from 'path';

import { createMemoryAdapter } from '../../src/adapters/sourcesMemoryAdapter';
import { createFileAdapter } from '../../src/adapters/sourcesFileAdapter';

const DATA_DIR = path.resolve('./data');
const TEST_FILE = path.join(DATA_DIR, 'test-sources.json');

describe('Sources adapters', () => {
  beforeEach(() => {
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
    } catch (e) {}
  });

  afterEach(() => {
    try {
      if (fs.existsSync(TEST_FILE)) fs.unlinkSync(TEST_FILE);
    } catch (e) {}
  });

  it('memory adapter: add and list with pagination', async () => {
    const adapter = createMemoryAdapter();
    for (let i = 0; i < 15; i++) {
      await adapter.addSource({ type: 'link', value: `https://a/${i}` });
    }

    const page1 = await adapter.listSources(0, 10);
    expect(page1.length).toBe(10);

    const page2 = await adapter.listSources(10, 10);
    expect(page2.length).toBe(5);
  });

  it('file adapter: persists data to disk and reads back', async () => {
    const adapter = await createFileAdapter(TEST_FILE);
    await adapter.addSource({ type: 'link', value: 'https://x/1' });
    await adapter.addSource({ type: 'link', value: 'https://x/2' });

    // create a new adapter pointing to same file to ensure persistence
    const adapter2 = await createFileAdapter(TEST_FILE);
    const all = await adapter2.listSources(0, 100);
    expect(all.length).toBe(2);
  });
});
