'use client';

import { useMemo } from 'react';

import { getUsStateSvgPaths, US_ALBERS_MAP_VIEWBOX } from '@/lib/us-albers-state-paths';

const PATH_CLASS =
  'stroke-[#1a1410]/45 transition-[fill,filter] duration-300 [vector-effect:non-scaling-stroke]';

type UsAlbersMapProps = {
  /** CMS: each state is an SVG <a> with correct geometry. Homepage: plain paths (no links). */
  interactive?: boolean;
  stateHrefs?: Record<string, string>;
};

export function UsAlbersMap({ interactive = false, stateHrefs }: UsAlbersMapProps) {
  const paths = useMemo(() => getUsStateSvgPaths(), []);

  const vb = US_ALBERS_MAP_VIEWBOX;

  return (
    <svg
      viewBox={`0 0 ${vb.width} ${vb.height}`}
      className="h-full w-full overflow-visible"
      role="img"
      aria-label="United States map"
      preserveAspectRatio="xMidYMid meet"
    >
      {paths.map(({ code, d, name }) => {
        const a11yLabel = name;
        const pathNode = (
          <path
            d={d}
            strokeWidth={0.65}
            className={`${PATH_CLASS} fill-[#9a7b52]/92 hover:fill-[#C5A16E] hover:drop-shadow-[0_0_14px_rgba(197,161,110,0.5)] ${
              interactive ? 'cursor-pointer' : 'cursor-default'
            }`}
          />
        );

        if (interactive && stateHrefs) {
          const href = stateHrefs[code] ?? '/';
          const ext = href.startsWith('http://') || href.startsWith('https://');
          return (
            <a
              key={code}
              href={href}
              aria-label={a11yLabel}
              title={a11yLabel}
              data-state={code}
              {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="outline-none focus-visible:outline-none [&:focus-visible_path]:stroke-[#f5e6d3] [&:focus-visible_path]:stroke-[2.5px]"
            >
              <title>{a11yLabel}</title>
              {pathNode}
            </a>
          );
        }

        return <g key={code}>{pathNode}</g>;
      })}
      <g className="pointer-events-none" aria-hidden>
        {paths.map(({ code, labelX, labelY, labelFont }) => (
          <text
            key={`label-${code}`}
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(255,250,245,0.95)"
            stroke="rgba(15,10,8,0.55)"
            strokeWidth={0.45}
            paintOrder="stroke fill"
            style={{
              fontSize: labelFont,
              fontWeight: 700,
              fontFamily:
                'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
            }}
          >
            {code}
          </text>
        ))}
      </g>
    </svg>
  );
}
