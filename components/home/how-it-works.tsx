'use client';

import { StepsRow } from '@/components/common/steps-row';
import { CursorGlow } from '@/components/ui/cursor-glow';

const steps = [
  'Share Plans',
  'Receive a Quote',
  'Process Payment',
  'Get Estimates',
];

export function HowItWorks() {
  return (
    <section className="bg-background py-20">
      <CursorGlow className="h-full w-full">
        <div className="mx-auto max-w-7xl px-6">
          <StepsRow
            heading="How Can You Receive Construction Estimates"
            steps={steps}
          />
        </div>
      </CursorGlow>
    </section>
  );
}
