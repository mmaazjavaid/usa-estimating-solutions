'use client';

import Link from 'next/link';
import {
  CMS_SECTION_BODY_LINES,
  CMS_SECTION_HEADING_LINES,
  CmsClamp,
} from '@/components/ui/cms-clamp';
import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

type CTASectionProps = {
  variant?: 'default' | 'dark';
  title?: string;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
  titleTypography?: CmsTextTypography;
  descriptionTypography?: CmsTextTypography;
};

const DEFAULT_TITLE = 'Got Your Plans? Let’s Talk.';

const DEFAULT_DESCRIPTION =
  'Recognized by The Blue Book Network, we are a trusted construction cost estimation company known for affordable pricing, precision, and professionalism in every project we handle.';

export function CTASection({
  variant = 'dark',
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  ctaHref = '/contact',
  ctaLabel = 'Get a Quote',
  titleTypography,
  descriptionTypography,
}: CTASectionProps = {}) {
  const isDark = variant === 'dark';

  return (
    <section
      className={`relative overflow-visible px-4 py-12 md:py-14 ${isDark ? 'border-y border-white/10 bg-[#1E1E1E]' : 'border-y border-border bg-background'}`}
    >
      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
        <h2
          className={cn(
            'mb-4 text-balance text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl',
            isDark ? 'text-white' : 'text-foreground',
            titleTypography?.className,
          )}
          style={titleTypography?.style}
        >
          <CmsClamp as="span" lines={CMS_SECTION_HEADING_LINES}>
            {title}
          </CmsClamp>
        </h2>

        <p
          className={cn(
            'mx-auto mb-7 max-w-2xl text-sm leading-normal md:text-base',
            isDark ? 'text-[#D1D1D1]' : 'text-muted-foreground',
            descriptionTypography?.className,
          )}
          style={descriptionTypography?.style}
        >
          <CmsClamp as="span" lines={CMS_SECTION_BODY_LINES}>
            {description}
          </CmsClamp>
        </p>

        <div className="flex justify-center">
          <Link
            href={ctaHref}
            className={`inline-flex items-center justify-center rounded-full border px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
              isDark
                ? 'border-white/40 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)] hover:bg-white hover:text-black'
                : 'border-foreground/30 text-foreground hover:bg-foreground hover:text-background'
            }`}
          >
            {ctaLabel}
          </Link>
        </div>
      </div>

      <button
        aria-label="Scroll to top"
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute right-10 top-0 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-lg md:right-14"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
    </section>
  );
}
