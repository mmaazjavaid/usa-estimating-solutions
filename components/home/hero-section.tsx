'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CursorGlow } from '@/components/ui/cursor-glow';
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

  const headlineClass = cn(
    'text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl',
    !showDefaultHeadline ? headlineTypography?.className : undefined,
  );
  const headlineStyle = !showDefaultHeadline ? headlineTypography?.style : undefined;

  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start px-6 py-14 lg:flex-row lg:items-end lg:py-20">
        <div className="relative z-10 flex max-w-xl flex-col gap-6 pb-8 lg:pb-12">
          {showDefaultHeadline ? (
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
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
            <h1
              className={headlineClass}
              style={headlineStyle}
              dangerouslySetInnerHTML={{ __html: trimmedHeadline }}
            />
          ) : (
            <h1
              className={cn(headlineClass, 'whitespace-pre-line')}
              style={headlineStyle}
            >
              {trimmedHeadline}
            </h1>
          )}
          <p
            className={cn(
              'max-w-md text-base leading-relaxed text-muted-foreground',
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

        <div className="relative mt-6 flex w-full flex-1 justify-center lg:mt-0 lg:justify-end">
          <CursorGlow className="w-full max-w-3xl overflow-visible lg:max-w-[48rem]">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={1100}
              height={620}
              className="w-full object-contain opacity-95"
              priority
            />
          </CursorGlow>
        </div>
      </div>
    </section>
  );
}
