'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CursorGlow } from '@/components/ui/cursor-glow';
import { ConstructionEstimationHeroSvg } from '@/components/cms/construction-estimation-hero-svg';
import {
  CMS_HERO_SUBTITLE_LINES,
  cmsClampClassNames,
} from '@/components/ui/cms-clamp';
import {
  renderGradientHeading,
  stripHtmlToText,
} from '@/components/common/gradient-heading';
import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';
import { renderInlineLinks } from '@/components/cms/rich-text';

export type FloatingCardItem = {
  title: string;
  top: string;
  right?: string;
  left?: string;
  rotate: string;
};

export type ServiceMarketingHeroProps = {
  breadcrumbParentHref?: string;
  breadcrumbParentLabel?: string;
  breadcrumbCurrent?: string;
  headlineHtml: string;
  intro?: string;
  layout?: 'cost' | 'marketing_split' | 'marketing_split_centered';
  rightVisual?: 'none' | 'image' | 'floating_cards' | 'construction_svg';
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
  imageSizes?: string;
  glowPrimary?: string;
  glowSecondary?: string;
  glowTertiary?: string;
  floatingCards?: FloatingCardItem[];
  imageWrapperClassName?: string;
  headlineTypography?: CmsTextTypography;
  introTypography?: CmsTextTypography;
};

const defaultGlow = {
  primary: 'rgba(196, 149, 106, 0.35)',
  secondary: 'rgba(91, 191, 186, 0.28)',
  tertiary: 'rgba(120, 120, 120, 0.22)',
};

/** Nudge right visual up (homepage hero keeps imagery visually higher); left column unchanged. */
const RIGHT_VISUAL_NUDGE_UP_CLASS =
  '-translate-y-2 md:-translate-y-4 lg:-translate-y-8 xl:-translate-y-10';

