import type { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/db';
import { PageModel } from '@/models/Page';
import { ServiceModel } from '@/models/Service';
import { SubServiceModel } from '@/models/SubService';
import { BlogModel } from '@/models/Blog';
import { getSiteUrl } from '@/lib/site-url';

/**
 * The site renders CMS content from MongoDB, so the sitemap is generated on demand rather
 * than baked at build time — new published services, trades, sub-services, and blog posts
 * appear without a redeploy. Pages that are unpublished or marked `noindex` are excluded.
 */
export const dynamic = 'force-dynamic';

const STATIC_PATHS = [
  '/',
  '/about',
  '/contact',
  '/pricing',
  '/samples',
  '/services',
  '/our-trades',
  '/blog',
];

function toUrlPath(value: string): string {
  if (!value) return '';
  const withSlash = value.startsWith('/') ? value : `/${value}`;
  // Percent-encode each segment so slugs with spaces/unsafe chars yield valid <loc> URLs.
  return withSlash
    .split('/')
    .map((seg) => (seg ? encodeURIComponent(seg) : seg))
    .join('/');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date();

  // Keyed by absolute URL so root-level service/CMS pages can't be listed twice.
  const entries = new Map<string, MetadataRoute.Sitemap[number]>();

  const add = (
    path: string,
    lastModified: Date | undefined,
    priority: number,
  ) => {
    const normalized = toUrlPath(path);
    if (!normalized) return;
    const url = `${baseUrl}${normalized === '/' ? '' : normalized}` || baseUrl;
    if (entries.has(url)) return;
    entries.set(url, {
      url,
      lastModified: lastModified ?? now,
      changeFrequency: normalized === '/' ? 'daily' : 'weekly',
      priority,
    });
  };

  for (const path of STATIC_PATHS) {
    add(path, now, path === '/' ? 1 : 0.8);
  }

  try {
    await connectToDatabase();

    const [pages, services, subServices, blogs] = await Promise.all([
      // Dynamic CMS pages render at their single-segment `path` (e.g. /mep, /exterior).
      PageModel.find({
        status: 'published',
        renderMode: 'dynamic',
        indexStatus: 'index',
      })
        .select('path updatedAt')
        .lean(),
      ServiceModel.find({ status: 'published', indexStatus: 'index' })
        .select('slug path updatedAt')
        .lean(),
      SubServiceModel.find({ status: 'published', indexStatus: 'index' })
        .select('slug updatedAt')
        .lean(),
      BlogModel.find({ status: 'published', indexStatus: 'index' })
        .select('slug updatedAt publishedDate')
        .lean(),
    ]);

    for (const p of pages) {
      add(String(p.path ?? ''), p.updatedAt as Date | undefined, 0.7);
    }

    for (const s of services) {
      const path = s.path ? String(s.path) : `/${s.slug}`;
      add(path, s.updatedAt as Date | undefined, 0.7);
    }

    for (const sub of subServices) {
      add(`/sub-services/${sub.slug}`, sub.updatedAt as Date | undefined, 0.6);
    }

    for (const b of blogs) {
      const last = (b.updatedAt as Date | undefined) ?? (b.publishedDate as Date | undefined);
      add(`/blog/${b.slug}`, last, 0.6);
    }
  } catch (error) {
    // Never let a DB hiccup break the sitemap — static routes still get served.
    console.error('[sitemap] failed to load CMS content', error);
  }

  return Array.from(entries.values());
}
