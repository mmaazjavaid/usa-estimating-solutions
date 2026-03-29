import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { CTASection } from "@/components/home/cta-section"
import { EstimateCard } from "@/components/common/estimate-card"
import { getSeoMetadataByPath } from "@/lib/cms"
import { getPublishedCmsPagesForListing } from "@/lib/cms-pages"

const trades = [
  {
    title: "Structural\nEstimating",
    description:
      "Reliable structural estimates that support competitive bids and efficient project execution.",
    arrowColor: "#EA7E37",
    iconColors: {
      top: "#E27B36",
      layers: "#8D5530",
    },
    href: "/trades/structural",
  },
  {
    title: "MEP\nEstimating",
    description:
      "Accurate MEP estimates covering mechanical, electrical, and plumbing systems for every project.",
    arrowColor: "#5BB8B0",
    iconColors: {
      top: "#5BB8B0",
      layers: "#307870",
    },
    href: "/trades/mep",
  },
  {
    title: "Interior\nEstimating",
    description:
      "Reliable interior estimates that support competitive bids and efficient project execution.",
    arrowColor: "#D45070",
    iconColors: {
      top: "#D45070",
      layers: "#8D3048",
    },
    href: "/trades/interior",
  },
  {
    title: "Exterior\nEstimating",
    description:
      "Comprehensive exterior estimates for facades, roofing, and site work with precision detail.",
    arrowColor: "#8A6AB8",
    iconColors: {
      top: "#8A6AB8",
      layers: "#5A4080",
    },
    href: "/trades/exterior",
  },
]

export async function generateMetadata(): Promise<Metadata> {
  return (await getSeoMetadataByPath("/trades")) ?? {}
}

export default async function TradesPage() {
  const cmsExtras = await getPublishedCmsPagesForListing("trades")

  return (
    <>
      <Header />
      <main className="bg-black pt-20 text-white">
        <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <h1 className="mb-4 text-center text-3xl font-bold md:text-4xl">Trades</h1>
          <h2 className="mb-6 text-center text-xl text-gray-200 md:text-2xl">
            Plan, Budget and Coordinate Every Trade
          </h2>
          <p className="mx-auto mb-14 max-w-5xl text-center text-sm leading-relaxed text-gray-400">
            Our trades estimating services cover every aspect of construction, providing
            detailed material and labor takeoffs across all specialties. From structural
            components to mechanical, electrical, plumbing, and interior and exterior
            finishes, we help contractors, developers, and project managers plan, budget,
            and coordinate efficiently. By breaking down each trade into clear cost and
            quantity data, our services streamline procurement, support accurate scheduling,
            and ensure every phase of construction progresses smoothly.
          </p>

          {cmsExtras.length > 0 ? (
            <section className="mb-16">
              <h2 className="mb-4 text-center text-xl font-semibold text-gray-200">
                Resources
              </h2>
              <ul className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
                {cmsExtras.map((p) => (
                  <li key={p._id.toString()}>
                    <Link
                      href={p.path.startsWith("/") ? p.path : `/${p.path}`}
                      className="block rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white transition-colors hover:border-[#FF771E]/50"
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {trades.map((trade) => (
              <EstimateCard
                key={trade.title}
                title={trade.title}
                description={trade.description}
                href={trade.href}
                arrowColor={trade.arrowColor}
                topColor={trade.iconColors.top}
                layerColor={trade.iconColors.layers}
                minHeight="300px"
              />
            ))}
          </div>
        </section>
        <CTASection variant="dark" />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
