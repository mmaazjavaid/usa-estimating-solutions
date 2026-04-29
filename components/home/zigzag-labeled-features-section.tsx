import Link from 'next/link';
import {
  CMS_SECTION_BODY_LINES,
  CMS_SECTION_HEADING_LINES,
  CmsClamp,
  cmsClampClassNames,
} from '@/components/ui/cms-clamp';
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
    'flex h-40 w-full shrink-0 items-center justify-center rounded-lg border border-[#d9d9d9]/10 bg-[#1a1a1a] px-4 py-8 text-center text-3xl font-semibold text-white md:w-64 md:py-14 md:text-4xl transition-colors min-w-0';

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
          <span className={cmsClampClassNames(3)}>{label}</span>
        </a>
      );
    }
    return (
      <Link href={href} className={cnBoxClickable(boxClass)}>
        <span className={cmsClampClassNames(3)}>{label}</span>
      </Link>
    );
  }

  return (
    <div className={boxClass}>
      <span className={cmsClampClassNames(3)}>{label}</span>
    </div>
  );
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
          <CmsClamp as="span" lines={CMS_SECTION_HEADING_LINES}>
            {heading}
          </CmsClamp>
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
          <CmsClamp as="span" lines={CMS_SECTION_BODY_LINES}>
            {intro}
          </CmsClamp>
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
                <div className="min-w-0 flex-1 md:text-left">
                  <h3 className={cn('mb-2 text-base font-bold', cmsClampClassNames(2))}>
                    {item.title}
                  </h3>
                  <p
                    className={cn(
                      'text-justify text-sm leading-relaxed text-[#d9d9d9]/70',
                      cmsClampClassNames(4),
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="min-w-0 flex-1 md:text-right">
                  <h3 className={cn('mb-2 text-base font-bold', cmsClampClassNames(2))}>
                    {item.title}
                  </h3>
                  <p
                    className={cn(
                      'text-justify text-sm leading-relaxed text-[#d9d9d9]/70',
                      cmsClampClassNames(4),
                    )}
                  >
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
