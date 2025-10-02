import {
  createSnapshot,
  DashboardSnapshot,
  validateDashboardSnapshot,
} from '../../src/models/dashboardSnapshot';
import { strict as assert } from 'assert';

describe('DashboardSnapshot model', () => {
  it('creates a snapshot with defaults', () => {
    const snap: DashboardSnapshot = createSnapshot({});
    assert.ok(snap.id);
    assert.equal(snap.period, 'daily');
    assert.ok(Array.isArray(snap.items));
    assert.equal(typeof snap.createdAt, 'string');
  });

  it('preserves provided fields', () => {
    const snap = createSnapshot({
      period: 'weekly',
      items: [{ contentItemId: 'c1', score: 1, signals: {} }],
      version: 5,
    });
    assert.equal(snap.period, 'weekly');
    assert.equal(snap.items.length, 1);
    assert.equal(snap.version, 5);
  });

  it('validates snapshot shape', () => {
    const snap = createSnapshot({});
    assert.equal(validateDashboardSnapshot(snap), true);

    const bad = { id: 123 } as unknown;
    assert.equal(validateDashboardSnapshot(bad), false);
  });
});
