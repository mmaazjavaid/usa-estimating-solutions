"use client"

import Link from "next/link"
import Image from "next/image"
import { CursorGlow } from "@/components/ui/cursor-glow"
import { ServiceTradesSection } from "@/components/services/service-trades-section"

const takeoffGlowColors = {
  primary: "rgba(45, 130, 135, 0.48)",
  secondary: "rgba(38, 110, 115, 0.40)",
  tertiary: "rgba(30, 90, 95, 0.34)",
}

export function ConstructionTakeoffContent() {
  const clients = [
    "General Contractors",
    "Subcontractors",
    "Architects",
    "Owners",
    "Vendors",
    "Real-Estate Developers",
  ]

  const features = [
    "Quick Turnaround",
    "Accurate & Comprehensive",
    "Tailored for U.S Project",
  ]

  const takeoffServices = [
    ["Site Work Takeoff", "Masonry Takeoff", "Concrete Takeoff", "Drywall Takeoff"],
    ["Painting Takeoff", "Insulation Takeoff", "Roofing Takeoff", "Lumber Takeoff"],
    ["Millwork Takeoff", "Cabinet Takeoff", "Mechanical Takeoff", "HVAC Takeoff"],
    ["Plumbing Takeoff", "Electrical Takeoff", "Door/Window Takeoff", "Structural Steel Takeoff"],
  ]

  return (
    <section className="bg-black text-white">
      <section className="px-6 pb-16 pt-8 md:px-12 lg:px-20">
        <nav className="mb-16 text-sm text-[#d9d9d9]/60">
          <Link href="/services">Services</Link>
          <span className="mx-2">{">"}</span>
          <span>Construction Takeoff</span>
        </nav>

        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          <div className="max-w-xl flex-1">
            <h1 className="mb-8 text-4xl font-bold leading-tight md:text-5xl lg:text-[3.5rem]">
              <span className="bg-gradient-to-r from-[#5B8C7B] via-[#7BAF9A] to-[#C4A962] bg-clip-text text-transparent">
                Precise
              </span>{" "}
              <span className="text-white">Quantities That</span>{" "}
              <span className="bg-gradient-to-r from-[#C4A962] to-[#D4B978] bg-clip-text text-transparent">
                Power
              </span>
              <br />
              <span className="text-white">Accurate Bids</span>
            </h1>

            <p className="text-justify text-base leading-relaxed text-[#d9d9d9]/70">
              We specialize in providing precise, timely, and affordable construction
              takeoff services tailored to your project&apos;s needs. Whether you&apos;re
              working on residential, commercial, or industrial projects, our expert
              estimators deliver high-quality results every time. We provide expert
              quantity takeoff services for general contractors, subcontractors,
              engineering firms, architects, and developers.
            </p>
          </div>

          <CursorGlow colors={takeoffGlowColors} className="flex flex-1 justify-center lg:justify-end">
            <Image
              src="/images/construction-takeoff-chart.png"
              alt="Construction takeoff chart illustration"
              width={1024}
              height={768}
              className="h-auto w-full max-w-2xl"
              priority
            />
          </CursorGlow>
        </div>
      </section>

      <CursorGlow colors={takeoffGlowColors} className="w-full">
        <section className="px-6 py-20 md:px-12 lg:px-20">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Our Clients Are</h2>
          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-12 gap-y-6">
            {clients.map((client) => (
              <span key={client} className="text-base text-[#d9d9d9]/80 md:text-lg">
                {client}
              </span>
            ))}
          </div>
        </section>

        <section className="px-6 py-20 md:px-12 lg:px-20">
          <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">Quantity Take-off Services</h2>

          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 divide-y divide-[#d9d9d9]/20 md:grid-cols-4 md:divide-x md:divide-y-0">
              {[0, 1, 2, 3].map((colIndex) => (
                <div key={colIndex} className="divide-y divide-[#d9d9d9]/20">
                  {takeoffServices.map((row, rowIndex) => (
                    <div key={`${rowIndex}-${colIndex}`} className="px-4 py-8 text-center">
                      <span className="text-sm text-[#d9d9d9]/90 md:text-base">{row[colIndex]}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:px-12 lg:px-20">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-0">
            {features.map((feature, index) => (
              <div key={feature} className="flex items-center">
                <span className="whitespace-nowrap text-sm text-[#d9d9d9]/80 md:text-base">
                  {feature}
                </span>
                {index < features.length - 1 ? (
                  <div className="mx-4 hidden h-px w-32 bg-[#d9d9d9]/30 lg:w-48 md:block" />
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
