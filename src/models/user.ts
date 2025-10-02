export interface User {
  id: string;
  email: string;
  createdAt: string;
  lastActiveAt: string;
  preferences: Record<string, unknown>;
}

export function validateUser(user: unknown): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  if (!user || typeof user !== 'object') {
    return { valid: false, errors: ['user must be an object'] };
  }
  const u = user as Partial<User>;

  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!u.id || typeof u.id !== 'string' || !uuidRe.test(u.id)) {
    errors.push('id must be a valid uuid');
  }

  if (!u.email || typeof u.email !== 'string') {
    errors.push('email must be a string');
  } else {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(u.email)) {
      errors.push('email must be a valid email address');
    }
  }

  const checkIsoField = (val: unknown, name: string) => {
    if (!val || typeof val !== 'string') {
      errors.push(`${name} must be an ISO timestamp string`);
      return;
    }
    const t = Date.parse(val);
    if (!isFinite(t)) {
      errors.push(`${name} is not a valid date`);
      return;
    }
    try {
      const iso = new Date(val).toISOString();
      if (iso !== val) {
        errors.push(`${name} must be an ISO string (toISOString)`);
      }
    } catch (e) {
      errors.push(`${name} is not a valid date`);
    }
  };

  checkIsoField(u.createdAt, 'createdAt');
  checkIsoField(u.lastActiveAt, 'lastActiveAt');

  if (u.preferences === undefined || u.preferences === null || typeof u.preferences !== 'object') {
    errors.push('preferences must be an object');
  }

  return { valid: errors.length === 0, errors: errors.length ? errors : undefined };
}
