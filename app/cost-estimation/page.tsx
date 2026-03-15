import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { CTASection } from "@/components/home/cta-section"
import { CostEstimationContent } from "@/components/services/cost-estimation-content"
import { getSeoMetadataByPath } from "@/lib/cms"

export async function generateMetadata(): Promise<Metadata> {
  return (await getSeoMetadataByPath("/cost-estimation")) ?? {}
}

export default function CostEstimationPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <CostEstimationContent />
        <CTASection variant="dark" />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
