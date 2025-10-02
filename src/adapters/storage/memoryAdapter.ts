import { DashboardSnapshot, createSnapshot, Period } from '../../models/dashboardSnapshot';

const seededDaily = createSnapshot({
  id: 'daily-1',
  period: 'daily',
  items: [{ contentItemId: 'c1', score: 0.9, signals: { reason: 'top' } }],
});

const seededWeekly = createSnapshot({
  id: 'weekly-1',
  period: 'weekly',
  items: [{ contentItemId: 'c2', score: 0.8, signals: { reason: 'trend' } }],
});

export class MemoryAdapter {
  private snapshots: Record<Period, DashboardSnapshot> = {
    daily: seededDaily,
    weekly: seededWeekly,
  };

  async getSnapshot(period: Period): Promise<DashboardSnapshot | null> {
    return this.snapshots[period] || null;
  }

  // helper to seed/replace snapshots during tests
  async setSnapshot(snapshot: DashboardSnapshot): Promise<void> {
    this.snapshots[snapshot.period] = snapshot;
  }

  // Replace existing seeded snapshot with a refreshed one
  async refreshSnapshot(period: Period): Promise<DashboardSnapshot> {
    const existing = this.snapshots[period];
    const now = new Date().toISOString();
    // perform ingest of sources into items
    try {
      // lazy import to avoid circular deps
      // @ts-expect-error: dynamic import to avoid circular dependency in tests
      const { ingestAll } = await import('../../services/ingestService');
      const items = await ingestAll();

      const created: DashboardSnapshot = createSnapshot({
        period,
        createdAt: now,
        version: (existing?.version || 0) + 1,
        items: items.map((it: any) => ({ contentItemId: it.contentItemId, score: it.score, signals: it.signals })),
      });
      this.snapshots[period] = created;
      return created;
    } catch (e) {
      // fallback to previous behavior
      if (existing) {
        const refreshed: DashboardSnapshot = {
          ...existing,
          id: `${period}-${Date.now()}`,
          createdAt: now,
          version: existing.version + 1,
        };
        this.snapshots[period] = refreshed;
        return refreshed;
      }
      const created: DashboardSnapshot = createSnapshot({ period, createdAt: now, version: 1 });
      this.snapshots[period] = created;
      return created;
    }
  }
}

export const memoryAdapter = new MemoryAdapter();
