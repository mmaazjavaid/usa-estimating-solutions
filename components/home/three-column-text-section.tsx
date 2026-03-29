import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

export type ThreeColumnTextSectionProps = {
  heading?: string;
  /** 2–4 on md screens; 1 column on mobile. */
  columns?: number;
  items: string[];
  headingTypography?: CmsTextTypography;
};

export function ThreeColumnTextSection({
  heading,
  columns: colsIn = 3,
  items,
  headingTypography,
}: ThreeColumnTextSectionProps) {
  const columns = Math.min(4, Math.max(2, Math.round(colsIn) || 3));
  const colClass =
    columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';

  const list = items.map((t) => String(t || '').trim()).filter(Boolean);

  if (!heading && list.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 text-white">
      {heading ? (
        <h2
          className={cn('mb-8 text-xl font-bold md:text-2xl', headingTypography?.className)}
          style={headingTypography?.style}
        >
          {heading}
        </h2>
      ) : null}
      <div
        className={cn(
          'mx-auto grid max-w-5xl grid-cols-1 gap-6 md:gap-10',
          colClass,
        )}
      >
        {list.map((item, idx) => (
          <p
            key={idx}
            className="whitespace-pre-line text-center text-sm text-[#d9d9d9]/80 md:text-base"
          >
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}
