import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { getAdminCookieName, verifyAdminToken } from '@/lib/auth';
import { buildRedirectUrl, matchRedirect } from '@/lib/redirects';

/**
 * Runs before every matched request (Next 16 "proxy", Node.js runtime):
 *  1. Guards `/admin` and `/login` with the admin session cookie.
 *  2. Applies SEO redirects managed in `/admin/redirects`.
 */
export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  if (pathname === '/login' || pathname === '/admin' || pathname.startsWith('/admin/')) {
    return guardAdmin(request, pathname);
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return NextResponse.next();
  }

  const redirect = await findRedirect(request, event);
  return redirect ?? NextResponse.next();
}

async function guardAdmin(request: NextRequest, pathname: string) {
  const isLoginRoute = pathname === '/login';
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

  if (!isLoginRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

async function findRedirect(request: NextRequest, event: NextFetchEvent) {
  try {
    // Loaded lazily so a database/config problem can never take the whole site down.
    const { getRedirectIndex, recordRedirectHit } = await import('@/lib/redirects-server');
    const index = await getRedirectIndex();
    if (!index) return null;

    const match = matchRedirect(index, request.nextUrl.pathname);
    if (!match) return null;

    const target = buildRedirectUrl(match.destination, request.url);
    if (target.href === request.nextUrl.href) return null;

    event.waitUntil(recordRedirectHit(match.rule.id));
    return NextResponse.redirect(target, match.rule.statusCode);
  } catch (err) {
    console.warn('[redirects] lookup failed', err);
    return null;
  }
}

export const config = {
  // Everything except API routes, Next internals and known static assets. Old URLs with file
  // extensions (e.g. /page.html, /old.php from a previous site) still go through the redirect check.
  matcher: [
    '/((?!api/|_next/|images/|files/|uploads/|llms\\.txt|favicon\\.ico|icon\\.svg|icon-|apple-icon|robots\\.txt|sitemap\\.xml|google[0-9a-f]+\\.html).*)',
  ],
};
