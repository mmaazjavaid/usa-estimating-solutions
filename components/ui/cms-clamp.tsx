import type { ElementType, ReactNode } from 'react';

import { cn } from '@/lib/utils';

/** Default visible lines for section headings (h2-scale blocks). */
export const CMS_SECTION_HEADING_LINES = 3;

/** Default visible lines for intros, subtitles, and lead copy. */
export const CMS_SECTION_BODY_LINES = 3;

/** Hero h1 — slightly more room than section titles. */
export const CMS_HERO_HEADLINE_LINES = 4;

export const CMS_HERO_SUBTITLE_LINES = 3;

const LINE_CLAMP: Record<number, string> = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
  7: 'line-clamp-7',
  8: 'line-clamp-8',
};

export const CMS_CLAMP_BASE_CLASS =
  'min-w-0 max-w-full break-words text-balance overflow-hidden';

export function cmsLineClampClass(lines: number): string {
  const n = Number.isFinite(lines) ? Math.min(8, Math.max(1, Math.round(lines))) : 3;
  return LINE_CLAMP[n] ?? LINE_CLAMP[3];
}

export function cmsClampClassNames(lines: number, className?: string): string {
  return cn(CMS_CLAMP_BASE_CLASS, cmsLineClampClass(lines), className);
}

type CmsClampProps<T extends ElementType> = {
  as?: T;
  lines?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Truncates CMS-driven copy in the UI while leaving full strings in the page source
 * (when used as text children — not a substitute for HTML field sanitization).
 */
export function CmsClamp<T extends ElementType = 'span'>({
  as,
  lines = CMS_SECTION_BODY_LINES,
  className,
  children,
}: CmsClampProps<T>) {
  const Comp = (as ?? 'span') as ElementType;
  return <Comp className={cmsClampClassNames(lines, className)}>{children}</Comp>;
}
