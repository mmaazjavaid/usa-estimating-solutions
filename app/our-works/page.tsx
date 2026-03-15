import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { CTASection } from "@/components/home/cta-section"
import { getSeoMetadataByPath } from "@/lib/cms"

const workImages = [
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
  "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=1200&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1200&q=80",
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80",
  "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=1200&q=80",
  "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&q=80",
  "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200&q=80",
]

export async function generateMetadata(): Promise<Metadata> {
  return (await getSeoMetadataByPath("/our-works")) ?? {}
}

export default function OurWorksPage() {
  return (
    <>
      <Header />
      <main className="bg-black pt-20 text-white">
        <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="mx-auto mb-12 max-w-4xl text-center">
            <h1 className="text-3xl font-bold md:text-4xl">Our Works</h1>
            <h2 className="mt-4 text-lg font-semibold text-gray-200 md:text-2xl">
              Delivering Reliable Estimates Across Every Project Type
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-gray-400">
              From residential homes to large commercial and industrial developments, we
              provide comprehensive estimating services that cover every phase and trade.
              Our work ensures clients have the information they need to plan budgets,
              manage resources, and make confident decisions. By combining expert knowledge,
              industry-standard tools, and clear reporting, we help projects stay on track,
              on schedule, and aligned with financial goals.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {workImages.map((src, index) => (
              <div key={src} className="overflow-hidden rounded-2xl border border-white/15 bg-black">
                <img
                  src={src}
                  alt={`Our work sample ${index + 1}`}
                  className="h-64 w-full object-cover grayscale transition duration-300 hover:grayscale-0 md:h-72"
                  loading="lazy"
                />
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
