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

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PartnersBar />
        <ServicesSection />
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
