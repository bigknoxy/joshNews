import { DashboardSnapshot, Period } from '../models/dashboardSnapshot';
import { memoryAdapter } from '../adapters/storage/memoryAdapter';
import * as fileAdapter from '../adapters/storage/fileAdapter';

const useFile = process.env.USE_FILE_ADAPTER === 'true';

export class DashboardService {
  async getSnapshot(period: Period): Promise<DashboardSnapshot | null> {
    if (useFile) return fileAdapter.getSnapshotFromFile(period);
    return memoryAdapter.getSnapshot(period);
  }

  async refreshSnapshot(period: Period): Promise<DashboardSnapshot> {
    if (useFile) return fileAdapter.refreshSnapshotFile(period);
    return memoryAdapter.refreshSnapshot(period);
  }
}

export const dashboardService = new DashboardService();
