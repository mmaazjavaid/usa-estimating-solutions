'use client';

import { useCursorGlow } from '@/hooks/use-cursor-glow';

export type CursorGlowColors = {
  primary: string;
  secondary: string;
  tertiary: string;
};

const DEFAULT_COLORS: CursorGlowColors = {
  primary: 'rgba(236, 129, 58, 0.18)',
  secondary: 'rgba(255, 149, 76, 0.14)',
  tertiary: 'rgba(230, 96, 28, 0.12)',
};

function withAlpha(rgba: string, alpha: number): string {
  return rgba.replace(/,\s*[\d.]+\)$/, `, ${alpha})`);
}

type CursorGlowProps = {
  children: React.ReactNode;
  colors?: CursorGlowColors;
  className?: string;
};

export function CursorGlow({ children, colors = DEFAULT_COLORS, className }: CursorGlowProps) {
  const {
    primaryRef,
    secondaryRef,
    tertiaryRef,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
  } = useCursorGlow();

  return (
    <div
      className={`relative ${className ?? ''}`}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
      <div className="pointer-events-none absolute inset-0 overflow-visible">
        <div
          ref={primaryRef}
          className="absolute h-[370px] w-[370px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-400"
          style={{
            background: `radial-gradient(circle, ${colors.primary} 0%, ${withAlpha(colors.primary, 0.05)} 42%, transparent 72%)`,
            filter: 'blur(30px) saturate(1.14)',
            mixBlendMode: 'screen',
            willChange:
              'left, top, width, height, opacity, transform, border-radius',
            transition:
              'left 420ms cubic-bezier(0.22, 1, 0.36, 1), top 420ms cubic-bezier(0.22, 1, 0.36, 1), width 320ms ease-out, height 320ms ease-out, transform 320ms ease-out, border-radius 360ms ease-out, opacity 220ms ease-out',
          }}
        />
        <div
          ref={secondaryRef}
          className="absolute h-[285px] w-[285px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-400"
          style={{
            background: `radial-gradient(circle, ${colors.secondary} 0%, ${withAlpha(colors.secondary, 0.04)} 46%, transparent 74%)`,
            filter: 'blur(24px)',
            mixBlendMode: 'screen',
            willChange:
              'left, top, width, height, opacity, transform, border-radius',
            transition:
              'left 460ms cubic-bezier(0.22, 1, 0.36, 1), top 460ms cubic-bezier(0.22, 1, 0.36, 1), width 340ms ease-out, height 340ms ease-out, transform 340ms ease-out, border-radius 360ms ease-out, opacity 220ms ease-out',
          }}
        />
        <div
          ref={tertiaryRef}
          className="absolute h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-400"
          style={{
            background: `radial-gradient(circle, ${colors.tertiary} 0%, ${withAlpha(colors.tertiary, 0.03)} 50%, transparent 76%)`,
            filter: 'blur(22px)',
            mixBlendMode: 'screen',
            willChange:
              'left, top, width, height, opacity, transform, border-radius',
            transition:
              'left 500ms cubic-bezier(0.22, 1, 0.36, 1), top 500ms cubic-bezier(0.22, 1, 0.36, 1), width 360ms ease-out, height 360ms ease-out, transform 360ms ease-out, border-radius 380ms ease-out, opacity 220ms ease-out',
          }}
        />
      </div>
    </div>
  );
}
