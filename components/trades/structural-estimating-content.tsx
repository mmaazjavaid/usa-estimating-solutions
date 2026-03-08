import Link from "next/link"

const whyMatters = [
  "Forms the cost backbone of the\nproject",
  "Limits major scope\nchanges later",
  "Guides early design and planning\ndecisions",
]

const structuralTypes = [
  {
    label: "Concrete",
    title: "Concrete Estimating",
    description:
      "Includes foundations, slabs, footings, columns, and structural concrete elements. Estimates support site conditions, forming methods, and construction phasing.",
  },
  {
    label: "Masonry",
    title: "Masonry Estimating",
    description:
      "Addresses blockwork, brickwork, and structural masonry assemblies. Estimates consider wall types, bonding patterns, and associated materials to support planning and execution.",
  },
  {
    label: "Rebar",
    title: "Rebar Estimating",
    description:
      "Covers reinforcement quantities, placement considerations, and fabrication requirements. Our rebar takeoffs help streamline ordering and coordination with concrete schedules.",
  },
]

export function StructuralEstimatingContent() {
  return (
    <section className="bg-black text-white">
      <section className="px-6 pb-16 pt-8 md:px-12 lg:px-20">
        <nav className="mb-16 text-sm text-[#d9d9d9]/60">
          <Link href="/trades">Trades</Link>
          <span className="mx-2">{">"}</span>
          <span>Structural Estimation</span>
        </nav>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="max-w-xl">
            <h1 className="mb-8 text-4xl font-bold leading-tight md:text-5xl">
              Cost <span className="text-[#C9A86C]">Planning</span> for the Backbone of Your
              Project
            </h1>

            <p className="text-justify text-sm leading-relaxed text-[#d9d9d9]/75 md:text-base">
              Structural estimating services provide clarity on materials,
              assemblies, and construction sequencing that form the core of a
              building. We support early planning and execution by aligning
              structural scope with design intent and construction requirements.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <StructuralHexIcon
              id="structural-hero-icon"
              topColor="#EA7E37"
              layerColor="#8D5530"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 lg:px-20">
        <h2 className="mb-8 text-xl font-bold md:text-2xl">Why Structural Estimates Matter:</h2>
        <div className="flex flex-wrap justify-start gap-x-24 gap-y-6">
          {whyMatters.map((item) => (
            <p
              key={item}
              className="whitespace-pre-line text-center text-sm text-[#d9d9d9]/80 md:text-base"
            >
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 lg:px-20">
        <h2 className="mb-6 text-center text-3xl font-bold md:text-4xl">
          Types of Structural Estimates
        </h2>
        <p className="mx-auto mb-12 max-w-5xl text-center text-sm leading-relaxed text-[#d9d9d9]/75 md:text-base">
          Structural estimating forms the backbone of any construction project.
          Here are the primary elements we analyze to maintain stability,
          efficiency, and accurate budgeting.
        </p>

        <div className="mx-auto max-w-5xl space-y-8">
          {structuralTypes.map((item, index) => (
            <div
              key={item.label}
              className={`flex flex-col items-center gap-8 ${
                index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              {index % 2 === 0 ? (
                <>
                  <div className="h-40 w-full flex-shrink-0 rounded-lg border border-[#d9d9d9]/10 bg-[#1a1a1a] px-6 py-14 text-center text-4xl font-semibold md:w-64">
                    {item.label}
                  </div>
                  <div className="flex-1 md:text-left">
                    <h3 className="mb-2 text-base font-bold">{item.title}</h3>
                    <p className="text-justify text-sm leading-relaxed text-[#d9d9d9]/70">
                      {item.description}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1 md:text-right">
                    <h3 className="mb-2 text-base font-bold">{item.title}</h3>
                    <p className="text-justify text-sm leading-relaxed text-[#d9d9d9]/70">
                      {item.description}
                    </p>
                  </div>
                  <div className="h-40 w-full flex-shrink-0 rounded-lg border border-[#d9d9d9]/10 bg-[#1a1a1a] px-6 py-14 text-center text-4xl font-semibold md:w-64">
                    {item.label}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

function StructuralHexIcon({
  topColor,
  layerColor,
  id,
}: {
  topColor: string
  layerColor: string
  id: string
}) {
  const clipId = `clip-hex-${id.replace(/[^a-zA-Z0-9-_]/g, "-")}`

  return (
    <svg
      width="100"
      height="130"
      viewBox="0 0 123 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full max-w-[360px]"
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M123.002 116.111C98.3321 130.739 73.6626 145.366 48.9993 159.994C32.6688 150.335 16.3383 140.677 0.0078125 131.019V114.525C16.3383 124.184 32.6688 133.842 48.9993 143.5C73.6626 128.904 98.3259 114.308 122.989 99.7114C122.989 105.178 123.002 110.645 123.002 116.105V116.111Z"
          fill={layerColor}
          fillOpacity="0.75"
        />
        <path
          d="M123.002 91.7139C98.3321 106.341 73.6626 120.969 48.9993 135.596C32.6688 125.938 16.3383 116.279 0.0078125 106.621V90.128C16.3383 99.7863 32.6688 109.445 48.9993 119.103C73.6626 104.507 98.3259 89.9103 122.989 75.314C122.989 80.7806 123.002 86.2472 123.002 91.7076V91.7139Z"
          fill={layerColor}
          fillOpacity="0.75"
        />
        <path
          d="M123.002 67.7827C98.3321 82.4101 73.6626 97.0376 48.9993 111.665C32.6688 102.007 16.3383 92.3483 0.0078125 82.69V66.1968C16.3383 75.8552 32.6688 85.5135 48.9993 95.1718C73.6626 80.5755 98.3259 65.9792 122.989 51.3828C122.989 56.8494 123.002 62.3161 123.002 67.7765V67.7827Z"
          fill={layerColor}
          fillOpacity="0.75"
        />
        <path
          d="M0 43.8823C24.6695 29.2549 49.339 14.6274 74.0023 0C90.3328 9.65834 106.663 19.3167 122.994 28.975V45.4682C106.663 35.8099 90.3328 26.1515 74.0023 16.4932C49.339 31.0895 24.6757 45.6859 0.0124092 60.2822L0 43.8885V43.8823Z"
          fill={topColor}
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="123" height="160" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
