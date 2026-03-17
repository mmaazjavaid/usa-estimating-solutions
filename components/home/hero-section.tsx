 'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type MouseEvent, useRef } from 'react';

export function HeroSection() {
  const primaryTintRef = useRef<HTMLDivElement | null>(null);
  const secondaryTintRef = useRef<HTMLDivElement | null>(null);
  const tertiaryTintRef = useRef<HTMLDivElement | null>(null);
  const activeBlockRef = useRef<string | null>(null);

  const GRID_ROWS = 10;
  const GRID_COLS = 20;

  const getBlockMetrics = (row: number, col: number, blockIndex: number) => {
    const phaseA = Math.sin((row + 1) * 0.9 + (col + 1) * 0.6);
    const phaseB = Math.cos((row + 1) * 0.7 - (col + 1) * 0.8);
    const phaseC = Math.sin((blockIndex + 1) * 0.45);

    return {
      primaryW: 328 + phaseA * 32,
      primaryH: 312 + phaseB * 30,
      secondaryW: 252 + phaseB * 26,
      secondaryH: 236 + phaseC * 24,
      tertiaryW: 206 + phaseC * 20,
      tertiaryH: 192 + phaseA * 18,
      rotationPrimary: phaseA * 14,
      rotationSecondary: phaseB * -12,
      rotationTertiary: phaseC * 10,
      radiusPrimary: `${48 + phaseA * 16}% ${52 + phaseB * 12}% ${50 + phaseC * 14}% ${50 + phaseA * 10}%`,
      radiusSecondary: `${52 + phaseB * 14}% ${48 + phaseC * 10}% ${54 + phaseA * 12}% ${46 + phaseB * 12}%`,
      radiusTertiary: `${50 + phaseC * 10}% ${50 + phaseA * 12}% ${46 + phaseB * 11}% ${54 + phaseC * 9}%`,
    };
  };

  const moveGlowToBlock = (event: MouseEvent<HTMLDivElement>) => {
    if (!primaryTintRef.current || !secondaryTintRef.current || !tertiaryTintRef.current) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const blockWidth = rect.width / GRID_COLS;
    const blockHeight = rect.height / GRID_ROWS;
    const col = Math.min(GRID_COLS - 1, Math.max(0, Math.floor(x / blockWidth)));
    const row = Math.min(GRID_ROWS - 1, Math.max(0, Math.floor(y / blockHeight)));
    const blockKey = `${row}-${col}`;

    const blockChanged = activeBlockRef.current !== blockKey;
    activeBlockRef.current = blockKey;

    const cursorX = x;
    const cursorY = y + 12;

    // Always follow the pointer position.
    primaryTintRef.current.style.left = `${cursorX}px`;
    primaryTintRef.current.style.top = `${cursorY}px`;
    secondaryTintRef.current.style.left = `${cursorX}px`;
    secondaryTintRef.current.style.top = `${cursorY}px`;
    tertiaryTintRef.current.style.left = `${cursorX}px`;
    tertiaryTintRef.current.style.top = `${cursorY}px`;

    // Update blob geometry only when crossing into a different grid block.
    if (blockChanged) {
      const metrics = getBlockMetrics(row, col, row * GRID_COLS + col);

      primaryTintRef.current.style.width = `${metrics.primaryW}px`;
      primaryTintRef.current.style.height = `${metrics.primaryH}px`;
      primaryTintRef.current.style.transform = `rotate(${metrics.rotationPrimary}deg)`;
      primaryTintRef.current.style.borderRadius = metrics.radiusPrimary;

      secondaryTintRef.current.style.width = `${metrics.secondaryW}px`;
      secondaryTintRef.current.style.height = `${metrics.secondaryH}px`;
      secondaryTintRef.current.style.transform = `rotate(${metrics.rotationSecondary}deg)`;
      secondaryTintRef.current.style.borderRadius = metrics.radiusSecondary;

      tertiaryTintRef.current.style.width = `${metrics.tertiaryW}px`;
      tertiaryTintRef.current.style.height = `${metrics.tertiaryH}px`;
      tertiaryTintRef.current.style.transform = `rotate(${metrics.rotationTertiary}deg)`;
      tertiaryTintRef.current.style.borderRadius = metrics.radiusTertiary;
    }

    primaryTintRef.current.style.opacity = '1';
    secondaryTintRef.current.style.opacity = '1';
    tertiaryTintRef.current.style.opacity = '1';
  };

  const handleImageMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    moveGlowToBlock(event);
  };

  const handleImageMouseLeave = () => {
    if (!primaryTintRef.current || !secondaryTintRef.current || !tertiaryTintRef.current) return;
    primaryTintRef.current.style.opacity = '0';
    secondaryTintRef.current.style.opacity = '0';
    tertiaryTintRef.current.style.opacity = '0';
    activeBlockRef.current = null;
  };

  const handleImageMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    moveGlowToBlock(event);
  };

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
            <Link
              href="/services"
              className="rounded-full border border-foreground/30 px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Explore Services
            </Link>
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
          <div
            className="relative w-full max-w-3xl overflow-visible lg:max-w-[48rem]"
            onMouseEnter={handleImageMouseEnter}
            onMouseMove={handleImageMouseMove}
            onMouseLeave={handleImageMouseLeave}
          >
            <Image
              src="/images/cityscape.png"
              alt="City skyline illustration representing construction and urban development"
              width={1100}
              height={620}
              className="w-full object-contain opacity-95"
              priority
            />
            <div className="pointer-events-none absolute inset-0 overflow-visible">
              <div
                ref={primaryTintRef}
                className="absolute h-[312px] w-[312px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-400"
                style={{
                  background:
                    'radial-gradient(circle, rgba(236, 129, 58, 0.34) 0%, rgba(236, 129, 58, 0.08) 42%, rgba(236, 129, 58, 0) 72%)',
                  filter: 'blur(30px) saturate(1.14)',
                  mixBlendMode: 'screen',
                  willChange:
                    'left, top, width, height, opacity, transform, border-radius',
                  transition:
                    'left 420ms cubic-bezier(0.22, 1, 0.36, 1), top 420ms cubic-bezier(0.22, 1, 0.36, 1), width 320ms ease-out, height 320ms ease-out, transform 320ms ease-out, border-radius 360ms ease-out, opacity 220ms ease-out',
                }}
              />
              <div
                ref={secondaryTintRef}
                className="absolute h-[236px] w-[236px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-400"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255, 149, 76, 0.24) 0%, rgba(255, 149, 76, 0.06) 46%, rgba(255, 149, 76, 0) 74%)',
                  filter: 'blur(24px)',
                  mixBlendMode: 'screen',
                  willChange:
                    'left, top, width, height, opacity, transform, border-radius',
                  transition:
                    'left 460ms cubic-bezier(0.22, 1, 0.36, 1), top 460ms cubic-bezier(0.22, 1, 0.36, 1), width 340ms ease-out, height 340ms ease-out, transform 340ms ease-out, border-radius 360ms ease-out, opacity 220ms ease-out',
                }}
              />
              <div
                ref={tertiaryTintRef}
                className="absolute h-[192px] w-[192px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-400"
                style={{
                  background:
                    'radial-gradient(circle, rgba(230, 96, 28, 0.2) 0%, rgba(230, 96, 28, 0.05) 50%, rgba(230, 96, 28, 0) 76%)',
                  filter: 'blur(22px)',
                  mixBlendMode: 'screen',
                  willChange:
                    'left, top, width, height, opacity, transform, border-radius',
                  transition:
                    'left 500ms cubic-bezier(0.22, 1, 0.36, 1), top 500ms cubic-bezier(0.22, 1, 0.36, 1), width 360ms ease-out, height 360ms ease-out, transform 360ms ease-out, border-radius 380ms ease-out, opacity 220ms ease-out',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
