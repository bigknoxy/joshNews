import { strict as assert } from 'assert';
import { dashboardService } from '../../src/services/dashboardService';
import { memoryAdapter } from '../../src/adapters/storage/memoryAdapter';
import { createSnapshot } from '../../src/models/dashboardSnapshot';

describe('Unit: dashboardService.refreshSnapshot', () => {
  it('generates and stores a new snapshot for daily', async () => {
    // seed a known snapshot
    const old = createSnapshot({ id: 'test-old', period: 'daily', version: 1 });
    await memoryAdapter.setSnapshot(old);

    const s = await (dashboardService as any).refreshSnapshot('daily');
    // typed assertion
    assert.equal(s.period, 'daily');
    assert.ok(typeof s.version === 'number');

    const stored = await memoryAdapter.getSnapshot('daily');
    assert.equal(stored?.version, s.version);
  });
});
