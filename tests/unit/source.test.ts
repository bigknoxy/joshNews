import { describe, it, expect } from 'bun:test';
import { createSource } from '../../src/models/source';

describe('Source model', () => {
  it('should create a Source with default fields and valid values', () => {
    const input = {
      name: 'Example Feed',
      url: 'https://example.com/feed',
      type: 'rss' as const,
      active: true,
    };

    const src = createSource(input as any);

    // Expect id to match strict pattern
    expect(/^src_[a-z0-9]{8}$/.test(src.id)).toBe(true);
    // Expect fetchIntervalMinutes default to 60
    expect(src.fetchIntervalMinutes).toBe(60);
    // Expect createdAt to be a valid ISO string
    expect(typeof src.createdAt).toBe('string');
    // Expect name/url/type to match
    expect(src.name).toBe(input.name);
    expect(src.url).toBe(input.url);
    expect(src.type).toBe(input.type);
  });

  it('should throw for empty name', () => {
    const input = {
      name: '',
      url: 'https://example.com/feed',
      type: 'rss' as const,
      active: true,
    };

    expect(() => createSource(input as any)).toThrow();
  });

  it('should throw for invalid url', () => {
    const input = {
      name: 'Bad URL',
      url: 'ftp://example.com/feed',
      type: 'rss' as const,
      active: true,
    };

    expect(() => createSource(input as any)).toThrow();
  });
});
