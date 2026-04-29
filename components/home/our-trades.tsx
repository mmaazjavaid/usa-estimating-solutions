import { EstimateCard } from '@/components/common/estimate-card';
import {
  CMS_SECTION_BODY_LINES,
  CMS_SECTION_HEADING_LINES,
  CmsClamp,
} from '@/components/ui/cms-clamp';
import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

export type OurTradeItem = {
  title: string;
  description: string;
  href: string;
  arrowColor: string;
  topColor: string;
  layerColor: string;
};

const DEFAULT_TRADES: OurTradeItem[] = [
  {
    title: 'Structural\nEstimating',
    description:
      'Reliable structural estimates that support competitive bids and efficient project execution.',
    arrowColor: '#EA7E37',
    topColor: '#E27B36',
    layerColor: '#8D5530',
    href: '/trades/structural',
  },
  {
    title: 'MEP\nEstimating',
    description:
      'Accurate MEP estimates covering mechanical, electrical, and plumbing systems for every project.',
    arrowColor: '#5BB8B0',
    topColor: '#5BB8B0',
    layerColor: '#307870',
    href: '/trades/mep',
  },
  {
    title: 'Interior\nEstimating',
    description:
      'Reliable interior estimates that support competitive bids and efficient project execution.',
    arrowColor: '#D45070',
    topColor: '#D45070',
    layerColor: '#8D3048',
    href: '/trades/interior',
  },
  {
    title: 'Exterior\nEstimating',
    description:
      'Comprehensive exterior estimates for facades, roofing, and site work with precision detail.',
    arrowColor: '#8A6AB8',
    topColor: '#8A6AB8',
    layerColor: '#5A4080',
    href: '/trades/exterior',
  },
];

const DEFAULT_INTRO =
  'Our estimators provide accurate quantity takeoffs and cost estimates across all CSI Division trades, supporting commercial, residential, and industrial projects. All estimates are prepared in strict compliance with U.S. construction codes, industry standards, and current pricing databases, ensuring your bids remain competitive, accurate, and aligned with market conditions.';

export type OurTradesProps = {
  heading?: string;
  intro?: string;
  trades?: OurTradeItem[];
  /** Dark layout for service marketing pages (black background, light text). */
  theme?: 'default' | 'dark';
  headingTypography?: CmsTextTypography;
  introTypography?: CmsTextTypography;
};

export function OurTrades({
  heading = 'Our Trades',
  intro = DEFAULT_INTRO,
  trades = DEFAULT_TRADES,
  theme = 'default',
  headingTypography,
  introTypography,
}: OurTradesProps = {}) {
  const isDark = theme === 'dark';
  return (
    <section className={isDark ? 'bg-black py-20 text-white' : 'bg-background py-20'}>
      <div className="mx-auto max-w-7xl px-6">
        <h2
          className={cn(
            isDark
              ? 'mb-10 text-center text-3xl font-bold text-white md:text-4xl'
              : 'mb-6 text-balance text-center font-serif text-3xl font-bold text-foreground md:text-4xl',
            headingTypography?.className,
          )}
          style={headingTypography?.style}
        >
          <CmsClamp as="span" lines={CMS_SECTION_HEADING_LINES}>
            {heading}
          </CmsClamp>
        </h2>
        <p
          className={cn(
            isDark
              ? 'mx-auto mb-14 max-w-3xl text-center text-sm leading-relaxed text-gray-400'
              : 'mx-auto mb-14 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground',
            introTypography?.className,
          )}
          style={introTypography?.style}
        >
          <CmsClamp as="span" lines={CMS_SECTION_BODY_LINES}>
            {intro}
          </CmsClamp>
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {trades.map((trade) => (
            <EstimateCard
              key={trade.href}
              title={trade.title}
              description={trade.description}
              href={trade.href}
              arrowColor={trade.arrowColor}
              topColor={trade.topColor}
              layerColor={trade.layerColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
