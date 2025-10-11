import { DashboardSnapshot, Period } from '../models/dashboardSnapshot';
import { memoryAdapter } from '../adapters/storage/memoryAdapter';
import * as fileAdapter from '../adapters/storage/fileAdapter';

export class DashboardService {
  private useFile: boolean;

  constructor(useFile?: boolean) {
    this.useFile = typeof useFile === 'boolean' ? useFile : process.env.USE_FILE_ADAPTER === 'true';
  }

  async getSnapshot(period: Period): Promise<DashboardSnapshot | null> {
    if (this.useFile) return fileAdapter.getSnapshotFromFile(period);
    return memoryAdapter.getSnapshot(period);
  }

  async refreshSnapshot(period: Period): Promise<DashboardSnapshot> {
    if (this.useFile) return fileAdapter.refreshSnapshotFile(period);
    return memoryAdapter.refreshSnapshot(period);
  }
}

export const dashboardService = new DashboardService();
