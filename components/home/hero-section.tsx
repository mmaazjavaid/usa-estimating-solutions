'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CursorGlow } from '@/components/ui/cursor-glow';

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start px-6 py-14 lg:flex-row lg:items-end lg:py-20">
        {/* Left Content */}
        <div className="relative z-10 flex max-w-xl flex-col gap-6 pb-8 lg:pb-12">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
            <span>
              Bid{' '}
              <span className="text-animated-gradient text-animated-gradient--phase-0">
                Power
              </span>
              . Price{' '}
              <span className="text-animated-gradient text-animated-gradient--phase-2">
                smarter
              </span>
              . Win
            </span>
            <span className="block">more work.</span>
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            We provide professional construction estimating services and
            detailed material takeoff solutions.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <CursorGlow className="inline-block">
              <Link
                href="/services"
                className="rounded-full border border-foreground/30 px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Explore Services
              </Link>
            </CursorGlow>
            <Link
              href="/contact"
              className="rounded-full border border-foreground/30 px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Get a Quote
            </Link>
          </div>
        </div>

        {/* Right - Cityscape Image */}
        <div className="relative mt-6 flex-1 lg:mt-0">
          <CursorGlow className="w-full max-w-3xl overflow-visible lg:max-w-[48rem]">
            <Image
              src="/images/cityscape.png"
              alt="City skyline illustration representing construction and urban development"
              width={1100}
              height={620}
              className="w-full object-contain opacity-95"
              priority
            />
          </CursorGlow>
        </div>
      </div>
    </section>
  );
}
