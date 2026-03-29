import type { Metadata } from 'next';
import { cmsReadNoStore } from '@/lib/cms-read-no-store';
import { connectToDatabase } from '@/lib/db';
import { ensureBaseCmsRecords } from '@/lib/cms';
import { PageModel } from '@/models/Page';
import type { CmsPageSection } from '@/lib/cms-sections/types';
import { migrateLegacyCmsSection } from '@/lib/cms-sections/legacy-map';
import { isKnownSectionType } from '@/lib/cms-sections/registry';

export type CmsNavLink = { label: string; href: string };

export function normalizePath(path: string): string {
  const p = path.trim();
  if (!p || p === '/') {
    return '/';
  }
  return p.startsWith('/') ? p : `/${p}`;
}

function singleSegmentPath(path: string): string | null {
  const p = normalizePath(path);
  if (p === '/') {
    return null;
  }
  const parts = p.split('/').filter(Boolean);
  return parts.length === 1 ? `/${parts[0]}` : null;
}

/** Dynamic CMS pages may be `/segment` or `/trades/segment` (trades sub-pages). */
export function isAllowedDynamicPublicPath(path: string): boolean {
  const p = normalizePath(path);
  if (p === '/') {
    return true;
  }
  const parts = p.split('/').filter(Boolean);
  if (parts.length === 1) {
    return true;
  }
  if (parts.length === 2 && parts[0] === 'trades' && parts[1].length > 0) {
    return true;
  }
  return false;
}

/** `trade-exterior` ↔ `/trades/exterior` */
export function expectedTradeSlugForPath(path: string): string | null {
  const p = normalizePath(path);
  const parts = p.split('/').filter(Boolean);
  if (parts.length === 2 && parts[0] === 'trades') {
    return `trade-${parts[1]}`;
  }
  return null;
}

export { parseTradeSlugInput } from '@/lib/trade-slug-input';

export async function getPublishedCmsNavLinks(): Promise<{
  services: CmsNavLink[];
  trades: CmsNavLink[];
}> {
  cmsReadNoStore();
  await ensureBaseCmsRecords();
  await connectToDatabase();

  const [services, trades] = await Promise.all([
    PageModel.find({
      status: 'published',
      renderMode: 'dynamic',
      placement: 'services',
    })
      .sort({ name: 1 })
      .select('name path')
      .lean(),
    PageModel.find({
      status: 'published',
      renderMode: 'dynamic',
      placement: 'trades',
    })
      .sort({ name: 1 })
      .select('name path')
      .lean(),
  ]);

  return {
    services: services.map((p) => ({
      label: p.name,
      href: normalizePath(p.path),
    })),
    trades: trades.map((p) => ({
      label: p.name,
      href: normalizePath(p.path),
    })),
  };
}

export async function getPublishedCmsPagesForListing(placement: 'services' | 'trades') {
  cmsReadNoStore();
  await ensureBaseCmsRecords();
  return await PageModel.find({
    status: 'published',
    renderMode: 'dynamic',
    placement,
  })
    .sort({ name: 1 })
    .select('name path metaDescription')
    .lean();
}

/** Normalized paths for dynamic CMS pages that are unpublished — hide from nav and listings. */
export async function getUnpublishedDynamicPathsForPlacement(
  placement: 'services' | 'trades',
): Promise<string[]> {
  cmsReadNoStore();
  await ensureBaseCmsRecords();
  await connectToDatabase();
  const rows = await PageModel.find({
    renderMode: 'dynamic',
    placement,
    status: 'unpublished',
  })
    .select('path')
    .lean();
  return rows.map((r) => normalizePath(String((r as { path?: string }).path ?? '')));
}

/** True if this slug maps to an unpublished dynamic CMS page (public should 404, not fall through to catalog). */
export async function hasUnpublishedDynamicCmsPageAtSlug(slug: string): Promise<boolean> {
  const pathNorm = normalizePath(slug);
  const single = singleSegmentPath(pathNorm);
  if (!single) {
    return false;
  }
  return hasUnpublishedDynamicCmsPageAtPath(single);
}

/** Same as {@link hasUnpublishedDynamicCmsPageAtSlug} but for any allowed path (e.g. `/trades/exterior`). */
export async function hasUnpublishedDynamicCmsPageAtPath(path: string): Promise<boolean> {
  cmsReadNoStore();
  await ensureBaseCmsRecords();
  await connectToDatabase();
  const normalized = normalizePath(path);
  if (!isAllowedDynamicPublicPath(normalized)) {
    return false;
  }
  const doc = await PageModel.findOne({
    path: normalized,
    renderMode: 'dynamic',
    status: 'unpublished',
  })
    .select('_id')
    .lean();
  return !!doc;
}

export type LoadPageOptions = {
  allowDraft?: boolean;
};

export async function loadDynamicCmsPageByPath(path: string, options: LoadPageOptions = {}) {
  cmsReadNoStore();
  await ensureBaseCmsRecords();
  await connectToDatabase();

  const normalized = normalizePath(path);
  const query: Record<string, unknown> = {
    renderMode: 'dynamic',
    path: normalized,
  };

  if (!options.allowDraft) {
    query.status = 'published';
  }

  return await PageModel.findOne(query).lean();
}

export async function loadDynamicCmsPageBySlug(slug: string, options: LoadPageOptions = {}) {
  const path = normalizePath(slug);
  const single = singleSegmentPath(path);
  if (!single) {
    return null;
  }
  return loadDynamicCmsPageByPath(single, options);
}

export async function buildDynamicPageMetadata(
  slug: string,
  options: LoadPageOptions = {},
): Promise<Metadata | null> {
  const page = await loadDynamicCmsPageBySlug(slug, options);
  return page ? buildMetadataFromPageDoc(page) : null;
}

