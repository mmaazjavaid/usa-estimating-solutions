import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

export type TitleDescriptionCell = {
  title: string;
  description: string;
};

export function SiteTitleDescriptionMatrixSection({
  heading,
  intro,
  rows,
  headingTypography,
  introTypography,
}: {
  heading?: string;
  intro?: string;
  rows: TitleDescriptionCell[][];
  headingTypography?: CmsTextTypography;
  introTypography?: CmsTextTypography;
}) {
  return (
    <section className="px-6 py-20 text-white md:px-12 lg:px-20">
      {heading ? (
        <h2
          className={cn(
            'mb-8 text-center text-3xl font-bold md:text-4xl',
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
            'mx-auto mb-16 max-w-5xl text-center text-sm text-[#d9d9d9]/70 md:text-base',
            introTypography?.className,
          )}
          style={introTypography?.style}
        >
          {intro}
        </p>
      ) : null}

      <div className="mx-auto max-w-4xl">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={cn(
              'grid grid-cols-1 md:grid-cols-2',
              rowIndex === 0 ? 'border-b border-[#d9d9d9]/20' : '',
            )}
          >
            {row.map((estimate, colIndex) => (
              <div
                key={estimate.title}
                className={`px-8 py-16 text-center ${
                  colIndex === 0 ? 'md:border-r md:border-[#d9d9d9]/20' : ''
                }`}
              >
                <p className="text-sm text-[#d9d9d9]/90 md:text-base">
                  <span className="font-semibold text-white">{estimate.title}</span>{' '}
                  <span className="text-[#d9d9d9]/70">{estimate.description}</span>
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
