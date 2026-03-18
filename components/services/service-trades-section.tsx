'use client';

import Link from 'next/link';
import { TradeCard } from '../common/trade-card';
import { CursorGlow } from '@/components/ui/cursor-glow';

const trades = [
  {
    label: 'Structural Estimating',
    description:
      'Accurate structural estimates covering concrete, masonry, rebar, and steel.',
    href: '/trades/structural',
    glow: '#48F9EA',
  },
  {
    label: 'MEP Estimation',
    description:
      'Precise MEP estimating for mechanical, electrical, and plumbing systems.',
    href: '/trades/mep',
    glow: '#8B5CF6',
  },
  {
    label: 'Interior Estimating',
    description:
      'Accurate interior estimates covering drywall, flooring, and finishes.',
    href: '/trades/interior',
    glow: '#9F1239',
  },
  {
    label: 'Exterior Estimating',
    description:
      'Detailed exterior estimating to ensure accuracy and cost control.',
    href: '/trades/exterior',
    glow: '#EA580C',
  },
];

export function ServiceTradesSection() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <CursorGlow className="mb-20 w-full">
          <h2 className="mb-6 text-center text-4xl font-bold text-white">
            Our Trades
          </h2>

          <p className="mx-auto max-w-6xl text-center leading-relaxed text-gray-400">
            Our estimators provide accurate quantity takeoffs and cost estimates
            across all CSI Division trades, supporting commercial, residential,
            and industrial projects. All estimates are prepared in strict
            compliance with U.S. construction codes, industry standards, and
            current pricing databases, ensuring your bids remain competitive,
            accurate, and aligned with market conditions.
          </p>
        </CursorGlow>

        {/* GAP APPLIED HERE (gap-12) */}
        <div className="grid grid-cols-1 justify-items-center gap-12 md:grid-cols-2 md:gap-16 lg:grid-cols-4 lg:gap-20 xl:gap-24">
          {trades.map((trade) => (
            <Link key={trade.label} href={trade.href} className="p-4">
              <TradeCard
                label={trade.label}
                description={trade.description}
                glowColor={trade.glow}
              />
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-20">
          <Link
            href="/contact"
            className="rounded-full border border-white/20 px-10 py-3 text-white transition-all hover:bg-white hover:text-black font-medium"
          >
            Submit a plan
          </Link>
        </div>
      </div>
    </section>
  );
}
