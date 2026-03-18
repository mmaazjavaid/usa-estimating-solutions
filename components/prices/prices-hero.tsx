"use client"

import { CursorGlow } from "@/components/ui/cursor-glow"
import { PricingPlans } from "@/components/prices/pricing-plans"

const pricesGlowColors = {
  primary: "rgba(45, 130, 135, 0.48)",
  secondary: "rgba(38, 110, 115, 0.40)",
  tertiary: "rgba(30, 90, 95, 0.34)",
}

type Plan = {
  name: string
  description: string
  price: string
  popular?: boolean
  details: {
    bestFor: string
    tradeCoverage: string
    bullets: string[]
    revisions: string
    turnaround: string
  }
}

export function PricesHero({ plans }: { plans: Plan[] }) {
  return (
    <CursorGlow colors={pricesGlowColors} className="w-full">
      <h1 className="mb-5 text-center text-4xl font-bold md:text-5xl">Prices</h1>
      <p className="mx-auto mb-14 max-w-5xl text-center text-xl leading-relaxed text-[#d9d9d9]/85">
        Find yourself the best plan. Pay only for what you need, with flexible
        estimating options for every project stage. Discounts available for
        first-time clients and long-term partnerships.
      </p>
      <PricingPlans plans={plans} />
    </CursorGlow>
  )
}
