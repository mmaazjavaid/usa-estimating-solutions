import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { ServicesSection } from "@/components/services/services-section"
import { getSeoMetadataByPath } from "@/lib/cms"
import { getLiveServicesForCarousel } from "@/lib/service-nav"

export async function generateMetadata(): Promise<Metadata> {
  return (await getSeoMetadataByPath("/services", {
    title: "Construction Estimating Services | USA Estimating Solutions",
    description:
      "Explore our construction estimating services: cost estimation, quantity takeoffs, commercial, residential and industrial estimates, CPM scheduling and more.",
  })) ?? {}
}

export default async function ServicesPage() {
  const mappedServices = await getLiveServicesForCarousel()

  return (
    <>
      <Header />
      <main className="pt-20">
        <ServicesSection services={mappedServices} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
