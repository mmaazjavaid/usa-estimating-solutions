'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CarouselApi } from '@/components/ui/carousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

const services = [
  {
    title: 'Cost\nEstimation',
    description:
      'Accurate cost estimates to help you budget confidently and submit competitive bids.',
    slug: 'cost-estimation',
    href: '/cost-estimation',
  },
  {
    title: 'Construction\nEstimation',
    description:
      'Detailed construction estimates covering labor, materials, equipment, and overhead.',
    slug: 'construction-estimation',
    href: '/construction-estimation',
  },
  {
    title: 'Construction\nTakeoff',
    description:
      'Precise quantity takeoffs that eliminate guesswork and improve bid accuracy.',
    slug: 'construction-takeoff',
    href: '/construction-takeoff',
  },
  {
    title: 'Residential\nEstimating',
    description:
      'Reliable estimating solutions for residential projects of all sizes.',
    slug: 'residential-estimating',
    href: '/residential-estimation',
  },
  {
    title: 'Commercial\nEstimating',
    description:
      'Comprehensive commercial estimates designed for complex, large-scale projects.',
    slug: 'commercial-estimating',
    href: '/commercial-estimating',
  },
  {
    title: 'CPM\nScheduling',
    description:
      'Professional CPM schedules that optimize timelines and project coordination.',
    slug: 'cpm-scheduling',
    href: '/cpm-scheduling',
  },
  {
    title: 'Industrial\nEstimating',
    description:
      'Accurate industrial estimates aligned with strict standards and project demands.',
    slug: 'industrial-estimating',
    href: '/industrial-estimating',
  },
  {
    title: 'Preliminary\nEstimating',
    description:
      'Early-stage cost insights to support planning and feasibility decisions.',
    slug: 'preliminary-estimating',
    href: '/preliminary-estimating',
  },
  {
    title: '3D\nVisualization',
    description:
      'Bring designs to life with detailed 3D models that clearly communicate form, layout, and intent.',
    slug: '3d-visualization',
    href: '/3d-visualization',
  },
  {
    title: 'Interior\nDesign',
    description:
      'Create functional, well-planned interior spaces that support workflow, comfort, and efficiency.',
    slug: 'interior-design-services',
    href: '/interior-design-services',
  },
];

const glowColors = [
  'bg-[#53C0AE]',
  'bg-[rgba(164,107,238,0.9)]',
  'bg-[rgba(237,44,76,0.85)]',
  'bg-[rgba(234,126,55,0.9)]',
];

type ServiceCardProps = {
  slug: string;
  title: string;
  description: string;
  href: string;
  glowColor: string;
};

export default function ServiceCard({
  slug,
  title,
  description,
  href,
  glowColor,
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="group relative block h-[420px] w-full overflow-hidden rounded-[22px] border-[3px] border-white/60 bg-white/[0.03] transition-all duration-700 ease-out hover:border-white/10"
    >
      {/* Glow */}
      <div
        className={`pointer-events-none absolute left-[180px] top-[118px] h-[179px] w-[354px] blur-[62px]
          opacity-0 scale-75 transition-all duration-700 ease-out delay-100
          group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-x-4
          ${glowColor}`}
      />

      {/* Icon wrapper */}
      <div className="absolute left-[30px] top-[33px] origin-top-left transition-all duration-700 ease-out delay-100 group-hover:scale-[0.68] group-hover:opacity-60">
        <Image
          src={`/images/services-section/${slug}.svg`}
          alt=""
          width={182}
          height={188}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 px-[30px] pb-[30px]">
        <h3 className="whitespace-pre-line text-left text-[32px] font-extrabold leading-[40px] transition-transform duration-700 ease-out delay-100 group-hover:-translate-y-1">
          {title}
        </h3>
        <p
          className="mt-3 overflow-hidden text-[16px] leading-[22px] text-white/80
          opacity-0 max-h-0 translate-y-3
          transition-all duration-700 ease-out delay-100
          group-hover:opacity-100 group-hover:max-h-28 group-hover:translate-y-0"
        >
          {description}
        </p>
      </div>
    </Link>
  );
}

export function ServicesSection() {
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
    <section className="bg-black py-20 text-white">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8 lg:px-10">
        <h2 className="mb-6 text-center text-3xl font-semibold md:text-4xl">
          Services
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-center text-sm leading-relaxed text-white/60 md:text-base">
          We provide professional construction estimating and quantity takeoff
          services designed to help you bid confidently, reduce overhead costs,
          and plan projects more efficiently. Using advanced estimating
          software, real-time pricing databases, and industry expertise, our
          estimators deliver accurate, reliable takeoffs tailored to your
          project{"'"}s scope, timeline, and budget.
        </p>

        <div className="relative mx-auto mb-10 w-full">
          <Carousel
            setApi={setApi}
            opts={{ align: 'start', containScroll: 'trimSnaps' }}
            className="relative"
          >
            <CarouselContent className="ml-0 pt-14 pb-16 md:pt-16 md:pb-16">
              {services.map((service, index) => (
                <CarouselItem
                  key={service.title}
                  className={`basis-[353px] min-w-[353px] pl-0 mr-10 last:mr-0 ${
                    index % 2 === 0 ? 'md:-translate-y-10' : 'md:translate-y-10'
                  }`}
                >
                  <ServiceCard
                    slug={service.slug}
                    title={service.title}
                    description={service.description}
                    href={service.href}
                    glowColor={glowColors[index % 4]}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Previous"
            className="absolute left-0 top-1/2 hidden -translate-x-10 -translate-y-1/2 items-center justify-center text-white/70 transition-colors hover:text-white disabled:opacity-0 md:flex"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Next"
            className="absolute right-0 top-1/2 hidden translate-x-10 -translate-y-1/2 items-center justify-center text-white/70 transition-colors hover:text-white disabled:opacity-0 md:flex"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          <div className="mt-8 flex items-center justify-center gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === selectedIndex
                    ? 'bg-white'
                    : 'border border-white/40 bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link
            href="/services"
            className="rounded-full border border-white/30 px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
          >
            Explore Services
          </Link>
        </div>
      </div>
    </section>
  );
}
