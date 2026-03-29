import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

export function SiteMultilineItemGridSection({
  heading,
  items,
  columns,
  headingTypography,
}: {
  heading?: string;
  items: string[];
  columns: 2 | 3 | 6;
  headingTypography?: CmsTextTypography;
}) {
  const gridCols =
    columns === 6
      ? 'grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6'
      : columns === 3
        ? 'grid-cols-1 gap-8 md:grid-cols-3'
        : 'grid-cols-2 gap-8';

  return (
    <section className="px-6 py-20 text-white md:px-12 lg:px-20">
      {heading ? (
        <h2
          className={cn(
            'mb-16 text-center text-2xl font-bold md:text-3xl lg:text-4xl',
            headingTypography?.className,
          )}
          style={headingTypography?.style}
        >
          {heading}
        </h2>
      ) : null}
      <div className="mx-auto max-w-6xl">
        <div className={cn('grid', gridCols)}>
          {items.map((item) => (
            <div key={item} className="text-center">
              <span className="whitespace-pre-line text-sm leading-relaxed text-[#d9d9d9]/80 md:text-base">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
