import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { CTASection } from "@/components/home/cta-section"
import { PricesHero } from "@/components/prices/prices-hero"
import { getSeoMetadataByPath } from "@/lib/cms"

const plans = [
  {
    name: "Basic",
    description: "Single trade and\nlimited scope",
    price: "$ 200+",
    details: {
      bestFor: "Small projects / single trade",
      tradeCoverage: "Single trade or limited scope",
      bullets: ["Quantity Takeoffs", "Color-Coded Takeoffs"],
      revisions: "1",
      turnaround: "2-3 Business Days",
    },
  },
  {
    name: "Standard",
    description: "Covers multiple trades\nand services.",
    price: "$ 400+",
    popular: true,
    details: {
      bestFor: "Medium projects / GC Bids",
      tradeCoverage: "Multiple trades",
      bullets: [
        "Quantity Takeoffs",
        "Labor & Material Pricing",
        "Overhead & Profit (O&P) Optional",
        "GC Summary & Markups",
        "Color-Coded Takeoffs",
      ],
      revisions: "2",
      turnaround: "3-4 Business Days",
    },
  },
  {
    name: "Premium",
    description: "Covers all trades\nand services.",
    price: "$ 900+",
    details: {
      bestFor: "Large projects / full GC",
      tradeCoverage: "Full GC - all trades",
      bullets: [
        "Quantity Takeoffs",
        "Labor & Material Pricing",
        "Overhead & Profit (O&P)",
        "GC Summary & Markups",
        "Color-Coded Takeoffs",
      ],
      revisions: "3",
      turnaround: "3-5 Business Days",
    },
  },
]

export async function generateMetadata(): Promise<Metadata> {
  return (await getSeoMetadataByPath("/prices")) ?? {}
}

export default function PricesPage() {
  return (
    <>
      <Header />
      <main className="bg-black pt-20 text-white">
        <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <PricesHero plans={plans} />
        </section>
        <CTASection variant="dark" />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
