#!/usr/bin/env bun

process.env.SNAPSHOT_STORAGE_DIR = `tests/tmp/debug-${Date.now()}`;
process.env.USE_FILE_ADAPTER = 'true';

import { refreshSnapshotFile, getSnapshotFromFile } from '../src/adapters/storage/fileAdapter';

(async () => {
  console.log('USE_FILE_ADAPTER=', process.env.USE_FILE_ADAPTER);
  const snap = await refreshSnapshotFile('daily');
  console.log('refreshed snapshot version=', snap.version);
  const read = await getSnapshotFromFile('daily');
  console.log('read snapshot persistedAt=', read?.persistedAt);
  console.log('read snapshot full=', JSON.stringify(read, null, 2));
})();
