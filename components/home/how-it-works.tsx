import { StepsRow } from '@/components/common/steps-row';

const steps = [
  'Share Plans',
  'Receive a Quote',
  'Process Payment',
  'Get Estimates',
];

export function HowItWorks() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <StepsRow
          heading="How Can You Receive Construction Estimates"
          steps={steps}
        />
      </div>
    </section>
  );
}
