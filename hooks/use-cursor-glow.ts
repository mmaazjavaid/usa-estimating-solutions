'use client';

import { type MouseEvent, useRef, useCallback } from 'react';

const GRID_ROWS = 5;
const GRID_COLS = 10;
const CURSOR_OFFSET_Y = 12;

function getBlockMetrics(row: number, col: number, blockIndex: number) {
  const phaseA = Math.sin((row + 1) * 0.9 + (col + 1) * 0.6);
  const phaseB = Math.cos((row + 1) * 0.7 - (col + 1) * 0.8);
  const phaseC = Math.sin((blockIndex + 1) * 0.45);

  return {
    primaryW: 380 + phaseA * 38,
    primaryH: 365 + phaseB * 36,
    secondaryW: 295 + phaseB * 30,
    secondaryH: 278 + phaseC * 28,
    tertiaryW: 245 + phaseC * 24,
    tertiaryH: 228 + phaseA * 22,
    rotationPrimary: phaseA * 14,
    rotationSecondary: phaseB * -12,
    rotationTertiary: phaseC * 10,
    radiusPrimary: `${48 + phaseA * 16}% ${52 + phaseB * 12}% ${50 + phaseC * 14}% ${50 + phaseA * 10}%`,
    radiusSecondary: `${52 + phaseB * 14}% ${48 + phaseC * 10}% ${54 + phaseA * 12}% ${46 + phaseB * 12}%`,
    radiusTertiary: `${50 + phaseC * 10}% ${50 + phaseA * 12}% ${46 + phaseB * 11}% ${54 + phaseC * 9}%`,
  };
}

export function useCursorGlow() {
  const primaryRef = useRef<HTMLDivElement | null>(null);
  const secondaryRef = useRef<HTMLDivElement | null>(null);
  const tertiaryRef = useRef<HTMLDivElement | null>(null);
  const activeBlockRef = useRef<string | null>(null);

  const moveGlow = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (!primaryRef.current || !secondaryRef.current || !tertiaryRef.current) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const blockWidth = rect.width / GRID_COLS;
    const blockHeight = rect.height / GRID_ROWS;
    const col = Math.min(GRID_COLS - 1, Math.max(0, Math.floor(x / blockWidth)));
    const row = Math.min(GRID_ROWS - 1, Math.max(0, Math.floor(y / blockHeight)));
    const blockKey = `${row}-${col}`;

    const blockChanged = activeBlockRef.current !== blockKey;
    activeBlockRef.current = blockKey;

    const cursorX = x;
    const cursorY = y + CURSOR_OFFSET_Y;

    primaryRef.current.style.left = `${cursorX}px`;
    primaryRef.current.style.top = `${cursorY}px`;
    secondaryRef.current.style.left = `${cursorX}px`;
    secondaryRef.current.style.top = `${cursorY}px`;
    tertiaryRef.current.style.left = `${cursorX}px`;
    tertiaryRef.current.style.top = `${cursorY}px`;

    if (blockChanged) {
      const metrics = getBlockMetrics(row, col, row * GRID_COLS + col);

      primaryRef.current.style.width = `${metrics.primaryW}px`;
      primaryRef.current.style.height = `${metrics.primaryH}px`;
      primaryRef.current.style.transform = `rotate(${metrics.rotationPrimary}deg)`;
      primaryRef.current.style.borderRadius = metrics.radiusPrimary;

      secondaryRef.current.style.width = `${metrics.secondaryW}px`;
      secondaryRef.current.style.height = `${metrics.secondaryH}px`;
      secondaryRef.current.style.transform = `rotate(${metrics.rotationSecondary}deg)`;
      secondaryRef.current.style.borderRadius = metrics.radiusSecondary;

      tertiaryRef.current.style.width = `${metrics.tertiaryW}px`;
      tertiaryRef.current.style.height = `${metrics.tertiaryH}px`;
      tertiaryRef.current.style.transform = `rotate(${metrics.rotationTertiary}deg)`;
      tertiaryRef.current.style.borderRadius = metrics.radiusTertiary;
    }

    primaryRef.current.style.opacity = '1';
    secondaryRef.current.style.opacity = '1';
    tertiaryRef.current.style.opacity = '1';
  }, []);

  const hideGlow = useCallback(() => {
    if (!primaryRef.current || !secondaryRef.current || !tertiaryRef.current) return;
    primaryRef.current.style.opacity = '0';
    secondaryRef.current.style.opacity = '0';
    tertiaryRef.current.style.opacity = '0';
    activeBlockRef.current = null;
  }, []);

  return {
    primaryRef,
    secondaryRef,
    tertiaryRef,
    onMouseEnter: moveGlow,
    onMouseMove: moveGlow,
    onMouseLeave: hideGlow,
  };
}
