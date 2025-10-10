import { getSourcesAdapter } from '../lib/sourcesStore';

// Minimal ingest: read sources and produce content items derived from them
export async function ingestAll(): Promise<any[]> {
  const adapter = getSourcesAdapter();
  // fetch all sources (use large limit)
  const sources = await adapter.listSources(0, 10000);
  const items = sources.map((s: any, idx: number) => ({
    contentItemId: `ci-${s.id}-${idx}`,
    title: s.title || `Imported from ${s.value}`,
    url: s.value,
    signals: { source: s },
    score: 0.5,
  }));
  return items;
}
