import Link from 'next/link';
import { TradeHexIcon } from '@/components/cms/trade-hex-icon';
import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

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
  hexTopColor: string;
  hexLayerColor: string;
  iconId: string;
  headlineTypography?: CmsTextTypography;
  introTypography?: CmsTextTypography;
}) {
  return (
    <section className="bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-8">
      <nav className="mb-16 text-sm text-[#d9d9d9]/60">
        <Link href="/trades">Trades</Link>
        <span className="mx-2">{'>'}</span>
        <span>{breadcrumbCurrent}</span>
      </nav>

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="max-w-xl">
          <h1
            className={cn(
              'mb-8 text-4xl font-bold leading-tight md:text-5xl',
              headlineTypography?.className,
            )}
            style={headlineTypography?.style}
            dangerouslySetInnerHTML={{ __html: headlineHtml }}
          />
          <p
            className={cn(
              'text-justify text-sm leading-relaxed text-[#d9d9d9]/75 md:text-base',
              introTypography?.className,
            )}
            style={introTypography?.style}
          >
            {intro}
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <TradeHexIcon id={iconId} topColor={hexTopColor} layerColor={hexLayerColor} />
        </div>
      </div>
      </section>
    </section>
  );
}
