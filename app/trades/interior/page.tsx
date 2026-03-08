import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { CTASection } from "@/components/home/cta-section"
import { InteriorEstimatingContent } from "@/components/trades/interior-estimating-content"

export default function InteriorTradePage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <InteriorEstimatingContent />
        <CTASection variant="dark" />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
