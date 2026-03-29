import type { CSSProperties } from 'react';

/** Admin select options: current section styles = Default; semantic scales + custom px. */
export const CMS_TEXT_SIZE_OPTIONS = [
  { value: 'default', label: 'Default (section style)' },
  { value: 'h1', label: 'Large (H1 scale)' },
  { value: 'h2', label: 'Medium (H2 scale)' },
  { value: 'h3', label: 'Small (H3 scale)' },
  { value: 'custom', label: 'Custom (px)' },
] as const;

export type CmsTextTypography = {
  className?: string;
  style?: CSSProperties;
};

const HEADLINE_SCALE: Record<string, string> = {
  h1: 'text-4xl md:text-5xl lg:text-6xl',
  h2: 'text-3xl md:text-4xl lg:text-5xl',
  h3: 'text-2xl md:text-3xl lg:text-4xl',
};

/** Body / intro copy — “H1 scale” = large lead, not a literal <h1>. */
const PARAGRAPH_SCALE: Record<string, string> = {
  h1: 'text-xl md:text-2xl',
  h2: 'text-lg md:text-xl',
  h3: 'text-base md:text-lg',
};

export function parseCmsFontSizePx(raw: unknown): number | undefined {
  const n = parseFloat(String(raw ?? '').trim().replace(/px$/i, ''));
  if (!Number.isFinite(n) || n <= 0 || n > 512) {
    return undefined;
  }
  return n;
}

function normalizeSize(raw: unknown): string {
  return String(raw ?? 'default').trim() || 'default';
}

export function cmsResolveHeadlineSize(
  sizeRaw: unknown,
  pxRaw: unknown,
): CmsTextTypography | undefined {
  const size = normalizeSize(sizeRaw);
  if (size === 'default') {
    return undefined;
  }
  if (size === 'custom') {
    const px = parseCmsFontSizePx(pxRaw);
    if (px == null) {
      return undefined;
    }
    return {
      className: 'leading-tight',
      style: { fontSize: `${px}px`, lineHeight: 1.15 },
    };
  }
  const cls = HEADLINE_SCALE[size];
  if (!cls) {
    return undefined;
  }
  return { className: cls };
}

export function cmsResolveParagraphSize(
  sizeRaw: unknown,
  pxRaw: unknown,
): CmsTextTypography | undefined {
  const size = normalizeSize(sizeRaw);
  if (size === 'default') {
    return undefined;
  }
  if (size === 'custom') {
    const px = parseCmsFontSizePx(pxRaw);
    if (px == null) {
      return undefined;
    }
    return {
      style: { fontSize: `${px}px`, lineHeight: 1.6 },
    };
  }
  const cls = PARAGRAPH_SCALE[size];
  if (!cls) {
    return undefined;
  }
  return { className: cls };
}
