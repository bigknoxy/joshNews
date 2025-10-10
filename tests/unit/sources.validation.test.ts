import { describe, it, expect } from 'bun:test';
import { validateSource } from '../../src/lib/validators';

describe('Sources validation', () => {
  it('rejects invalid source with bad url', () => {
    const res = validateSource({ type: 'link', value: 'not-a-url' });
    expect(res.valid).toBeFalsy();
  });

  it('accepts valid link source', () => {
    const res = validateSource({ type: 'link', value: 'https://example.com' });
    expect(res.valid).toBeTruthy();
  });
});
