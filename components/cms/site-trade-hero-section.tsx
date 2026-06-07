import Link from 'next/link';
import { TradeHeroHexVisual } from '@/components/cms/trade-hero-hex-visual';
import {
  renderGradientHeading,
  stripHtmlToText,
} from '@/components/common/gradient-heading';
import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';
import { renderInlineLinks } from '@/components/cms/rich-text';

export function SiteTradeHeroSection({
  breadcrumbCurrent,
  headlineHtml,
  intro,
  hexTopColor,
  hexLayerColor,
  iconId,
  headlineTypography,
  introTypography,
}: {
  breadcrumbCurrent: string;
  headlineHtml: string;
  intro: string;
  hexTopColor?: string;
  hexLayerColor?: string;
  iconId: string;
  headlineTypography?: CmsTextTypography;
  introTypography?: CmsTextTypography;
}) {
  // Strip all text-size tokens (incl. responsive variants like md:text-5xl) so CMS
  // typography can't override the hardcoded size at any breakpoint.
  const headlineTypographyClass = headlineTypography?.className
    ?.split(' ')
    .filter((c) => !/^(?:(?:sm|md|lg|xl|2xl):)?text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/.test(c))
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

  return (
    <section className="bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-8">
      <nav className="mb-16 text-sm text-[#d9d9d9]/60">
        <Link href="/our-trades">Trades</Link>
        <span className="mx-2">{'>'}</span>
        <span>{breadcrumbCurrent}</span>
      </nav>

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="max-w-xl">
          <h1
            className={cn(
              'mb-8 text-4xl font-bold leading-tight',
              headlineTypographyClass,
            )}
            style={headlineStyle}
          >
            {renderGradientHeading(stripHtmlToText(headlineHtml))}
          </h1>
          <p
            className={cn(
              'text-justify text-sm leading-relaxed text-[#d9d9d9]/75 md:text-base',
              introTypography?.className,
            )}
            style={introTypography?.style}
          >
            {renderInlineLinks(intro)}
          </p>
        </div>

        <div className="flex w-full justify-center lg:justify-end">
          <TradeHeroHexVisual id={iconId} topColor={hexTopColor} layerColor={hexLayerColor} />
        </div>
      </div>
      </section>
    </section>
  );
}
