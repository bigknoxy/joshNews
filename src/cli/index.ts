#!/usr/bin/env bun

import { startServer } from '../main';
import { createLogger } from './logger';

export {};

const args = process.argv.slice(2);
const command = args[0];
const jsonFlag = args.includes('--json');

const logger = createLogger({ json: jsonFlag });

if (command === 'run-fetch') {
  await runFetch(jsonFlag);
} else if (command === 'list-sources') {
  await listSources(jsonFlag);
} else if (command === 'serve') {
  await serve(jsonFlag);
} else {
  logger.error('Usage: bun run src/cli/index.ts <command>');
  logger.error('Commands: run-fetch, list-sources [--json], serve');
  process.exit(1);
}

async function runFetch(json: boolean) {
  const logger = createLogger({ json });
  try {
    const response = await fetch('http://localhost:3000/api/v1/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'ingest' }),
    });
    if (response.ok) {
      const result = await response.json();
      logger.info(`Job started: ${result.jobId}`);
    } else {
      logger.error(`Failed to start job: ${response.statusText}`);
    }
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
}

async function listSources(json: boolean) {
  const logger = createLogger({ json });
  try {
    const response = await fetch('http://localhost:3000/api/v1/sources');
    if (response.ok) {
      const sources = await response.json();
      if (json) {
        logger.info(JSON.stringify(sources, null, 2));
      } else {
        logger.info(`Sources: ${JSON.stringify(sources)}`);
      }
    } else {
      logger.error(`Failed to fetch sources: ${response.statusText}`);
    }
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
}

async function serve(json: boolean) {
  const logger = createLogger({ json });
  const server = await startServer();
  logger.info(`Server started on port ${process.env.PORT || 3000}`);
  // Keep the process alive
  process.on('SIGINT', () => {
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  });
}
