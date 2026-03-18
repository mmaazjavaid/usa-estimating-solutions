'use client';

import { CTASection } from '@/components/home/cta-section';
import { AnimatedServiceCard } from '@/components/common/animated-service-card';
import { CursorGlow } from '@/components/ui/cursor-glow';
import { DEFAULT_SERVICES } from '@/lib/cms-defaults';

type ServiceCardData = {
  title: string;
  slug: string;
  href: string;
  description?: string;
  image?: string;
};

const iconSlugAliases: Record<string, string> = {
  'residential-estimation': 'residential-estimating',
};

const builtInIconSlugs = new Set([
  'cost-estimation',
  'construction-estimation',
  'construction-takeoff',
  'residential-estimating',
  'commercial-estimating',
  'industrial-estimating',
  'preliminary-estimating',
  'cpm-scheduling',
  '3d-visualization',
  'interior-design-services',
]);

const glowColors = [
  'bg-[#53C0AE]',
  'bg-[rgba(164,107,238,0.9)]',
  'bg-[rgba(237,44,76,0.85)]',
  'bg-[rgba(234,126,55,0.9)]',
];

function getServiceIconSrc(service: ServiceCardData) {
  if (service.image?.trim()) {
    return service.image.trim();
  }

  const resolvedSlug = iconSlugAliases[service.slug] ?? service.slug;
  if (builtInIconSlugs.has(resolvedSlug)) {
    return `/images/services-section/${resolvedSlug}.svg`;
  }

  return '/placeholder.svg';
}

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
          <CursorGlow
            className="mb-12 w-full"
            colors={{
              primary: 'rgba(160, 55, 55, 0.42)',
              secondary: 'rgba(140, 45, 45, 0.36)',
              tertiary: 'rgba(115, 35, 35, 0.30)',
            }}
          >
            <div className="text-center">
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
          </CursorGlow>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
            {services.slice(0, 4).map((service, index) => (
              <AnimatedServiceCard
                key={service.slug}
                href={service.href}
                title={service.title}
                description={service.description || ''}
                iconSrc={getServiceIconSrc(service)}
                glowColorClassName={glowColors[index % 4]}
                imagePriority={index < 4}
                size="sm"
              />
            ))}
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
            {services.slice(4, 8).map((service, index) => (
              <AnimatedServiceCard
                key={service.slug}
                href={service.href}
                title={service.title}
                description={service.description || ''}
                iconSrc={getServiceIconSrc(service)}
                glowColorClassName={glowColors[index % 4]}
                size="sm"
              />
            ))}
          </div>

          <div className="flex justify-center">
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:w-1/2 md:gap-6">
              {services.slice(8, 10).map((service, index) => (
                <AnimatedServiceCard
                  key={service.slug}
                  href={service.href}
                  title={service.title}
                  description={service.description || ''}
                  iconSrc={getServiceIconSrc(service)}
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
