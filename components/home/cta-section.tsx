'use client';

import Link from 'next/link';

type CTASectionProps = {
  variant?: 'default' | 'dark';
};

export function CTASection({ variant = 'dark' }: CTASectionProps) {
  const isDark = variant === 'dark';

  return (
    <section
      className={`relative overflow-visible px-4 py-12 md:py-14 ${isDark ? 'bg-[#1E1E1E] border-y border-white/10' : 'bg-background border-y border-border'}`}
    >
      {/* Removed glass overlay to avoid the two-tone effect */}

      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
        <h2
          className={`mb-4 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl text-balance ${
            isDark ? 'text-white' : 'text-foreground'
          }`}
        >
          Got Your Plans? Let’s Talk.
        </h2>

        <p
          className={`mx-auto mb-7 max-w-2xl text-sm leading-normal md:text-base ${
            isDark ? 'text-[#D1D1D1]' : 'text-muted-foreground'
          }`}
        >
          Recognized by The Blue Book Network, we are a trusted construction
          cost estimation company known for affordable pricing, precision, and
          professionalism in every project we handle.
        </p>

        <div className="flex justify-center">
          <Link
            href="/contact"
            className={`inline-flex items-center justify-center rounded-full border px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
              isDark
                ? 'border-white/40 text-white hover:bg-white hover:text-black shadow-[0_0_0_1px_rgba(255,255,255,0.06)]'
                : 'border-foreground/30 text-foreground hover:bg-foreground hover:text-background'
            }`}
          >
            Get a Quote
          </Link>
        </div>
      </div>

      <button
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute right-10 top-0 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-lg cursor-pointer md:right-14"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
    </section>
  );
}
