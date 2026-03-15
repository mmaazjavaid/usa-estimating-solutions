import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { ServicesSection } from "@/components/services/services-section"
import { getPublishedServices, getSeoMetadataByPath } from "@/lib/cms"

export async function generateMetadata(): Promise<Metadata> {
  return (await getSeoMetadataByPath("/services")) ?? {}
}

export default async function ServicesPage() {
  const services = await getPublishedServices()
  const mappedServices = services.map((service) => ({
    title: service.name,
    slug: service.slug,
    href: service.path || `/services/${service.slug}`,
  }))

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
