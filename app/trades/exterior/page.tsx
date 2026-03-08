import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { CTASection } from "@/components/home/cta-section"
import { ExteriorEstimatingContent } from "@/components/trades/exterior-estimating-content"

export default function ExteriorTradePage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ExteriorEstimatingContent />
        <CTASection variant="dark" />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
