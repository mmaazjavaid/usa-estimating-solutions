'use client';

import { type MouseEvent, useRef, useCallback } from 'react';

const CURSOR_OFFSET_Y = 12;

export function useCursorGlow() {
  const primaryRef = useRef<HTMLDivElement | null>(null);
  const secondaryRef = useRef<HTMLDivElement | null>(null);
  const tertiaryRef = useRef<HTMLDivElement | null>(null);

  const hideGlow = useCallback(() => {
    if (!primaryRef.current || !secondaryRef.current || !tertiaryRef.current) return;
    primaryRef.current.style.opacity = '0';
    secondaryRef.current.style.opacity = '0';
    tertiaryRef.current.style.opacity = '0';
  }, []);

  const moveGlow = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!primaryRef.current || !secondaryRef.current || !tertiaryRef.current) return;

      if (
        event.target instanceof Element &&
        event.target.closest('[data-no-glow]')
      ) {
        hideGlow();
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const cursorX = x;
      const cursorY = y + CURSOR_OFFSET_Y;

      primaryRef.current.style.left = `${cursorX}px`;
      primaryRef.current.style.top = `${cursorY}px`;
      secondaryRef.current.style.left = `${cursorX}px`;
      secondaryRef.current.style.top = `${cursorY}px`;
      tertiaryRef.current.style.left = `${cursorX}px`;
      tertiaryRef.current.style.top = `${cursorY}px`;

      primaryRef.current.style.opacity = '1';
      secondaryRef.current.style.opacity = '1';
      tertiaryRef.current.style.opacity = '1';
    },
    [hideGlow],
  );

  return {
    primaryRef,
    secondaryRef,
    tertiaryRef,
    onMouseEnter: moveGlow,
    onMouseMove: moveGlow,
    onMouseLeave: hideGlow,
  };
}
