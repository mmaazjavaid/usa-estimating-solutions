import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

export type LinePairItem = { line1: string; line2: string };

export function SiteLinePairGridSection({
  heading,
  intro,
  items,
  gapClassName = 'gap-x-16 gap-y-6',
  headingTypography,
  introTypography,
}: {
  heading?: string;
  intro?: string;
  items: LinePairItem[];
  gapClassName?: string;
  headingTypography?: CmsTextTypography;
  introTypography?: CmsTextTypography;
}) {
  return (
    <section className="px-6 py-20 text-white md:px-12 lg:px-20">
      {heading ? (
        <h2
          className={cn(
            'mb-12 text-center text-3xl font-bold md:text-4xl',
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
            'mx-auto mb-16 max-w-4xl text-center text-sm text-[#d9d9d9]/70 md:text-base',
            introTypography?.className,
          )}
          style={introTypography?.style}
        >
          {intro}
        </p>
      ) : null}
      <div className={`mx-auto flex max-w-5xl flex-wrap justify-center ${gapClassName}`}>
        {items.map((item) => (
          <div key={`${item.line1}-${item.line2}`} className="text-center">
            <span className="text-sm text-[#d9d9d9]/80 md:text-base">
              {item.line1}
              {item.line2 ? (
                <>
                  <br />
                  {item.line2}
                </>
              ) : null}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
