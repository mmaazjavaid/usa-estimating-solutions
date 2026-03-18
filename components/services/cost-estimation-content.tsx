'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { EstimateCard } from '@/components/common/estimate-card';
import { CursorGlow } from '@/components/ui/cursor-glow';
import { StepsRow } from '@/components/common/steps-row';
import { ServiceTradesSection } from '@/components/services/service-trades-section';

const costServices = [
  {
    title: 'Building Cost\nEstimating',
    description:
      'Detailed building cost estimates built for budget control and confident bidding.',
    arrowColor: '#E85A71',
    iconColors: { top: '#E85A71', layers: '#8D3048' },
    href: '/cost-estimation',
  },
  {
    title: 'BIM\nEstimating',
    description:
      'BIM-based quantification and pricing support for design coordination and accuracy.',
    arrowColor: '#9B8AC4',
    iconColors: { top: '#9B8AC4', layers: '#5A4080' },
    href: '/cost-estimation',
  },
  {
    title: 'Budget\nEstimating',
    description:
      'Reliable budget estimates for early planning, forecasting, and cost decisions.',
    arrowColor: '#5BBFBA',
    iconColors: { top: '#5BBFBA', layers: '#307870' },
    href: '/cost-estimation',
  },
  {
    title: 'Preliminary\nEstimating',
    description:
      'Concept-stage estimate guidance to evaluate feasibility and project scope.',
    arrowColor: '#C4956A',
    iconColors: { top: '#C4956A', layers: '#8D5530' },
    href: '/cost-estimation',
  },
  {
    title: 'Design Phase\nEstimating',
    description:
      'Design development estimates to keep decisions aligned with target budgets.',
    arrowColor: '#5B8BD4',
    iconColors: { top: '#5B8BD4', layers: '#345C9A' },
    href: '/cost-estimation',
  },
  {
    title: 'Bid\nEstimating',
    description:
      'Bid-ready estimates that improve competitiveness while protecting margins.',
    arrowColor: '#D4D95B',
    iconColors: { top: '#D4D95B', layers: '#899030' },
    href: '/cost-estimation',
  },
];

const processSteps = [
  'Share Plans',
  'Receive a Quote',
  'Process Payment',
  'Get Your Estimate',
];

// Position data for the floating cards to match the first image
const floatingCards = [
  { title: 'Preliminary Estimating', top: '6%', right: '6%', rotate: 12 },
  { title: 'Building Cost Estimating', top: '30%', left: '6%', rotate: -8 },
  { title: 'BIM Estimating', top: '56%', right: '10%', rotate: 5 },
  { title: 'Budget Estimating', top: '80%', left: '10%', rotate: -10 },
];

export function CostEstimationContent() {
  return (
    <section className="bg-black py-16 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        {/* Breadcrumb */}
        <div className="mb-12 text-sm text-gray-500">
          <Link href="/services" className="hover:text-white transition-colors">
            Services
          </Link>{' '}
          {'>'} <span className="text-white">Cost Estimation</span>
        </div>

        {/* Hero Section */}
        <div className="mb-32 grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="relative z-10">
            <h1 className="mb-8 text-balance text-5xl font-bold leading-[1.1] text-white md:text-6xl tracking-tight">
              Accurate <span className="text-[#5BBFBA]">Estimates</span> for{' '}
              <span className="text-[#C4956A]">Smarter</span> Budgeting & Cost
              Control
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-gray-400 md:text-lg">
              Accurate cost estimates are the difference between winning a bid
              and losing profit. Every estimate is developed through a detailed
              analysis of drawings, construction methods, materials, site
              conditions, and logistics, with precise trade-specific quantity
              takeoffs reviewed by senior estimators for maximum accuracy.
            </p>
          </div>

          {/* Floating Cards Visualization Section (The "First Image" look) */}
          <CursorGlow className="relative min-h-[620px] w-full">
            {floatingCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20, rotate: card.rotate }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="absolute flex h-28 w-55 items-center justify-center rounded-2xl border border-white/10 bg-[#0D0D0D] px-6 text-center shadow-2xl backdrop-blur-sm"
                style={{
                  top: card.top,
                  right: 'right' in card ? card.right : undefined,
                  left: 'left' in card ? card.left : undefined,
                }}
              >
                <p className="text-sm font-medium leading-snug text-white/90">
                  {card.title}
                </p>
                {/* Subtle bottom glow to match the screenshot style */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </motion.div>
            ))}

            {/* Background ambient glow to tie the cards together */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 -z-10 h-[400px] w-[400px] bg-[#C4956A]/10 blur-[120px] rounded-full" />
          </CursorGlow>
        </div>

        {/* ... (Keep the rest of your Cost Estimation Services and Process sections) */}

        <div className="mb-20">
          <h2 className="mb-10 text-center text-3xl font-bold text-white md:text-4xl">
            Cost Estimation Services
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {costServices.map((service) => (
              <EstimateCard
                key={service.title}
                title={service.title}
                description={service.description}
                href={service.href}
                arrowColor={service.arrowColor}
                topColor={service.iconColors.top}
                layerColor={service.iconColors.layers}
              />
            ))}
          </div>
        </div>

        <CursorGlow className="mb-20 w-full">
          <StepsRow
            heading="How Our Estimating Process Works"
            steps={processSteps}
            variant="dark"
          />
        </CursorGlow>

        <ServiceTradesSection />
      </div>
    </section>
  );
}
