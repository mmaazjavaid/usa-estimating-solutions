'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const works = [
  {
    src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop&q=80',
    alt: 'Construction blueprints',
    title: 'Electrical Estimate Sample',
  },
  {
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80',
    alt: 'Estimation dashboard',
    title: 'Estimate - Adams County Regional Medical Center',
  },
  {
    src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop&q=80',
    alt: 'Architect at desk',
    title: 'Division 9 - Finishes',
  },
  {
    src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop&q=80',
    alt: 'Modern architecture',
    title: 'Glass and Glazing Sample Estimate',
  },
];

export function OurWorks() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-6 text-center text-3xl font-bold text-foreground md:text-4xl">
          Our Works
        </h2>
        <p className="mx-auto mb-14 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
          Our estimators provide accurate quantity takeoffs and cost estimates
          across all CSI Division trades, supporting commercial, residential,
          and industrial projects. All estimates are prepared in strict
          compliance with U.S. construction codes, industry standards, and
          current pricing databases, ensuring your bids remain competitive,
          accurate, and aligned with market conditions.
        </p>

        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {works.map((work, index) => (
            <motion.div
              key={index}
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg bg-black"
            >
              {/* SHADOW OVERLAY: 
                Starts light (10%) and deepens to dark (60%) on hover 
                to make white text pop.
              */}
              <div className="absolute inset-0 z-10 bg-black/10 transition-all duration-500 group-hover:bg-black/60" />

              <motion.div
                variants={{
                  rest: { filter: 'grayscale(100%)' },
                  hover: { filter: 'grayscale(0%)' },
                }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full"
              >
                <Image
                  src={work.src}
                  alt={work.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </motion.div>

              {/* Centered Reveal Text */}
              <div className="absolute inset-0 z-20 flex items-center justify-center p-6 text-center">
                <motion.span
                  variants={{
                    rest: { opacity: 0, y: 15, filter: 'blur(4px)' },
                    hover: { opacity: 1, y: 0, filter: 'blur(0px)' },
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="font-serif text-lg font-medium text-white md:text-xl lg:text-2xl"
                >
                  {work.title}
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/our-works"
            className="rounded-full border border-foreground/30 px-8 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-foreground hover:text-background"
          >
            Explore More
          </Link>
        </div>
      </div>
    </section>
  );
}
