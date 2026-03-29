import Link from 'next/link';
import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

export type ZigzagFeatureRow = {
  label: string;
  title: string;
  description: string;
  labelHref?: string;
};

export type ZigzagLabeledFeaturesSectionProps = {
  heading?: string;
  intro?: string;
  items: ZigzagFeatureRow[];
  headingTypography?: CmsTextTypography;
  introTypography?: CmsTextTypography;
};

function LabelPanel({
  label,
  href,
}: {
  label: string;
  href?: string;
}) {
  const boxClass =
    'flex h-40 w-full shrink-0 items-center justify-center rounded-lg border border-[#d9d9d9]/10 bg-[#1a1a1a] px-4 py-8 text-center text-3xl font-semibold text-white md:w-64 md:py-14 md:text-4xl transition-colors';

  if (href) {
    const ext = href.startsWith('http://') || href.startsWith('https://');
    if (ext) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cnBoxClickable(boxClass)}
        >
          {label}
        </a>
      );
    }
    return (
      <Link href={href} className={cnBoxClickable(boxClass)}>
        {label}
      </Link>
    );
  }

  return <div className={boxClass}>{label}</div>;
}

function cnBoxClickable(base: string) {
  return `${base} cursor-pointer hover:border-[#d9d9d9]/30 hover:bg-[#222] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A16E]/80`;
}

export function ZigzagLabeledFeaturesSection({
  heading,
  intro,
  items,
  headingTypography,
  introTypography,
}: ZigzagLabeledFeaturesSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 text-white">
      {heading ? (
        <h2
          className={cn(
            'mb-6 text-center text-3xl font-bold md:text-4xl',
            headingTypography?.className,
          )}
          style={headingTypography?.style}
        >
          {heading}
        </h2>
      ) : null}
      {intro ? (
        <p
          className={cn(
            'mx-auto mb-12 max-w-5xl text-center text-sm leading-relaxed text-[#d9d9d9]/75 md:text-base',
            introTypography?.className,
          )}
          style={introTypography?.style}
        >
          {intro}
        </p>
      ) : null}

      <div className="mx-auto max-w-5xl space-y-8">
        {items.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className={`flex flex-col items-center gap-8 ${
              index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
            }`}
          >
            {index % 2 === 0 ? (
              <>
                <LabelPanel label={item.label} href={item.labelHref} />
                <div className="flex-1 md:text-left">
                  <h3 className="mb-2 text-base font-bold">{item.title}</h3>
                  <p className="text-justify text-sm leading-relaxed text-[#d9d9d9]/70">
                    {item.description}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1 md:text-right">
                  <h3 className="mb-2 text-base font-bold">{item.title}</h3>
                  <p className="text-justify text-sm leading-relaxed text-[#d9d9d9]/70">
                    {item.description}
                  </p>
                </div>
                <LabelPanel label={item.label} href={item.labelHref} />
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
