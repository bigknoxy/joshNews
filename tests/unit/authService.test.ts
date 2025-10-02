import { describe, it, expect } from 'bun:test';

import { sendMagicLink, verifyToken } from '../../src/services/authService';

describe('Auth service', () => {
  it('sendMagicLink returns token and can be verified', async () => {
    const email = 'user@example.com';
    const token = await sendMagicLink(email);
    expect(typeof token).toBe('string');

    const verified = await verifyToken(token);
    expect(verified).toBeTruthy();
    expect(verified?.userId).toBeDefined();
  });

  it('verifyToken returns null for invalid token', async () => {
    const res = await verifyToken('nope');
    expect(res).toBeNull();
  });
});
