import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { CTASection } from "@/components/home/cta-section"
import { ConstructionEstimationContent } from "@/components/services/construction-estimation-content"
import { getSeoMetadataByPath } from "@/lib/cms"

export async function generateMetadata(): Promise<Metadata> {
  return (await getSeoMetadataByPath("/construction-estimation")) ?? {}
}

export default function ConstructionEstimationPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ConstructionEstimationContent />
        <CTASection variant="dark" />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
