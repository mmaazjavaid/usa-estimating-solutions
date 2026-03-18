"use client"

import Image from "next/image"
import Link from "next/link"
import { EstimateCard } from "@/components/common/estimate-card"
import { CursorGlow } from "@/components/ui/cursor-glow"
import { ServiceTradesSection } from "@/components/services/service-trades-section"

export function CommercialEstimatingContent() {
  const projects = [
    { line1: "Warehouses &", line2: "Parking Garages" },
    { line1: "Retail &", line2: "Restaurants" },
    { line1: "Medical &", line2: "Airports" },
    { line1: "Theaters &", line2: "Museums" },
    { line1: "High-Rise", line2: "Buildings & Hotels" },
    { line1: "Libraries, Prisons &", line2: "Police Stations" },
  ]

  const coreServices = [
    ["Pre-Construction Estimates", "Material & Labor Takeoffs", "Cost Analysis & Profit Planning"],
    ["Bid Proposal Preparation", "Change Order Estimates", "Value Engineering & Cost Reduction"],
  ]

  const estimateCards = [
    {
      title: "Commercial\nDevelopers",
      description:
        "Detailed estimating support for developers managing schedules, budgets, and project feasibility.",
      arrowColor: "#c75f6b",
      iconColors: { top: "#c75f6b", layers: "#4a2a2d" },
      href: "/commercial-estimating",
    },
    {
      title: "Commercial\nContractors",
      description:
        "Accurate bid-focused estimates for general and specialty commercial contractors.",
      arrowColor: "#b8956c",
      iconColors: { top: "#b8956c", layers: "#4a3d2d" },
      href: "/commercial-estimating",
    },
    {
      title: "Architects &\nDesigners",
      description:
        "Design-phase estimating to keep concepts aligned with real-world construction costs.",
      arrowColor: "#8b7cb8",
      iconColors: { top: "#8b7cb8", layers: "#3d3654" },
      href: "/commercial-estimating",
    },
    {
      title: "Design Building\nEstimate",
      description:
        "Integrated design-build cost guidance for better coordination and cost control.",
      arrowColor: "#5b9a8b",
      iconColors: { top: "#5b9a8b", layers: "#2d4a44" },
      href: "/commercial-estimating",
    },
  ]

  return (
    <section className="bg-black text-white">
      <section className="relative min-h-[80vh] overflow-hidden px-6 pb-16 pt-6 md:px-12 lg:px-20">
        <nav className="mb-24 text-sm text-[#d9d9d9]/60">
          <Link href="/services">Services</Link>
          <span className="mx-2">{">"}</span>
          <span>Commercial Estimating</span>
        </nav>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="max-w-xl">
            <h1 className="mb-8 text-4xl font-bold leading-tight md:text-5xl lg:text-5xl">
              <span className="text-white">Proven </span>
              <span className="bg-gradient-to-r from-[#5b9a8b] to-[#7ab8a8] bg-clip-text text-transparent">
                Experience
              </span>
              <span className="text-white"> Across</span>
              <br />
              <span className="bg-gradient-to-r from-[#c9a855] to-[#e8c76a] bg-clip-text text-transparent">
                Global
              </span>
              <span className="text-white"> Commercial Projects</span>
            </h1>

            <p className="text-justify text-sm leading-relaxed text-[#d9d9d9]/70 md:text-base">
              Commercial estimating requires technical precision, industry
              insight, and real-world cost intelligence. Accurate estimates are
              critical for budgeting, bidding, cost control, and long-term
              project success. Our experienced estimators support projects of
              all sizes - from renovations to large-scale commercial
              developments - ensuring every estimate is reviewed, validated, and
              aligned with market realities.
            </p>
          </div>

          <CursorGlow className="flex justify-center lg:justify-end">
            <Image
              src="/images/commercial-estimating-hero.png"
              alt="Commercial estimating skyline illustration"
              width={1024}
              height={768}
              className="w-full max-w-[700px] h-auto"
              priority
            />
          </CursorGlow>
        </div>
      </section>

      <CursorGlow className="w-full">
        <section className="px-6 py-20 md:px-12 lg:px-20">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            Commercial Projects We Estimate
          </h2>

          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-16 gap-y-6">
            {projects.map((project) => (
              <div key={`${project.line1}-${project.line2}`} className="text-center">
                <span className="text-sm text-[#d9d9d9]/80 md:text-base">
                  {project.line1}
                  <br />
                  {project.line2}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-20 md:px-12 lg:px-20">
          <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
            Core Commercial Estimating Services
          </h2>

          <p className="mx-auto mb-16 max-w-4xl text-center text-sm text-[#d9d9d9]/70 md:text-base">
            Our commercial estimating services support developers, contractors,
            and consultants with dependable scope-based quantities, labor and
            material pricing, and strategic bid support tailored to each project.
          </p>

          <div className="mx-auto max-w-5xl">
            {coreServices.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className={`grid grid-cols-1 md:grid-cols-3 ${
                  rowIndex === 0 ? "border-b border-[#d9d9d9]/20" : ""
                }`}
              >
                {row.map((service, colIndex) => (
                  <div
                    key={service}
                    className={`py-16 px-6 text-center ${
                      colIndex < row.length - 1 ? "md:border-r border-[#d9d9d9]/20" : ""
                    }`}
                  >
                    <span className="whitespace-pre-line text-sm text-[#d9d9d9]/90 md:text-base">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </CursorGlow>

      <section className="px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
          {estimateCards.map((card) => (
            <EstimateCard
              key={card.title}
              title={card.title}
              description={card.description}
              href={card.href}
              arrowColor={card.arrowColor}
              topColor={card.iconColors.top}
              layerColor={card.iconColors.layers}
            />
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-20">
        <ServiceTradesSection />
      </section>
    </section>
  )
}
