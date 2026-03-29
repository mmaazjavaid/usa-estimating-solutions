import { CursorGlow } from '@/components/ui/cursor-glow';
import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

export function SiteOfferingsGridSection({
  heading,
  items,
  wrapInCursorGlow,
  glowPrimary,
  glowSecondary,
  glowTertiary,
  headingTypography,
}: {
  heading?: string;
  items: string[];
  wrapInCursorGlow?: boolean;
  glowPrimary?: string;
  glowSecondary?: string;
  glowTertiary?: string;
  headingTypography?: CmsTextTypography;
}) {
  const inner = (
    <>
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
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
        {items.map((item) => (
          <div key={item} className="text-center">
            <p className="text-sm font-medium text-white md:text-base">{item}</p>
          </div>
        ))}
      </div>
    </>
  );

  if (wrapInCursorGlow) {
    return (
      <section className="bg-black px-6 pb-20 pt-8 text-white lg:px-12">
        <CursorGlow
          colors={
            glowPrimary && glowSecondary && glowTertiary
              ? { primary: glowPrimary, secondary: glowSecondary, tertiary: glowTertiary }
              : undefined
          }
          className="w-full"
        >
          {inner}
        </CursorGlow>
      </section>
    );
  }

  return (
    <section className="px-6 py-16 text-white md:px-12 lg:px-20">
      {inner}
    </section>
  );
}
