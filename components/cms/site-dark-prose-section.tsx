import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

export function SiteDarkProseSection({
  heading,
  body,
  align = 'center',
  headingTypography,
  bodyTypography,
}: {
  heading?: string;
  body?: string;
  align?: 'center' | 'justify';
  headingTypography?: CmsTextTypography;
  bodyTypography?: CmsTextTypography;
}) {
  const paragraphs = String(body || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="px-6 py-16 text-white md:px-12 lg:px-20">
      {heading ? (
        <h2
          className={cn(
            'mb-8 text-center text-2xl font-bold md:text-3xl lg:text-4xl',
            headingTypography?.className,
          )}
          style={headingTypography?.style}
        >
          {heading}
        </h2>
      ) : null}
      <div
        className={cn(
          'mx-auto max-w-4xl text-sm leading-relaxed text-[#d9d9d9]/70 md:text-base',
          align === 'justify' ? 'text-justify' : 'text-center',
          bodyTypography?.className,
        )}
        style={bodyTypography?.style}
      >
        {paragraphs.map((p, i) => (
          <p key={i} className="whitespace-pre-line">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
