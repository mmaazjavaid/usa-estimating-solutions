/**
 * Services mega-menu column layout — single source of truth with the navbar
 * (`HeaderClient`) and live service carousels (`getLiveServicesForCarousel`).
 */
export type DropdownLink = { label: string; href: string };
export type DropdownGroup = { title: DropdownLink; items: DropdownLink[] };

export const SERVICES_DROPDOWN_COLUMNS: DropdownGroup[][] = [
  [
    {
      title: { label: 'Cost Estimation', href: '/cost-estimation' },
      items: [
        { label: 'Construction Estimation', href: '/construction-estimation' },
        { label: 'Construction Takeoff', href: '/construction-takeoff' },
      ],
    },
  ],
  [
    {
      title: {
        label: 'Residential Estimating',
        href: '/residential-estimation',
      },
      items: [
        { label: 'Commercial Estimating', href: '/commercial-estimating' },
        { label: 'Industrial Estimating', href: '/industrial-estimating' },
      ],
    },
  ],
  [
    {
      title: {
        label: 'Preliminary Estimating',
        href: '/preliminary-estimating',
      },
      items: [
        { label: 'CPM Scheduling', href: '/cpm-scheduling' },
        { label: '3D Modeling & Visualization', href: '/3d-visualization' },
      ],
    },
  ],
  [
    {
      title: {
        label: 'Interior Design Services',
        href: '/interior-design-services',
      },
      items: [],
    },
  ],
];
