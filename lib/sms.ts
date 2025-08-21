import { URLSearchParams } from 'url';

export type SmsProviderResult = {
  ok: boolean;
  code: number;
  message: string;
};

export function normalizeBdPhone(input: string): string {
  const trimmed = (input || '').replace(/\s|-/g, '');
  return trimmed.startsWith('+') ? trimmed.slice(1) : trimmed;
}

export function isValidBdPhone(input: string): boolean {
  const phone = normalizeBdPhone(input);
  return /^8801\d{9}$/.test(phone);
}

export function mapSmsCode(code: number): string {
  const table: Record<number, string> = {
    202: 'SMS submitted successfully',
    1001: 'Invalid number',
    1002: 'Sender ID incorrect or disabled',
    1003: 'Required field missing',
    1005: 'Internal error',
    1006: 'Balance validity not available',
    1007: 'Insufficient balance',
    1011: 'User ID not found',
    1012: 'Masking SMS must be sent in Bengali',
    1013: 'Sender ID gateway not found by API key',
    1014: 'Sender type name not found',
    1015: 'No valid gateway found for this Sender ID',
    1016: 'Active price info not found (sender)',
    1017: 'Price info not found (sender)',
    1018: 'Account disabled',
    1019: 'Price of this account is disabled',
    1020: 'Parent account not found',
    1021: 'Parent active price not found',
    1031: 'Account not verified',
    1032: 'IP not whitelisted',
  };
  return table[code] || 'Unknown response';
}

export async function sendSms(number: string, message: string, type: 'text' | 'unicode' = 'text'): Promise<SmsProviderResult> {
  const base = process.env.SMS_API_BASE || 'http://bulksmsbd.net/api';
  const apiKey = process.env.SMS_API_KEY;
  const senderId = process.env.SMS_SENDER_ID || '';

  if (!apiKey) {
    return { ok: false, code: -1, message: 'SMS_API_KEY not configured on server' };
  }

  const phone = normalizeBdPhone(number);
  if (!isValidBdPhone(phone)) {
    return { ok: false, code: -1, message: 'Invalid Bangladeshi phone number' };
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    type,
    number: phone,
    senderid: senderId,
    message,
  });

  const url = `${base.replace(/\/$/, '')}/smsapi?${params.toString()}`;

  try {
    const resp = await fetch(url, { method: 'GET' });
    const text = await resp.text();
    const code = parseInt(text, 10);
    const ok = code === 202;
    return { ok, code: Number.isFinite(code) ? code : -1, message: mapSmsCode(code) };
  } catch (err: any) {
    return { ok: false, code: -1, message: err?.message || 'Failed to contact SMS provider' };
  }
}


