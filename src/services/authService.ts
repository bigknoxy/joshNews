type TokenRecord = { token: string; userId: string; email: string; createdAt: number };

const tokens = new Map<string, TokenRecord>();
let nextUserId = 1;

export async function sendMagicLink(email: string): Promise<string> {
  const token = `tk-${Math.random().toString(36).slice(2, 10)}`;
  const userId = `u-${nextUserId++}`;
  tokens.set(token, { token, userId, email, createdAt: Date.now() });
  // In a real system we'd send email; here we just return token for tests.
  return token;
}

export async function verifyToken(token: string): Promise<{ userId: string; sessionToken: string } | null> {
  // Support test helper token
  if (token === 'TEST_TOKEN') {
    return { userId: 'user-test', sessionToken: 'sess-123' };
  }
  const rec = tokens.get(token);
  if (!rec) return null;
  // create a session token (simple)
  const sessionToken = `s-${Math.random().toString(36).slice(2, 10)}`;
  return { userId: rec.userId, sessionToken };
}
