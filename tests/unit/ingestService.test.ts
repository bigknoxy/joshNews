import { describe, test, expect } from 'bun:test';
import { setSourcesAdapter } from '../../src/lib/sourcesStore';
import { createMemoryAdapter } from '../../src/adapters/sourcesMemoryAdapter';
import { ingestAll } from '../../src/services/ingestService';

// ensure TS knows this is a test file for Bun
describe('ingestService', () => {
  test('should read sources and return corresponding items', async () => {
    const adapter = createMemoryAdapter();
    setSourcesAdapter(adapter);

    await adapter.addSource({ title: 'Source One', value: 'http://one' });
    await adapter.addSource({ title: 'Source Two', value: 'http://two' });

    const items = await ingestAll();

    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBe(2);
    expect(items[0]).toHaveProperty('contentItemId');
    expect(items[0]).toHaveProperty('title');
    expect(items[0]).toHaveProperty('url');
  });
});
