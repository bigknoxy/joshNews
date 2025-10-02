let adapter: any = null;

export function setSourcesAdapter(a: any) {
  adapter = a;
}

export function getSourcesAdapter() {
  if (!adapter) throw new Error('sources adapter not initialized');
  return adapter;
}
