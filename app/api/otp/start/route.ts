import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { normalizeBdPhone, isValidBdPhone } from '@/lib/sms';
import { sendSms } from '@/lib/sms';

const OTP_EXP_MINUTES = 5;
const COOKIE_NAME = 'otp_session';

function generateOtp(): string {
  return (Math.floor(100000 + Math.random() * 900000)).toString();
}

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    const number = normalizeBdPhone(phone);
    if (!isValidBdPhone(number)) {
      return NextResponse.json({ ok: false, error: 'Invalid phone' }, { status: 400 });
    }

    const otp = generateOtp();
    const hash = crypto.createHash('sha256').update(`${number}:${otp}`).digest('hex');
    const expiresAt = Date.now() + OTP_EXP_MINUTES * 60 * 1000;

    const cookieValue = JSON.stringify({ number, hash, expiresAt, attempts: 0 });
    cookies().set(COOKIE_NAME, cookieValue, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: OTP_EXP_MINUTES * 60,
    });

    const brand = 'China Wholesale';
    const message = `Your ${brand} OTP is ${otp}`;
    const result = await sendSms(number, message);

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.message, code: result.code }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}


