import type { CmsPageSection } from '@/lib/cms-sections/types';
import {
  SERVICE_MARKETING_SECTIONS_BY_SLUG,
  SERVICE_MARKETING_CTA_DATA,
} from '@/lib/cms-service-marketing-sections-data';

export { SERVICE_MARKETING_CTA_DATA };

/** Bump when default section shapes change so bootstrap can migrate template-based pages. */
export const SERVICE_MARKETING_SECTIONS_SCHEMA_VERSION = 2;

export const SERVICE_MARKETING_PAGES: {
  path: string;
  slug: string;
  name: string;
}[] = [
  { path: '/cost-estimation', slug: 'cost-estimation', name: 'Cost Estimation' },
  { path: '/construction-estimation', slug: 'construction-estimation', name: 'Construction Estimation' },
  { path: '/construction-takeoff', slug: 'construction-takeoff', name: 'Construction Takeoff' },
  { path: '/commercial-estimating', slug: 'commercial-estimating', name: 'Commercial Estimating' },
  { path: '/cpm-scheduling', slug: 'cpm-scheduling', name: 'CPM Scheduling' },
  { path: '/industrial-estimating', slug: 'industrial-estimating', name: 'Industrial Estimating' },
  { path: '/interior-design-services', slug: 'interior-design-services', name: 'Interior Design Services' },
  { path: '/preliminary-estimating', slug: 'preliminary-estimating', name: 'Preliminary Estimating' },
  { path: '/residential-estimation', slug: 'residential-estimation', name: 'Residential Estimation' },
  { path: '/3d-visualization', slug: '3d-visualization', name: '3D Visualization' },
];

export function buildServiceMarketingSections(slug: string): CmsPageSection[] {
  const sections = SERVICE_MARKETING_SECTIONS_BY_SLUG[slug];
  if (!sections) {
    return [];
  }
  return JSON.parse(JSON.stringify(sections)) as CmsPageSection[];
}
