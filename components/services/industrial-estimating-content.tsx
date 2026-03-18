"use client"

import Image from "next/image"
import Link from "next/link"
import { CursorGlow } from "@/components/ui/cursor-glow"
import { ServiceTradesSection } from "@/components/services/service-trades-section"

const industrialGlowColors = {
  primary: "rgba(70, 70, 35, 0.5)",
  secondary: "rgba(58, 58, 30, 0.42)",
  tertiary: "rgba(45, 45, 25, 0.36)",
}

export function IndustrialEstimatingContent() {
  const supporters = [
    "EPC Contractors",
    "Industrial Owners & Operators",
    "Engineering & Design Firms",
    "Financial Investors",
    "Joint Venture Partners",
  ]

  const coreServices = [
    [
      "Sitework & Foundations\nStructural Steel",
      "Mechanical & Process\nEquipment",
      "Electrical &\nInstrumentation",
    ],
    [
      "Process Piping & HVAC",
      "Insulation, Fireproofing\n& Coatings",
      "Welding & Asbestos\nAbatement",
    ],
  ]

  const specializedCapabilities = [
    "Structural Steel Estimating",
    "Mechanical Estimating",
    "Electrical Estimating",
  ]

  return (
    <section className="bg-black text-white">
      <section className="min-h-[600px] px-6 pb-16 pt-8 md:px-12 lg:px-20">
        <nav className="mb-16 text-sm text-[#d9d9d9]/60">
          <Link href="/services">Services</Link>
          <span className="mx-2">{">"}</span>
          <span>Industrial Estimating</span>
        </nav>

        <div className="flex flex-col items-start justify-between gap-12 lg:flex-row">
          <div className="max-w-xl lg:max-w-lg xl:max-w-xl">
            <h1 className="mb-8 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-[#5B8A7A] to-[#C9A55C] bg-clip-text text-transparent">
                Confidence-Driven
              </span>{" "}
              Industrial Cost Planning
            </h1>

            <p className="text-justify text-sm leading-relaxed text-[#d9d9d9]/70 md:text-base">
              Industrial projects demand precision, coordination, and strict cost
              control. Our industrial estimating services deliver accurate,
              audit-ready cost estimates and detailed takeoffs that support
              informed decision-making from early planning through construction.
              By combining industry expertise, advanced estimating software, and
              real-time pricing data, we help EPC contractors, owners, and
              engineering teams reduce risk, control budgets, and execute
              complex industrial projects with confidence.
            </p>
          </div>

          <CursorGlow colors={industrialGlowColors} className="flex w-full flex-1 justify-center lg:justify-end">
            <Image
              src="/images/industrial-estimating-hero.png"
              alt="Industrial estimating facility illustration"
              width={1024}
              height={768}
              className="h-auto w-full max-w-[700px]"
              priority
            />
          </CursorGlow>
        </div>
      </section>

      <CursorGlow colors={industrialGlowColors} className="w-full">
        <section className="px-6 py-20 md:px-12 lg:px-20">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Who We Support</h2>

          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-12 gap-y-6">
            {supporters.map((supporter) => (
              <span key={supporter} className="text-sm text-[#d9d9d9]/80 md:text-base">
                {supporter}
              </span>
            ))}
          </div>
        </section>

        <section className="px-6 py-20 md:px-12 lg:px-20">
          <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
            Core Industrial Estimating Services
          </h2>

          <p className="mx-auto mb-16 max-w-5xl text-center text-sm text-[#d9d9d9]/70 md:text-base">
            Our services include quantity takeoffs and cost estimates, bid
            evaluation and proposal support, feasibility and risk analysis, change
            order preparation and review, value engineering and cost optimization,
            project scheduling and cost management, as well as QA/QC reviews and
            cold-eye audits. Trade coverage:
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

        <section className="px-6 py-20 md:px-12 lg:px-20">
          <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">
            Specialized Estimating Capabilities
          </h2>

          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 md:flex-row md:gap-0">
            {specializedCapabilities.map((capability, index) => (
              <div key={capability} className="flex items-center">
                <span className="whitespace-nowrap text-sm text-[#d9d9d9]/80 md:text-base">
                  {capability}
                </span>
                {index < specializedCapabilities.length - 1 ? (
                  <div className="mx-6 hidden h-px w-24 bg-[#d9d9d9]/30 lg:w-32 md:block" />
                ) : null}
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
