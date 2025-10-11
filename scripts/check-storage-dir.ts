#!/usr/bin/env bun
import path from 'path';
console.log('CWD=', process.cwd());
console.log('SNAPSHOT_STORAGE_DIR (before)=', process.env.SNAPSHOT_STORAGE_DIR);
process.env.SNAPSHOT_STORAGE_DIR = `tests/tmp/check-${Date.now()}`;
console.log('SNAPSHOT_STORAGE_DIR (after)=', process.env.SNAPSHOT_STORAGE_DIR);
console.log('RESOLVED=', path.resolve(process.env.SNAPSHOT_STORAGE_DIR || process.cwd(), 'data'));
