export type CmsFaqItem = {
  question: string;
  answer: string;
};

import {
  CMS_SECTION_HEADING_LINES,
  CmsClamp,
  cmsClampClassNames,
} from '@/components/ui/cms-clamp';
import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

export type CmsFaqGridSectionProps = {
  heading?: string;
  items: CmsFaqItem[];
  headingTypography?: CmsTextTypography;
};

export function CmsFaqGridSection({
  heading = 'Frequently Asked Questions',
  items,
  headingTypography,
}: CmsFaqGridSectionProps) {
  const list = items.filter((f) => f.question.trim() && f.answer.trim());

  if (list.length === 0) {
    return null;
  }

  return (
    <section className="px-6 py-16 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl rounded-2xl bg-[#111] p-8 text-white md:p-12">
        {heading ? (
          <h2
            className={cn('mb-12 text-2xl font-bold md:text-3xl', headingTypography?.className)}
            style={headingTypography?.style}
          >
            <CmsClamp as="span" lines={CMS_SECTION_HEADING_LINES}>
              {heading}
            </CmsClamp>
          </h2>
        ) : null}

        <div className="grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
          {list.map((faq) => (
            <div key={faq.question}>
              <h3 className={cn('mb-3 text-sm font-semibold md:text-base', cmsClampClassNames(3))}>
                {faq.question}
              </h3>
              <p
                className={cn(
                  'text-sm leading-relaxed text-[#d9d9d9]/70',
                  cmsClampClassNames(6),
                )}
              >
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
