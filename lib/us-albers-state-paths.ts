import { geoAlbersUsa, geoPath as d3GeoPath } from 'd3-geo';
import type * as GeoJSON from 'geojson';
import { feature } from 'topojson-client';

import usTopo from '@/lib/data/us-states-10m.json';

const MAP_WIDTH = 960;
const MAP_HEIGHT = 600;
const MAP_PAD = 4;

const NAME_TO_CODE: Record<string, string> = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  'District of Columbia': 'DC',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
};

/** Label anchor in SVG user units (same space as `d`). */
export type UsStatePath = {
  code: string;
  name: string;
  d: string;
  labelX: number;
  labelY: number;
  /** Approximate map area — smaller states get a smaller label size in the SVG. */
  labelFont: number;
};

export const US_ALBERS_MAP_VIEWBOX = { width: MAP_WIDTH, height: MAP_HEIGHT };

/** States where a smaller abbreviation fits better (dense Northeast, HI, DC). */
const COMPACT_LABEL_PX = new Set([
  'CT',
  'DC',
  'DE',
  'HI',
  'MA',
  'MD',
  'NH',
  'NJ',
  'RI',
  'VT',
]);

let cached: UsStatePath[] | null = null;

export function getUsStateSvgPaths(): UsStatePath[] {
  if (cached) {
    return cached;
  }
  const topo = usTopo as unknown as Parameters<typeof feature>[0];
  const stateObject = (usTopo as { objects: { states: Parameters<typeof feature>[1] } }).objects
    .states;
  const statesFc = feature(topo, stateObject) as GeoJSON.FeatureCollection;
  const features = statesFc.features.filter(
    (f): f is GeoJSON.Feature<GeoJSON.Geometry, { name?: string }> =>
      Boolean(f.properties && NAME_TO_CODE[String(f.properties.name)]),
  );
  const fc: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features };
  const projection = geoAlbersUsa().fitExtent(
    [
      [MAP_PAD, MAP_PAD],
      [MAP_WIDTH - MAP_PAD, MAP_HEIGHT - MAP_PAD],
    ],
    fc,
  );
  const path = d3GeoPath().projection(projection);
  const built: UsStatePath[] = [];
  for (const f of features) {
    const name = String(f.properties?.name ?? '');
    const code = NAME_TO_CODE[name];
    const d = path(f);
    if (!code || !d) continue;
    const [[bx0, by0], [bx1, by1]] = path.bounds(f);
    const boxArea = Math.max(1, (bx1 - bx0) * (by1 - by0));
    const [labelX, labelY] = path.centroid(f);
    let font = 11;
    if (COMPACT_LABEL_PX.has(code)) font = 8;
    else if (boxArea < 2200) font = 9;
    else if (boxArea > 12000) font = 13;
    built.push({ code, name, d, labelX, labelY, labelFont: font });
  }
  cached = built;
  return built;
}
