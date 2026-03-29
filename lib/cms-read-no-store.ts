import { unstable_noStore as noStore } from 'next/cache';

/**
 * Marks the current server render as non-cacheable so Mongo-backed CMS data (nav, SEO,
 * page body) is not served from a stale Full Route Cache / Data Cache on production.
 */
export function cmsReadNoStore(): void {
  noStore();
}
