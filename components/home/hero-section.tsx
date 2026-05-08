'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CursorGlow } from '@/components/ui/cursor-glow';
import {
  CMS_HERO_HEADLINE_LINES,
  CMS_HERO_SUBTITLE_LINES,
  cmsClampClassNames,
} from '@/components/ui/cms-clamp';
import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

export type HeroSectionCmsLink = {
  href: string;
  label: string;
};

const DEFAULT_SUBTITLE =
  'We provide professional construction estimating services and detailed material takeoff solutions.';

const DEFAULT_PRIMARY: HeroSectionCmsLink = {
  href: '/services',
  label: 'Explore Services',
};

const DEFAULT_SECONDARY: HeroSectionCmsLink = {
  href: '/contact',
  label: 'Get a Quote',
};

const DEFAULT_IMAGE = {
  src: '/images/cityscape.png',
  alt: 'City skyline illustration representing construction and urban development',
};

function headlineLooksLikeHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value.trim());
}

export type HeroSectionProps = {
  /**
   * Plain text (line breaks preserved) or HTML when you use tags.
   * For any color without Tailwind, use inline CSS, e.g.
   * `<span style="color:#B4934E">Power</span>` or `style="color: rgb(180, 147, 78)"`.
   * Tailwind classes on spans also work, e.g. `class="text-[#B4934E]"`.
   * When omitted, the animated default “Bid Power…” headline is used.
   */
  headline?: string;
  subtitle?: string;
  primaryCta?: HeroSectionCmsLink;
  secondaryCta?: HeroSectionCmsLink;
  imageSrc?: string;
  imageAlt?: string;
  /** CMS text size (optional). Ignored for the built-in animated headline. */
  headlineTypography?: CmsTextTypography;
  subtitleTypography?: CmsTextTypography;
};

export function HeroSection({
  headline,
  subtitle = DEFAULT_SUBTITLE,
  primaryCta = DEFAULT_PRIMARY,
  secondaryCta = DEFAULT_SECONDARY,
  imageSrc = DEFAULT_IMAGE.src,
  imageAlt = DEFAULT_IMAGE.alt,
  headlineTypography,
  subtitleTypography,
}: HeroSectionProps = {}) {
  const trimmedHeadline = (headline ?? '').trim();
  const showDefaultHeadline = !trimmedHeadline;
  const headlineAsHtml = showDefaultHeadline ? false : headlineLooksLikeHtml(trimmedHeadline);

  // Strip all text-size tokens (incl. responsive variants like md:text-5xl) so CMS
  // typography can't override the hardcoded size at any breakpoint.
  const headlineTypographyClass = headlineTypography?.className
    ?.split(' ')
    .filter((c) => !/^(?:(?:sm|md|lg|xl|2xl):)?text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/.test(c))
    .join(' ');

  const headlineClass = cn(
    'min-w-0 max-w-full text-balance font-bold leading-tight tracking-tight text-foreground',
    !showDefaultHeadline ? cmsClampClassNames(CMS_HERO_HEADLINE_LINES) : undefined,
    !showDefaultHeadline ? headlineTypographyClass : undefined,
    'text-4xl',
  );
  // Strip fontSize from CMS style — size is enforced by headlineClass so inline px can't override
  const headlineStyle = (() => {
    if (!showDefaultHeadline && headlineTypography?.style) {
      const { fontSize: omitted, ...rest } = headlineTypography.style;
      void omitted;
      return Object.keys(rest).length ? rest : undefined;
    }
    return undefined;
  })();

  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-6 md:pt-8">
      <div className="mx-auto flex max-w-7xl flex-col px-6 lg:min-h-[calc(100vh-5rem)] lg:flex-row lg:items-end lg:gap-12">
        {/* Left: text content */}
        <div className="relative z-10 flex min-w-0 flex-col gap-6 pb-10 pt-4 lg:w-[44%] lg:flex-none lg:pb-20 lg:pt-0">
          {showDefaultHeadline ? (
            <h1 className="min-w-0 text-balance text-2xl font-bold leading-tight tracking-tight text-foreground">
              <span>
                Bid{' '}
                <span className="text-animated-gradient text-animated-gradient--phase-0">
                  Power
                </span>
                . Price{' '}
                <span className="text-animated-gradient text-animated-gradient--phase-2">
                  smarter
                </span>
                . Win
              </span>
              <span className="block">more work.</span>
            </h1>
          ) : headlineAsHtml ? (
            <h1 className={headlineClass} style={headlineStyle} dangerouslySetInnerHTML={{ __html: trimmedHeadline }} />
          ) : (
            <h1 className={cn(headlineClass, 'whitespace-pre-line')} style={headlineStyle}>
              {trimmedHeadline}
            </h1>
          )}
          <p
            className={cn(
              'max-w-sm text-sm leading-relaxed text-muted-foreground',
              cmsClampClassNames(CMS_HERO_SUBTITLE_LINES),
              subtitleTypography?.className,
            )}
            style={subtitleTypography?.style}
          >
            {subtitle}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <CursorGlow className="inline-block">
              <Link
                href={primaryCta.href}
                className="rounded-full border border-foreground/30 px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                {primaryCta.label}
              </Link>
            </CursorGlow>
            <Link
              href={secondaryCta.href}
              className="rounded-full border border-foreground/30 px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>

        {/* Right: cityscape image */}
        <div className="flex items-end justify-center lg:w-[52%] lg:flex-none lg:justify-end">
          <CursorGlow className="w-full overflow-visible">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={945}
              height={821}
              className="w-full max-h-[45vh] object-contain object-bottom opacity-95 lg:max-h-[72vh]"
              priority
            />
          </CursorGlow>
        </div>
      </div>
    </section>
  );
}
