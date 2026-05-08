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
  /** Optional. When omitted, a deterministic palette color is chosen. */
  arrowColor?: string;
  /** Optional. When omitted, a deterministic palette color is chosen. */
  topColor?: string;
  /** Optional. When omitted, derived from the chosen topColor. */
  layerColor?: string;
  minHeight?: string;
};

function hashStringToIndex(input: string, mod: number): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  const n = Math.abs(hash);
  return mod > 0 ? n % mod : 0;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const raw = hex.trim().replace(/^#/, '');
  const normalized =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  if (!/^[\da-fA-F]{6}$/.test(normalized)) return null;
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function clamp8(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  const to2 = (v: number) => clamp8(v).toString(16).padStart(2, '0');
  return `#${to2(r)}${to2(g)}${to2(b)}`.toUpperCase();
}

function darkenHex(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return rgbToHex({
    r: rgb.r * (1 - amount),
    g: rgb.g * (1 - amount),
    b: rgb.b * (1 - amount),
  });
}

function resolveEstimateCardTopColor(seed: string): string {
  // Requested base palette: orange, purple, reddish, greenish.
  const palette = ['#EA580C', '#8B5CF6', '#E11D48', '#22C55E'] as const;
  return palette[hashStringToIndex(seed || 'estimate', palette.length)] ?? palette[0];
}

export function EstimateCard({
  title,
  description,
  href,
  arrowColor,
  topColor,
  layerColor,
  minHeight = '320px',
}: EstimateCardProps) {
  const seed = `${href}::${title}`;
  const resolvedTop = (topColor && topColor.trim()) ? topColor : resolveEstimateCardTopColor(seed);
  const resolvedLayer =
    (layerColor && layerColor.trim()) ? layerColor : darkenHex(resolvedTop, 0.34);
  const resolvedArrow = (arrowColor && arrowColor.trim()) ? arrowColor : resolvedTop;

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
      data-no-glow
      className="group relative flex flex-col justify-between overflow-hidden rounded-[21px] border bg-white/[0.03] p-6 backdrop-blur-[15px] md:p-8"
      style={{ minHeight }}
    >
      <motion.div
        variants={glowVariants}
        className="pointer-events-none absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full blur-[80px]"
        style={{
          background: `radial-gradient(circle, ${resolvedTop} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        <HexIcon id={href} topColor={resolvedTop} layerColor={resolvedLayer} />
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
                      stroke={resolvedArrow}
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
