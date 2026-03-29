'use client';

import Link from 'next/link';
import { CursorGlow } from '@/components/ui/cursor-glow';
import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

export type SiteTradeTypeRow = {
  label: string;
  title: string;
  description: string;
  /** If set, the large label box links here — `/path`, `path`, or `https://...`. */
  labelLinkHref?: string;
  /** If set, the main title (h3) links here — `/path`, `path`, or `https://...`. */
  titleLinkHref?: string;
};

type CursorGlowColors = {
  primary: string;
  secondary: string;
  tertiary: string;
};

function TypeTitle({ title, href }: { title: string; href?: string }) {
  const trimmed = href?.trim();
  const linkClass =
    'text-base font-bold underline decoration-[#d9d9d9]/40 underline-offset-2 transition-colors hover:text-white hover:decoration-white';

  if (!trimmed) {
    return <h3 className="mb-2 text-base font-bold">{title}</h3>;
  }

  const external = trimmed.startsWith('http://') || trimmed.startsWith('https://');
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  if (external) {
    return (
      <h3 className="mb-2">
        <a href={trimmed} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {title}
        </a>
      </h3>
    );
  }

  return (
    <h3 className="mb-2">
      <Link href={path} className={linkClass}>
        {title}
      </Link>
    </h3>
  );
}

const labelBoxBaseClass =
  'flex h-40 w-full flex-shrink-0 items-center justify-center rounded-lg border border-[#d9d9d9]/10 bg-[#1a1a1a] px-6 py-14 text-center text-4xl font-semibold text-white md:w-64 transition-colors';

const labelBoxInteractiveClass =
  'cursor-pointer hover:border-[#d9d9d9]/30 hover:bg-[#222] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40';

function LabelBox({ label, href }: { label: string; href?: string }) {
  const trimmed = href?.trim();

  if (!trimmed) {
    return <div className={labelBoxBaseClass}>{label}</div>;
  }

  const external = trimmed.startsWith('http://') || trimmed.startsWith('https://');
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  if (external) {
    return (
      <a
        href={trimmed}
        target="_blank"
        rel="noopener noreferrer"
        className={`${labelBoxBaseClass} ${labelBoxInteractiveClass}`}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={path} className={`${labelBoxBaseClass} ${labelBoxInteractiveClass}`}>
      {label}
    </Link>
  );
}

export function SiteTradeLowerSection({
  glowColors,
  whyHeading,
  whyItems,
  typesHeading,
  typesIntro,
  types,
  whyHeadingTypography,
  typesHeadingTypography,
  typesIntroTypography,
}: {
  glowColors?: CursorGlowColors;
  whyHeading: string;
  whyItems: string[];
  typesHeading: string;
  typesIntro: string;
  types: SiteTradeTypeRow[];
  whyHeadingTypography?: CmsTextTypography;
  typesHeadingTypography?: CmsTextTypography;
  typesIntroTypography?: CmsTextTypography;
}) {
  return (
    <section className="bg-black text-white">
    <CursorGlow colors={glowColors} className="w-full">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2
          className={cn('mb-8 text-xl font-bold md:text-2xl', whyHeadingTypography?.className)}
          style={whyHeadingTypography?.style}
        >
          {whyHeading}
        </h2>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-10">
          {whyItems.map((item, wi) => (
            <p
              key={wi}
              className="whitespace-pre-line text-center text-sm text-[#d9d9d9]/80 md:text-base"
            >
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2
          className={cn(
            'mb-6 text-center text-3xl font-bold md:text-4xl',
            typesHeadingTypography?.className,
          )}
          style={typesHeadingTypography?.style}
        >
          {typesHeading}
        </h2>
        <p
          className={cn(
            'mx-auto mb-12 max-w-5xl text-center text-sm leading-relaxed text-[#d9d9d9]/75 md:text-base',
            typesIntroTypography?.className,
          )}
          style={typesIntroTypography?.style}
        >
          {typesIntro}
        </p>

        <div className="mx-auto max-w-5xl space-y-8">
          {types.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className={`flex flex-col items-center gap-8 ${
                index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
            >
              {index % 2 === 0 ? (
                <>
                  <LabelBox label={item.label} href={item.labelLinkHref} />
                  <div className="flex-1 md:text-left">
                    <TypeTitle title={item.title} href={item.titleLinkHref} />
                    <p className="text-justify text-sm leading-relaxed text-[#d9d9d9]/70">
                      {item.description}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1 md:text-right">
                    <TypeTitle title={item.title} href={item.titleLinkHref} />
                    <p className="text-justify text-sm leading-relaxed text-[#d9d9d9]/70">
                      {item.description}
                    </p>
                  </div>
                  <LabelBox label={item.label} href={item.labelLinkHref} />
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </CursorGlow>
    </section>
  );
}
