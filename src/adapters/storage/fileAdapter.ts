import fs from 'fs';
import path from 'path';
import { DashboardSnapshot, createSnapshot, Period } from '../../models/dashboardSnapshot';

const STORAGE_DIR = path.resolve(process.cwd(), 'data');

function ensureStorageDir(): void {
  if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

function filePathForPeriod(period: Period): string {
  return path.join(STORAGE_DIR, `snapshot-${period}.json`);
}

export async function getSnapshotFromFile(period: Period): Promise<DashboardSnapshot | null> {
  ensureStorageDir();
  const p = filePathForPeriod(period);
  if (!fs.existsSync(p)) return null;
  const raw = await fs.promises.readFile(p, 'utf-8');
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as DashboardSnapshot;
    return null;
  } catch (e) {
    return null;
  }
}

export async function writeSnapshotToFile(snapshot: DashboardSnapshot): Promise<void> {
  ensureStorageDir();
  const p = filePathForPeriod(snapshot.period as Period);
  await fs.promises.writeFile(p, JSON.stringify(snapshot, null, 2), 'utf-8');
}

export async function refreshSnapshotFile(period: Period): Promise<DashboardSnapshot> {
  const now = new Date().toISOString();
  const snapshot: DashboardSnapshot = createSnapshot({
    period,
    startAt: now,
    endAt: now,
    items: [],
    createdAt: now,
    version: Date.now(),
  });
  await writeSnapshotToFile(snapshot);
  return snapshot;
}
