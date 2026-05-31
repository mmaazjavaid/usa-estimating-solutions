/**
 * Absolute base URL for the public site, used by `robots.ts` and `sitemap.ts` to emit
 * fully-qualified URLs (search engines require absolute URLs in sitemaps).
 *
 * Resolution order:
 *  1. `NEXT_PUBLIC_SITE_URL` (set this in production / Vercel env — e.g. https://www.example.com)
 *  2. `VERCEL_PROJECT_PRODUCTION_URL` (auto-provided on Vercel, no protocol)
 *  3. localhost fallback for local dev.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return stripTrailingSlash(ensureProtocol(explicit));
  }

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) {
    return stripTrailingSlash(ensureProtocol(vercel));
  }

  return 'http://localhost:3000';
}

function ensureProtocol(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}
