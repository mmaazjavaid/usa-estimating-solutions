'use client';

import { StepsRow } from '@/components/common/steps-row';
import { CursorGlow } from '@/components/ui/cursor-glow';
import type { CmsTextTypography } from '@/lib/cms-text-typography';

const DEFAULT_STEPS = [
  'Share Plans',
  'Receive a Quote',
  'Process Payment',
  'Get Estimates',
];

export type HowItWorksProps = {
  heading?: string;
  steps?: string[];
  /** Use transparent background + dark StepsRow for black service pages. */
  variant?: 'light' | 'dark';
  headingTypography?: CmsTextTypography;
};

export function HowItWorks({
  heading = 'How Can You Receive Construction Estimates',
  steps = DEFAULT_STEPS,
  variant = 'light',
  headingTypography,
}: HowItWorksProps = {}) {
  const inner = (
    <CursorGlow className="h-full w-full">
      <div className="mx-auto max-w-7xl px-6">
        <StepsRow
          heading={heading}
          steps={steps}
          variant={variant === 'dark' ? 'dark' : 'light'}
          headingClassName={headingTypography?.className}
          headingStyle={headingTypography?.style}
        />
      </div>
    </CursorGlow>
  );

  if (variant === 'dark') {
    return <section className="bg-black py-20">{inner}</section>;
  }

  return <section className="bg-background py-20">{inner}</section>;
}
