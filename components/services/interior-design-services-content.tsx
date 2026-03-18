"use client"

import Image from "next/image"
import Link from "next/link"
import { CursorGlow } from "@/components/ui/cursor-glow"
import { ServiceTradesSection } from "@/components/services/service-trades-section"

const interiorDesignGlowColors = {
  primary: "rgba(180, 55, 65, 0.48)",
  secondary: "rgba(150, 45, 55, 0.40)",
  tertiary: "rgba(120, 38, 48, 0.34)",
}

export function InteriorDesignServicesContent() {
  const supporters = [
    "EPC Contractors",
    "Industrial Owners & Operators",
    "Engineering & Design Firms",
    "Financial Investors",
    "Joint Venture Partners",
  ]

  const coreServices = [
    [
      "Concept Design & Mood\nBoards",
      "Space Planning &\nLayout Optimization",
      "Material, Color & Finish\nSelection",
    ],
    [
      "Furniture & Lighting\nDesign",
      "Kitchen & Bathroom\nDesign",
      "Commercial & Office\nInterior Design",
    ],
  ]

  return (
    <section className="min-h-screen bg-black text-white">
      <section className="px-6 pb-16 pt-8 md:px-12 lg:px-20">
        <nav className="mb-16 text-sm text-[#d9d9d9]/60">
          <Link href="/services">Services</Link>
          <span className="mx-2">{">"}</span>
          <span>Interior Design Services</span>
        </nav>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="max-w-xl">
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
              <span className="bg-gradient-to-r from-[#5b8a7a] via-[#8fb09a] to-[#c9a86c] bg-clip-text text-transparent">
                Coordinated
              </span>{" "}
              Interior Design for Seamless Execution
            </h1>

            <p className="text-justify text-sm leading-relaxed text-[#d9d9d9]/70 md:text-base">
              Interior design plays a key role in shaping how a space looks,
              feels, and functions. Our interior design services focus on
              thoughtful space planning, balanced layouts, and coordinated
              design elements that support everyday use while aligning with the
              overall architectural vision. From early concepts to detailed
              layouts, we help create interiors that feel intentional,
              organized, and ready for execution.
            </p>
          </div>

          <CursorGlow className="flex justify-center lg:justify-end" colors={interiorDesignGlowColors}>
            <Image
              src="/images/interior-design-services-hero.png"
              alt="Interior design staircase illustration"
              width={1024}
              height={768}
              className="h-auto w-full max-w-[700px]"
              priority
            />
          </CursorGlow>
        </div>
      </section>

      <CursorGlow colors={interiorDesignGlowColors} className="w-full">
        <section className="px-6 py-16 md:px-12 lg:px-20">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Who We Support</h2>

          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-12 gap-y-4">
            {supporters.map((supporter) => (
              <span key={supporter} className="text-sm text-[#d9d9d9]/80 md:text-base">
                {supporter}
              </span>
            ))}
          </div>
        </section>

        <section className="px-6 py-20 md:px-12 lg:px-20">
          <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
            Core Interior Design Services
          </h2>

          <p className="mx-auto mb-16 max-w-5xl text-center text-sm leading-relaxed text-[#d9d9d9]/70 md:text-base">
            Our interior design and space planning services include developing
            efficient floor plans, circulation strategies, and interior layouts
            that make the best use of available space. We work closely with
            project teams to ensure finishes, fixtures, and interior components
            are aligned with construction requirements, helping reduce conflicts,
            improve coordination, and support a smoother transition from design
            to build.
          </p>

          <div className="mx-auto max-w-4xl">
            {coreServices.map((row, rowIndex) => (
              <div
                key={`core-${rowIndex}`}
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

      <section className="px-6 md:px-12 lg:px-20">
        <ServiceTradesSection />
      </section>
    </section>
  )
}
