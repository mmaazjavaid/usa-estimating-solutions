'use client';

import Link from "next/link"
import Image from "next/image"
import { CursorGlow } from "@/components/ui/cursor-glow"
import { ServiceTradesSection } from "@/components/services/service-trades-section"

const residentialGlowColors = {
  primary: 'rgba(48, 18, 82, 0.52)',
  secondary: 'rgba(36, 13, 66, 0.42)',
  tertiary: 'rgba(28, 10, 50, 0.34)',
};

export function ResidentialEstimationContent() {
  const projects = [
    [
      "Apartments & Condominiums",
      "Townhouses, Bungalows & Mansions",
      "Home Additions & Remodeling",
    ],
    [
      "Single-Family Homes",
      "Multi-Family Homes",
      "Duplex/Triplex Homes",
      "Custom & Modular Homes",
    ],
  ]

  const tradeServices = [
    [
      "General Conditions & Permits",
      "Site Work & Earthwork\nDoors & Windows",
      "Stairs, Kitchens, Fixtures\n& Furnishings",
    ],
    [
      "Wood & Composite\nWork",
      "Thermal & Moisture\nProtection",
      "Doors & Windows",
    ],
    [
      "Structural & Decorative\nMetals",
      "Interior & Exterior\nFinishes",
      "Plumbing, Mechanical &\nElectrical",
    ],
  ]

  const deliverables = [
    "Customized\nResidential Estimates",
    "Digital Takeoff\nExcel Files",
    "Material\nQuantities & Types",
    "Material & Labor\nPricing",
    "Colored Marked-\nUp Drawings",
    "Complete Takeoff\nSummary",
  ]

  return (
    <section className="bg-black text-white">
      <section className="relative min-h-[600px] overflow-hidden px-6 pb-16 pt-8 md:px-12 lg:px-20">
        <nav className="mb-24 text-sm text-[#d9d9d9]/60">
          <Link href="/services">Services</Link> {">"} Residential Estimation
        </nav>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="max-w-xl">
            <h1 className="mb-6 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              <span className="text-white">Residential Cost Estimates</span>
              <br />
              <span className="text-white">For </span>
              <span className="text-[#5FBDBA]">Builders</span>
              <span className="text-white"> & </span>
              <span className="text-[#C9A227]">Homeowners</span>
            </h1>

            <p className="text-justify text-sm leading-relaxed text-[#d9d9d9]/70 md:text-base">
              Fast, precise, and cost-effective residential estimating services
              designed to give you full control over your project budget, reduce
              financial risks, and make confident decisions at every stage -
              from planning a single-family home to managing large multi-unit
              residential developments. With detailed takeoffs, labor and
              material cost breakdowns, and expert analysis, you can streamline
              bidding, secure funding, and ensure your project stays on track
              from start to finish.
            </p>
          </div>

          <CursorGlow
            colors={residentialGlowColors}
            className="hidden w-full items-center justify-end lg:flex"
          >
            <Image
              src="/images/residential-estimation-hero.png"
              alt="Residential estimation skyline illustration"
              width={1024}
              height={768}
              className="h-auto w-full max-w-[700px]"
              priority
            />
          </CursorGlow>
        </div>
      </section>

      <CursorGlow colors={residentialGlowColors} className="w-full">
      <section className="px-6 py-16 md:px-12 lg:px-20">
        <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl lg:text-4xl">
          Residential Projects We Estimate
        </h2>

        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-wrap justify-center gap-x-16 gap-y-4">
            {projects[0].map((project) => (
              <span key={project} className="text-sm text-[#d9d9d9]/80 md:text-base">
                {project}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            {projects[1].map((project) => (
              <span key={project} className="text-sm text-[#d9d9d9]/80 md:text-base">
                {project}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 lg:px-20">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl lg:text-4xl">
          Single-Family Residential Estimating
        </h2>

        <p className="mx-auto max-w-4xl text-center text-sm leading-relaxed text-[#d9d9d9]/70 md:text-base">
          Our Single-Family Residential Estimating Services are designed for
          homeowners, builders, and contractors who need precise, fast, and
          dependable house construction estimates before starting construction.
          Trade coverage:
        </p>
      </section>

      <section className="px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {tradeServices.map((row, rowIndex) =>
              row.map((service, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`py-16 px-8 text-center ${
                    colIndex < 2 ? "md:border-r border-[#d9d9d9]/20" : ""
                  } ${rowIndex < 2 ? "border-b border-[#d9d9d9]/20" : ""}`}
                >
                  <span className="whitespace-pre-line text-sm leading-relaxed text-[#d9d9d9]/90 md:text-base">
                    {service}
                  </span>
                </div>
              )),
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-12 lg:px-20">
        <h2 className="mb-16 text-center text-2xl font-bold md:text-3xl lg:text-4xl">
          Our Deliverables
        </h2>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {deliverables.map((item) => (
              <div key={item} className="text-center">
                <span className="whitespace-pre-line text-sm leading-relaxed text-[#d9d9d9]/80 md:text-base">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      </CursorGlow>

      <section className="px-6 md:px-12 lg:px-20">
        <ServiceTradesSection />
      </section>
    </section>
  )
}
