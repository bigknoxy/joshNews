import { test, expect } from 'bun:test';
import { createLogger } from '../../src/cli/logger';

test('logger outputs JSON when --json flag is set', () => {
  const logger = createLogger({ json: true });
  // Mock console.log to capture output
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (msg: string) => logs.push(msg);

  logger.info('Test message');

  expect(logs.length).toBe(1);
  const parsed = JSON.parse(logs[0]);
  expect(parsed.level).toBe('info');
  expect(parsed.message).toBe('Test message');

  console.log = originalLog;
});

test('logger outputs plain text when --json flag is not set', () => {
  const logger = createLogger({ json: false });
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (msg: string) => logs.push(msg);

  logger.info('Test message');

  expect(logs.length).toBe(1);
  expect(logs[0]).toBe('Test message');

  console.log = originalLog;
});

test('logger respects JSON_LOGS env var', () => {
  process.env.JSON_LOGS = 'true';
  const logger = createLogger({});
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (msg: string) => logs.push(msg);

  logger.info('Test message');

  expect(logs.length).toBe(1);
  const parsed = JSON.parse(logs[0]);
  expect(parsed.level).toBe('info');

  delete process.env.JSON_LOGS;
  console.log = originalLog;
});
