"use client"

import Image from "next/image"
import Link from "next/link"
import { CursorGlow } from "@/components/ui/cursor-glow"
import { ServiceTradesSection } from "@/components/services/service-trades-section"

const cpmGlowColors = {
  primary: "rgba(180, 50, 50, 0.42)",
  secondary: "rgba(150, 42, 42, 0.36)",
  tertiary: "rgba(120, 35, 35, 0.30)",
}

export function CPMSchedulingContent() {
  const industries = [
    { line1: "Residential & Commercial", line2: "Construction" },
    { line1: "Industrial Projects & EPC", line2: "Contractors" },
    { line1: "Public Infrastructure &", line2: "Civil Engineering" },
    { line1: "Healthcare, Airports, Hotels,", line2: "Historic Restorations" },
  ]

  const cpmServices = [
    ["Identify essential tasks\nand critical activities", "Develop baseline schedules\nand monitor progress"],
    ["Manage risks and address\ndelays proactively", "Track resources, budgets,\nand performance metrics"],
  ]

  const primaveraServices = [
    ["Concept-to-close\nproject scheduling", "Critical path analysis and\nresource allocation"],
    [
      "Forecasting, delay\nmanagement, and risk\nmitigation",
      "Customizable reports: Gantt\ncharts, activity networks,\nand time-scaled logic\ndiagrams",
    ],
  ]

  const msProjectServices = [
    [
      "Comprehensive task\nsequencing and float\ncalculations",
      '"What-If" scenario planning for\nrisk management',
    ],
    ["Resource optimization and\nbaseline alignment", "Backward scheduling to meet\nfixed deadlines"],
  ]

  return (
    <section className="bg-black text-white">
      <section className="px-6 pb-20 pt-6 md:px-12 lg:px-20">
        <nav className="mb-16 text-sm text-[#d9d9d9]/60">
          <Link href="/services">Services</Link>
          <span className="mx-2">{">"}</span>
          <span>CPM Scheduling</span>
        </nav>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="max-w-xl">
            <h1 className="mb-8 text-4xl font-bold leading-tight md:text-5xl">
              Efficient Scheduling for{" "}
              <span className="bg-gradient-to-r from-[#5b9a8b] to-[#7ab8a8] bg-clip-text text-transparent">
                Timely
              </span>{" "}
              & Projects{" "}
              <span className="bg-gradient-to-r from-[#c9a227] to-[#d4af37] bg-clip-text text-transparent">
                Cost-Controlled
              </span>
            </h1>

            <p className="text-justify text-sm leading-relaxed text-[#d9d9d9]/70 md:text-base">
              Effective construction scheduling is essential for keeping projects
              on track, within budget, and aligned with deadlines. It helps teams
              coordinate tasks, allocate resources, anticipate challenges, and make
              informed decisions at every stage of construction. Whether your
              project is residential, commercial, or industrial, professional
              scheduling ensures smooth execution and improved project performance.
            </p>
          </div>

          <CursorGlow colors={cpmGlowColors} className="flex justify-center lg:justify-end">
            <Image
              src="/images/cpm-scheduling-hero.png"
              alt="CPM scheduling chart illustration"
              width={1024}
              height={768}
              className="h-auto w-full max-w-[700px]"
              priority
            />
          </CursorGlow>
        </div>
      </section>

      <CursorGlow colors={cpmGlowColors} className="w-full">
        <section className="px-6 py-20 md:px-12 lg:px-20">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Industries We Serve</h2>

          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-16 gap-y-6">
            {industries.map((industry) => (
              <div key={`${industry.line1}-${industry.line2}`} className="text-center">
                <span className="text-sm text-[#d9d9d9]/80 md:text-base">
                  {industry.line1}
                  <br />
                  {industry.line2}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-20 md:px-12 lg:px-20">
          <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
            Critical Path Method (CPM) Scheduling
          </h2>

        <p className="mx-auto mb-16 max-w-4xl text-center text-sm text-[#d9d9d9]/70 md:text-base">
          CPM scheduling identifies the most important tasks and milestones, helping
          you plan the optimal sequence of activities. It allows teams to manage
          risks, track progress, and adjust timelines, ensuring critical work is
          completed on schedule and projects move forward efficiently. CPM scheduling
          breaks down complex projects to highlight the most important tasks and
          milestones, ensuring smooth execution from start to finish.
        </p>

        <div className="mx-auto max-w-3xl">
          {cpmServices.map((row, rowIndex) => (
            <div
              key={`cpm-${rowIndex}`}
              className={`grid grid-cols-1 md:grid-cols-2 ${
                rowIndex === 0 ? "border-b border-[#d9d9d9]/20" : ""
              }`}
            >
              {row.map((service, colIndex) => (
                <div
                  key={service}
                  className={`py-16 px-6 text-center ${
                    colIndex === 0 ? "md:border-r border-[#d9d9d9]/20" : ""
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
        <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
          Primavera Scheduling Services
        </h2>

        <p className="mx-auto mb-16 max-w-4xl text-center text-sm text-[#d9d9d9]/70 md:text-base">
          Primavera scheduling provides detailed timelines, resource allocation, and
          integrated reporting for complex projects. With Gantt charts, network
          diagrams, and logic-based schedules, teams can forecast delays, coordinate
          trades, and maintain visibility across all project phases. Primavera
          scheduling ensures that projects run smoothly with realistic timelines,
          integrated team coordination, and ongoing updates for any project changes.
        </p>

        <div className="mx-auto max-w-3xl">
          {primaveraServices.map((row, rowIndex) => (
            <div
              key={`primavera-${rowIndex}`}
              className={`grid grid-cols-1 md:grid-cols-2 ${
                rowIndex === 0 ? "border-b border-[#d9d9d9]/20" : ""
              }`}
            >
              {row.map((service, colIndex) => (
                <div
                  key={service}
                  className={`py-16 px-6 text-center ${
                    colIndex === 0 ? "md:border-r border-[#d9d9d9]/20" : ""
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
        <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
          MS Project Scheduling Services
        </h2>

        <p className="mx-auto mb-16 max-w-4xl text-center text-sm text-[#d9d9d9]/70 md:text-base">
          MS Project scheduling organizes and tracks tasks, manages dependencies,
          and optimizes resources. Features like critical path analysis,
          &quot;What-If&quot; scenario planning, and backward scheduling allow teams
          to visualize timelines, prevent conflicts, and ensure projects stay on
          schedule and on budget. MS Project scheduling gives you full visibility
          of project progress, allowing you to anticipate delays and make
          data-driven decisions.
        </p>

        <div className="mx-auto max-w-3xl">
          {msProjectServices.map((row, rowIndex) => (
            <div
              key={`ms-project-${rowIndex}`}
              className={`grid grid-cols-1 md:grid-cols-2 ${
                rowIndex === 0 ? "border-b border-[#d9d9d9]/20" : ""
              }`}
            >
              {row.map((service, colIndex) => (
                <div
                  key={service}
                  className={`py-16 px-6 text-center ${
                    colIndex === 0 ? "md:border-r border-[#d9d9d9]/20" : ""
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
