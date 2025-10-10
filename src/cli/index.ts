#!/usr/bin/env bun

export {};

const args = process.argv.slice(2);
const command = args[0];
const jsonFlag = args.includes('--json');

if (command === 'run-fetch') {
  await runFetch();
} else if (command === 'list-sources') {
  await listSources(jsonFlag);
} else {
  console.error('Usage: bun run src/cli/index.ts <command>');
  console.error('Commands: run-fetch, list-sources [--json]');
  process.exit(1);
}

async function runFetch() {
  try {
    const response = await fetch('http://localhost:3000/api/v1/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'ingest' }),
    });
    if (response.ok) {
      const result = await response.json();
      console.log('Job started:', result.jobId);
    } else {
      console.error('Failed to start job:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function listSources(json: boolean) {
  try {
    const response = await fetch('http://localhost:3000/api/v1/sources');
    if (response.ok) {
      const sources = await response.json();
      if (json) {
        console.log(JSON.stringify(sources, null, 2));
      } else {
        console.log('Sources:', sources);
      }
    } else {
      console.error('Failed to fetch sources:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
