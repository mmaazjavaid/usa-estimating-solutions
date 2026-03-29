/**
 * Legacy static homepage composition (pre-CMS). Kept for reference and emergencies.
 * The live `/` route renders from admin via `CmsPageSections` + `HOME_PAGE_SECTIONS` defaults.
 */
import { HeroSection } from '@/components/home/hero-section';
import { PartnersBar } from '@/components/home/partners-bar';
import { ServicesSection } from '@/components/home/services-section';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { OurTrades } from '@/components/home/our-trades';
import { HowItWorks } from '@/components/home/how-it-works';
import { OurWorks } from '@/components/home/our-works';
import { ServiceLocations } from '@/components/home/service-locations';
import { CTASection } from '@/components/home/cta-section';

type StaticHomeProps = {
  mappedServices: {
    slug: string;
    title: string;
    description: string;
    href: string;
    image?: string;
  }[];
};

export function StaticHomePageComposition({ mappedServices }: StaticHomeProps) {
  return (
    <>
      <HeroSection />
      <PartnersBar />
      <ServicesSection services={mappedServices} />
      <WhyChooseUs />
      <OurTrades />
      <HowItWorks />
      <OurWorks />
      <ServiceLocations />
      <CTASection />
    </>
  );
}
