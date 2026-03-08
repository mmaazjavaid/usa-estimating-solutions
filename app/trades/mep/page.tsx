import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { CTASection } from "@/components/home/cta-section"
import { MEPEstimatingContent } from "@/components/trades/mep-estimating-content"

export default function MEPTradePage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <MEPEstimatingContent />
        <CTASection variant="dark" />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
