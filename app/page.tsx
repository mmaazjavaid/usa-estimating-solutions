import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollToTop } from '@/components/layout/scroll-to-top';
import { HeroSection } from '@/components/home/hero-section';
import { PartnersBar } from '@/components/home/partners-bar';
import { ServicesSection } from '@/components/home/services-section';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { OurTrades } from '@/components/home/our-trades';
import { HowItWorks } from '@/components/home/how-it-works';
import { OurWorks } from '@/components/home/our-works';
import { ServiceLocations } from '@/components/home/service-locations';
import { CTASection } from '@/components/home/cta-section';
import { getPublishedServices, getSeoMetadataByPath } from '@/lib/cms';

export async function generateMetadata(): Promise<Metadata> {
  return (await getSeoMetadataByPath('/')) ?? {};
}

export default async function HomePage() {
  const services = await getPublishedServices();
  const mappedServices = services.map((service) => ({
    slug: service.slug,
    title: service.name,
    description: service.shortDescription || '',
    href: service.path || `/services/${service.slug}`,
    image: service.image || '',
  }));

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PartnersBar />
        <ServicesSection services={mappedServices} />
        <WhyChooseUs />
        <OurTrades />
        <HowItWorks />
        <OurWorks />
        <ServiceLocations />
        <CTASection />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
