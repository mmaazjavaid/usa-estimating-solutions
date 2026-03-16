"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"

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

export function PricingPlans({ plans }: { plans: Plan[] }) {
  const [openPlan, setOpenPlan] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
      {plans.map((plan) => {
        const isOpen = openPlan === plan.name
        return (
          <div
            key={plan.name}
            onMouseEnter={() => setOpenPlan(plan.name)}
            onMouseLeave={() => setOpenPlan(null)}
            onFocusCapture={() => setOpenPlan(plan.name)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setOpenPlan(null)
              }
            }}
            className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#111318]"
          >
            <div className="relative p-6 pb-8">
              <div className="relative mb-5 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-3xl font-bold">{plan.name}</h2>
                  <p className="mt-2 whitespace-pre-line text-lg leading-snug text-[#d9d9d9]/85">
                    {plan.description}
                  </p>
                </div>
                {plan.popular ? (
                  <span className="rounded-full border border-[#9d6b48] px-3 py-1 text-xs text-[#d2a376]">
                    Popular
                  </span>
                ) : null}
              </div>

              <p className="mb-6 text-4xl font-bold">{plan.price}</p>

              <Link
                href="/contact"
                className="relative z-10 inline-flex w-full items-center justify-center rounded-full border border-white/35 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
              >
                Know More
              </Link>
            </div>

            <div
              className={cn(
                "max-h-0 translate-y-3 overflow-hidden border-t border-white/0 bg-black/95 opacity-0 transition-all duration-500 ease-out",
                isOpen &&
                  "max-h-[420px] translate-y-0 border-white/10 opacity-100"
              )}
            >
              <div className="p-6">
                <ul className="space-y-2 text-[#e7e7e7]">
                  <li>
                    • <span className="font-bold">Best For:</span>{" "}
                    {plan.details.bestFor}
                  </li>
                  <li>
                    • <span className="font-bold">Trade Coverage:</span>{" "}
                    {plan.details.tradeCoverage}
                  </li>
                  {plan.details.bullets.map((item) => (
                    <li key={`${plan.name}-${item}`}>• {item}</li>
                  ))}
                  <li>
                    • <span className="font-bold">Revisions Included:</span>{" "}
                    {plan.details.revisions}
                  </li>
                  <li>
                    • <span className="font-bold">Turnaround Time:</span>{" "}
                    {plan.details.turnaround}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
