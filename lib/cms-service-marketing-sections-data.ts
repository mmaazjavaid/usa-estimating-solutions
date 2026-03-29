import type { CmsPageSection } from '@/lib/cms-sections/types';

/** Shared footer CTA (same as former static service pages). */
export const SERVICE_MARKETING_CTA_DATA: Record<string, unknown> = {
  variant: 'dark',
  title: 'Got Your Plans? Let’s Talk.',
  description:
    'Recognized by The Blue Book Network, we are a trusted construction cost estimation company known for affordable pricing, precision, and professionalism in every project we handle.',
  cta: {
    kind: 'internal',
    href: '/contact',
    label: 'Get a Quote',
  },
};

function ctaSection(order: number, key: string): CmsPageSection {
  return {
    key,
    type: 'site_cta',
    order,
    data: { ...SERVICE_MARKETING_CTA_DATA },
  };
}

/** Full section lists migrated from legacy `components/services/*-content.tsx` layouts. */
export const SERVICE_MARKETING_SECTIONS_BY_SLUG: Record<string, CmsPageSection[]> = {
  'cost-estimation': [
    {
      key: 'cost-hero',
      type: 'site_service_marketing_hero',
      order: 0,
      data: {
        breadcrumbParentHref: '/services',
        breadcrumbParentLabel: 'Services',
        breadcrumbCurrent: 'Cost Estimation',
        headlineHtml:
          'Accurate <span class="text-[#5BBFBA]">Estimates</span> for <span class="text-[#C4956A]">Smarter</span> Budgeting & Cost Control',
        intro:
          'Accurate cost estimates are the difference between winning a bid and losing profit. Every estimate is developed through a detailed analysis of drawings, construction methods, materials, site conditions, and logistics, with precise trade-specific quantity takeoffs reviewed by senior estimators for maximum accuracy.',
        layout: 'cost',
        rightVisual: 'floating_cards',
        floatingCards: [
          { title: 'Preliminary Estimating', top: '6%', right: '6%', rotate: '12' },
          { title: 'Building Cost Estimating', top: '30%', left: '6%', rotate: '-8' },
          { title: 'BIM Estimating', top: '56%', right: '10%', rotate: '5' },
          { title: 'Budget Estimating', top: '80%', left: '10%', rotate: '-10' },
        ],
      },
    },
    {
      key: 'cost-services-grid',
      type: 'site_trades_grid',
      order: 1,
      data: {
        heading: 'Cost Estimation Services',
        intro: '',
        theme: 'dark',
        trades: [
          {
            title: 'Building Cost\nEstimating',
            description:
              'Detailed building cost estimates built for budget control and confident bidding.',
            href: '/cost-estimation',
            arrowColor: '#E85A71',
            topColor: '#E85A71',
            layerColor: '#8D3048',
          },
          {
            title: 'BIM\nEstimating',
            description:
              'BIM-based quantification and pricing support for design coordination and accuracy.',
            href: '/cost-estimation',
            arrowColor: '#9B8AC4',
            topColor: '#9B8AC4',
            layerColor: '#5A4080',
          },
          {
            title: 'Budget\nEstimating',
            description:
              'Reliable budget estimates for early planning, forecasting, and cost decisions.',
            href: '/cost-estimation',
            arrowColor: '#5BBFBA',
            topColor: '#5BBFBA',
            layerColor: '#307870',
          },
          {
            title: 'Preliminary\nEstimating',
            description:
              'Concept-stage estimate guidance to evaluate feasibility and project scope.',
            href: '/cost-estimation',
            arrowColor: '#C4956A',
            topColor: '#C4956A',
            layerColor: '#8D5530',
          },
          {
            title: 'Design Phase\nEstimating',
            description:
              'Design development estimates to keep decisions aligned with target budgets.',
            href: '/cost-estimation',
            arrowColor: '#5B8BD4',
            topColor: '#5B8BD4',
            layerColor: '#345C9A',
          },
          {
            title: 'Bid\nEstimating',
            description:
              'Bid-ready estimates that improve competitiveness while protecting margins.',
            href: '/cost-estimation',
            arrowColor: '#D4D95B',
            topColor: '#D4D95B',
            layerColor: '#899030',
          },
        ],
      },
    },
    {
      key: 'cost-steps',
      type: 'site_how_it_works',
      order: 2,
      data: {
        heading: 'How Our Estimating Process Works',
        stepsLines: 'Share Plans\nReceive a Quote\nProcess Payment\nGet Your Estimate',
        variant: 'dark',
      },
    },
    {
      key: 'cost-trades',
      type: 'site_service_trades_footer',
      order: 3,
      data: {},
    },
    ctaSection(4, 'cost-cta'),
  ],

  'construction-estimation': [
    {
      key: 'conest-hero',
      type: 'site_service_marketing_hero',
      order: 0,
      data: {
        breadcrumbParentHref: '/services',
        breadcrumbParentLabel: 'Services',
        breadcrumbCurrent: 'Construction Estimation',
        headlineHtml:
          '<span class="bg-clip-text text-transparent" style="background-image: linear-gradient(90deg, #5a9a8a, #c9a227)">Data-Driven</span> <span class="text-white">Construction Estimating Solutions</span>',
        intro:
          'At USA Estimating Solutions, we deliver fast, precise, and data-driven construction estimates that empower contractors, developers, and project owners to plan smarter, bid competitively, and win more work. Whether your project is residential, commercial, or industrial, our expert team transforms your plans into accurate cost projections, reducing risk and giving you financial clarity from day one.',
        layout: 'marketing_split',
        rightVisual: 'construction_svg',
        glowPrimary: 'rgba(75, 40, 130, 0.48)',
        glowSecondary: 'rgba(60, 32, 105, 0.40)',
        glowTertiary: 'rgba(48, 25, 85, 0.34)',
      },
    },
    {
      key: 'conest-offerings',
      type: 'site_offerings_grid',
      order: 1,
      data: {
        heading: 'What We Offer',
        wrapInCursorGlow: 'true',
        glowPrimary: 'rgba(75, 40, 130, 0.48)',
        glowSecondary: 'rgba(60, 32, 105, 0.40)',
        glowTertiary: 'rgba(48, 25, 85, 0.34)',
        items: [
          { text: 'Structural Steel & MEP Shop Drawings' },
          { text: 'Monthly Takeoff Packages' },
          { text: 'Estimating Consultations' },
          { text: 'Conceptual Estimates' },
        ],
      },
    },
    {
      key: 'conest-cards',
      type: 'site_trades_grid',
      order: 2,
      data: {
        heading: '',
        intro: '',
        theme: 'dark',
        trades: [
          {
            title: 'Freelance\nEstimating',
            description:
              'Flexible freelance estimating support for contractors needing fast and accurate bid help.',
            href: '/construction-estimation',
            arrowColor: '#c96b6b',
            topColor: '#c96b6b',
            layerColor: '#8d4a4a',
          },
          {
            title: 'Construction\nEstimator',
            description:
              'Dedicated construction estimator services for labor, material, and equipment pricing.',
            href: '/construction-estimation',
            arrowColor: '#9b7bcb',
            topColor: '#9b7bcb',
            layerColor: '#5a4080',
          },
          {
            title: 'Blue-Print\nEstimator',
            description:
              'Blueprint-based quantity takeoffs and scope validation to improve estimate confidence.',
            href: '/construction-estimation',
            arrowColor: '#6bc9b9',
            topColor: '#6bc9b9',
            layerColor: '#307870',
          },
          {
            title: 'Xactimate\nEstimating',
            description:
              'Professional Xactimate estimates aligned with insurance workflows and documentation.',
            href: '/construction-estimation',
            arrowColor: '#b8956b',
            topColor: '#b8956b',
            layerColor: '#8d5530',
          },
        ],
      },
    },
    {
      key: 'conest-trades',
      type: 'site_service_trades_footer',
      order: 3,
      data: {},
    },
    ctaSection(4, 'conest-cta'),
  ],

  'construction-takeoff': [
    {
      key: 'takeoff-hero',
      type: 'site_service_marketing_hero',
      order: 0,
      data: {
        breadcrumbParentHref: '/services',
        breadcrumbParentLabel: 'Services',
        breadcrumbCurrent: 'Construction Takeoff',
        headlineHtml:
          '<span class="bg-gradient-to-r from-[#5B8C7B] via-[#7BAF9A] to-[#C4A962] bg-clip-text text-transparent">Precise</span> <span class="text-white">Quantities That</span> <span class="bg-gradient-to-r from-[#C4A962] to-[#D4B978] bg-clip-text text-transparent">Power</span><br /><span class="text-white">Accurate Bids</span>',
        intro:
          "We specialize in providing precise, timely, and affordable construction takeoff services tailored to your project's needs. Whether you're working on residential, commercial, or industrial projects, our expert estimators deliver high-quality results every time. We provide expert quantity takeoff services for general contractors, subcontractors, engineering firms, architects, and developers.",
        layout: 'marketing_split_centered',
        rightVisual: 'image',
        imageSrc: '/images/construction-takeoff-chart.png',
        imageAlt: 'Construction takeoff chart illustration',
        imageClassName: 'h-auto w-full max-w-2xl',
        glowPrimary: 'rgba(45, 130, 135, 0.48)',
        glowSecondary: 'rgba(38, 110, 115, 0.40)',
        glowTertiary: 'rgba(30, 90, 95, 0.34)',
      },
    },
    {
      key: 'takeoff-clients',
      type: 'site_tag_cloud_row',
      order: 1,
      data: {
        heading: 'Our Clients Are',
        tags: [
          { text: 'General Contractors' },
          { text: 'Subcontractors' },
          { text: 'Architects' },
          { text: 'Owners' },
          { text: 'Vendors' },
          { text: 'Real-Estate Developers' },
        ],
      },
    },
    {
      key: 'takeoff-grid',
      type: 'site_split_cell_grid',
      order: 2,
      data: {
        heading: 'Quantity Take-off Services',
        intro: '',
        gridRows: '4',
        gridCols: '4',
        containerWidth: 'wide',
        cells: [
          { text: 'Site Work Takeoff' },
          { text: 'Masonry Takeoff' },
          { text: 'Concrete Takeoff' },
          { text: 'Drywall Takeoff' },
          { text: 'Painting Takeoff' },
          { text: 'Insulation Takeoff' },
          { text: 'Roofing Takeoff' },
          { text: 'Lumber Takeoff' },
          { text: 'Millwork Takeoff' },
          { text: 'Cabinet Takeoff' },
          { text: 'Mechanical Takeoff' },
          { text: 'HVAC Takeoff' },
          { text: 'Plumbing Takeoff' },
          { text: 'Electrical Takeoff' },
          { text: 'Door/Window Takeoff' },
          { text: 'Structural Steel Takeoff' },
        ],
      },
    },
    {
      key: 'takeoff-pills',
      type: 'site_horizontal_pills',
      order: 3,
      data: {
        heading: '',
        variant: 'compact',
        items: [
          { text: 'Quick Turnaround' },
          { text: 'Accurate & Comprehensive' },
          { text: 'Tailored for U.S Project' },
        ],
      },
    },
    {
      key: 'takeoff-trades',
      type: 'site_service_trades_footer',
      order: 4,
      data: {},
    },
    ctaSection(5, 'takeoff-cta'),
  ],

  'commercial-estimating': [
    {
      key: 'comm-hero',
      type: 'site_service_marketing_hero',
      order: 0,
      data: {
        breadcrumbParentHref: '/services',
        breadcrumbParentLabel: 'Services',
        breadcrumbCurrent: 'Commercial Estimating',
        headlineHtml:
          '<span class="text-white">Proven </span><span class="bg-gradient-to-r from-[#5b9a8b] to-[#7ab8a8] bg-clip-text text-transparent">Experience</span><span class="text-white"> Across</span><br /><span class="bg-gradient-to-r from-[#c9a855] to-[#e8c76a] bg-clip-text text-transparent">Global</span><span class="text-white"> Commercial Projects</span>',
        intro:
          'Commercial estimating requires technical precision, industry insight, and real-world cost intelligence. Accurate estimates are critical for budgeting, bidding, cost control, and long-term project success. Our experienced estimators support projects of all sizes - from renovations to large-scale commercial developments - ensuring every estimate is reviewed, validated, and aligned with market realities.',
        layout: 'marketing_split',
        rightVisual: 'image',
        imageSrc: '/images/commercial-estimating-hero.png',
        imageAlt: 'Commercial estimating skyline illustration',
        imageClassName: 'w-full max-w-[700px] h-auto',
      },
    },
    {
      key: 'comm-projects',
      type: 'site_line_pair_grid',
      order: 1,
      data: {
        heading: 'Commercial Projects We Estimate',
        items: [
          { line1: 'Warehouses &', line2: 'Parking Garages' },
          { line1: 'Retail &', line2: 'Restaurants' },
          { line1: 'Medical &', line2: 'Airports' },
          { line1: 'Theaters &', line2: 'Museums' },
          { line1: 'High-Rise', line2: 'Buildings & Hotels' },
          { line1: 'Libraries, Prisons &', line2: 'Police Stations' },
        ],
      },
    },
    {
      key: 'comm-core',
      type: 'site_split_cell_grid',
      order: 2,
      data: {
        heading: 'Core Commercial Estimating Services',
        intro:
          'Our commercial estimating services support developers, contractors, and consultants with dependable scope-based quantities, labor and material pricing, and strategic bid support tailored to each project.',
        gridRows: '2',
        gridCols: '3',
        containerWidth: 'wide',
        cells: [
          { text: 'Pre-Construction Estimates' },
          { text: 'Material & Labor Takeoffs' },
          { text: 'Cost Analysis & Profit Planning' },
          { text: 'Bid Proposal Preparation' },
          { text: 'Change Order Estimates' },
          { text: 'Value Engineering & Cost Reduction' },
        ],
      },
    },
    {
      key: 'comm-cards',
      type: 'site_trades_grid',
      order: 3,
      data: {
        heading: '',
        intro: '',
        theme: 'dark',
        trades: [
          {
            title: 'Commercial\nDevelopers',
            description:
              'Detailed estimating support for developers managing schedules, budgets, and project feasibility.',
            href: '/commercial-estimating',
            arrowColor: '#c75f6b',
            topColor: '#c75f6b',
            layerColor: '#4a2a2d',
          },
          {
            title: 'Commercial\nContractors',
            description:
              'Accurate bid-focused estimates for general and specialty commercial contractors.',
            href: '/commercial-estimating',
            arrowColor: '#b8956c',
            topColor: '#b8956c',
            layerColor: '#4a3d2d',
          },
          {
            title: 'Architects &\nDesigners',
            description:
              'Design-phase estimating to keep concepts aligned with real-world construction costs.',
            href: '/commercial-estimating',
            arrowColor: '#8b7cb8',
            topColor: '#8b7cb8',
            layerColor: '#3d3654',
          },
          {
            title: 'Design Building\nEstimate',
            description:
              'Integrated design-build cost guidance for better coordination and cost control.',
            href: '/commercial-estimating',
            arrowColor: '#5b9a8b',
            topColor: '#5b9a8b',
            layerColor: '#2d4a44',
          },
        ],
      },
    },
    {
      key: 'comm-trades',
      type: 'site_service_trades_footer',
      order: 4,
      data: {},
    },
    ctaSection(5, 'comm-cta'),
  ],

  'cpm-scheduling': [
    {
      key: 'cpm-hero',
      type: 'site_service_marketing_hero',
      order: 0,
      data: {
        breadcrumbParentHref: '/services',
        breadcrumbParentLabel: 'Services',
        breadcrumbCurrent: 'CPM Scheduling',
        headlineHtml:
          'Efficient Scheduling for <span class="bg-gradient-to-r from-[#5b9a8b] to-[#7ab8a8] bg-clip-text text-transparent">Timely</span> & Projects <span class="bg-gradient-to-r from-[#c9a227] to-[#d4af37] bg-clip-text text-transparent">Cost-Controlled</span>',
        intro:
          'Effective construction scheduling is essential for keeping projects on track, within budget, and aligned with deadlines. It helps teams coordinate tasks, allocate resources, anticipate challenges, and make informed decisions at every stage of construction. Whether your project is residential, commercial, or industrial, professional scheduling ensures smooth execution and improved project performance.',
        layout: 'marketing_split',
        rightVisual: 'image',
        imageSrc: '/images/cpm-scheduling-hero.png',
        imageAlt: 'CPM scheduling chart illustration',
        imageClassName: 'h-auto w-full max-w-[700px]',
        glowPrimary: 'rgba(180, 50, 50, 0.42)',
        glowSecondary: 'rgba(150, 42, 42, 0.36)',
        glowTertiary: 'rgba(120, 35, 35, 0.30)',
      },
    },
    {
      key: 'cpm-industries',
      type: 'site_line_pair_grid',
      order: 1,
      data: {
        heading: 'Industries We Serve',
        items: [
          { line1: 'Residential & Commercial', line2: 'Construction' },
          { line1: 'Industrial Projects & EPC', line2: 'Contractors' },
          { line1: 'Public Infrastructure &', line2: 'Civil Engineering' },
          { line1: 'Healthcare, Airports, Hotels,', line2: 'Historic Restorations' },
        ],
      },
    },
    {
      key: 'cpm-block',
      type: 'site_split_cell_grid',
      order: 2,
      data: {
        heading: 'Critical Path Method (CPM) Scheduling',
        intro:
          'CPM scheduling identifies the most important tasks and milestones, helping you plan the optimal sequence of activities. It allows teams to manage risks, track progress, and adjust timelines, ensuring critical work is completed on schedule and projects move forward efficiently. CPM scheduling breaks down complex projects to highlight the most important tasks and milestones, ensuring smooth execution from start to finish.',
        gridRows: '2',
        gridCols: '2',
        containerWidth: 'narrow',
        cells: [
          { text: 'Identify essential tasks\nand critical activities' },
          { text: 'Develop baseline schedules\nand monitor progress' },
          { text: 'Manage risks and address\ndelays proactively' },
          { text: 'Track resources, budgets,\nand performance metrics' },
        ],
      },
    },
    {
      key: 'cpm-primavera',
      type: 'site_split_cell_grid',
      order: 3,
      data: {
        heading: 'Primavera Scheduling Services',
        intro:
          'Primavera scheduling provides detailed timelines, resource allocation, and integrated reporting for complex projects. With Gantt charts, network diagrams, and logic-based schedules, teams can forecast delays, coordinate trades, and maintain visibility across all project phases. Primavera scheduling ensures that projects run smoothly with realistic timelines, integrated team coordination, and ongoing updates for any project changes.',
        gridRows: '2',
        gridCols: '2',
        containerWidth: 'narrow',
        cells: [
          { text: 'Concept-to-close\nproject scheduling' },
          { text: 'Critical path analysis and\nresource allocation' },
          {
            text: 'Forecasting, delay\nmanagement, and risk\nmitigation',
          },
          {
            text: 'Customizable reports: Gantt\ncharts, activity networks,\nand time-scaled logic\ndiagrams',
          },
        ],
      },
    },
    {
      key: 'cpm-msproject',
      type: 'site_split_cell_grid',
      order: 4,
      data: {
        heading: 'MS Project Scheduling Services',
        intro:
          'MS Project scheduling organizes and tracks tasks, manages dependencies, and optimizes resources. Features like critical path analysis, "What-If" scenario planning, and backward scheduling allow teams to visualize timelines, prevent conflicts, and ensure projects stay on schedule and on budget. MS Project scheduling gives you full visibility of project progress, allowing you to anticipate delays and make data-driven decisions.',
        gridRows: '2',
        gridCols: '2',
        containerWidth: 'narrow',
        cells: [
          {
            text: 'Comprehensive task\nsequencing and float\ncalculations',
          },
          {
            text: '"What-If" scenario planning for\nrisk management',
          },
          { text: 'Resource optimization and\nbaseline alignment' },
          { text: 'Backward scheduling to meet\nfixed deadlines' },
        ],
      },
    },
    {
      key: 'cpm-trades',
      type: 'site_service_trades_footer',
      order: 5,
      data: {},
    },
    ctaSection(6, 'cpm-cta'),
  ],

  'industrial-estimating': [
    {
      key: 'ind-hero',
      type: 'site_service_marketing_hero',
      order: 0,
      data: {
        breadcrumbParentHref: '/services',
        breadcrumbParentLabel: 'Services',
        breadcrumbCurrent: 'Industrial Estimating',
        headlineHtml:
          '<span class="bg-gradient-to-r from-[#5B8A7A] to-[#C9A55C] bg-clip-text text-transparent">Confidence-Driven</span> <span class="text-white">Industrial Cost Planning</span>',
        intro:
          'Industrial projects demand precision, coordination, and strict cost control. Our industrial estimating services deliver accurate, audit-ready cost estimates and detailed takeoffs that support informed decision-making from early planning through construction. By combining industry expertise, advanced estimating software, and real-time pricing data, we help EPC contractors, owners, and engineering teams reduce risk, control budgets, and execute complex industrial projects with confidence.',
        layout: 'marketing_split',
        rightVisual: 'image',
        imageSrc: '/images/industrial-estimating-hero.png',
        imageAlt: 'Industrial estimating facility illustration',
        imageClassName: 'h-auto w-full max-w-[700px]',
        glowPrimary: 'rgba(120, 120, 60, 0.46)',
        glowSecondary: 'rgba(100, 100, 50, 0.38)',
        glowTertiary: 'rgba(80, 80, 42, 0.32)',
      },
    },
    {
      key: 'ind-support',
      type: 'site_tag_cloud_row',
      order: 1,
      data: {
        heading: 'Who We Support',
        tags: [
          { text: 'EPC Contractors' },
          { text: 'Industrial Owners & Operators' },
          { text: 'Engineering & Design Firms' },
          { text: 'Financial Investors' },
          { text: 'Joint Venture Partners' },
        ],
      },
    },
    {
      key: 'ind-core',
      type: 'site_split_cell_grid',
      order: 2,
      data: {
        heading: 'Core Industrial Estimating Services',
        intro:
          'Our services include quantity takeoffs and cost estimates, bid evaluation and proposal support, feasibility and risk analysis, change order preparation and review, value engineering and cost optimization, project scheduling and cost management, as well as QA/QC reviews and cold-eye audits. Trade coverage:',
        gridRows: '2',
        gridCols: '3',
        containerWidth: 'wide',
        cells: [
          { text: 'Sitework & Foundations\nStructural Steel' },
          { text: 'Mechanical & Process\nEquipment' },
          { text: 'Electrical &\nInstrumentation' },
          { text: 'Process Piping & HVAC' },
          { text: 'Insulation, Fireproofing\n& Coatings' },
          { text: 'Welding & Asbestos\nAbatement' },
        ],
      },
    },
    {
      key: 'ind-spec',
      type: 'site_horizontal_pills',
      order: 3,
      data: {
        heading: 'Specialized Estimating Capabilities',
        variant: 'default',
        items: [
          { text: 'Structural Steel Estimating' },
          { text: 'Mechanical Estimating' },
          { text: 'Electrical Estimating' },
        ],
      },
    },
    {
      key: 'ind-trades',
      type: 'site_service_trades_footer',
      order: 4,
      data: {},
    },
    ctaSection(5, 'ind-cta'),
  ],

  'interior-design-services': [
    {
      key: 'int-hero',
      type: 'site_service_marketing_hero',
      order: 0,
      data: {
        breadcrumbParentHref: '/services',
        breadcrumbParentLabel: 'Services',
        breadcrumbCurrent: 'Interior Design Services',
        headlineHtml:
          '<span class="bg-gradient-to-r from-[#5b8a7a] via-[#8fb09a] to-[#c9a86c] bg-clip-text text-transparent">Coordinated</span> Interior Design for Seamless Execution',
        intro:
          'Interior design plays a key role in shaping how a space looks, feels, and functions. Our interior design services focus on thoughtful space planning, balanced layouts, and coordinated design elements that support everyday use while aligning with the overall architectural vision. From early concepts to detailed layouts, we help create interiors that feel intentional, organized, and ready for execution.',
        layout: 'marketing_split',
        rightVisual: 'image',
        imageSrc: '/images/interior-design-services-hero.png',
        imageAlt: 'Interior design staircase illustration',
        imageClassName: 'h-auto w-full max-w-[700px]',
        glowPrimary: 'rgba(180, 55, 65, 0.48)',
        glowSecondary: 'rgba(150, 45, 55, 0.40)',
        glowTertiary: 'rgba(120, 38, 48, 0.34)',
      },
    },
    {
      key: 'int-support',
      type: 'site_tag_cloud_row',
      order: 1,
      data: {
        heading: 'Who We Support',
        tags: [
          { text: 'EPC Contractors' },
          { text: 'Industrial Owners & Operators' },
          { text: 'Engineering & Design Firms' },
          { text: 'Financial Investors' },
          { text: 'Joint Venture Partners' },
        ],
      },
    },
    {
      key: 'int-core',
      type: 'site_split_cell_grid',
      order: 2,
      data: {
        heading: 'Core Interior Design Services',
        intro:
          'Our interior design and space planning services include developing efficient floor plans, circulation strategies, and interior layouts that make the best use of available space. We work closely with project teams to ensure finishes, fixtures, and interior components are aligned with construction requirements, helping reduce conflicts, improve coordination, and support a smoother transition from design to build.',
        gridRows: '2',
        gridCols: '3',
        containerWidth: 'wide',
        cells: [
          { text: 'Concept Design & Mood\nBoards' },
          { text: 'Space Planning &\nLayout Optimization' },
          { text: 'Material, Color & Finish\nSelection' },
          { text: 'Furniture & Lighting\nDesign' },
          { text: 'Kitchen & Bathroom\nDesign' },
          { text: 'Commercial & Office\nInterior Design' },
        ],
      },
    },
    {
      key: 'int-trades',
      type: 'site_service_trades_footer',
      order: 3,
      data: {},
    },
    ctaSection(4, 'int-cta'),
  ],

  'preliminary-estimating': [
    {
      key: 'pre-hero',
      type: 'site_service_marketing_hero',
      order: 0,
      data: {
        breadcrumbParentHref: '/services',
        breadcrumbParentLabel: 'Services',
        breadcrumbCurrent: 'Preliminary Estimating',
        headlineHtml:
          '<span class="text-white">Plan </span><span class="bg-gradient-to-r from-[#5B8C7B] via-[#8B9B6B] to-[#C4A95B] bg-clip-text text-transparent">Smarter</span><span class="text-white"> with Preliminary</span><br /><span class="text-white">Construction Estimates</span>',
        intro:
          "A preliminary estimate helps you evaluate your project's feasibility early on, even when drawings are incomplete or supplier quotes are delayed. By analyzing square footage, material, and labor costs, you can make informed decisions, set realistic budgets, and guide client discussions with confidence. Whether you're at 30%, 60%, or 90% of your plans, our preliminary estimates give you a clear snapshot of project costs and financial viability.",
        layout: 'marketing_split',
        rightVisual: 'image',
        imageSrc: '/images/preliminary-estimating-hero.png',
        imageAlt: 'Preliminary estimating illustration',
        imageClassName: 'h-auto w-full max-w-[500px]',
        glowPrimary: 'rgba(45, 130, 135, 0.48)',
        glowSecondary: 'rgba(38, 110, 115, 0.40)',
        glowTertiary: 'rgba(30, 90, 95, 0.34)',
      },
    },
    {
      key: 'pre-why',
      type: 'site_line_pair_grid',
      order: 1,
      data: {
        heading: 'Why Preliminary Estimates Matter:',
        items: [
          { line1: 'Compare design alternatives', line2: 'for cost-effectiveness' },
          { line1: 'Allocate funds efficiently', line2: '' },
          { line1: 'Set early-stage budgets', line2: '' },
          { line1: 'Reduce financial risks', line2: 'before construction begins' },
        ],
      },
    },
    {
      key: 'pre-matrix',
      type: 'site_title_description_matrix',
      order: 2,
      data: {
        heading: 'Types of Preliminary Estimates',
        intro:
          'Our preliminary estimates include everything from preliminaries, substructures, and superstructures to external and internal finishes, mechanical, plumbing, and electrical systems, along with labor costs, contingency allowances, project schedules, and clear square footage and unit-based breakdowns for easy interpretation.',
        cells: [
          {
            title: 'Rough Order Magnitude (ROM):',
            description: 'Early feasibility checks (+/-50% accuracy)',
          },
          {
            title: 'Ballpark Estimate:',
            description: 'Helps owners evaluate budgets (+/-20% accuracy)',
          },
          {
            title: 'Budget Estimate:',
            description: 'Outlines major costs for planning purposes (+/-10-25% accuracy)',
          },
          {
            title: 'Definitive Estimate:',
            description: 'Final pre-construction cost verification (+/-5-15% accuracy)',
          },
        ],
      },
    },
    {
      key: 'pre-trades',
      type: 'site_service_trades_footer',
      order: 3,
      data: {},
    },
    ctaSection(4, 'pre-cta'),
  ],

  'residential-estimation': [
    {
      key: 'res-hero',
      type: 'site_service_marketing_hero',
      order: 0,
      data: {
        breadcrumbParentHref: '/services',
        breadcrumbParentLabel: 'Services',
        breadcrumbCurrent: 'Residential Estimation',
        headlineHtml:
          '<span class="text-white">Residential Cost Estimates</span><br /><span class="text-white">For </span><span class="text-[#5FBDBA]">Builders</span><span class="text-white"> & </span><span class="text-[#C9A227]">Homeowners</span>',
        intro:
          'Fast, precise, and cost-effective residential estimating services designed to give you full control over your project budget, reduce financial risks, and make confident decisions at every stage - from planning a single-family home to managing large multi-unit residential developments. With detailed takeoffs, labor and material cost breakdowns, and expert analysis, you can streamline bidding, secure funding, and ensure your project stays on track from start to finish.',
        layout: 'marketing_split',
        rightVisual: 'image',
        imageSrc: '/images/residential-estimation-hero.png',
        imageAlt: 'Residential estimation skyline illustration',
        imageClassName: 'h-auto w-full max-w-[700px]',
        imageWrapperClassName: 'hidden w-full items-center justify-end lg:flex',
        glowPrimary: 'rgba(88, 50, 140, 0.48)',
        glowSecondary: 'rgba(70, 40, 115, 0.40)',
        glowTertiary: 'rgba(55, 32, 95, 0.34)',
      },
    },
    {
      key: 'res-projects',
      type: 'site_stacked_tag_rows',
      order: 1,
      data: {
        heading: 'Residential Projects We Estimate',
        rows: [
          {
            tags: 'Apartments & Condominiums\nTownhouses, Bungalows & Mansions\nHome Additions & Remodeling',
          },
          {
            tags: 'Single-Family Homes\nMulti-Family Homes\nDuplex/Triplex Homes\nCustom & Modular Homes',
          },
        ],
      },
    },
    {
      key: 'res-sfr',
      type: 'site_dark_prose',
      order: 2,
      data: {
        heading: 'Single-Family Residential Estimating',
        body:
          'Our Single-Family Residential Estimating Services are designed for homeowners, builders, and contractors who need precise, fast, and dependable house construction estimates before starting construction.\n\nTrade coverage:',
        align: 'center',
      },
    },
    {
      key: 'res-trade-grid',
      type: 'site_split_cell_grid',
      order: 3,
      data: {
        heading: '',
        intro: '',
        gridRows: '3',
        gridCols: '3',
        containerWidth: 'wide',
        cells: [
          { text: 'General Conditions & Permits' },
          { text: 'Site Work & Earthwork\nDoors & Windows' },
          { text: 'Stairs, Kitchens, Fixtures\n& Furnishings' },
          { text: 'Wood & Composite\nWork' },
          { text: 'Thermal & Moisture\nProtection' },
          { text: 'Doors & Windows' },
          { text: 'Structural & Decorative\nMetals' },
          { text: 'Interior & Exterior\nFinishes' },
          { text: 'Plumbing, Mechanical &\nElectrical' },
        ],
      },
    },
    {
      key: 'res-deliverables',
      type: 'site_multiline_item_grid',
      order: 4,
      data: {
        heading: 'Our Deliverables',
        columns: '6',
        items: [
          { text: 'Customized\nResidential Estimates' },
          { text: 'Digital Takeoff\nExcel Files' },
          { text: 'Material\nQuantities & Types' },
          { text: 'Material & Labor\nPricing' },
          { text: 'Colored Marked-\nUp Drawings' },
          { text: 'Complete Takeoff\nSummary' },
        ],
      },
    },
    {
      key: 'res-trades',
      type: 'site_service_trades_footer',
      order: 5,
      data: {},
    },
    ctaSection(6, 'res-cta'),
  ],

  '3d-visualization': [
    {
      key: '3d-hero',
      type: 'site_service_marketing_hero',
      order: 0,
      data: {
        breadcrumbParentHref: '/services',
        breadcrumbParentLabel: 'Services',
        breadcrumbCurrent: '3D Visualization',
        headlineHtml:
          'Bring Designs to <span class="bg-gradient-to-r from-[#7ab8a8] via-[#a8b87a] to-[#c9a85c] bg-clip-text text-transparent">Life</span> Before Construction Begins',
        intro:
          '3D modeling and architectural visualization transform concepts and drawings into clear, realistic visuals that make design intent easy to understand. These services help architects, developers, and contractors visualize spaces, materials, and layouts early in the process - supporting better planning, smoother approvals, and more confident decision-making before construction starts.',
        layout: 'marketing_split_centered',
        rightVisual: 'image',
        imageSrc: '/images/3d-visualization-hero.png',
        imageAlt: '3D visualization cube illustration',
        imageClassName: 'h-auto w-full max-w-[420px]',
        glowPrimary: 'rgba(120, 120, 60, 0.46)',
        glowSecondary: 'rgba(100, 100, 50, 0.38)',
        glowTertiary: 'rgba(80, 80, 42, 0.32)',
      },
    },
    {
      key: '3d-benefits',
      type: 'site_line_pair_grid',
      order: 1,
      data: {
        heading: 'Why Choose Our 3D Services:',
        items: [
          { line1: 'Seamless integration with', line2: 'cost estimates & takeoffs' },
          { line1: 'Ideal for bids, permits,', line2: 'and marketing' },
          { line1: 'Faster client approvals &', line2: 'stronger presentations' },
          { line1: 'Realistic materials, lighting,', line2: 'and scale accuracy' },
        ],
      },
    },
    {
      key: '3d-core',
      type: 'site_split_cell_grid',
      order: 2,
      data: {
        heading: 'Core 3D Visualization Services',
        intro:
          'Our 3D modeling and visualization services convert 2D plans, sketches, and specifications into detailed three-dimensional models and high-quality visual representations. By creating accurate digital models, we help project teams explore design options, identify potential issues, and communicate ideas clearly to clients, stakeholders, and approval authorities.',
        gridRows: '2',
        gridCols: '3',
        containerWidth: 'wide',
        cells: [
          { text: '360 deg Panoramas &\nWalkthrough Views' },
          { text: 'Exterior & Interior 3D\nVisualizations' },
          { text: 'Furniture, Fixture &\nMaterial Visualization' },
          { text: 'Photorealistic Renders' },
          { text: 'Architectural 3D\nModeling (Residential &\nCommercial)' },
          {
            text: 'Construction-Ready 3D\nModels for Design\nCoordination',
          },
        ],
      },
    },
    {
      key: '3d-trades',
      type: 'site_service_trades_footer',
      order: 3,
      data: {},
    },
    ctaSection(4, '3d-cta'),
  ],
};
