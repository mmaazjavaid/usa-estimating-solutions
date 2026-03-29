import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

export function SiteHorizontalPillsSection({
  heading,
  items,
  variant = 'default',
  headingTypography,
}: {
  heading?: string;
  items: string[];
  variant?: 'default' | 'compact';
  headingTypography?: CmsTextTypography;
}) {
  const dividerClass =
    variant === 'compact'
      ? 'mx-4 hidden h-px w-16 bg-[#d9d9d9]/30 md:block lg:w-32'
      : 'mx-4 hidden h-px w-32 bg-[#d9d9d9]/30 md:block lg:w-48';

  return (
    <section className="px-6 py-16 text-white md:px-12 lg:px-20">
      {heading ? (
        <h2
          className={cn(
            'mb-16 text-center text-3xl font-bold md:text-4xl',
            headingTypography?.className,
          )}
          style={headingTypography?.style}
        >
          {heading}
        </h2>
      ) : null}
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 md:flex-row md:gap-0">
        {items.map((feature, index) => (
          <div key={feature} className="flex items-center">
            <span className="whitespace-nowrap text-sm text-[#d9d9d9]/80 md:text-base">{feature}</span>
            {index < items.length - 1 ? <div className={dividerClass} /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
