import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { CTASection } from "@/components/home/cta-section"
import { PreliminaryEstimatingContent } from "@/components/services/preliminary-estimating-content"
import { getSeoMetadataByPath } from "@/lib/cms"

export async function generateMetadata(): Promise<Metadata> {
  return (await getSeoMetadataByPath("/preliminary-estimating")) ?? {}
}

export default function PreliminaryEstimatingPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <PreliminaryEstimatingContent />
        <CTASection variant="dark" />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
