import fs from 'fs/promises';

export async function createFileAdapter(filePath: string) {
  // ensure file exists
  try {
    await fs.access(filePath);
  } catch (e) {
    await fs.writeFile(filePath, JSON.stringify([]));
  }

  async function readAll() {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw || '[]');
  }

  async function writeAll(arr: any[]) {
    await fs.writeFile(filePath, JSON.stringify(arr, null, 2));
  }

  return {
    async addSource(data: any) {
      const arr = await readAll();
      const id = `s-${arr.length + 1}`;
      const rec = { id, ...data };
      arr.push(rec);
      await writeAll(arr);
      return rec;
    },
    async listSources(offset = 0, limit = 100) {
      const arr = await readAll();
      return arr.slice(offset, offset + limit);
    },
  };
}
