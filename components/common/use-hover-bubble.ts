'use client';

import {
  createElement,
  useRef,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  type MotionValue,
} from 'framer-motion';
import { usePageGlowTheme } from '@/components/ui/page-glow';

type UseHoverBubbleOptions = {
  stiffness?: number;
  damping?: number;
};

type UseHoverBubbleResult<T extends HTMLElement> = {
  ref: RefObject<T | null>;
  onMouseMove: (event: MouseEvent<T>) => void;
  x: MotionValue<number>;
  y: MotionValue<number>;
};

export function useHoverBubble<T extends HTMLElement = HTMLDivElement>(
  options: UseHoverBubbleOptions = {},
): UseHoverBubbleResult<T> {
  const { stiffness = 400, damping = 30 } = options;

  const ref = useRef<T | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useSpring(mouseX, { stiffness, damping });
  const y = useSpring(mouseY, { stiffness, damping });

  function onMouseMove(event: MouseEvent<T>) {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    mouseX.set(event.clientX - left);
    mouseY.set(event.clientY - top);
  }

  return { ref, onMouseMove, x, y };
}

type HoverBubbleLayerOptions = {
  /** When false, no bubble is rendered and mouse move is a no-op. */
  enabled?: boolean;
  /**
   * Optional: when omitted, the page accent color is used so the whole page
   * stays consistent across sections.
   */
  color?: string;
  size?: number;
  blur?: number;
  hoverOpacity?: number;
  className?: string;
  zIndexClassName?: string;
  gradientInnerStop?: number;
  gradientOuterStop?: number;
};

type UseHoverBubbleLayerResult<T extends HTMLElement> =
  UseHoverBubbleResult<T> & {
    bubble: ReactNode;
  };

export function useHoverBubbleLayer<T extends HTMLElement = HTMLDivElement>(
  layer: HoverBubbleLayerOptions,
  options: UseHoverBubbleOptions = {},
): UseHoverBubbleLayerResult<T> {
  const { ref, onMouseMove, x, y } = useHoverBubble<T>(options);
  const pageTheme = usePageGlowTheme();

  const {
    enabled = true,
    color = pageTheme.bubbleColor,
    size = 100,
    blur = 20,
    hoverOpacity = 0.45,
    zIndexClassName = 'z-10',
    className,
    gradientInnerStop = 30,
    gradientOuterStop = 80,
  } = layer;

  if (!enabled) {
    return { ref, onMouseMove: () => {}, x, y, bubble: null };
  }

  const bubble = createElement(motion.div, {
    className: `absolute ${zIndexClassName} pointer-events-none ${className ?? ''}`,
    style: {
      x,
      y,
      translateX: '-50%',
      translateY: '-50%',
      width: `${size}px`,
      height: `${size}px`,
      background: `radial-gradient(circle, ${color} ${gradientInnerStop}%, transparent ${gradientOuterStop}%)`,
      filter: `blur(${blur}px)`,
      opacity: 0,
    },
    variants: {
      hover: { opacity: hoverOpacity },
    },
  });

  return { ref, onMouseMove, x, y, bubble };
}
