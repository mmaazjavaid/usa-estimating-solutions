import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { CTASection } from "@/components/home/cta-section"
import { getSeoMetadataByPath } from "@/lib/cms"

const plans = [
  {
    name: "Basic",
    description: "Single trade and\nlimited scope",
    price: "$ 200+",
  },
  {
    name: "Standard",
    description: "Covers multiple trades\nand services.",
    price: "$ 400+",
    popular: true,
  },
  {
    name: "Premium",
    description: "Covers all trades\nand services.",
    price: "$ 900+",
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
          <h1 className="mb-5 text-center text-4xl font-bold md:text-5xl">Prices</h1>
          <p className="mx-auto mb-14 max-w-5xl text-center text-xl leading-relaxed text-[#d9d9d9]/85">
            Find yourself the best plan. Pay only for what you need, with flexible
            estimating options for every project stage. Discounts available for
            first-time clients and long-term partnerships.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="rounded-[22px] border border-white/10 bg-[#1e1f24] p-6"
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-3xl font-bold">{plan.name}</h2>
                    <p className="mt-2 whitespace-pre-line text-lg leading-snug text-[#d9d9d9]/85">
                      {plan.description}
                    </p>
                  </div>
                  {plan.popular ? (
                    <span className="rounded-full border border-[#9d6b48] px-3 py-1 text-xs text-[#d2a376]">
                      Popular
                    </span>
                  ) : null}
                </div>

                <p className="mb-6 text-4xl font-bold">{plan.price}</p>

                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/35 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
                >
                  Know More
                </Link>
              </div>
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