export function SiteServiceMarketingHero({
  breadcrumbParentHref = '/services',
  breadcrumbParentLabel = 'Services',
  breadcrumbCurrent = '',
  headlineHtml,
  intro,
  layout = 'marketing_split',
  rightVisual = 'none',
  imageSrc,
  imageAlt = '',
  imageClassName = 'h-auto w-full max-w-[700px]',
  imageSizes = '(max-width: 1024px) 100vw, 700px',
  glowPrimary,
  glowSecondary,
  glowTertiary,
  floatingCards = [],
  imageWrapperClassName,
  headlineTypography,
  introTypography,
}: ServiceMarketingHeroProps) {
  // Strip all text-size tokens (incl. responsive variants like md:text-5xl) so CMS
  // typography can't override the hardcoded size at any breakpoint.
  const headlineTypographyClass = headlineTypography?.className
    ?.split(' ')
    .filter(
      (c) =>
        !/^(?:(?:sm|md|lg|xl|2xl):)?text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/.test(
          c,
        ),
    )
    .join(' ');

  // Strip fontSize from CMS style — size is enforced by headline class so inline px can't override
  const headlineStyle = (() => {
    if (headlineTypography?.style) {
      const { fontSize: omitted, ...rest } = headlineTypography.style;
      void omitted;
      return Object.keys(rest).length ? rest : undefined;
    }
    return undefined;
  })();

  const glow = {
    primary: glowPrimary || defaultGlow.primary,
    secondary: glowSecondary || defaultGlow.secondary,
    tertiary: glowTertiary || defaultGlow.tertiary,
  };

  /** Tall right column (cost + floating cards, or any floating-cards visual) — show full intro and top-align columns. */
  const relaxIntroClamp = layout === 'cost' || rightVisual === 'floating_cards';

  const rightColumn = () => {
    if (rightVisual === 'image' && imageSrc) {
      return (
        <CursorGlow
          colors={glow}
          className={imageWrapperClassName ?? 'flex justify-center lg:justify-end'}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1024}
            height={768}
            className={imageClassName}
            sizes={imageSizes}
            priority
          />
        </CursorGlow>
      );
    }
    if (rightVisual === 'construction_svg') {
      return (
        <CursorGlow colors={glow} className="w-full flex-shrink-0 lg:w-[500px] xl:w-[600px]">
          <ConstructionEstimationHeroSvg />
        </CursorGlow>
      );
    }
    if (rightVisual === 'floating_cards' && floatingCards.length > 0) {
      return (
        <CursorGlow className="relative min-h-[480px] w-full sm:min-h-[520px] lg:min-h-[560px]">
          {floatingCards.map((card, index) => (
            <motion.div
              key={`${card.title}-${index}`}
              initial={{ opacity: 0, y: 20, rotate: Number(card.rotate) || 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="absolute flex h-28 w-55 items-center justify-center rounded-2xl border border-white/10 bg-[#0D0D0D] px-6 text-center shadow-2xl backdrop-blur-sm"
              style={{
                top: card.top,
                right: card.right,
                left: card.left,
              }}
            >
              <p className="text-sm font-medium leading-snug text-white/90">{card.title}</p>
              <div className="absolute bottom-0 left-1/2 h-[1px] w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>
          ))}
          <div className="absolute right-0 top-1/2 -z-10 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#C4956A]/10 blur-[120px]" />
        </CursorGlow>
      );
    }
    return null;
  };

  const breadcrumb = (
    <nav
      className={
        layout === 'cost'
          ? 'mb-8 text-sm text-gray-500'
          : 'mb-10 text-sm text-[#d9d9d9]/60 md:mb-12'
      }
    >
      <Link
        href={breadcrumbParentHref}
        className={layout === 'cost' ? 'transition-colors hover:text-white' : undefined}
      >
        {breadcrumbParentLabel}
      </Link>
      <span className="mx-2">&gt;</span>
      <span className={layout === 'cost' ? 'text-white' : undefined}>{breadcrumbCurrent}</span>
    </nav>
  );

  const headline = (
    <h1
      className={cn(
        layout === 'cost'
          ? 'mb-5 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-white'
          : 'mb-5 text-4xl font-bold leading-tight',
        headlineTypographyClass,
      )}
      style={headlineStyle}
    >
      {renderGradientHeading(stripHtmlToText(headlineHtml))}
    </h1>
  );

  const introBlock = intro ? (
    <p
      className={cn(
        layout === 'cost'
          ? 'max-w-xl text-base leading-relaxed text-gray-400 md:text-lg'
          : 'max-w-xl text-justify text-sm leading-relaxed text-[#d9d9d9]/70 md:text-base',
        relaxIntroClamp
          ? 'min-w-0 max-w-full break-words text-balance'
          : cmsClampClassNames(CMS_HERO_SUBTITLE_LINES),
        introTypography?.className,
      )}
      style={introTypography?.style}
    >
      {renderInlineLinks(intro)}
    </p>
  ) : null;

  if (layout === 'cost') {
    return (
      <section className="overflow-hidden bg-black py-8 pb-6 text-white md:py-12 md:pb-8">
        <div className="mx-auto max-w-7xl px-6">
          {breadcrumb}
          <div
            className={cn(
              'mb-8 grid gap-8 md:mb-10 lg:grid-cols-2',
              relaxIntroClamp ? 'lg:items-start' : 'lg:items-center',
            )}
          >
            <div className="relative z-10">
              {headline}
              {introBlock}
            </div>
            <div className={RIGHT_VISUAL_NUDGE_UP_CLASS}>{rightColumn()}</div>
          </div>
        </div>
      </section>
    );
  }

  const mainClass =
    layout === 'marketing_split_centered'
      ? cn(
          'flex flex-col gap-6 lg:flex-row lg:gap-12',
          relaxIntroClamp ? 'items-start' : 'items-center',
        )
      : layout === 'marketing_split' && rightVisual !== 'none'
        ? cn(
            'grid grid-cols-1 gap-6 lg:grid-cols-2',
            relaxIntroClamp ? 'items-start' : 'items-center',
          )
        : 'flex flex-col items-start justify-between gap-6 lg:flex-row';

  return (
    <section className="bg-black text-white">
      <section
        className={
          layout === 'marketing_split_centered'
            ? 'px-6 pb-5 pt-6 md:px-12 md:pb-6 lg:px-20'
            : 'relative min-h-[320px] overflow-hidden px-6 pb-5 pt-4 sm:min-h-[360px] md:px-12 md:pb-6 lg:min-h-[400px] lg:px-20'
        }
      >
        {breadcrumb}
        <div className={mainClass}>
          <div
            className={
              layout === 'marketing_split_centered' ? 'max-w-xl flex-1' : 'max-w-xl lg:max-w-lg xl:max-w-xl'
            }
          >
            {headline}
            {introBlock}
          </div>
          {rightVisual !== 'none' ? (
            <div
              className={cn(
                RIGHT_VISUAL_NUDGE_UP_CLASS,
                layout === 'marketing_split_centered'
                  ? 'flex flex-1 justify-center lg:justify-end'
                  : layout === 'marketing_split'
                    ? 'flex justify-center lg:justify-end'
                    : undefined,
              )}
            >
              {rightColumn()}
            </div>
          ) : null}
        </div>
      </section>
    </section>
  );
}
