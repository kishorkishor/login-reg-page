import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { normalizeBdPhone } from '@/lib/sms';
import { SESSION_COOKIE_NAME, createSessionValue, getSessionCookieOptions } from '@/lib/session';

const COOKIE_NAME = 'otp_session';

export async function POST(request: Request) {
  try {
    const { phone, otp } = await request.json();
    const number = normalizeBdPhone(phone);
    const cookie = cookies().get(COOKIE_NAME)?.value;
    if (!cookie) {
      return NextResponse.json({ ok: false, error: 'OTP not requested' }, { status: 400 });
    }

    const data = JSON.parse(cookie);
    if (data.number !== number) {
      return NextResponse.json({ ok: false, error: 'Phone mismatch' }, { status: 400 });
    }
    if (Date.now() > data.expiresAt) {
      return NextResponse.json({ ok: false, error: 'OTP expired' }, { status: 400 });
    }
    if (data.attempts >= 3) {
      return NextResponse.json({ ok: false, error: 'Too many attempts' }, { status: 429 });
    }

    const expectedHash = crypto.createHash('sha256').update(`${number}:${otp}`).digest('hex');
    const ok = expectedHash === data.hash;

    if (!ok) {
      const updated = { ...data, attempts: (data.attempts || 0) + 1 };
      cookies().set(COOKIE_NAME, JSON.stringify(updated), {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: Math.floor((data.expiresAt - Date.now()) / 1000),
      });
      return NextResponse.json({ ok: false, error: 'Invalid OTP' }, { status: 400 });
    }

    // Consume OTP cookie and establish a simple session cookie
    cookies().delete(COOKIE_NAME);
    const sessionValue = createSessionValue(number);
    cookies().set(SESSION_COOKIE_NAME, sessionValue, getSessionCookieOptions());
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}


