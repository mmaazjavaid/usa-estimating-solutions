import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAdminCookieName, verifyAdminToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginRoute = pathname === '/login';
  const isProtectedAdminRoute = pathname.startsWith('/admin');

  if (!isLoginRoute && !isProtectedAdminRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(getAdminCookieName())?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      await verifyAdminToken(token);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  if (isLoginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  if (isProtectedAdminRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/admin/:path*'],
};
