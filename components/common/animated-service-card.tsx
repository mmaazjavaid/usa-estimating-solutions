'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';

import { cmsClampClassNames } from '@/components/ui/cms-clamp';
import { cn } from '@/lib/utils';

export type AnimatedServiceCardProps = {
  href: string;
  title: string;
  description: string;
  iconSrc: string;
  iconAlt?: string;
  glowColorClassName: string;
  imagePriority?: boolean;
  verticalOffset?: 'none' | 'up' | 'down';
  size?: 'default' | 'sm';
};

export function AnimatedServiceCard({
  href,
  title,
  description,
  iconSrc,
  iconAlt = '',
  glowColorClassName,
  imagePriority = false,
  verticalOffset = 'none',
  size = 'default',
}: AnimatedServiceCardProps) {
  const ease = [0.16, 1, 0.3, 1] as const;

  const verticalOffsetClassName =
    verticalOffset === 'up'
      ? 'md:-translate-y-6'
      : verticalOffset === 'down'
        ? 'md:translate-y-6'
        : '';

  const containerClassName =
    size === 'sm'
      ? 'relative h-[360px] w-full overflow-hidden rounded-[22px] border-[3px] bg-white/[0.03] backdrop-blur-[15px]'
      : 'relative h-[420px] w-full overflow-hidden rounded-[22px] border-[3px] bg-white/[0.03] backdrop-blur-[15px]';

  const glowClassName =
    size === 'sm'
      ? `pointer-events-none absolute left-[130px] top-[85px] h-[200px] w-[330px] blur-[65px] ${glowColorClassName}`
      : `pointer-events-none absolute left-[160px] top-[100px] h-[220px] w-[380px] blur-[70px] ${glowColorClassName}`;

  const iconSize = size === 'sm' ? 140 : 160;
  const iconHeight = size === 'sm' ? 145 : 165;
  const contentClassName =
    size === 'sm'
      ? 'absolute inset-x-0 bottom-0 z-10 px-[26px] pb-[28px]'
      : 'absolute inset-x-0 bottom-0 z-10 px-[30px] pb-[35px]';
  const titleClassName =
    size === 'sm'
      ? cn(
          'whitespace-pre-line text-left text-[24px] font-extrabold leading-[30px] text-white',
          cmsClampClassNames(2),
        )
      : cn(
          'whitespace-pre-line text-left text-[28px] font-extrabold leading-[34px] text-white',
          cmsClampClassNames(2),
        );
  const descriptionClassName =
    size === 'sm'
      ? cn(
          'overflow-hidden text-[13px] font-medium leading-[19px] text-white/70',
          cmsClampClassNames(4),
        )
      : cn(
          'overflow-hidden text-[14px] font-medium leading-[20px] text-white/70',
          cmsClampClassNames(4),
        );

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
      maxHeight: 0,
      y: 20,
      marginTop: 0,
    },
    hover: {
      opacity: 1,
      maxHeight: 96,
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
    <Link href={href} className={`block w-full ${verticalOffsetClassName}`}>
      <motion.div
        initial="initial"
        whileHover="hover"
        variants={cardVariants}
        className={containerClassName}
      >
        <motion.div
          variants={glowVariants}
          className={glowClassName}
        />

        <motion.div
          variants={iconVariants}
          className="absolute left-[30px] top-[33px] origin-top-left"
        >
          <Image
            src={iconSrc}
            alt={iconAlt}
            width={iconSize}
            height={iconHeight}
            priority={imagePriority}
          />
        </motion.div>

        <div className={contentClassName}>
          <h3 className={titleClassName}>{title}</h3>

          <motion.p
            variants={descriptionVariants}
            className={descriptionClassName}
          >
            {description}
          </motion.p>
        </div>
      </motion.div>
    </Link>
  );
}
