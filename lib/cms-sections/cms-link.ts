import type { CmsLinkValue } from '@/lib/cms-sections/types';

/** If a link was stored as a JSON string or bare path string, coerce to an object. */
export function coerceCmsLinkField(value: unknown): unknown {
  if (value && typeof value === 'object') {
    return value;
  }
  if (typeof value !== 'string') {
    return value;
  }
  const t = value.trim();
  if (!t) {
    return undefined;
  }
  if (t.startsWith('{')) {
    try {
      return JSON.parse(t) as unknown;
    } catch {
      /* fall through */
    }
  }
  return { kind: 'internal' as const, href: t, label: '' };
}

export function cmsLinkToPair(
  link: unknown,
  fallback: { href: string; label: string },
): { href: string; label: string } {
  if (!link || typeof link !== 'object') {
    return fallback;
  }
  const l = link as Partial<CmsLinkValue>;
  const href = (l.href || '').trim() || fallback.href;
  const label = (l.label || '').trim() || fallback.label;
  return { href, label };
}

export function slugFromPathOrHref(href: string): string {
  const parts = href.replace(/^\/+/, '').split('/').filter(Boolean);
  return parts[parts.length - 1] || 'service';
}

/** Resolves a CMS link for map state targets; blank href → home (`/`). */
export function cmsStateLinkHref(link: unknown): string {
  if (!link || typeof link !== 'object') {
    return '/';
  }
  const l = link as Partial<CmsLinkValue>;
  const raw = (l.href || '').trim();
  if (!raw) {
    return '/';
  }
  if (l.kind === 'external') {
    return raw;
  }
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw;
  }
  return raw.startsWith('/') ? raw : `/${raw}`;
}
