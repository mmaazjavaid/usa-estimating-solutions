'use client';

import { CTASection } from '@/components/home/cta-section';
import { AnimatedServiceCard } from '@/components/common/animated-service-card';
import { DEFAULT_SERVICES } from '@/lib/cms-defaults';

type ServiceCardData = {
  title: string;
  slug: string;
  href: string;
  description?: string;
  image?: string;
};

const glowColors = [
  'bg-[#53C0AE]',
  'bg-[rgba(164,107,238,0.9)]',
  'bg-[rgba(237,44,76,0.85)]',
  'bg-[rgba(234,126,55,0.9)]',
];

export function ServicesSection({
  services = DEFAULT_SERVICES.map((service) => ({
    title: service.name,
    slug: service.slug,
    href: service.path,
    description: service.shortDescription,
    image: service.image,
  })),
}: {
  services?: ServiceCardData[];
}) {
  return (
    <section className="bg-black text-white">
      <div className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Our Services
            </h2>
            <h3 className="mb-6 text-lg text-gray-300 md:text-xl">
              Construction Estimating Services Built for Accurate Bids
            </h3>
            <p className="mx-auto max-w-4xl text-sm leading-relaxed text-gray-400">
              We provide professional construction estimating and quantity
              takeoff services designed to help you bid confidently, reduce
              overhead costs, and plan projects more efficiently. Using advanced
              estimating software, real-time pricing databases, and industry
              expertise, our estimators deliver accurate, reliable takeoffs
              tailored to your project&apos;s scope, timeline, and budget.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {services.slice(0, 4).map((service, index) => (
              <AnimatedServiceCard
                key={service.slug}
                href={service.href}
                title={service.title}
                description={service.description || ''}
                iconSrc={service.image || `/images/services-section/${service.slug}.svg`}
                glowColorClassName={glowColors[index % 4]}
                imagePriority={index < 4}
                size="sm"
              />
            ))}
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {services.slice(4, 8).map((service, index) => (
              <AnimatedServiceCard
                key={service.slug}
                href={service.href}
                title={service.title}
                description={service.description || ''}
                iconSrc={service.image || `/images/services-section/${service.slug}.svg`}
                glowColorClassName={glowColors[index % 4]}
                size="sm"
              />
            ))}
          </div>

          <div className="flex justify-center">
            <div className="grid w-full grid-cols-2 gap-4 md:w-1/2 md:gap-6">
              {services.slice(8, 10).map((service, index) => (
                <AnimatedServiceCard
                  key={service.slug}
                  href={service.href}
                  title={service.title}
                  description={service.description || ''}
                  iconSrc={service.image || `/images/services-section/${service.slug}.svg`}
                  glowColorClassName={glowColors[index % 4]}
                  size="sm"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <CTASection variant="dark" />
    </section>
  );
}
