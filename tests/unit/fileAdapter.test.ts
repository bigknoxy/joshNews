import { describe, test, expect } from 'bun:test'
import { refreshSnapshotFile, getSnapshotFromFile, writeSnapshotToFile } from '../../src/adapters/storage/fileAdapter'
import { createSnapshot } from '../../src/models/dashboardSnapshot'
import fs from 'fs'
import path from 'path'

const STORAGE_DIR = path.resolve(process.cwd(), 'data')

describe('file adapter', () => {
  test('refreshSnapshotFile writes and reads snapshot', async () => {
    const s = await refreshSnapshotFile('daily')
    expect(s).toBeDefined()
    const got = await getSnapshotFromFile('daily')
    expect(got).not.toBeNull()
    expect(got?.period).toBe('daily')
  })

  test('writeSnapshotToFile and read back', async () => {
    const snap = createSnapshot({ period: 'weekly', items: [] })
    await writeSnapshotToFile(snap)
    const got = await getSnapshotFromFile('weekly')
    expect(got).not.toBeNull()
    expect(got?.period).toBe('weekly')
  })

  test('cleanup', async () => {
    // remove data dir created by tests
    if (fs.existsSync(STORAGE_DIR)) {
      await fs.promises.rm(STORAGE_DIR, { recursive: true, force: true })
    }
    expect(fs.existsSync(STORAGE_DIR)).toBe(false)
  })
})
