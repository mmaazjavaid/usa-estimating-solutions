export const DEFAULT_PAGE_DEFINITIONS = [
  { name: 'Home', slug: '/', path: '/' },
  { name: 'About', slug: 'about', path: '/about' },
  { name: 'Contact', slug: 'contact', path: '/contact' },
  { name: 'Services', slug: 'services', path: '/services' },
  { name: 'Trades', slug: 'trades', path: '/trades' },
  { name: 'Our Works', slug: 'our-works', path: '/our-works' },
  { name: 'Prices', slug: 'prices', path: '/prices' },
  {
    name: 'Cost Estimation',
    slug: 'cost-estimation',
    path: '/cost-estimation',
  },
  {
    name: 'Construction Estimation',
    slug: 'construction-estimation',
    path: '/construction-estimation',
  },
  {
    name: 'Construction Takeoff',
    slug: 'construction-takeoff',
    path: '/construction-takeoff',
  },
  {
    name: 'Commercial Estimating',
    slug: 'commercial-estimating',
    path: '/commercial-estimating',
  },
  {
    name: 'CPM Scheduling',
    slug: 'cpm-scheduling',
    path: '/cpm-scheduling',
  },
  {
    name: 'Industrial Estimating',
    slug: 'industrial-estimating',
    path: '/industrial-estimating',
  },
  {
    name: 'Interior Design Services',
    slug: 'interior-design-services',
    path: '/interior-design-services',
  },
  {
    name: 'Preliminary Estimating',
    slug: 'preliminary-estimating',
    path: '/preliminary-estimating',
  },
  {
    name: 'Residential Estimation',
    slug: 'residential-estimation',
    path: '/residential-estimation',
  },
  {
    name: '3D Visualization',
    slug: '3d-visualization',
    path: '/3d-visualization',
  },
  {
    name: 'Trade - Exterior',
    slug: 'trade-exterior',
    path: '/trades/exterior',
  },
  {
    name: 'Trade - Interior',
    slug: 'trade-interior',
    path: '/trades/interior',
  },
  {
    name: 'Trade - MEP',
    slug: 'trade-mep',
    path: '/trades/mep',
  },
  {
    name: 'Trade - Structural',
    slug: 'trade-structural',
    path: '/trades/structural',
  },
  {
    name: 'Blogs',
    slug: 'blogs',
    path: '/blogs',
  },
] as const;

export const DEFAULT_CONTACT = {
  emails: ['info@usaestimatingsolutions.com'],
  phones: ['+1 (716) 226-1302'],
  address: 'Brooklyn, NY 11222, USA',
};

export const DEFAULT_SERVICES = [
  {
    name: 'Cost Estimation',
    slug: 'cost-estimation',
    path: '/cost-estimation',
    shortDescription:
      'Accurate cost estimates to help you budget confidently and submit competitive bids.',
    image: '/images/services-section/cost-estimation.svg',
    imageAlt: 'Cost estimation',
  },
  {
    name: 'Construction Estimation',
    slug: 'construction-estimation',
    path: '/construction-estimation',
    shortDescription:
      'Detailed construction estimates covering labor, materials, equipment, and overhead.',
    image: '/images/services-section/construction-estimation.svg',
    imageAlt: 'Construction estimation',
  },
  {
    name: 'Construction Takeoff',
    slug: 'construction-takeoff',
    path: '/construction-takeoff',
    shortDescription:
      'Precise quantity takeoffs that eliminate guesswork and improve bid accuracy.',
    image: '/images/services-section/construction-takeoff.svg',
    imageAlt: 'Construction takeoff',
  },
  {
    name: 'Residential Estimation',
    slug: 'residential-estimation',
    path: '/residential-estimation',
    shortDescription:
      'Reliable estimating solutions for residential projects of all sizes.',
    image: '/images/services-section/residential-estimating.svg',
    imageAlt: 'Residential estimation',
  },
  {
    name: 'Commercial Estimating',
    slug: 'commercial-estimating',
    path: '/commercial-estimating',
    shortDescription:
      'Comprehensive commercial estimates designed for complex, large-scale projects.',
    image: '/images/services-section/commercial-estimating.svg',
    imageAlt: 'Commercial estimating',
  },
  {
    name: 'Industrial Estimating',
    slug: 'industrial-estimating',
    path: '/industrial-estimating',
    shortDescription:
      'Accurate industrial estimates aligned with strict standards and project demands.',
    image: '/images/services-section/industrial-estimating.svg',
    imageAlt: 'Industrial estimating',
  },
  {
    name: 'Preliminary Estimating',
    slug: 'preliminary-estimating',
    path: '/preliminary-estimating',
    shortDescription:
      'Early-stage cost insights to support planning and feasibility decisions.',
    image: '/images/services-section/preliminary-estimating.svg',
    imageAlt: 'Preliminary estimating',
  },
  {
    name: 'CPM Scheduling',
    slug: 'cpm-scheduling',
    path: '/cpm-scheduling',
    shortDescription:
      'Professional CPM schedules that optimize timelines and project coordination.',
    image: '/images/services-section/cpm-scheduling.svg',
    imageAlt: 'CPM scheduling',
  },
  {
    name: '3D Visualization',
    slug: '3d-visualization',
    path: '/3d-visualization',
    shortDescription:
      'Bring designs to life with detailed 3D models that clearly communicate intent.',
    image: '/images/services-section/3d-visualization.svg',
    imageAlt: '3D visualization',
  },
  {
    name: 'Interior Design Services',
    slug: 'interior-design-services',
    path: '/interior-design-services',
    shortDescription:
      'Create functional, well-planned interior spaces for comfort and efficiency.',
    image: '/images/services-section/interior-design-services.svg',
    imageAlt: 'Interior design services',
  },
] as const;
