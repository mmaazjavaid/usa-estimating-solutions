'use client';

import { TradeHexIcon } from '@/components/cms/trade-hex-icon';
import { usePageGlowTheme } from '@/components/ui/page-glow';

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
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function clamp8(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  const to2 = (v: number) => clamp8(v).toString(16).padStart(2, '0');
  return `#${to2(r)}${to2(g)}${to2(b)}`.toUpperCase();
}

function darkenHex(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return rgbToHex({
    r: rgb.r * (1 - amount),
    g: rgb.g * (1 - amount),
    b: rgb.b * (1 - amount),
  });
}

export type TradeHeroHexVisualProps = {
  id: string;
  topColor?: string;
  layerColor?: string;
};

/**
 * Trade hero hex: page-accent colors, no mouse-follow bubble (hex already carries glow).
 */
export function TradeHeroHexVisual({ id, topColor, layerColor }: TradeHeroHexVisualProps) {
  const pageTheme = usePageGlowTheme();
  const derivedTop = topColor?.trim() || pageTheme.accentHex;
  const derivedLayer = layerColor?.trim() || darkenHex(derivedTop, 0.28);

  return (
    <div className="relative w-full max-w-[360px]" data-no-glow>
      <TradeHexIcon id={id} topColor={derivedTop} layerColor={derivedLayer} />
    </div>
  );
}
