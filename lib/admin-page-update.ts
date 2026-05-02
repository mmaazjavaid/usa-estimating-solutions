import {
  assertPageSlugPathUnique,
  normalizePath,
  normalizeSectionsInput,
} from '@/lib/cms-pages';
import { parseTradeSlugInput } from '@/lib/trade-slug-input';

const PATCH_KEYS = [
  'name',
  'slug',
  'path',
  'metaTitle',
  'metaDescription',
  'metaImage',
  'headerMetaTags',
  'footerMetaTags',
  'indexStatus',
  'status',
  'placement',
  'renderMode',
  'sections',
  'tradeLocation',
  'parentTrade',
  'parentTradeDescription',
] as const;

type PatchKey = (typeof PATCH_KEYS)[number];

export type PagePatchPayload = Partial<Record<PatchKey, unknown>>;

function asRenderMode(v: unknown): 'seo_only' | 'dynamic' | undefined {
  if (v === 'seo_only' || v === 'dynamic') return v;
  return undefined;
}

function asPlacement(v: unknown): 'none' | 'services' | 'trades' | undefined {
  if (v === 'none' || v === 'services' || v === 'trades') return v;
  return undefined;
}

export function sanitizePagePatch(body: Record<string, unknown>): PagePatchPayload {
  const out: PagePatchPayload = {};
  for (const key of PATCH_KEYS) {
    if (key in body) {
      out[key] = body[key];
    }
  }
  return out;
}

export async function validateAndFinalizePagePatch(params: {
  existing: {
    _id: { toString(): string };
    slug: string;
    path: string;
    renderMode?: string;
    name: string;
  };
  patch: PagePatchPayload;
}): Promise<{ ok: true; update: Record<string, unknown> } | { ok: false; message: string }> {
  const { existing, patch } = params;

  const renderMode =
    asRenderMode(patch.renderMode) ??
    (existing.renderMode === 'dynamic' ? 'dynamic' : 'seo_only');

  let slug =
    typeof patch.slug === 'string' ? patch.slug.trim().replace(/^\/+/, '') : existing.slug;
  let path = typeof patch.path === 'string' ? patch.path.trim() : existing.path;

  if (renderMode === 'dynamic') {
    const existingPathNorm = normalizePath(existing.path);
    if (existingPathNorm === '/') {
      path = '/';
      const raw =
        typeof patch.slug === 'string' ? patch.slug : existing.slug;
      // Not "home" — that slug is often used by a /home CMS page and must stay unique.
      slug = String(raw ?? 'homepage')
        .trim()
        .replace(/^\/+/, '') || 'homepage';
    } else if (existingPathNorm.startsWith('/trades/')) {
      const segment = parseTradeSlugInput(slug);
      if (!segment) {
        return { ok: false, message: 'Invalid trades slug (use trade-{segment} e.g. trade-exterior).' };
      }
      slug = `trade-${segment}`;
      path = `/trades/${segment}`;
    } else {
      slug = slug.replace(/^\/+/, '');
      path = `/${slug}`;
    }
  }

  const unique = await assertPageSlugPathUnique({
    slug,
    path,
    renderMode,
    excludePageId: existing._id.toString(),
  });

  if (!unique.ok) {
    return unique;
  }

  if (typeof patch.name === 'string' && !patch.name.trim()) {
    return { ok: false, message: 'Page name cannot be empty.' };
  }

  const update: Record<string, unknown> = {};

  for (const key of PATCH_KEYS) {
    if (!(key in patch)) {
      continue;
    }

    if (key === 'sections') {
      update.sections = normalizeSectionsInput(patch.sections);
      continue;
    }

    if (key === 'placement') {
      const p = asPlacement(patch.placement);
      if (!p) {
        return { ok: false, message: 'Invalid placement.' };
      }
      update.placement = p;
      continue;
    }

    if (key === 'renderMode') {
      update.renderMode = renderMode;
      continue;
    }

    if (key === 'indexStatus') {
      if (patch.indexStatus !== 'index' && patch.indexStatus !== 'noindex') {
        return { ok: false, message: 'Invalid index status.' };
      }
      update.indexStatus = patch.indexStatus;
      continue;
    }

    if (key === 'status') {
      if (patch.status !== 'published' && patch.status !== 'unpublished') {
        return { ok: false, message: 'Invalid publish status.' };
      }
      update.status = patch.status;
      continue;
    }

    if (key === 'tradeLocation') {
      if (patch.tradeLocation !== 'independent' && patch.tradeLocation !== 'under_trade') {
        return { ok: false, message: 'Invalid trade location.' };
      }
      update.tradeLocation = patch.tradeLocation;
      continue;
    }

    if (key === 'parentTrade') {
      const valid = ['interior', 'exterior', 'mep', 'structural', null, ''];
      if (!valid.includes(patch.parentTrade as string | null)) {
        return { ok: false, message: 'Invalid parent trade.' };
      }
      update.parentTrade = patch.parentTrade || null;
      continue;
    }

    if (key === 'parentTradeDescription') {
      update.parentTradeDescription = typeof patch.parentTradeDescription === 'string' ? patch.parentTradeDescription : '';
      continue;
    }

    update[key] = patch[key];
  }

  if (renderMode === 'dynamic' && ('slug' in patch || 'path' in patch || 'renderMode' in patch)) {
    update.slug = slug;
    update.path = path;
  }

  return { ok: true, update };
}

