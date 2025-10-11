import fs from 'fs';
import path from 'path';

// Set up a custom storage directory for this test BEFORE importing services
const TEST_DIR = path.resolve('tests/tmp', `snapshots-${Date.now()}`);
fs.mkdirSync(TEST_DIR, { recursive: true });
process.env.SNAPSHOT_STORAGE_DIR = TEST_DIR;
process.env.USE_FILE_ADAPTER = 'true';

import { describe, test, expect } from 'bun:test';

describe('Snapshot persistence to disk', () => {
  test('should persist and retrieve snapshot with persistedAt field', async () => {
    const mod = await import('../../src/services/dashboardService');
    const DashboardService = mod.DashboardService;
    const service = new DashboardService();

    // Refresh snapshot
    const refreshed = await service.refreshSnapshot('daily');
    expect(refreshed).toBeDefined();
    expect(refreshed.period).toBe('daily');

    // Create a new service instance pointing to the same path
    const newService = new DashboardService();
    const got = await newService.getSnapshot('daily');
    expect(got).not.toBeNull();
    expect(got?.period).toBe('daily');
    expect(got?.version).toBe(refreshed.version); // Assert same version

    // Assert for persistedAt field
    expect(got?.persistedAt).toBeDefined();
    expect(() => new Date(got!.persistedAt!)).not.toThrow(); // Should be parseable as ISO date
  });
});
