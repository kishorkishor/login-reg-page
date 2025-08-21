## Auth + SMS OTP integration plan

This doc lists the exact steps to integrate BulkSMSBD for OTP and make login/register work end‑to‑end. Items starting with [Q] need your confirmation before I implement.

### 0) Assumptions / Questions (updated per your reply)
- [Answered] OTP is required for both registration and login (phone-first).
- [Open] Backend usage: do we still call any existing auth endpoints after OTP verification? If not available yet, I will create a lightweight client-side session (signed cookie/localStorage) after OTP success as a placeholder.
- [Open] Token/session: prefer httpOnly cookie from server if you have a session backend; otherwise temporary client token until backend is ready.
- [Confirmed] No Google/Facebook for now.
- [Default] OTP SMS template: "Your China Wholesale OTP is {XXXX}. It will expire in 5 minutes."
- [Default] Limits: 3 attempts per OTP, 60s resend cooldown, 5‑minute expiry.

### 1) Configuration
- Add `.env.local` (not committed) with:
  - `NEXT_PUBLIC_API_URL=<your-auth-api-base>`
  - `SMS_API_BASE=http://bulksmsbd.net/api`
  - `SMS_API_KEY=REPLACE_ME`  <-- put your real key only in `.env.local`
  - `SMS_SENDER_ID=8809617626330`
  - `SMS_TYPE=text`

Provide `.env.example` with the same keys (dummy values).

### 2) Server-side SMS proxy (hide API key)
- Create `app/api/sms/send/route.ts` (POST) to call BulkSMSBD from the server using `SMS_API_KEY` and `SMS_SENDER_ID`.
- Input: `{ number: string, message: string }`.
- Output: `{ code: number, ok: boolean, message: string }` with proper mapping from provider codes (202, 1001, ...).
- Rationale: prevents exposing `api_key` in the browser and avoids CORS issues.

### 3) OTP generation & verification endpoints
- Create `app/api/otp/start/route.ts` (POST):
  - Input: `{ phone: string }`.
  - Generates 6-digit OTP, stores hash + expiry (5 mins) in an httpOnly signed cookie or in-memory map keyed per session.
  - Sends SMS via `app/api/sms/send` using templated message.
  - Response: `{ ok: true }` or `{ ok: false, error }`.
- Create `app/api/otp/verify/route.ts` (POST):
  - Input: `{ phone: string, otp: string }`.
  - Validates against stored hash + expiry, consumes on success.
  - Response: `{ ok: true }` or `{ ok: false, error }`.

Note: For production, swap in Redis/DB storage; cookie/in-memory is acceptable for now.

### 4) Frontend utilities
- Add `utils/sms.ts`:
  - `sendSmsViaProxy(number, message)` calls the server route.
  - `parseSmsCode(code)` maps provider codes to human messages.
- Add `utils/otp.ts`:
  - `requestOtp(phone)` → `POST /api/otp/start`.
  - `verifyOtp(phone, otp)` → `POST /api/otp/verify`.

### 5) Registration flow updates (`app/register/page.tsx`)
- Phone-first form:
  - Fields: `phone` (required), `name` (optional for now), `email` (optional; can be hidden), no password.
  - "Send OTP" → 60s countdown; show `otp` input; "Verify OTP".
  - Only after OTP verified: enable "Finish Registration".
- After OTP success:
  - If backend endpoint exists: call your phone-based registration endpoint; otherwise create a temporary local profile and mark the session as authenticated (to be replaced by backend later).

### 6) Login flow updates (`app/login/page.tsx`)
- Convert to phone-only login:
  - Fields: `phone` + `otp` with the same send/verify flow.
  - On OTP verification success: establish session (server cookie if available; else temporary client token) and redirect.

### 7) Auth client updates (`utils/api.ts`)
- Ensure base URL comes from `NEXT_PUBLIC_API_URL`.
- Add `withCredentials` toggle if server cookies are used.
- Add small client-side session helper (`utils/phoneAuth.ts`) used only when no backend session exists yet.

### 8) Validation and UX
- E.164-ish validation for Bangladeshi numbers (e.g., `8801XXXXXXXXX`).
- Clear toasts for SMS codes using the provider mapping.
- Edge cases: resend when code expired, max attempts, lockout message.

### 9) Docs
- Update `README.md` with environment setup and flows.
- Note security considerations (never expose `SMS_API_KEY` to the client).

### 10) Deliverables (incremental PRs)
1. Config + secure SMS proxy + provider response mapping.
2. OTP start/verify endpoints with cookie storage (5‑min expiry, 3 attempts, 60s resend).
3. Login page rewrite: phone-only OTP login + session establishment.
4. Register page: phone-first with OTP gating; optional name/email capture.
5. Optional client session helper (only if backend session not ready yet).
6. Docs and `.env.example`. Remove OAuth UI.

### Provider response mapping (BulkSMSBD → user-facing)
- 202 → "SMS submitted successfully"
- 1001 → "Invalid number"
- 1002 → "Sender ID incorrect/disabled"
- 1003 → "Required field missing"
- 1005 → "Internal error"
- 1006 → "Balance validity not available"
- 1007 → "Insufficient balance"
- 1011 → "User ID not found"
- 1012 → "Masking SMS must be sent in Bengali"
- 1013/1015 → "Sender ID gateway issue"
- 1014 → "Sender type name not found"
- 1016/1017 → "Price info not found for sender"
- 1018 → "Account disabled"
- 1019 → "Price disabled for account"
- 1020 → "Parent account not found"
- 1021 → "Parent active price not found"
- 1031 → "Account not verified"
- 1032 → "IP not whitelisted"

### Code snippets to be added (high-level)
```env
# .env.example
NEXT_PUBLIC_API_URL=
SMS_API_BASE=http://bulksmsbd.net/api
SMS_API_KEY=REPLACE_ME
SMS_SENDER_ID=8809617626330
SMS_TYPE=text
```

```ts
// utils/sms.ts (client → our server proxy)
export async function sendSmsViaProxy(number: string, message: string) {
  const res = await fetch('/api/sms/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ number, message })
  });
  return res.json();
}
```


