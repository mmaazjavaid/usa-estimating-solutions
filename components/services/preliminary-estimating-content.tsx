"use client"

import Image from "next/image"
import Link from "next/link"
import { CursorGlow } from "@/components/ui/cursor-glow"
import { ServiceTradesSection } from "@/components/services/service-trades-section"

const preliminaryGlowColors = {
  primary: "rgba(45, 130, 135, 0.48)",
  secondary: "rgba(38, 110, 115, 0.40)",
  tertiary: "rgba(30, 90, 95, 0.34)",
}

export function PreliminaryEstimatingContent() {
  const whyMatters = [
    { line1: "Compare design alternatives", line2: "for cost-effectiveness" },
    { line1: "Allocate funds efficiently", line2: "" },
    { line1: "Set early-stage budgets", line2: "" },
    { line1: "Reduce financial risks", line2: "before construction begins" },
  ]

  const estimateTypes = [
    [
      {
        title: "Rough Order Magnitude (ROM):",
        description: "Early feasibility checks (+/-50% accuracy)",
      },
      {
        title: "Ballpark Estimate:",
        description: "Helps owners evaluate budgets (+/-20% accuracy)",
      },
    ],
    [
      {
        title: "Budget Estimate:",
        description: "Outlines major costs for planning purposes (+/-10-25% accuracy)",
      },
      {
        title: "Definitive Estimate:",
        description: "Final pre-construction cost verification (+/-5-15% accuracy)",
      },
    ],
  ]

  return (
    <section className="bg-black text-white">
      <section className="px-6 pb-20 pt-8 md:px-12 lg:px-20">
        <nav className="mb-16 text-sm text-[#d9d9d9]/60">
          <Link href="/services">Services</Link>
          <span className="mx-2">{">"}</span>
          <span>Preliminary Estimating</span>
        </nav>

        <div className="flex flex-col items-start justify-between gap-12 lg:flex-row">
          <div className="max-w-xl">
            <h1 className="mb-8 text-4xl font-bold leading-tight md:text-5xl">
              <span className="text-white">Plan </span>
              <span className="bg-gradient-to-r from-[#5B8C7B] via-[#8B9B6B] to-[#C4A95B] bg-clip-text text-transparent">
                Smarter
              </span>
              <span className="text-white"> with Preliminary</span>
              <br />
              <span className="text-white">Construction Estimates</span>
            </h1>

            <p className="text-justify text-sm leading-relaxed text-[#d9d9d9]/80 md:text-base">
              A preliminary estimate helps you evaluate your project&apos;s feasibility
              early on, even when drawings are incomplete or supplier quotes are
              delayed. By analyzing square footage, material, and labor costs, you
              can make informed decisions, set realistic budgets, and guide client
              discussions with confidence. Whether you&apos;re at 30%, 60%, or 90% of
              your plans, our preliminary estimates give you a clear snapshot of
              project costs and financial viability.
            </p>
          </div>

          <CursorGlow
            colors={preliminaryGlowColors}
            className="flex-shrink-0"
          >
            <Image
              src="/images/preliminary-estimating-hero.png"
              alt="Preliminary estimating illustration"
              width={1024}
              height={768}
              className="h-auto w-full max-w-[500px]"
              priority
            />
          </CursorGlow>
        </div>
      </section>

      <CursorGlow colors={preliminaryGlowColors} className="w-full">
      <section className="px-6 py-20 md:px-12 lg:px-20">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          Why Preliminary Estimates Matter:
        </h2>

        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-16 gap-y-8">
          {whyMatters.map((item) => (
            <div key={item.line1} className="text-center">
              <span className="text-sm text-[#d9d9d9]/80 md:text-base">
                {item.line1}
                {item.line2 ? (
                  <>
                    <br />
                    {item.line2}
                  </>
                ) : null}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 md:px-12 lg:px-20">
        <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
          Types of Preliminary Estimates
        </h2>

        <p className="mx-auto mb-16 max-w-5xl text-center text-sm text-[#d9d9d9]/70 md:text-base">
          Our preliminary estimates include everything from preliminaries,
          substructures, and superstructures to external and internal finishes,
          mechanical, plumbing, and electrical systems, along with labor costs,
          contingency allowances, project schedules, and clear square footage and
          unit-based breakdowns for easy interpretation.
        </p>

        <div className="mx-auto max-w-4xl">
          {estimateTypes.map((row, rowIndex) => (
            <div
              key={`estimate-row-${rowIndex}`}
              className={`grid grid-cols-1 md:grid-cols-2 ${
                rowIndex === 0 ? "border-b border-[#d9d9d9]/20" : ""
              }`}
            >
              {row.map((estimate, colIndex) => (
                <div
                  key={estimate.title}
                  className={`py-16 px-8 text-center ${
                    colIndex === 0 ? "md:border-r border-[#d9d9d9]/20" : ""
                  }`}
                >
                  <p className="text-sm text-[#d9d9d9]/90 md:text-base">
                    <span className="font-semibold text-white">{estimate.title}</span>{" "}
                    <span className="text-[#d9d9d9]/70">{estimate.description}</span>
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      </CursorGlow>

      <section className="px-6 md:px-12 lg:px-20">
        <ServiceTradesSection />
      </section>
    </section>
  )
}
