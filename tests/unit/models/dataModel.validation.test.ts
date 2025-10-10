import { describe, it, expect } from 'bun:test';

// Unit tests for data model validation rules (failing tests as skeletons)

// NOTE: These tests assume runtime validation helpers exist at src/lib/validators.ts
// If not present, implement minimal helpers or adjust tests. The tests intentionally
// assert expected validation behavior and will fail until implemented.

import { validateSource, validateContentItem } from '../../../src/lib/validators';

describe('Data model validation', () => {
  it('rejects invalid URLs for source.value', () => {
    const invalid = { type: 'link', value: 'not-a-url' } as any;
    const res = validateSource(invalid);
    expect(res.valid).toBeFalsy();
    expect(res.errors.some((e: string) => e.includes('url'))).toBeTruthy();
  });

  it('allows up to 3 signal_explanations and rejects more', () => {
    const item = {
      title: 'Example',
      url: 'https://example.com',
      signal_explanations: ['a', 'b', 'c', 'd'],
    } as any;

    const res = validateContentItem(item);
    expect(res.valid).toBeFalsy();
    expect(res.errors.some((e: string) => e.includes('signal_explanations'))).toBeTruthy();
  });

  it('accepts valid content item', () => {
    const valid = {
      title: 'OK',
      url: 'https://example.com/path',
      signal_explanations: ['a'],
    } as any;
    const res = validateContentItem(valid);
    expect(res.valid).toBeTruthy();
  });
});
