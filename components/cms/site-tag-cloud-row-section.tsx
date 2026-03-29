import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

export function SiteTagCloudRowSection({
  heading,
  tags,
  gapClassName = 'gap-x-12 gap-y-6',
  textClassName = 'text-base text-[#d9d9d9]/80 md:text-lg',
  headingTypography,
}: {
  heading?: string;
  tags: string[];
  gapClassName?: string;
  textClassName?: string;
  headingTypography?: CmsTextTypography;
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
      <div className={`mx-auto flex max-w-5xl flex-wrap justify-center ${gapClassName}`}>
        {tags.map((tag) => (
          <span key={tag} className={textClassName}>
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
