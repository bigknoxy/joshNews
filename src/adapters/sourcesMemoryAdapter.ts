export function createMemoryAdapter() {
  const items: any[] = [];
  let id = 1;
  return {
    async addSource(data: any) {
      const rec = { id: `s-${id++}`, ...data };
      items.push(rec);
      return rec;
    },
    async listSources(offset = 0, limit = 100) {
      return items.slice(offset, offset + limit);
    },
  };
}
