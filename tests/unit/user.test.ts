import { describe, test, expect } from 'bun:test';
import { validateUser, User } from '../../src/models/user';

// Tests follow TDD: models are not implemented yet — these should fail initially.

describe('User model validation', () => {
  test('valid user passes validation', () => {
    const user: User = {
      id: '00000000-0000-4000-8000-000000000000',
      email: 'alice@example.com',
      createdAt: '2025-10-01T12:00:00.000Z',
      lastActiveAt: '2025-10-01T13:00:00.000Z',
      preferences: { theme: 'light', notifications: true },
    };

    const result = validateUser(user);
    expect(result.valid).toBe(true);
  });

  test('invalid email fails validation', () => {
    const user = {
      id: '00000000-0000-4000-8000-000000000000',
      email: 'not-an-email',
      createdAt: '2025-10-01T12:00:00.000Z',
      lastActiveAt: '2025-10-01T13:00:00.000Z',
      preferences: {},
    } as unknown as User;

    const result = validateUser(user);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
  });

  test('missing required field throws or returns invalid', () => {
    // omit id
    const user = {
      email: 'bob@example.com',
      createdAt: '2025-10-01T12:00:00.000Z',
      lastActiveAt: '2025-10-01T13:00:00.000Z',
      preferences: {},
    } as unknown as User;

    const result = validateUser(user);
    expect(result.valid).toBe(false);
  });
});
