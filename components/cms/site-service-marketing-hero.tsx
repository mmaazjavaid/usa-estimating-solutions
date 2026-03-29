'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CursorGlow } from '@/components/ui/cursor-glow';
import { ConstructionEstimationHeroSvg } from '@/components/cms/construction-estimation-hero-svg';
import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

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
  const glow = {
    primary: glowPrimary || defaultGlow.primary,
    secondary: glowSecondary || defaultGlow.secondary,
    tertiary: glowTertiary || defaultGlow.tertiary,
  };

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
        <CursorGlow className="relative min-h-[620px] w-full">
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
          ? 'mb-12 text-sm text-gray-500'
          : 'mb-16 text-sm text-[#d9d9d9]/60 md:mb-24'
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
          ? 'mb-8 text-balance text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl'
          : 'mb-8 text-4xl font-bold leading-tight md:text-5xl lg:text-5xl',
        headlineTypography?.className,
      )}
      style={headlineTypography?.style}
      dangerouslySetInnerHTML={{ __html: headlineHtml }}
    />
  );

  const introBlock = intro ? (
    <p
      className={cn(
        layout === 'cost'
          ? 'max-w-xl text-base leading-relaxed text-gray-400 md:text-lg'
          : 'max-w-xl text-justify text-sm leading-relaxed text-[#d9d9d9]/70 md:text-base',
        introTypography?.className,
      )}
      style={introTypography?.style}
    >
      {intro}
    </p>
  ) : null;

  if (layout === 'cost') {
    return (
      <section className="overflow-hidden bg-black py-16 text-white md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          {breadcrumb}
          <div className="mb-32 grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="relative z-10">
              {headline}
              {introBlock}
            </div>
            {rightColumn()}
          </div>
        </div>
      </section>
    );
  }

  const mainClass =
    layout === 'marketing_split_centered'
      ? 'flex flex-col items-center gap-12 lg:flex-row lg:gap-20'
      : layout === 'marketing_split' && rightVisual !== 'none'
        ? 'grid grid-cols-1 items-center gap-12 lg:grid-cols-2'
        : 'flex flex-col items-start justify-between gap-12 lg:flex-row';

  return (
    <section className="bg-black text-white">
      <section
        className={
          layout === 'marketing_split_centered'
            ? 'px-6 pb-16 pt-8 md:px-12 lg:px-20'
            : 'relative min-h-[600px] overflow-hidden px-6 pb-16 pt-6 md:px-12 lg:px-20'
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
              className={
                layout === 'marketing_split_centered'
                  ? 'flex flex-1 justify-center lg:justify-end'
                  : undefined
              }
            >
              {rightColumn()}
            </div>
          ) : null}
        </div>
      </section>
    </section>
  );
}
