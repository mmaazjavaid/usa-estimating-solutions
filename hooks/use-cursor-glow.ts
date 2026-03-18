'use client';

import { type MouseEvent, useRef, useCallback } from 'react';

const GRID_ROWS = 5;
const GRID_COLS = 10;
const CURSOR_OFFSET_Y = 12;

function getBlockMetrics(row: number, col: number, blockIndex: number) {
  const phaseA = Math.sin((row + 1) * 0.9 + (col + 1) * 0.6);
  const phaseB = Math.cos((row + 1) * 0.7 - (col + 1) * 0.8);
  const phaseC = Math.sin((blockIndex + 1) * 0.45);
  const phaseD = Math.cos(row * 2.3 + col * 1.7 + blockIndex * 0.4);
  const phaseE = Math.sin(col * 2.1 + row * 1.9 - blockIndex * 0.3);
  const phaseF = Math.sin(row * 3.7 + col * 2.9 + blockIndex * 0.17);
  const phaseG = Math.cos(col * 2.7 + row * 3.1 - blockIndex * 0.23);

  const irregularity = (Math.sin(row * 2.7 + col * 1.3) + 1) / 2;
  const roundness = (Math.cos(blockIndex * 0.53 + row * 1.1) + 1) / 2;
  const chaos = Math.sin(blockIndex * 0.83 + row * 1.7 + col * 2.3);

  const radiusSpread = 28 + irregularity * 32;
  const radiusBias = (1 - roundness * 0.6) * radiusSpread;

  const r1 = 50 + phaseA * radiusSpread - phaseD * radiusBias + phaseF * 12;
  const r2 = 50 + phaseB * radiusSpread + phaseE * radiusBias - phaseG * 10;
  const r3 = 50 + phaseC * radiusSpread + phaseD * (radiusSpread * 0.9) + phaseG * 14;
  const r4 = 50 + phaseA * radiusSpread - phaseE * (radiusSpread * 0.8) - phaseF * 11;

  const r5 = 50 + phaseB * radiusSpread + phaseD * radiusBias + phaseF * 8;
  const r6 = 50 + phaseC * radiusSpread - phaseE * radiusBias - phaseG * 15;
  const r7 = 50 + phaseA * radiusSpread + phaseE * (radiusSpread * 1) + phaseD * 10;
  const r8 = 50 + phaseB * radiusSpread - phaseD * (radiusSpread * 0.7) + phaseF * 13;

  const r9 = 50 + phaseC * radiusSpread + phaseA * radiusBias - phaseG * 9;
  const r10 = 50 + phaseA * radiusSpread - phaseB * radiusBias + phaseF * 14;
  const r11 = 50 + phaseB * radiusSpread + phaseC * (radiusSpread * 0.85) - phaseD * 12;
  const r12 = 50 + phaseC * radiusSpread - phaseA * (radiusSpread * 0.9) + phaseE * 11;

  const clamp = (v: number) => Math.max(12, Math.min(88, v));

  return {
    primaryW: 460 + phaseA * 60 + phaseD * 55 + phaseF * 40,
    primaryH: 440 + phaseB * 58 - phaseD * 55 + phaseG * 38,
    secondaryW: 360 + phaseB * 48 + phaseE * 42 + phaseG * 32,
    secondaryH: 340 + phaseC * 46 - phaseE * 45 - phaseF * 28,
    tertiaryW: 300 + phaseC * 42 + phaseD * 38 + phaseF * 26,
    tertiaryH: 280 + phaseA * 40 - phaseE * 36 + phaseG * 24,
    rotationPrimary: phaseA * 28 + phaseD * 18 + chaos * 12,
    rotationSecondary: phaseB * -24 + phaseE * 14 - chaos * 10,
    rotationTertiary: phaseC * 22 - phaseD * 12 + chaos * 8,
    radiusPrimary: `${clamp(r1)}% ${clamp(r2)}% ${clamp(r3)}% ${clamp(r4)}%`,
    radiusSecondary: `${clamp(r5)}% ${clamp(r6)}% ${clamp(r7)}% ${clamp(r8)}%`,
    radiusTertiary: `${clamp(r9)}% ${clamp(r10)}% ${clamp(r11)}% ${clamp(r12)}%`,
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
