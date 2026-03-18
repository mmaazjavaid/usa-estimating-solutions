'use client';

import { CursorGlow } from '@/components/ui/cursor-glow';

const stats = [
  {
    value: "Fast Turnaround",
    label: "with 99% Accuracy",
  },
  {
    value: "Affordable Pricing",
    label: "",
  },
  {
    value: "92% Bid Success",
    label: "Rate",
  },
  {
    value: "24/7 Customer",
    label: "Support",
  },
]

export function WhyChooseUs() {
  return (
    <section className="bg-background py-20">
      <CursorGlow className="h-full w-full">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-14 text-center text-3xl font-bold text-foreground md:text-4xl text-balance">
            Why Choose Our USA Estimating Experts
          </h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.value} className="flex flex-col items-center text-center">
                <p className="text-sm font-medium text-muted-foreground md:text-base">
                  {stat.value}
                </p>
                {stat.label && (
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </CursorGlow>
    </section>
  )
}
