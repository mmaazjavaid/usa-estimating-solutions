import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { CTASection } from "@/components/home/cta-section"
import { StructuralEstimatingContent } from "@/components/trades/structural-estimating-content"

export default function StructuralTradePage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <StructuralEstimatingContent />
        <CTASection variant="dark" />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
