'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
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

export function ServiceCard({
  slug,
  title,
  description,
  href,
  glowColor,
}: ServiceCardProps) {
  const ease = [0.16, 1, 0.3, 1] as const;

  const cardVariants: Variants = {
    initial: {
      borderColor: 'rgba(255, 255, 255, 0.6)',
    },
    hover: {
      borderColor: 'rgba(255, 255, 255, 0.15)',
      transition: { duration: 0.8, ease },
    },
  };

  const glowVariants: Variants = {
    initial: { opacity: 0, scale: 0.6, x: 20, y: 10 },
    hover: {
      opacity: 1,
      scale: 1,
      x: -20,
      y: -10,
      transition: {
        duration: 1.2,
        ease,
      },
    },
  };

  const iconVariants: Variants = {
    initial: { scale: 1, opacity: 1, y: 0 },
    hover: {
      scale: 0.65,
      opacity: 0.5,
      y: -5,
      transition: { duration: 0.8, ease },
    },
  };

  const descriptionVariants: Variants = {
    initial: {
      opacity: 0,
      height: 0,
      y: 20,
      marginTop: 0,
    },
    hover: {
      opacity: 1,
      height: 'auto',
      y: 0,
      marginTop: 12,
      transition: {
        duration: 0.8,
        ease,
        delay: 0.05,
      },
    },
  };

  return (
    <Link href={href} className="block w-full">
      <motion.div
        initial="initial"
        whileHover="hover"
        variants={cardVariants}
        className="relative h-[420px] w-full overflow-hidden rounded-[22px] border-[3px] bg-white/[0.03] backdrop-blur-[15px]"
      >
        {/* Animated Glow Background */}
        <motion.div
          variants={glowVariants}
          className={`pointer-events-none absolute left-[160px] top-[100px] h-[220px] w-[380px] blur-[70px] ${glowColor}`}
        />

        {/* Icon wrapper */}
        <motion.div
          variants={iconVariants}
          className="absolute left-[30px] top-[33px] origin-top-left"
        >
          <Image
            src={`/images/services-section/${slug}.svg`}
            alt=""
            width={160}
            height={165}
            priority
          />
        </motion.div>

        {/* Text Content */}
        <div className="absolute inset-x-0 bottom-0 px-[30px] pb-[35px] z-10">
          <h3 className="whitespace-pre-line text-left text-[28px] font-extrabold leading-[34px] text-white">
            {title}
          </h3>

          <motion.p
            variants={descriptionVariants}
            className="overflow-hidden text-[14px] leading-[20px] text-white/70 font-medium"
          >
            {description}
          </motion.p>
        </div>
      </motion.div>
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
    <section className="bg-black py-24 text-white overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-16">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            Services
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-white/50">
            We provide professional construction estimating and quantity takeoff
            services designed to help you bid confidently, reduce overhead
            costs, and plan projects more efficiently.
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
                  className={`pl-6 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 transition-transform duration-1000 ease-in-out ${
                    index % 2 === 0 ? 'md:-translate-y-6' : 'md:translate-y-6'
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
            href="/services"
            className="rounded-full border border-white/20 bg-white/5 px-10 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
          >
            Explore All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
