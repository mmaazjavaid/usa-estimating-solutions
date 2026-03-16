'use client';

import { motion } from 'framer-motion';
import { useHoverBubbleLayer } from '@/components/common/use-hover-bubble';

interface TradeCardProps {
  label: string;
  description: string;
  glowColor: string;
}

export function TradeCard({ label, description, glowColor }: TradeCardProps) {
  const { ref, onMouseMove, bubble } = useHoverBubbleLayer<HTMLDivElement>({
    color: glowColor,
  });

  return (
    <motion.div
      ref={ref}
      initial="initial"
      whileHover="hover"
      onMouseMove={onMouseMove}
      className="relative overflow-hidden cursor-pointer"
      style={{
        width: '260px',
        height: '380px',
        borderRadius: '20px',
      }}
    >
      {/* Background Glass Layer */}
      <div
        className="absolute inset-0 z-20 border-2 border-white/10 pointer-events-none"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
        }}
      />

      {/* 1. STATIC BASE GLOW - Extra intense glow */}
      <motion.div
        className="absolute z-10 pointer-events-none"
        variants={{
          initial: { opacity: 1 },
          hover: { opacity: 0 },
        }}
        transition={{ duration: 0.4 }}
        style={{
          width: '140%',
          height: '120%',
          left: '-50%',
          bottom: '-20%',
          background: `radial-gradient(circle at 30% 82%, ${glowColor} 0%, ${glowColor} 35%, transparent 82%)`,
          filter: 'blur(25px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* 2. CIRCULAR MOUSE BUBBLE - Increased Fading */}
      {bubble}

      {/* TEXT CONTENT */}
      <div className="relative z-30 h-full w-full p-6 flex flex-col pointer-events-none">
        <motion.h3
          variants={{
            initial: { y: 0 },
            hover: { y: 140 },
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl font-extrabold text-white text-left whitespace-nowrap overflow-hidden text-ellipsis"
          style={{
            fontFamily: 'Manrope, sans-serif',
            width: '100%',
          }}
        >
          {label}
        </motion.h3>

        <motion.p
          variants={{
            initial: { opacity: 0, y: 180 },
            hover: { opacity: 1, y: 145 },
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-sm text-gray-200 text-left leading-tight"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            marginTop: '0',
          }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
}