export async function buildDynamicPageMetadataForPath(
  path: string,
  options: LoadPageOptions = {},
): Promise<Metadata | null> {
  const page = await loadDynamicCmsPageByPath(normalizePath(path), options);
  return page ? buildMetadataFromPageDoc(page) : null;
}

function buildMetadataFromPageDoc(page: {
  name: string;
  path: string;
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: string;
  indexStatus?: string;
  headerMetaTags?: string;
  footerMetaTags?: string;
}): Metadata {
  const robotsValue =
    page.indexStatus === 'noindex'
      ? { index: false, follow: false }
      : { index: true, follow: true };

  const imageUrl = normalizeImageUrl(page.metaImage || '');

  return {
    title: page.metaTitle || page.name,
    description: page.metaDescription || undefined,
    robots: robotsValue,
    alternates: { canonical: normalizePath(page.path) },
    openGraph: {
      title: page.metaTitle || page.name,
      description: page.metaDescription || undefined,
      images: imageUrl ? [{ url: imageUrl, alt: page.name }] : [],
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: page.metaTitle || page.name,
      description: page.metaDescription || undefined,
      images: imageUrl ? [imageUrl] : [],
    },
    other: {
      headerMetaTags: page.headerMetaTags || '',
      footerMetaTags: page.footerMetaTags || '',
    },
  };
}

function normalizeImageUrl(value?: string): string {
  const raw = value?.trim().replace(/^['"]|['"]$/g, '') || '';
  if (!raw) {
    return '';
  }

  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('/')) {
    return raw;
  }

  if (raw.startsWith('www.')) {
    return `https://${raw}`;
  }

  return raw;
}

export async function assertDynamicSlugAvailable(params: {
  slug: string;
  path: string;
  excludePageId?: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  await connectToDatabase();

  const pathNorm = normalizePath(params.path);
  const slugNorm = params.slug.trim();

  /** Root homepage: URL stays `/`; slug is a label only (e.g. `home`). */
  if (pathNorm === '/') {
    const conflict = await PageModel.findOne({
      path: '/',
      renderMode: 'dynamic',
      ...(params.excludePageId
        ? { _id: { $ne: params.excludePageId } }
        : {}),
    })
      .select('_id')
      .lean();
    if (conflict) {
      return {
        ok: false,
        message: 'Another dynamic page already uses the homepage path.',
      };
    }
    return { ok: true };
  }

  if (!isAllowedDynamicPublicPath(pathNorm)) {
    return {
      ok: false,
      message: 'Dynamic CMS pages must use /page-name or /trades/page-name.',
    };
  }

  const parts = pathNorm.split('/').filter(Boolean);

  if (parts.length === 2 && parts[0] === 'trades') {
    const expected = `trade-${parts[1]}`;
    if (slugNorm !== expected) {
      return {
        ok: false,
        message: `For this path, slug must be "${expected}".`,
      };
    }
  } else if (parts.length === 1) {
    const single = `/${parts[0]}`;
    if (single !== `/${slugNorm}`) {
      return {
        ok: false,
        message: 'Slug must match the path segment (slug "my-page" → path "/my-page").',
      };
    }
  }

  /** Do not require slug to be unique vs `Service`: dynamic pages at `/{slug}` render before the catalog
   *  (`app/[slug]/page.tsx`), and service marketing URLs intentionally share the same slug as catalog rows.
   */

  const pageConflict = await PageModel.findOne({
    $and: [
      { $or: [{ slug: slugNorm }, { path: pathNorm }] },
      ...(params.excludePageId ? [{ _id: { $ne: params.excludePageId } }] : []),
    ],
  })
    .select('_id slug path')
    .lean();
  if (pageConflict) {
    return { ok: false, message: 'Another page already uses this slug or path.' };
  }

  return { ok: true };
}

export async function assertPageSlugPathUnique(params: {
  slug: string;
  path: string;
  renderMode: 'seo_only' | 'dynamic';
  excludePageId?: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  if (params.renderMode === 'dynamic') {
    return assertDynamicSlugAvailable({
      slug: params.slug,
      path: params.path,
      excludePageId: params.excludePageId,
    });
  }

  await connectToDatabase();
  const slugNorm = params.slug.trim();
  const pathNorm = normalizePath(params.path);

  const pageConflict = await PageModel.findOne({
    $and: [
      { $or: [{ slug: slugNorm }, { path: pathNorm }] },
      ...(params.excludePageId ? [{ _id: { $ne: params.excludePageId } }] : []),
    ],
  })
    .select('_id')
    .lean();

  if (pageConflict) {
    return { ok: false, message: 'Another page already uses this slug or path.' };
  }

  return { ok: true };
}

export function normalizeSectionsInput(raw: unknown): CmsPageSection[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  const sections: CmsPageSection[] = [];

  for (let i = 0; i < raw.length; i += 1) {
    const item = raw[i] as Record<string, unknown>;
    if (!item || typeof item !== 'object') {
      continue;
    }
    const type = String(item.type || '');
    const key = String(item.key || '').trim() || `sec-${i}-${type}`;
    const order = typeof item.order === 'number' ? item.order : i;
    const data =
      item.data && typeof item.data === 'object' && !Array.isArray(item.data)
        ? (item.data as Record<string, unknown>)
        : {};

    const migrated = migrateLegacyCmsSection({ key, type, order, data });
    if (!isKnownSectionType(migrated.type)) {
      continue;
    }
    sections.push(migrated);
  }

  sections.sort((a, b) => a.order - b.order || a.key.localeCompare(b.key));
  return sections.map((s, idx) => ({ ...s, order: idx }));
}
