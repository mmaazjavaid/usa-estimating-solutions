import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { CTASection } from "@/components/home/cta-section"
import { ResidentialEstimationContent } from "@/components/services/residential-estimation-content"
import { getSeoMetadataByPath } from "@/lib/cms"

export async function generateMetadata(): Promise<Metadata> {
  return (await getSeoMetadataByPath("/residential-estimation")) ?? {}
}

export default function ResidentialEstimationPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ResidentialEstimationContent />
        <CTASection variant="dark" />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
