import { NextResponse } from 'next/server';
import { sendSms } from '@/lib/sms';

export async function POST(request: Request) {
  try {
    const { number, message } = await request.json();
    if (!number || !message) {
      return NextResponse.json({ ok: false, code: -1, message: 'number and message are required' }, { status: 400 });
    }
    const result = await sendSms(number, message);
    const status = result.ok ? 200 : 400;
    return NextResponse.json(result, { status });
  } catch {
    return NextResponse.json({ ok: false, code: -1, message: 'Invalid request' }, { status: 400 });
  }
}


