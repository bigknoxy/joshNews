export type Period = 'daily' | 'weekly';

export interface SnapshotItem {
  contentItemId: string;
  score: number;
  signals: Record<string, string>;
}

export interface DashboardSnapshot {
  id: string;
  userId?: string;
  period: Period;
  startAt: string;
  endAt: string;
  items: SnapshotItem[];
  createdAt: string;
  persistedAt?: string;
  algorithmVersion?: string;
  version: number;
}

export function createSnapshot(partial: Partial<DashboardSnapshot>): DashboardSnapshot {
  const now = new Date().toISOString();
  return {
    id: partial.id || 'snapshot-' + Math.random().toString(36).slice(2, 10),
    userId: partial.userId,
    period: (partial.period || 'daily') as Period,
    startAt: partial.startAt || now,
    endAt: partial.endAt || now,
    items: partial.items || [],
    createdAt: partial.createdAt || now,
    algorithmVersion: partial.algorithmVersion || 'v1',
    version: partial.version || 1,
  };
}

export function validateDashboardSnapshot(val: unknown): val is DashboardSnapshot {
  if (!val || typeof val !== 'object') return false;
  const s = val as DashboardSnapshot;
  if (typeof s.id !== 'string') return false;
  if (s.period !== 'daily' && s.period !== 'weekly') return false;
  if (typeof s.startAt !== 'string') return false;
  if (typeof s.endAt !== 'string') return false;
  if (!Array.isArray(s.items)) return false;
  if (typeof s.createdAt !== 'string') return false;
  if (typeof s.version !== 'number') return false;
  // basic item checks
  for (const it of s.items) {
    if (!it || typeof it !== 'object') return false;
    if (typeof (it as any).contentItemId !== 'string') return false;
    if (typeof (it as any).score !== 'number') return false;
    if (typeof (it as any).signals !== 'object') return false;
  }
  return true;
}
