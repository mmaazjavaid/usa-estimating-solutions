import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { CTASection } from "@/components/home/cta-section"
import { getSeoMetadataByPath } from "@/lib/cms"

const workItems = [
  {
    image: "/images/our-works/work-01.png",
    title: "Division-9 Finishes",
    previewFile: "/files/our-works/work-01.pdf",
    downloadFile: "/files/our-works/work-01.xlsx",
  },
  {
    image: "/images/our-works/work-02.png",
    title: "Drywall Estimate",
    previewFile: "/files/our-works/work-02.pdf",
    downloadFile: "/files/our-works/work-02.xlsx",
  },
  {
    image: "/images/our-works/work-03.png",
    title: "Telecommunication Estimate",
    previewFile: "/files/our-works/work-03.pdf",
    downloadFile: "/files/our-works/work-03.xlsx",
  },
  {
    image: "/images/our-works/work-04.png",
    title: "MEP Estimate",
    previewFile: "/files/our-works/work-04.pdf",
    downloadFile: "/files/our-works/work-04.xlsx",
  },
  {
    image: "/images/our-works/work-05.png",
    title: "HVAC Estimate",
    previewFile: "/files/our-works/work-05.pdf",
    downloadFile: "/files/our-works/work-05.xlsx",
  },
  {
    image: "/images/our-works/work-06.png",
    title: "Glazing Estimate",
    previewFile: "/files/our-works/work-06.pdf",
    downloadFile: "/files/our-works/work-06.xlsx",
  },
  {
    image: "/images/our-works/work-07.png",
    title: "GC Sample Estimate",
    previewFile: "/files/our-works/work-07.pdf",
    downloadFile: "/files/our-works/work-07.xlsx",
  },
  {
    image: "/images/our-works/work-08.png",
    title: "Flooring Estimate",
    previewFile: "/files/our-works/work-08.pdf",
    downloadFile: "/files/our-works/work-08.xlsx",
  },
  {
    image: "/images/our-works/work-09.png",
    title: "Electrical Sample Estimate",
    previewFile: "/files/our-works/work-09.pdf",
    downloadFile: "/files/our-works/work-09.xlsx",
  },
  {
    image: "/images/our-works/work-10.png",
    title: "Lumber Estimate",
    previewFile: "/files/our-works/work-10.pdf",
    downloadFile: "/files/our-works/work-10.xlsx",
  },
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
            {workItems.map((item, index) => (
              <div
                key={item.image}
                className="group relative overflow-hidden rounded-2xl border border-white/15 bg-black"
              >
                <img
                  src={item.image}
                  alt={`Our work sample ${index + 1}`}
                  className="h-64 w-full object-cover transition duration-300 md:h-72"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-center text-2xl font-semibold text-white">
                    {item.title}
                  </p>
                  <a
                    href={item.previewFile}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-w-44 justify-center rounded-full border border-white/60 bg-white/20 px-6 py-2 text-xl font-medium text-white backdrop-blur-sm transition hover:bg-white/30"
                  >
                    Preview
                  </a>
                  <a
                    href={item.downloadFile}
                    download
                    className="inline-flex min-w-44 justify-center rounded-full border border-black/50 bg-black/75 px-6 py-2 text-xl font-semibold text-white transition hover:bg-black/90"
                  >
                    Download
                  </a>
                </div>
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
