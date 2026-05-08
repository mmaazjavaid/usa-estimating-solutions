'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import type { CursorGlowColors } from '@/components/ui/cursor-glow';
import { CursorGlow } from '@/components/ui/cursor-glow';

export type PageGlowTheme = {
  /** Colors for the multi-layer cursor-follow glow. */
  cursorGlow: CursorGlowColors;
  /** Accent color used by hover-bubble effects. */
  bubbleColor: string;
  /** Base hex accent used for fills/icons on the page. */
  accentHex: string;
};

const FALLBACK_THEME: PageGlowTheme = {
  cursorGlow: {
    primary: 'rgba(236, 129, 58, 0.32)',
    secondary: 'rgba(255, 149, 76, 0.26)',
    tertiary: 'rgba(230, 96, 28, 0.22)',
  },
  bubbleColor: 'rgba(236, 129, 58, 0.55)',
  accentHex: '#EC813A',
};

const PageGlowContext = createContext<PageGlowTheme | null>(null);

function hashStringToIndex(input: string, mod: number): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  const n = Math.abs(hash);
  return mod > 0 ? n % mod : 0;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const raw = hex.trim().replace(/^#/, '');
  const normalized =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  if (!/^[\da-fA-F]{6}$/.test(normalized)) return null;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return { r, g, b };
}

function rgbaFromHex(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(236, 129, 58, ${alpha})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function themeFromPath(pathname: string): PageGlowTheme {
  // Base palette requested by client: orange, red, yellow, purple.
  // (Hex values chosen to match the current visual language; tweak freely.)
  const basePalette = [
    { name: 'orange', hex: '#EC813A' },
    { name: 'red', hex: '#E11D48' },
    { name: 'yellow', hex: '#F59E0B' },
    { name: 'purple', hex: '#8B5CF6' },
  ] as const;

  const idx = hashStringToIndex(pathname || '/', basePalette.length);
  const chosen = basePalette[idx] ?? basePalette[0];
  void chosen?.name;

  return {
    cursorGlow: {
      primary: rgbaFromHex(chosen.hex, 0.32),
      secondary: rgbaFromHex(chosen.hex, 0.26),
      tertiary: rgbaFromHex(chosen.hex, 0.22),
    },
    bubbleColor: rgbaFromHex(chosen.hex, 0.55),
    accentHex: chosen.hex,
  };
}

export function PageGlowProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const theme = useMemo(() => themeFromPath(pathname), [pathname]);
  return <PageGlowContext.Provider value={theme}>{children}</PageGlowContext.Provider>;
}

export function usePageGlowTheme(): PageGlowTheme {
  return useContext(PageGlowContext) ?? FALLBACK_THEME;
}

/**
 * Wraps the whole app so every page/section gets the hover glow effect,
 * with a single consistent accent color per page.
 */
export function PageGlowShell({ children }: { children: React.ReactNode }) {
  return (
    <PageGlowProvider>
      <CursorGlow className="min-h-screen">{children}</CursorGlow>
    </PageGlowProvider>
  );
}

