'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

import { cmsClampClassNames } from '@/components/ui/cms-clamp';
import { cn } from '@/lib/utils';

import { HexIcon } from './hex-icon';

/** Hide “Learn More” when the target is the trades hub only, not a specific trade path. */
function isTradesIndexOnlyHref(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  const withoutQuery = trimmed.split('?')[0]?.split('#')[0] ?? trimmed;
  let path = withoutQuery;
  if (path.includes('://')) {
    try {
      path = new URL(path).pathname;
    } catch {
      return false;
    }
  }
  if (!path.startsWith('/')) path = `/${path}`;
  const normalized = path.replace(/\/+$/, '') || '/';
  return normalized === '/trades';
}

type EstimateCardProps = {
  title: string;
  description: string;
  href: string;
  arrowColor: string;
  topColor: string;
  layerColor: string;
  minHeight?: string;
};

export function EstimateCard({
  title,
  description,
  href,
  arrowColor,
  topColor,
  layerColor,
  minHeight = '320px',
}: EstimateCardProps) {
  const cardVariants: Variants = {
    rest: { borderColor: 'rgba(255, 255, 255, 0.1)' },
    hover: {
      borderColor: 'rgba(255, 255, 255, 0.4)',
      transition: { duration: 0.5 },
    },
  };

  const glowVariants: Variants = {
    rest: { opacity: 0, scale: 0.8 },
    hover: {
      opacity: 0.6,
      scale: 1.2,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const descriptionVariants: Variants = {
    rest: {
      opacity: 0,
      y: 10, // Slight vertical lift for a smoother entrance
      transition: { duration: 0.45 },
    },
    hover: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut', delay: 0.1 },
    },
  };

  // This variant handles the specific right-to-left shift
  const linkVariants: Variants = {
    rest: { x: 0 },
    hover: {
      x: -140,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1], // smoother cubic-bezier
      },
    },
  };

  const showLearnMore = !isTradesIndexOnlyHref(href);

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardVariants}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[21px] border bg-white/[0.03] p-6 backdrop-blur-[15px] md:p-8"
      style={{ minHeight }}
    >
      <motion.div
        variants={glowVariants}
        className="pointer-events-none absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full blur-[80px]"
        style={{
          background: `radial-gradient(circle, ${topColor} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        <HexIcon id={href} topColor={topColor} layerColor={layerColor} />
      </div>

      <div className="relative z-10">
        <div className="flex items-end justify-between">
          <h3
            className={cn(
              'min-w-0 whitespace-pre-line font-serif text-3xl font-extrabold leading-[1.1] text-white lg:text-[40px]',
              cmsClampClassNames(3),
            )}
          >
            {title}
          </h3>

          <div className="relative flex flex-col items-end">
            {/* Description wrapper with fixed height to prevent layout jump */}
            <div className="flex h-[60px] max-w-[270px] items-center">
              <motion.p
                variants={descriptionVariants}
                className={cn(
                  'max-w-[270px] text-[12px] leading-relaxed text-white/70',
                  cmsClampClassNames(3),
                )}
              >
                {description}
              </motion.p>
            </div>

            {showLearnMore ? (
              <motion.div variants={linkVariants}>
                <Link
                  href={href}
                  className="flex items-center gap-3 whitespace-nowrap text-sm text-white md:text-base"
                >
                  <span className="font-serif">Learn More</span>
                  <svg
                    width="34"
                    height="12"
                    viewBox="0 0 34 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 6H32M32 6L27 1M32 6L27 11"
                      stroke={arrowColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
