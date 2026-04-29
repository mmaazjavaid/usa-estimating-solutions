'use client';

import { motion } from 'framer-motion';

import { UsAlbersMap } from '@/components/home/us-albers-map';
import {
  CMS_SECTION_BODY_LINES,
  CMS_SECTION_HEADING_LINES,
  CmsClamp,
} from '@/components/ui/cms-clamp';
import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

export type ServiceLocationsProps = {
  heading?: string;
  subtitle?: string;
  /**
   * From CMS only: real SVG paths wrapped in links; missing keys use `/`.
   * Omit on the homepage for a non-clickable map with the same look.
   */
  stateHrefs?: Record<string, string>;
  headingTypography?: CmsTextTypography;
  subtitleTypography?: CmsTextTypography;
};

export function ServiceLocations({
  heading = 'Service Locations',
  subtitle = 'We work in the USA, UK, Canada, Australia, and all over the world',
  stateHrefs,
  headingTypography,
  subtitleTypography,
}: ServiceLocationsProps = {}) {
  const interactive = stateHrefs !== undefined;

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2
          className={cn(
            'mb-4 text-balance text-center text-3xl font-bold text-white md:text-4xl',
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
            'mx-auto mb-12 max-w-2xl text-center text-sm leading-relaxed text-white/70 md:text-base',
            subtitleTypography?.className,
          )}
          style={subtitleTypography?.style}
        >
          <CmsClamp as="span" lines={CMS_SECTION_BODY_LINES}>
            {subtitle}
          </CmsClamp>
        </p>

        <motion.div
          initial="rest"
          whileHover="hover"
          animate="rest"
          className={`relative isolate mx-auto aspect-[960/600] max-w-6xl ${interactive ? '' : 'cursor-pointer'}`}
        >
          <motion.div
            variants={{
              rest: { opacity: 0, scale: 0.85 },
              hover: { opacity: 0.18, scale: 1.05 },
            }}
            className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#C5A16E] blur-[100px] md:blur-[120px]"
            transition={{ duration: 1.1 }}
          />

          <div className="relative z-0 flex h-full w-full items-center justify-center px-2 md:px-4">
            {interactive && stateHrefs ? (
              <UsAlbersMap interactive stateHrefs={stateHrefs} />
            ) : (
              <UsAlbersMap />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
