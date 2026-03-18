"use client"

import Link from "next/link"
import { EstimateCard } from "@/components/common/estimate-card"
import { CursorGlow } from "@/components/ui/cursor-glow"
import { ServiceTradesSection } from "@/components/services/service-trades-section"

const constructionGlowColors = {
  primary: "rgba(48, 18, 82, 0.52)",
  secondary: "rgba(36, 13, 66, 0.42)",
  tertiary: "rgba(28, 10, 50, 0.34)",
}

const services = [
  {
    title: "Freelance\nEstimating",
    arrowColor: "#c96b6b",
    description:
      "Flexible freelance estimating support for contractors needing fast and accurate bid help.",
    iconColors: { top: "#c96b6b", layers: "#8d4a4a" },
  },
  {
    title: "Construction\nEstimator",
    arrowColor: "#9b7bcb",
    description:
      "Dedicated construction estimator services for labor, material, and equipment pricing.",
    iconColors: { top: "#9b7bcb", layers: "#5a4080" },
  },
  {
    title: "Blue-Print\nEstimator",
    arrowColor: "#6bc9b9",
    description:
      "Blueprint-based quantity takeoffs and scope validation to improve estimate confidence.",
    iconColors: { top: "#6bc9b9", layers: "#307870" },
  },
  {
    title: "Xactimate\nEstimating",
    arrowColor: "#b8956b",
    description:
      "Professional Xactimate estimates aligned with insurance workflows and documentation.",
    iconColors: { top: "#b8956b", layers: "#8d5530" },
  },
]

const offerings = [
  "Structural Steel & MEP Shop Drawings",
  "Monthly Takeoff Packages",
  "Estimating Consultations",
  "Conceptual Estimates",
]

export function ConstructionEstimationContent() {
  return (
    <section className="bg-black text-white">
      <section className="relative min-h-[600px] px-6 pb-24 pt-6 lg:px-12">
        <nav className="mb-24 text-sm text-[#d9d9d9]/60">
          <Link href="/services">Services</Link>
          <span className="mx-2">{">"}</span>
          <span>Construction Estimation</span>
        </nav>

        <div className="flex flex-col items-start justify-between gap-12 lg:flex-row">
          <div className="max-w-2xl">
            <h1 className="mb-8 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(90deg, #5a9a8a, #c9a227)",
                }}
              >
                Data-Driven
              </span>{" "}
              <span className="text-white">Construction Estimating Solutions</span>
            </h1>
            <p className="max-w-xl text-justify text-base leading-relaxed text-[#d9d9d9]/80">
              At USA Estimating Solutions, we deliver fast, precise, and
              data-driven construction estimates that empower contractors,
              developers, and project owners to plan smarter, bid
              competitively, and win more work. Whether your project is
              residential, commercial, or industrial, our expert team
              transforms your plans into accurate cost projections, reducing
              risk and giving you financial clarity from day one.
            </p>
          </div>

          <CursorGlow colors={constructionGlowColors} className="w-full flex-shrink-0 lg:w-[500px] xl:w-[600px]">
            <svg
              viewBox="0 0 600 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-auto w-full"
            >
              <path
                d="M100 350 L300 280 L550 320 L350 390 Z"
                stroke="#d9d9d9"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M150 340 L280 290 L480 320 L350 370"
                stroke="#d9d9d9"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
              />
              <g stroke="#d9d9d9" strokeWidth="1.5" fill="none">
                <ellipse cx="200" cy="95" rx="30" ry="12" />
                <path d="M170 95 Q170 70 200 65 Q230 70 230 95" />
                <line x1="200" y1="65" x2="200" y2="55" />
                <ellipse cx="200" cy="115" rx="18" ry="20" />
                <path d="M182 135 Q170 150 165 200 Q160 250 170 300" />
                <path d="M218 135 Q230 150 235 200 Q240 250 230 300" />
                <path d="M182 135 L218 135" />
                <path d="M175 160 Q150 180 160 220 Q170 260 220 280" />
                <path d="M225 160 Q250 180 260 220 Q265 250 250 280" />
              </g>
              <g stroke="#d9d9d9" strokeWidth="1.5" fill="none">
                <ellipse cx="350" cy="75" rx="28" ry="11" />
                <path d="M322 75 Q322 52 350 47 Q378 52 378 75" />
                <line x1="350" y1="47" x2="350" y2="38" />
                <ellipse cx="350" cy="95" rx="17" ry="18" />
                <path d="M333 113 Q320 130 315 180 Q310 230 320 280" />
                <path d="M367 113 Q380 130 385 180 Q390 230 380 280" />
                <path d="M333 113 L367 113" />
                <path d="M325 140 Q300 160 290 200 Q285 240 300 270" />
                <path d="M375 140 Q400 160 410 200 Q415 240 400 270" />
              </g>
              <g stroke="#d9d9d9" strokeWidth="1.5" fill="none">
                <ellipse cx="480" cy="80" rx="28" ry="11" />
                <path d="M452 80 Q452 57 480 52 Q508 57 508 80" />
                <line x1="480" y1="52" x2="480" y2="43" />
                <ellipse cx="480" cy="100" rx="17" ry="18" />
                <path d="M463 118 Q450 135 445 185 Q440 235 450 285" />
                <path d="M497 118 Q510 135 515 185 Q520 235 510 285" />
                <path d="M463 118 L497 118" />
                <path d="M455 145 Q430 165 420 205 Q415 245 430 275" />
                <path d="M505 145 Q530 165 540 205 Q545 235 530 265" />
              </g>
            </svg>
          </CursorGlow>
        </div>

        <CursorGlow colors={constructionGlowColors} className="mt-20 w-full">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            What We Offer
          </h2>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
            {offerings.map((item) => (
              <div key={item} className="text-center">
                <p className="text-sm font-medium text-white md:text-base">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </CursorGlow>
      </section>

      <section className="px-6 py-16 lg:px-12">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
          {services.map((service) => (
            <EstimateCard
              key={service.title}
              title={service.title}
              description={service.description}
              href="/construction-estimation"
              arrowColor={service.arrowColor}
              topColor={service.iconColors.top}
              layerColor={service.iconColors.layers}
            />
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-12">
        <ServiceTradesSection />
      </section>
    </section>
  )
}
