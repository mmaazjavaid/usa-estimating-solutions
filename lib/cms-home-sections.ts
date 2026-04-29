import type { CmsPageSection } from '@/lib/cms-sections/types';

/**
 * Full default homepage sections — matches former static `app/page.tsx` / component defaults
 * so admin fields are pre-filled and `/` is truly CMS-driven (not “empty data + component defaults”).
 */
export const HOME_PAGE_SECTIONS: CmsPageSection[] = [
  {
    key: 'home-hero',
    type: 'site_hero',
    order: 0,
    data: {
      headline:
        'Bid <span class="text-animated-gradient text-animated-gradient--phase-0">Power</span>. Price <span class="text-animated-gradient text-animated-gradient--phase-2">smarter</span>. Win more work.',
      subtitle:
        'We provide professional construction estimating services and detailed material takeoff solutions.',
      primaryCta: {
        kind: 'internal',
        href: '/services',
        label: 'Explore Services',
      },
      secondaryCta: {
        kind: 'internal',
        href: '/contact',
        label: 'Get a Quote',
      },
      imageSrc: '/images/cityscape.png',
      imageAlt:
        'City skyline illustration representing construction and urban development',
    },
  },
  {
    key: 'home-partners',
    type: 'site_partners',
    order: 1,
    data: {
      intro: 'Detailed takeoffs and bid-ready estimates; powered by',
      logos: [
        { src: '/images/partners/bluebeam.svg', alt: 'Bluebeam', width: 181, height: 39 },
        { src: '/images/partners/rsmeans.svg', alt: 'RSMeans', width: 155, height: 40 },
        { src: '/images/partners/planswift.svg', alt: 'PlanSwift', width: 225, height: 51 },
        { src: '/images/partners/xactimate.svg', alt: 'Xactimate', width: 180, height: 31 },
      ],
    },
  },
  {
    key: 'home-services',
    type: 'site_services_carousel',
    order: 2,
    data: {
      sectionTitle: 'Services',
      intro:
        "We provide professional construction estimating and quantity takeoff services designed to help you bid confidently, reduce overhead costs, and plan projects more efficiently. Using advanced estimating software, real-time pricing databases, and industry expertise, our estimators deliver accurate, reliable takeoffs tailored to your project's scope, timeline, and budget.",
      useLiveServices: 'true',
      exploreCta: {
        kind: 'internal',
        href: '/services',
        label: 'Explore All Services',
      },
      services: [],
    },
  },
  {
    key: 'home-why',
    type: 'site_why_choose_us',
    order: 3,
    data: {
      heading: 'Why Choose Our USA Estimating Experts',
      stats: [
        { value: 'Fast Turnaround', label: 'with 99% Accuracy' },
        { value: 'Affordable Pricing', label: '' },
        { value: '92% Bid Success', label: 'Rate' },
        { value: '24/7 Customer', label: 'Support' },
      ],
    },
  },
  {
    key: 'home-trades',
    type: 'site_trades_grid',
    order: 4,
    data: {
      heading: 'Our Trades',
      intro:
        'Our estimators provide accurate quantity takeoffs and cost estimates across all CSI Division trades, supporting commercial, residential, and industrial projects. All estimates are prepared in strict compliance with U.S. construction codes, industry standards, and current pricing databases, ensuring your bids remain competitive, accurate, and aligned with market conditions.',
      trades: [
        {
          title: 'Structural\nEstimating',
          description:
            'Reliable structural estimates that support competitive bids and efficient project execution.',
          href: '/trades/structural',
          arrowColor: '#EA7E37',
          topColor: '#E27B36',
          layerColor: '#8D5530',
        },
        {
          title: 'MEP\nEstimating',
          description:
            'Accurate MEP estimates covering mechanical, electrical, and plumbing systems for every project.',
          href: '/trades/mep',
          arrowColor: '#5BB8B0',
          topColor: '#5BB8B0',
          layerColor: '#307870',
        },
        {
          title: 'Interior\nEstimating',
          description:
            'Reliable interior estimates that support competitive bids and efficient project execution.',
          href: '/trades/interior',
          arrowColor: '#D45070',
          topColor: '#D45070',
          layerColor: '#8D3048',
        },
        {
          title: 'Exterior\nEstimating',
          description:
            'Comprehensive exterior estimates for facades, roofing, and site work with precision detail.',
          href: '/trades/exterior',
          arrowColor: '#8A6AB8',
          topColor: '#8A6AB8',
          layerColor: '#5A4080',
        },
      ],
    },
  },
  {
    key: 'home-how',
    type: 'site_how_it_works',
    order: 5,
    data: {
      heading: 'How Can You Receive Construction Estimates',
      stepsLines: 'Share Plans\nReceive a Quote\nProcess Payment\nGet Estimates',
    },
  },
  {
    key: 'home-works',
    type: 'site_our_works',
    order: 6,
    data: {
      heading: 'Our Works',
      intro:
        'Our estimators provide accurate quantity takeoffs and cost estimates across all CSI Division trades, supporting commercial, residential, and industrial projects. All estimates are prepared in strict compliance with U.S. construction codes, industry standards, and current pricing databases, ensuring your bids remain competitive, accurate, and aligned with market conditions.',
      exploreCta: {
        kind: 'internal',
        href: '/our-works',
        label: 'Explore More',
      },
      works: [
        {
          src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop&q=80',
          alt: 'Construction blueprints',
          title: 'Electrical Estimate Sample',
        },
        {
          src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80',
          alt: 'Estimation dashboard',
          title: 'Estimate - Adams County Regional Medical Center',
        },
        {
          src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop&q=80',
          alt: 'Architect at desk',
          title: 'Division 9 - Finishes',
        },
        {
          src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop&q=80',
          alt: 'Modern architecture',
          title: 'Glass and Glazing Sample Estimate',
        },
      ],
    },
  },
  {
    key: 'home-locations',
    type: 'site_service_locations',
    order: 7,
    data: {
      heading: 'Service Locations',
      subtitle: 'We work in the USA, UK, Canada, Australia, and all over the world',
      stateLinks: [],
    },
  },
  {
    key: 'home-cta',
    type: 'site_cta',
    order: 8,
    data: {
      variant: 'dark',
      title: 'Got Your Plans? Let’s Talk.',
      description:
        'Recognized by The Blue Book Network, we are a trusted construction cost estimation company known for affordable pricing, precision, and professionalism in every project we handle.',
      cta: {
        kind: 'internal',
        href: '/contact',
        label: 'Get a Quote',
      },
    },
  },
];

/** Bump when default payload shape changes (bootstrap can re-apply for unmigrated docs). */
export const HOME_SECTIONS_SCHEMA_VERSION = 5;
