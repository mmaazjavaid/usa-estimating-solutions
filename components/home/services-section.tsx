'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CarouselApi } from '@/components/ui/carousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { AnimatedServiceCard } from '@/components/common/animated-service-card';
import { DEFAULT_SERVICES } from '@/lib/cms-defaults';
import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

export type HomeServiceItem = {
  slug: string;
  title: string;
  description: string;
  href: string;
  image?: string;
};

const glowColors = [
  'bg-[#53C0AE]',
  'bg-[rgba(164,107,238,0.9)]',
  'bg-[rgba(237,44,76,0.85)]',
  'bg-[rgba(234,126,55,0.9)]',
];

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

function getServiceIconSrc(service: HomeServiceItem) {
  if (service.image?.trim()) {
    return service.image.trim();
  }

  const resolvedSlug = iconSlugAliases[service.slug] ?? service.slug;
  if (builtInIconSlugs.has(resolvedSlug)) {
    return `/images/services-section/${resolvedSlug}.svg`;
  }

  return '/placeholder.svg';
}

const DEFAULT_INTRO =
  "We provide professional construction estimating and quantity takeoff services designed to help you bid confidently, reduce overhead costs, and plan projects more efficiently. Using advanced estimating software, real-time pricing databases, and industry expertise, our estimators deliver accurate, reliable takeoffs tailored to your project's scope, timeline, and budget.";

export function ServicesSection({
  services = DEFAULT_SERVICES.map((service) => ({
    slug: service.slug,
    title: service.name,
    description: service.shortDescription,
    href: service.path,
    image: service.image,
  })),
  sectionTitle = 'Services',
  intro = DEFAULT_INTRO,
  exploreHref = '/services',
  exploreLabel = 'Explore All Services',
  sectionTitleTypography,
  introTypography,
}: {
  services?: HomeServiceItem[];
  sectionTitle?: string;
  intro?: string;
  exploreHref?: string;
  exploreLabel?: string;
  sectionTitleTypography?: CmsTextTypography;
  introTypography?: CmsTextTypography;
}) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    const update = () => {
      setSelectedIndex(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    setScrollSnaps(api.scrollSnapList());
    update();

    api.on('select', update);
    api.on('reInit', () => {
      setScrollSnaps(api.scrollSnapList());
      update();
    });

    return () => {
      api.off('select', update);
    };
  }, [api]);

  return (
    <section className="bg-black py-24 text-white overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-16">
        <div className="mb-16 flex flex-col items-center text-center">
          <h2
            className={cn(
              'mb-6 text-4xl font-bold tracking-tight md:text-5xl',
              sectionTitleTypography?.className,
            )}
            style={sectionTitleTypography?.style}
          >
            {sectionTitle}
          </h2>
          <p
            className={cn('max-w-3xl text-base leading-relaxed text-white', introTypography?.className)}
            style={introTypography?.style}
          >
            {intro}
          </p>
        </div>

        <div className="relative w-full">
          <Carousel
            setApi={setApi}
            opts={{ align: 'start', containScroll: 'trimSnaps' }}
            className="w-full"
          >
            <CarouselContent className="-ml-6 py-20">
              {services.map((service, index) => (
                <CarouselItem
                  key={service.slug}
                  /* Updated basis to fit 4 cards on desktop, 2 on tablet, 1 on mobile */
                  className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 transition-transform duration-1000 ease-in-out"
                >
                  <AnimatedServiceCard
                    title={service.title}
                    description={service.description}
                    href={service.href}
                    iconSrc={getServiceIconSrc(service)}
                    glowColorClassName={glowColors[index % 4]}
                    verticalOffset={index % 2 === 0 ? 'up' : 'down'}
                    imagePriority
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Navigation Controls */}
          <div className="hidden xl:block">
            <button
              onClick={() => api?.scrollPrev()}
              disabled={!canScrollPrev}
              className="absolute -left-16 top-1/2 -translate-y-1/2 p-2 text-white/40 transition-all hover:text-white disabled:opacity-0"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              disabled={!canScrollNext}
              className="absolute -right-16 top-1/2 -translate-y-1/2 p-2 text-white/40 transition-all hover:text-white disabled:opacity-0"
            >
              <ChevronRight className="h-10 w-10" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="mt-12 flex items-center justify-center gap-3">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-1.5 transition-all duration-500 rounded-full ${
                  index === selectedIndex ? 'w-10 bg-white' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-20 flex justify-center">
          <Link
            href={exploreHref}
            className="rounded-full border border-white/20 bg-white/5 px-10 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
          >
            {exploreLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
