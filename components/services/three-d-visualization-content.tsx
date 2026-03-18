"use client"

import Image from "next/image"
import Link from "next/link"
import { CursorGlow } from "@/components/ui/cursor-glow"
import { ServiceTradesSection } from "@/components/services/service-trades-section"

const threeDGlowColors = {
  primary: "rgba(70, 70, 35, 0.5)",
  secondary: "rgba(58, 58, 30, 0.42)",
  tertiary: "rgba(45, 45, 25, 0.36)",
}

export function ThreeDVisualizationContent() {
  const benefits = [
    { line1: "Seamless integration with", line2: "cost estimates & takeoffs" },
    { line1: "Ideal for bids, permits,", line2: "and marketing" },
    { line1: "Faster client approvals &", line2: "stronger presentations" },
    { line1: "Realistic materials, lighting,", line2: "and scale accuracy" },
  ]

  const coreServices = [
    [
      "360 deg Panoramas &\nWalkthrough Views",
      "Exterior & Interior 3D\nVisualizations",
      "Furniture, Fixture &\nMaterial Visualization",
    ],
    [
      "Photorealistic Renders",
      "Architectural 3D\nModeling (Residential &\nCommercial)",
      "Construction-Ready 3D\nModels for Design\nCoordination",
    ],
  ]

  return (
    <section className="bg-black text-white">
      <section className="px-6 pb-20 pt-8 md:px-12 lg:px-20">
        <nav className="mb-16 text-sm text-[#d9d9d9]/60">
          <Link href="/services">Services</Link>
          <span className="mx-2">{">"}</span>
          <span>3D Visualization</span>
        </nav>

        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          <div className="lg:w-1/2">
            <h1 className="mb-8 text-4xl font-bold leading-tight md:text-5xl lg:text-5xl">
              Bring Designs to{" "}
              <span className="bg-gradient-to-r from-[#7ab8a8] via-[#a8b87a] to-[#c9a85c] bg-clip-text text-transparent">
                Life
              </span>{" "}
              Before Construction Begins
            </h1>

            <p className="max-w-xl text-justify text-sm leading-relaxed text-[#d9d9d9]/70 md:text-base">
              3D modeling and architectural visualization transform concepts and
              drawings into clear, realistic visuals that make design intent easy
              to understand. These services help architects, developers, and
              contractors visualize spaces, materials, and layouts early in the
              process - supporting better planning, smoother approvals, and more
              confident decision-making before construction starts.
            </p>
          </div>

          <CursorGlow colors={threeDGlowColors} className="flex justify-center lg:w-1/2">
            <Image
              src="/images/3d-visualization-hero.png"
              alt="3D visualization cube illustration"
              width={1024}
              height={768}
              className="h-auto w-full max-w-[420px]"
              priority
            />
          </CursorGlow>
        </div>
      </section>

      <CursorGlow colors={threeDGlowColors} className="w-full">
        <section className="px-6 py-20 md:px-12 lg:px-20">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            Why Choose Our 3D Services:
          </h2>

          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-16 gap-y-8">
            {benefits.map((benefit) => (
              <div key={benefit.line1} className="text-center">
                <span className="text-sm text-[#d9d9d9]/80 md:text-base">
                  {benefit.line1}
                  <br />
                  {benefit.line2}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-20 md:px-12 lg:px-20">
          <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
            Core 3D Visualization Services
          </h2>

          <p className="mx-auto mb-16 max-w-4xl text-center text-sm text-[#d9d9d9]/70 md:text-base">
            Our 3D modeling and visualization services convert 2D plans, sketches,
            and specifications into detailed three-dimensional models and
            high-quality visual representations. By creating accurate digital
            models, we help project teams explore design options, identify
            potential issues, and communicate ideas clearly to clients,
            stakeholders, and approval authorities.
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

      <section className="px-6 md:px-12 lg:px-20">
        <ServiceTradesSection />
      </section>
    </section>
  )
}
