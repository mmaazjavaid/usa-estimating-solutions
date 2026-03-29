import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

export function SiteStackedTagRowsSection({
  heading,
  rows,
  gapBetweenRowsClassName = 'mb-6',
  headingTypography,
}: {
  heading?: string;
  rows: string[][];
  gapBetweenRowsClassName?: string;
  headingTypography?: CmsTextTypography;
}) {
  return (
    <section className="px-6 py-16 text-white md:px-12 lg:px-20">
      {heading ? (
        <h2
          className={cn(
            'mb-12 text-center text-2xl font-bold md:text-3xl lg:text-4xl',
            headingTypography?.className,
          )}
          style={headingTypography?.style}
        >
          {heading}
        </h2>
      ) : null}
      <div className="mx-auto max-w-5xl">
        {rows.map((tags, i) => (
          <div
            key={i}
            className={`flex flex-wrap justify-center gap-x-16 gap-y-4 ${
              i < rows.length - 1 ? gapBetweenRowsClassName : ''
            }`}
          >
            {tags.map((tag) => (
              <span key={tag} className="text-sm text-[#d9d9d9]/80 md:text-base">
                {tag}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
