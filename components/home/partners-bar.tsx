'use client';

import Image from 'next/image';
import { CursorGlow } from '@/components/ui/cursor-glow';
import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

const DEFAULT_INTRO =
  'Detailed takeoffs and bid-ready estimates; powered by';

const DEFAULT_LOGOS = [
  { src: '/images/partners/bluebeam.svg', alt: 'Bluebeam', width: 181, height: 39 },
  { src: '/images/partners/rsmeans.svg', alt: 'RSMeans', width: 155, height: 40 },
  { src: '/images/partners/planswift.svg', alt: 'PlanSwift', width: 225, height: 51 },
  { src: '/images/partners/xactimate.svg', alt: 'Xactimate', width: 180, height: 31 },
] as const;

export type PartnerLogo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type PartnersBarProps = {
  intro?: string;
  logos?: PartnerLogo[];
  introTypography?: CmsTextTypography;
};

export function PartnersBar({
  intro = DEFAULT_INTRO,
  logos = [...DEFAULT_LOGOS],
  introTypography,
}: PartnersBarProps = {}) {
  return (
    <section className="border-t border-border bg-background py-12">
      <CursorGlow className="h-full w-full">
        <div className="mx-auto max-w-5xl px-6">
          <p
            className={cn(
              'mb-10 text-balance text-center text-lg font-medium text-foreground md:text-xl',
              introTypography?.className,
            )}
            style={introTypography?.style}
          >
            {intro}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {logos.map((logo) => (
              <Image
                key={`${logo.src}-${logo.alt}`}
                src={logo.src}
                alt={logo.alt}
                width={logo.width ?? 160}
                height={logo.height ?? 40}
              />
            ))}
          </div>
        </div>
      </CursorGlow>
    </section>
  );
}
