import { describe, test, expect } from 'bun:test';
import { dashboardService } from '../../src/services/dashboardService';

// Run service with file adapter
process.env.USE_FILE_ADAPTER = 'true';

describe('DashboardService with file adapter', () => {
  test('refresh and get snapshot via file adapter', async () => {
    const refreshed = await dashboardService.refreshSnapshot('daily');
    expect(refreshed).toBeDefined();
    const got = await dashboardService.getSnapshot('daily');
    expect(got).not.toBeNull();
    expect(got?.period).toBe('daily');
  });
});
