"use client"

import { CursorGlow } from "@/components/ui/cursor-glow"

const ourWorksGlowColors = {
  primary: "rgba(180, 50, 50, 0.42)",
  secondary: "rgba(150, 42, 42, 0.36)",
  tertiary: "rgba(120, 35, 35, 0.30)",
}

export function OurWorksHero() {
  return (
    <CursorGlow colors={ourWorksGlowColors} className="mx-auto mb-12 w-full max-w-4xl text-center">
      <h1 className="text-3xl font-bold md:text-4xl">Our Works</h1>
      <h2 className="mt-4 text-lg font-semibold text-gray-200 md:text-2xl">
        Delivering Reliable Estimates Across Every Project Type
      </h2>
      <p className="mt-5 text-sm leading-relaxed text-gray-400">
        From residential homes to large commercial and industrial developments, we
        provide comprehensive estimating services that cover every phase and trade.
        Our work ensures clients have the information they need to plan budgets,
        manage resources, and make confident decisions. By combining expert knowledge,
        industry-standard tools, and clear reporting, we help projects stay on track,
        on schedule, and aligned with financial goals.
      </p>
    </CursorGlow>
  )
}
