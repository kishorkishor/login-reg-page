import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionValue } from '@/lib/session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = pathname.startsWith('/dashboard');
  if (!isProtected) return NextResponse.next();

  const raw = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const { valid } = verifySessionValue(raw);
  if (valid) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('message', 'Please sign in');
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/dashboard/:path*'],
};