export async function validateNewDynamicPage(body: Record<string, unknown>): Promise<
  | { ok: true; doc: Record<string, unknown> }
  | { ok: false; message: string }
> {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const slugRaw = typeof body.slug === 'string' ? body.slug.trim().replace(/^\/+/, '') : '';
  const placement = asPlacement(body.placement) ?? 'none';

  if (!name || !slugRaw) {
    return { ok: false, message: 'Name and slug are required.' };
  }

  let slug: string;
  let path: string;

  if (placement === 'trades') {
    const segment = parseTradeSlugInput(slugRaw);
    if (!segment) {
      return {
        ok: false,
        message: 'Enter a trades URL segment (e.g. exterior or trade-exterior for /trades/exterior).',
      };
    }
    slug = `trade-${segment}`;
    path = `/trades/${segment}`;
  } else {
    slug = slugRaw;
    path = `/${slugRaw}`;
  }

  const unique = await assertPageSlugPathUnique({
    slug,
    path,
    renderMode: 'dynamic',
  });

  if (!unique.ok) {
    return unique;
  }

  const sections = normalizeSectionsInput(body.sections);

  const tradeLocation =
    body.tradeLocation === 'under_trade' ? 'under_trade' : 'independent';
  const parentTradeRaw = body.parentTrade;
  const parentTrade =
    parentTradeRaw === 'interior' ||
    parentTradeRaw === 'exterior' ||
    parentTradeRaw === 'mep' ||
    parentTradeRaw === 'structural'
      ? parentTradeRaw
      : null;

  const doc = {
    name,
    slug,
    path,
    metaTitle: typeof body.metaTitle === 'string' ? body.metaTitle : '',
    metaDescription: typeof body.metaDescription === 'string' ? body.metaDescription : '',
    metaImage: typeof body.metaImage === 'string' ? body.metaImage : '',
    headerMetaTags: typeof body.headerMetaTags === 'string' ? body.headerMetaTags : '',
    footerMetaTags: typeof body.footerMetaTags === 'string' ? body.footerMetaTags : '',
    indexStatus:
      body.indexStatus === 'noindex' || body.indexStatus === 'index'
        ? body.indexStatus
        : 'index',
    status:
      body.status === 'unpublished' || body.status === 'published'
        ? body.status
        : 'unpublished',
    placement,
    renderMode: 'dynamic' as const,
    sections,
    tradeLocation,
    parentTrade,
    parentTradeDescription:
      typeof body.parentTradeDescription === 'string' ? body.parentTradeDescription : '',
  };

  return { ok: true, doc };
}
