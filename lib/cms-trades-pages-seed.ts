import type { CmsPageSection } from '@/lib/cms-sections/types';
import { SERVICE_MARKETING_CTA_DATA } from '@/lib/cms-service-marketing-sections-data';

export const TRADES_SECTIONS_SCHEMA_VERSION = 2;

export type TradesSeedDef = {
  path: string;
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  sections: CmsPageSection[];
};

function ctaSection(order: number, key: string): CmsPageSection {
  return {
    key,
    type: 'site_cta',
    order,
    data: { ...SERVICE_MARKETING_CTA_DATA },
  };
}

export const TRADES_DYNAMIC_PAGE_SEEDS: TradesSeedDef[] = [
  {
    path: '/trades/exterior',
    slug: 'trade-exterior',
    name: 'Exterior Estimating',
    metaTitle: 'Exterior Estimating | US Estimating Solutions',
    metaDescription:
      'Exterior estimating for roofing, site work, and envelope systems — accurate scopes aligned with U.S. construction practices.',
    sections: [
      {
        key: 'trade-ext-hero',
        type: 'site_trade_hero',
        order: 0,
        data: {
          breadcrumbCurrent: 'Exterior Estimation',
          headlineHtml:
            '<span class="text-[#C9A86C]">Planning</span> Costs Beyond the Building Envelope',
          intro:
            'Exterior estimating services focus on site conditions, building protection, and external systems that directly impact project timelines and budgets. These estimates help teams anticipate external factors early.',
          hexTopColor: '#8A6AB8',
          hexLayerColor: '#5A4080',
          iconId: 'exterior-hero-icon',
        },
      },
      {
        key: 'trade-ext-lower',
        type: 'site_trade_lower',
        order: 1,
        data: {
          glowPrimary: 'rgba(75, 40, 130, 0.48)',
          glowSecondary: 'rgba(60, 32, 105, 0.40)',
          glowTertiary: 'rgba(48, 25, 85, 0.34)',
          whyHeading: 'Why Exterior Estimates Matter:',
          whyItems: [
            { text: 'Accounts for site and building\nenvelope factors' },
            { text: 'Supports early-phase\nplanning' },
            { text: 'Helps manage external cost\nrisks' },
          ],
          typesHeading: 'Types of Exterior Estimates',
          typesIntro:
            'Exterior estimating addresses all site and envelope components critical to completing the building. These key areas allow precise cost control and planning for the project\'s outer structure.',
          types: [
            {
              label: 'Roofing',
              title: 'Roofing Estimating',
              description:
                'Includes roof assemblies, insulation, membranes, and accessories. Estimates support installation planning, material selection, and coordination with structural elements.',
              titleLinkHref: '',
            },
            {
              label: 'Site Work',
              title: 'Site Work Estimating',
              description:
                'Covers excavation, grading, utilities, paving, and landscaping. Site work estimates help manage early-phase construction activities and sequencing.',
              titleLinkHref: '',
            },
            {
              label: 'Inflation',
              title: 'Inflation Allowances',
              description:
                'Accounts for market fluctuations, escalation risks, and long-term pricing considerations. Inflation analysis helps protect budgets and improve financial planning for extended project timelines.',
              titleLinkHref: '',
            },
          ],
        },
      },
      ctaSection(2, 'trade-ext-cta'),
    ],
  },
  {
    path: '/trades/interior',
    slug: 'trade-interior',
    name: 'Interior Estimating',
    metaTitle: 'Interior Estimating | US Estimating Solutions',
    metaDescription:
      'Interior estimating for drywall, paint, flooring, and finishes — detailed scopes for build-outs and tenant improvements.',
    sections: [
      {
        key: 'trade-int-hero',
        type: 'site_trade_hero',
        order: 0,
        data: {
          breadcrumbCurrent: 'Interior Estimation',
          headlineHtml:
            'Clear Cost <span class="text-[#C9A86C]">Visibility</span> for Interior Build-Outs',
          intro:
            'Interior estimating services help contractors and owners understand the scope and sequencing of interior construction. These estimates support budgeting, scheduling, and coordination across finishing trades.',
          hexTopColor: '#D45070',
          hexLayerColor: '#8D3048',
          iconId: 'interior-hero-icon',
        },
      },
      {
        key: 'trade-int-lower',
        type: 'site_trade_lower',
        order: 1,
        data: {
          glowPrimary: 'rgba(180, 50, 50, 0.42)',
          glowSecondary: 'rgba(150, 42, 42, 0.36)',
          glowTertiary: 'rgba(120, 35, 35, 0.30)',
          whyHeading: 'Why Interior Estimates Matter:',
          whyItems: [
            { text: 'Supports coordination between major\nbuilding systems' },
            { text: 'Helps plan system costs\nearly' },
            { text: 'Reduces conflicts during\nconstruction' },
          ],
          typesHeading: 'Types of Interior Estimates',
          typesIntro:
            'Interior estimating ensures that every finish, fit-out, and detail is accounted for. The following categories help plan costs and streamline interior execution.',
          types: [
            {
              label: 'Drywall',
              title: 'Drywall Estimating',
              description:
                'Includes partitions, ceilings, framing, and finishes. Our drywall takeoffs help plan labor flow, material needs, and installation timelines.',
              titleLinkHref: '',
            },
            {
              label: 'Painting',
              title: 'Painting Estimating',
              description:
                'Addresses surface preparation, coatings, and finish applications. Painting estimates help plan labor, materials, and sequencing across interior spaces.',
              titleLinkHref: '',
            },
            {
              label: 'Flooring',
              title: 'Flooring Estimating',
              description:
                'Covers tile, carpet, hardwood, vinyl, and specialty flooring systems. Estimates are organized to support procurement, phasing, and finish coordination.',
              titleLinkHref: '',
            },
          ],
        },
      },
      ctaSection(2, 'trade-int-cta'),
    ],
  },
  {
    path: '/trades/mep',
    slug: 'trade-mep',
    name: 'MEP Estimating',
    metaTitle: 'MEP Estimating | US Estimating Solutions',
    metaDescription:
      'Mechanical, electrical, plumbing, and HVAC estimating — coordinated takeoffs for complex building systems.',
    sections: [
      {
        key: 'trade-mep-hero',
        type: 'site_trade_hero',
        order: 0,
        data: {
          breadcrumbCurrent: 'MEP Estimation',
          headlineHtml:
            'Integrated MEP Estimates That Keep Projects <span class="text-[#A0A36D]">Moving</span>',
          intro:
            'Our MEP (Mechanical, Electrical and Plumbing) estimating services support contractors, engineers, and developers with coordinated cost insights across electrical, mechanical, plumbing, and HVAC systems. We help you understand scope, sequencing, and system-level costs early, so coordination issues and budget conflicts are reduced before construction begins.',
          hexTopColor: '#5BB8B0',
          hexLayerColor: '#307870',
          iconId: 'mep-hero-icon',
        },
      },
      {
        key: 'trade-mep-lower',
        type: 'site_trade_lower',
        order: 1,
        data: {
          glowPrimary: 'rgba(45, 130, 135, 0.48)',
          glowSecondary: 'rgba(38, 110, 115, 0.40)',
          glowTertiary: 'rgba(30, 90, 95, 0.34)',
          whyHeading: 'Why MEP Estimates Matter:',
          whyItems: [
            { text: 'Supports coordination between major\nbuilding systems' },
            { text: 'Helps plan system costs early' },
            { text: 'Reduces conflicts during\nconstruction' },
          ],
          typesHeading: 'Types of MEP Estimates',
          typesIntro:
            'MEP estimating covers the core building systems that make a structure functional. Below are the key areas we focus on to ensure smooth installation, coordination, and cost planning.',
          types: [
            {
              label: 'Mechanical',
              title: 'Mechanical Estimating',
              description:
                'Includes equipment, piping, and system components required for mechanical operations. We support mechanical contractors with takeoffs that align with fabrication, installation planning, and procurement needs.',
              titleLinkHref: '',
            },
            {
              label: 'Electrical',
              title: 'Electrical Estimating',
              description:
                'Covers power distribution, lighting systems, low-voltage wiring, panels, and raceways. Our estimates support new construction, upgrades, and system expansions while aligning with project schedules and installation sequences.',
              titleLinkHref: '',
            },
            {
              label: 'Plumbing',
              title: 'Plumbing Estimating',
              description:
                'Addresses domestic water, drainage, fixtures, and specialty piping systems. Estimates are structured to help plan material ordering, labor sequencing, and coordination with other trades.',
              titleLinkHref: '',
            },
            {
              label: 'HVAC',
              title: 'HVAC Estimating',
              description:
                'Focuses on heating, cooling, ventilation, ductwork, and controls. Our HVAC estimates help teams evaluate system options, plan installations, and manage mechanical coordination efficiently.',
              titleLinkHref: '',
            },
          ],
        },
      },
      ctaSection(2, 'trade-mep-cta'),
    ],
  },
  {
    path: '/trades/structural',
    slug: 'trade-structural',
    name: 'Structural Estimating',
    metaTitle: 'Structural Estimating | US Estimating Solutions',
    metaDescription:
      'Structural estimating for concrete, masonry, rebar, and core building assemblies.',
    sections: [
      {
        key: 'trade-str-hero',
        type: 'site_trade_hero',
        order: 0,
        data: {
          breadcrumbCurrent: 'Structural Estimation',
          headlineHtml:
            'Cost <span class="text-[#C9A86C]">Planning</span> for the Backbone of Your Project',
          intro:
            'Structural estimating services provide clarity on materials, assemblies, and construction sequencing that form the core of a building. We support early planning and execution by aligning structural scope with design intent and construction requirements.',
          hexTopColor: '#EA7E37',
          hexLayerColor: '#8D5530',
          iconId: 'structural-hero-icon',
        },
      },
      {
        key: 'trade-str-lower',
        type: 'site_trade_lower',
        order: 1,
        data: {
          glowPrimary: '',
          glowSecondary: '',
          glowTertiary: '',
          whyHeading: 'Why Structural Estimates Matter:',
          whyItems: [
            { text: 'Forms the cost backbone of the\nproject' },
            { text: 'Limits major scope\nchanges later' },
            { text: 'Guides early design and planning\ndecisions' },
          ],
          typesHeading: 'Types of Structural Estimates',
          typesIntro:
            'Structural estimating forms the backbone of any construction project. Here are the primary elements we analyze to maintain stability, efficiency, and accurate budgeting.',
          types: [
            {
              label: 'Concrete',
              title: 'Concrete Estimating',
              description:
                'Includes foundations, slabs, footings, columns, and structural concrete elements. Estimates support site conditions, forming methods, and construction phasing.',
              titleLinkHref: '',
            },
            {
              label: 'Masonry',
              title: 'Masonry Estimating',
              description:
                'Addresses blockwork, brickwork, and structural masonry assemblies. Estimates consider wall types, bonding patterns, and associated materials to support planning and execution.',
              titleLinkHref: '',
            },
            {
              label: 'Rebar',
              title: 'Rebar Estimating',
              description:
                'Covers reinforcement quantities, placement considerations, and fabrication requirements. Our rebar takeoffs help streamline ordering and coordination with concrete schedules.',
              titleLinkHref: '',
            },
          ],
        },
      },
      ctaSection(2, 'trade-str-cta'),
    ],
  },
];
