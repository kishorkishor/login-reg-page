export type OtpStartResponse = { ok: boolean; error?: string };
export type OtpVerifyResponse = { ok: boolean; error?: string };

// Accept +8801XXXXXXXXX or 8801XXXXXXXXX and normalize to 8801XXXXXXXXX
export function normalizeBdPhone(input: string): string {
  const trimmed = (input || '').replace(/\s|-/g, '');
  if (trimmed.startsWith('+')) {
    return trimmed.slice(1);
  }
  return trimmed;
}

export function isValidBdPhone(input: string): boolean {
  const phone = normalizeBdPhone(input);
  return /^8801\d{9}$/.test(phone);
}

export async function requestOtp(phone: string): Promise<OtpStartResponse> {
  const number = normalizeBdPhone(phone);
  try {
    const res = await fetch('/api/otp/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: number })
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data?.error || 'Failed to request OTP' };
    return data;
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to request OTP' };
  }
}

export async function verifyOtp(phone: string, otp: string): Promise<OtpVerifyResponse> {
  const number = normalizeBdPhone(phone);
  try {
    const res = await fetch('/api/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: number, otp })
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data?.error || 'Invalid OTP' };
    return data;
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Invalid OTP' };
  }
}


