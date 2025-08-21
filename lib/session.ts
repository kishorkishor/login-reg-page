import crypto from 'crypto';

export const SESSION_COOKIE_NAME = 'session';
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || '';
  if (!secret) {
    // Intentionally not throwing to avoid crashing dev; but warn.
    console.warn('[session] SESSION_SECRET not set. Using ephemeral secret.');
    return 'dev-secret';
  }
  return secret;
}

export function createSessionValue(phone: string): string {
  const issuedAt = Date.now().toString();
  const payload = `${phone}:${issuedAt}`;
  const sig = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
  return `${phone}.${issuedAt}.${sig}`;
}

export function verifySessionValue(value: string | undefined | null): { valid: boolean; phone?: string } {
  if (!value) return { valid: false };
  const parts = value.split('.');
  if (parts.length !== 3) return { valid: false };
  const [phone, issuedAt, sig] = parts;
  const expected = crypto.createHmac('sha256', getSecret()).update(`${phone}:${issuedAt}`).digest('hex');
  const valid = sig === expected;
  return { valid, phone: valid ? phone : undefined };
}

export function getSessionCookieOptions(ttlSeconds: number = DEFAULT_TTL_SECONDS) {
  return {
    httpOnly: true as const,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: ttlSeconds,
    secure: process.env.NODE_ENV === 'production',
  };
}


