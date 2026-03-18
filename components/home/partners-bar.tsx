'use client';

import Image from 'next/image';
import { CursorGlow } from '@/components/ui/cursor-glow';

export function PartnersBar() {
  return (
    <section className="border-t border-border bg-background py-12">
      <CursorGlow className="h-full w-full">
        <div className="mx-auto max-w-5xl px-6">
          <p className="mb-10 text-center text-lg font-medium text-foreground md:text-xl text-balance">
            Detailed takeoffs and bid-ready estimates; powered by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            <Image
              src="/images/partners/bluebeam.svg"
              alt="Bluebeam"
              width={181}
              height={39}
            />
            <Image
              src="/images/partners/rsmeans.svg"
              alt="RSMeans"
              width={155}
              height={40}
            />
            <Image
              src="/images/partners/planswift.svg"
              alt="PlanSwift"
              width={225}
              height={51}
            />
            <Image
              src="/images/partners/xactimate.svg"
              alt="Xactimate"
              width={180}
              height={31}
            />
          </div>
        </div>
      </CursorGlow>
    </section>
  );
}
