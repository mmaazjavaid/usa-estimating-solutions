'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  CMS_SECTION_BODY_LINES,
  CMS_SECTION_HEADING_LINES,
  CmsClamp,
  cmsClampClassNames,
} from '@/components/ui/cms-clamp';
import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

export type CmsTestimonial = {
  name: string;
  text: string;
  rating?: number;
};

export type CmsTestimonialsSectionProps = {
  heading?: string;
  subtitle?: string;
  testimonials: CmsTestimonial[];
  headingTypography?: CmsTextTypography;
  subtitleTypography?: CmsTextTypography;
};

export function CmsTestimonialsSection({
  heading,
  subtitle,
  testimonials,
  headingTypography,
  subtitleTypography,
}: CmsTestimonialsSectionProps) {
  const [current, setCurrent] = useState(0);
  const list = testimonials.filter((t) => t.name.trim() || t.text.trim());

  if (list.length === 0) {
    return null;
  }

  const next = (current + 1) % list.length;

  return (
    <section className="px-6 py-16 text-white md:px-12 lg:px-20">
      {heading ? (
        <h2
          className={cn(
            'mb-4 text-center text-2xl font-bold md:text-3xl',
            headingTypography?.className,
          )}
          style={headingTypography?.style}
        >
          <CmsClamp as="span" lines={CMS_SECTION_HEADING_LINES}>
            {heading}
          </CmsClamp>
        </h2>
      ) : null}
      {subtitle ? (
        <p
          className={cn(
            'mx-auto mb-12 max-w-2xl text-center text-sm text-[#d9d9d9]/60 md:text-base',
            subtitleTypography?.className,
          )}
          style={subtitleTypography?.style}
        >
          <CmsClamp as="span" lines={CMS_SECTION_BODY_LINES}>
            {subtitle}
          </CmsClamp>
        </p>
      ) : null}

      <div className="relative mx-auto max-w-4xl">
        <div className="flex gap-4 overflow-hidden">
          <div
            className={`w-full shrink-0 rounded-lg bg-[#1a1a1a] p-8 ${
              list.length > 1 ? 'md:w-2/3' : 'md:w-full'
            }`}
          >
            <h3 className={cn('mb-4 text-lg font-semibold', cmsClampClassNames(2))}>
              {list[current].name}
            </h3>
            <p className={cn('text-sm leading-relaxed text-[#d9d9d9]/80', cmsClampClassNames(6))}>
              {list[current].text}
            </p>
            {list[current].rating && list[current].rating! > 0 ? (
              <div className="mt-4 flex gap-1" aria-hidden>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={i < (list[current].rating ?? 0) ? 'text-teal-400' : 'text-zinc-600'}
                  >
                    ★
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {list.length > 1 ? (
            <div className="hidden w-1/3 shrink-0 rounded-lg bg-[#1a1a1a] p-8 opacity-50 md:block">
              <h3 className="mb-4 text-lg font-semibold">{list[next].name}</h3>
              <p className="line-clamp-4 text-sm leading-relaxed text-[#d9d9d9]/80">
                {list[next].text}
              </p>
              {list[next].rating && list[next].rating! > 0 ? (
                <div className="mt-4 flex gap-1" aria-hidden>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < (list[next].rating ?? 0) ? 'text-teal-400' : 'text-zinc-600'}
                    >
                      ★
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {list.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                current === index ? 'bg-white' : 'bg-[#d9d9d9]/30'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {list.length > 1 ? (
          <button
            type="button"
            onClick={() => setCurrent((prev) => (prev + 1) % list.length)}
            className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 rounded-full p-2 transition-colors hover:bg-[#1a1a1a]"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        ) : null}
      </div>
    </section>
  );
}
