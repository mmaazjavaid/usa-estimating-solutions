import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { CTASection } from "@/components/home/cta-section"
import { AboutUsContent } from "@/components/about/about-us-content"
import { getSeoMetadataByPath } from "@/lib/cms"

export async function generateMetadata(): Promise<Metadata> {
  return (await getSeoMetadataByPath("/about")) ?? {}
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <AboutUsContent />
        <CTASection variant="dark" />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
