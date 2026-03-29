import type { CmsSectionDefinition, CmsSectionFieldDef } from '@/lib/cms-sections/types';
import { CMS_TEXT_SIZE_OPTIONS } from '@/lib/cms-text-typography';
import { US_STATE_OPTIONS } from '@/lib/us-states';

const t = (
  key: string,
  label: string,
  input: CmsSectionFieldDef['input'],
  extra: Partial<Pick<CmsSectionFieldDef, 'placeholder' | 'options'>> = {},
): CmsSectionFieldDef => ({ key, label, input, ...extra });

/** Headline / paragraph text size (Default, H1–H3 scale, or custom px). */
function textSizePair(baseKey: string, label: string): CmsSectionFieldDef[] {
  return [
    t(`${baseKey}Size`, `${label} — text size`, 'select', {
      options: CMS_TEXT_SIZE_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
    }),
    t(`${baseKey}FontSizePx`, `${label} — custom size (px, when Custom)`, 'text', {
      placeholder: 'e.g. 32',
    }),
  ];
}

const link = (key: string, label: string) => ({
  key,
  label,
  input: 'link' as const,
});

const itemList = (
  key: string,
  label: string,
  itemFields: CmsSectionFieldDef[],
  maxItems?: number,
  helperText?: string,
) => ({
  key,
  label,
  input: 'itemList' as const,
  itemFields,
  maxItems,
  ...(helperText ? { helperText } : {}),
});

const GRID_DIMENSION_OPTIONS = [2, 3, 4, 5, 6, 7, 8].map((n) => ({
  value: String(n),
  label: String(n),
}));

/**
 * Section templates aligned with real homepage / marketing UI in `components/home/*`.
 */
export const CMS_SECTION_REGISTRY: CmsSectionDefinition[] = [
  {
    type: 'site_hero',
    label: 'Hero (homepage style)',
    description: 'Same layout as the main hero: headline, subtitle, two CTAs, cityscape-style image.',
    category: 'Hero',
    previewClass: 'from-zinc-800 to-zinc-950',
    fields: [
      t(
        'headline',
        'Headline (optional — leave empty for animated default). Plain text or HTML. For colored words use inline style (any hex/rgb): <span style="color:#B4934E">Word</span>, or Tailwind: <span class="text-[#B4934E]">Word</span>.',
        'textarea',
        {
          placeholder:
            'e.g. Bid <span style="color:#B4934E">Power</span>. Price <span style="color:#B4934E">smarter</span>. Win more work.',
        },
      ),
      ...textSizePair('headline', 'Headline'),
      t('subtitle', 'Subtitle', 'textarea'),
      ...textSizePair('subtitle', 'Subtitle'),
      link('primaryCta', 'Primary button'),
      link('secondaryCta', 'Secondary button'),
      t('imageSrc', 'Right image URL (optional)', 'imageUrl', {
        placeholder: '/images/cityscape.png',
      }),
      t('imageAlt', 'Image alt text', 'text'),
    ],
    defaultData: {},
  },
  {
    type: 'site_partners',
    label: 'Partners bar',
    description: 'Centered intro line + partner logos row (same as homepage partners strip).',
    category: 'Social proof',
    previewClass: 'from-zinc-900 to-black',
    fields: [
      t('intro', 'Intro line', 'textarea'),
      ...textSizePair('intro', 'Intro line'),
      itemList(
        'logos',
        'Logos',
        [
          t('src', 'Image URL', 'imageUrl'),
          t('alt', 'Alt text', 'text'),
          t('width', 'Width (px, optional)', 'text'),
          t('height', 'Height (px, optional)', 'text'),
        ],
        12,
      ),
    ],
    defaultData: {},
  },
  {
    type: 'site_services_carousel',
    label: 'Services carousel',
    description: 'Black section with headline, intro, AnimatedServiceCard carousel + bottom link.',
    category: 'Features',
    previewClass: 'from-black to-zinc-900',
    fields: [
      t('sectionTitle', 'Section title', 'text'),
      ...textSizePair('sectionTitle', 'Section title'),
      t('intro', 'Intro paragraph', 'textarea'),
      ...textSizePair('intro', 'Intro paragraph'),
      t('useLiveServices', 'Service cards', 'select', {
        options: [
          { value: 'false', label: 'Custom cards below (empty → built-in defaults)' },
          { value: 'true', label: 'Published services catalog (same as the static homepage)' },
        ],
      }),
      link('exploreCta', 'Bottom “explore” button'),
      itemList(
        'services',
        'Service cards',
        [
          t('title', 'Title', 'text'),
          t('description', 'Description', 'textarea'),
          t('href', 'Link path', 'text', { placeholder: '/cost-estimation' }),
          t('slug', 'Slug (optional, for icon/key)', 'text'),
          t('image', 'Icon/image URL (optional)', 'imageUrl'),
        ],
        20,
      ),
    ],
    defaultData: { sectionTitle: 'Services', useLiveServices: 'false' },
  },
  {
    type: 'site_why_choose_us',
    label: 'Why choose us (stats grid)',
    description: 'Four-column stats grid with CursorGlow wrapper — matches homepage.',
    category: 'Features',
    previewClass: 'from-zinc-900 to-zinc-950',
    fields: [
      t('heading', 'Heading', 'text'),
      ...textSizePair('heading', 'Heading'),
      itemList(
        'stats',
        'Stats',
        [
          t('value', 'Main line', 'text'),
          t('label', 'Second line (optional)', 'text'),
        ],
        8,
      ),
    ],
    defaultData: { heading: 'Why Choose Our USA Estimating Experts' },
  },
  {
    type: 'site_trades_grid',
    label: 'Trades grid (EstimateCard)',
    description: '2×2 EstimateCard grid with hex icons — same as “Our Trades” on the homepage.',
    category: 'Features',
    previewClass: 'from-zinc-800 to-black',
    fields: [
      t('heading', 'Heading', 'text'),
      ...textSizePair('heading', 'Heading'),
      t('intro', 'Intro paragraph', 'textarea'),
      ...textSizePair('intro', 'Intro paragraph'),
      t('theme', 'Surface', 'select', {
        options: [
          { value: 'default', label: 'Light section (homepage style)' },
          { value: 'dark', label: 'Black background (service marketing)' },
        ],
      }),
      itemList(
        'trades',
        'Trade cards',
        [
          t('title', 'Title (use line breaks for two lines)', 'textarea'),
          t('description', 'Description', 'textarea'),
          t('href', 'Link path', 'text'),
          t('arrowColor', 'Arrow color (hex)', 'text', { placeholder: '#EA7E37' }),
          t('topColor', 'Icon glow top (hex)', 'text'),
          t('layerColor', 'Icon glow layer (hex)', 'text'),
        ],
        8,
      ),
    ],
    defaultData: { heading: 'Our Trades', theme: 'default' },
  },
  {
    type: 'site_how_it_works',
    label: 'How it works (steps row)',
    description: 'Horizontal steps with dividers — StepsRow + CursorGlow.',
    category: 'Content',
    previewClass: 'from-neutral-900 to-black',
    fields: [
      t('heading', 'Heading', 'text'),
      ...textSizePair('heading', 'Heading'),
      t(
        'stepsLines',
        'Steps (one per line)',
        'textarea',
        { placeholder: 'Share Plans\nReceive a Quote\n…' },
      ),
      t('variant', 'Style', 'select', {
        options: [
          { value: 'light', label: 'Light band (homepage)' },
          { value: 'dark', label: 'Dark (service marketing)' },
        ],
      }),
    ],
    defaultData: {
      heading: 'How Can You Receive Construction Estimates',
      stepsLines: 'Share Plans\nReceive a Quote\nProcess Payment\nGet Estimates',
      variant: 'light',
    },
  },
  {
    type: 'site_our_works',
    label: 'Our works (image grid)',
    description: '2-column image grid with hover titles + “Explore” link.',
    category: 'Media',
    previewClass: 'from-stone-900 to-black',
    fields: [
      t('heading', 'Heading', 'text'),
      ...textSizePair('heading', 'Heading'),
      t('intro', 'Intro paragraph', 'textarea'),
      ...textSizePair('intro', 'Intro paragraph'),
      link('exploreCta', 'Explore button'),
      itemList(
        'works',
        'Work items',
        [
          t('src', 'Image URL', 'imageUrl'),
          t('alt', 'Alt text', 'text'),
          t('title', 'Title overlay', 'text'),
        ],
        8,
      ),
    ],
    defaultData: { heading: 'Our Works' },
  },
  {
    type: 'site_service_locations',
    label: 'Service locations (US map)',
    description:
      'Same map as the homepage; on CMS pages each state can link to its own URL (unset states go to home).',
    category: 'Specialized',
    previewClass: 'from-amber-950/30 to-black',
    fields: [
      t('heading', 'Heading', 'text'),
      ...textSizePair('heading', 'Heading'),
      t('subtitle', 'Subtitle', 'textarea'),
      ...textSizePair('subtitle', 'Subtitle'),
      itemList(
        'stateLinks',
        'State → page links',
        [
          t('state', 'State', 'select', { options: US_STATE_OPTIONS }),
          link('target', 'Destination'),
        ],
        51,
        'Each row maps one state on the map to a page. Set Type to Internal and choose a saved CMS page from the list, or External and paste a full URL. Save this page when done. States you omit still open the map but go to Home (/).',
      ),
    ],
    defaultData: {},
  },
  {
    type: 'site_cta',
    label: 'CTA band',
    description: '“Got Your Plans?” style band — light or dark variant.',
    category: 'Conversion',
    previewClass: 'from-[#2a2a2a] to-[#1E1E1E]',
    fields: [
      t('title', 'Title', 'text'),
      ...textSizePair('title', 'Title'),
      t('description', 'Description', 'textarea'),
      ...textSizePair('description', 'Description'),
      link('cta', 'Button'),
      t('variant', 'Style', 'select', {
        options: [
          { value: 'dark', label: 'Dark (#1E1E1E)' },
          { value: 'default', label: 'Light (background)' },
        ],
      }),
    ],
    defaultData: { variant: 'dark' },
  },
  {
    type: 'site_split_cell_grid',
    label: 'Split cell grid (CPM / Primavera style)',
    description:
      'Centered heading + intro, then a bordered grid of text cells. Choose rows and columns (min 2×2); add one cell per box in row order.',
    category: 'Content',
    previewClass: 'from-zinc-900 to-black',
    fields: [
      t('heading', 'Heading', 'text'),
      ...textSizePair('heading', 'Heading'),
      t('intro', 'Intro paragraph', 'textarea'),
      ...textSizePair('intro', 'Intro paragraph'),
      t('gridRows', 'Number of rows', 'select', { options: GRID_DIMENSION_OPTIONS }),
      t('gridCols', 'Number of columns', 'select', { options: GRID_DIMENSION_OPTIONS }),
      t('containerWidth', 'Content width', 'select', {
        options: [
          { value: 'narrow', label: 'Narrow (max-w-3xl)' },
          { value: 'wide', label: 'Wide (max-w-5xl)' },
          { value: 'wider', label: 'Extra wide (max-w-6xl)' },
        ],
      }),
      itemList(
        'cells',
        'Cell texts',
        [t('text', 'Cell text (supports line breaks)', 'textarea')],
        64,
        'Enter exactly rows × columns items, in order: row 1 left→right, then row 2, etc. Leave blank for an empty cell.',
      ),
    ],
    defaultData: { gridRows: '2', gridCols: '2', containerWidth: 'narrow' },
  },
  {
    type: 'site_three_column_text',
    label: 'Three-point row (Why / highlights)',
    description:
      'Heading plus a responsive row of short blurbs (2–4 columns on desktop), matching the MEP “Why it matters” layout.',
    category: 'Content',
    previewClass: 'from-zinc-900 to-zinc-950',
    fields: [
      t('heading', 'Heading', 'text'),
      ...textSizePair('heading', 'Heading'),
      t(
        'columnCount',
        'Columns on desktop',
        'select',
        {
          options: [
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
          ],
        },
      ),
      itemList('blurbs', 'Points', [t('text', 'Text', 'textarea')], 12),
    ],
    defaultData: { columnCount: '3' },
  },
  {
    type: 'site_zigzag_features',
    label: 'Zigzag feature rows (MEP types style)',
    description:
      'Alternating large label + title/description. Optional link on the label turns the label panel into a button.',
    category: 'Features',
    previewClass: 'from-zinc-800 to-black',
    fields: [
      t('heading', 'Heading', 'text'),
      ...textSizePair('heading', 'Heading'),
      t('intro', 'Intro paragraph', 'textarea'),
      ...textSizePair('intro', 'Intro paragraph'),
      itemList(
        'features',
        'Rows',
        [
          t('label', 'Label (large panel)', 'text'),
          t('title', 'Title', 'text'),
          t('description', 'Description', 'textarea'),
          link('labelLink', 'Label link (optional)'),
        ],
        20,
      ),
    ],
    defaultData: {},
  },
  {
    type: 'site_testimonials',
    label: 'Testimonials carousel',
    description: 'Trusted partner strip with prev/next dots (About page style).',
    category: 'Social proof',
    previewClass: 'from-zinc-900 to-black',
    fields: [
      t('heading', 'Heading', 'text'),
      ...textSizePair('heading', 'Heading'),
      t('subtitle', 'Subtitle', 'textarea'),
      ...textSizePair('subtitle', 'Subtitle'),
      itemList(
        'testimonials',
        'Slides',
        [
          t('name', 'Name', 'text'),
          t('quote', 'Quote', 'textarea'),
          t('rating', 'Star rating', 'select', {
            options: [
              { value: '0', label: 'None' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
              { value: '5', label: '5' },
            ],
          }),
        ],
        12,
      ),
    ],
    defaultData: { heading: 'Proud to be a Trusted Partner' },
  },
  {
    type: 'site_faq_grid',
    label: 'FAQ grid (two columns)',
    description: 'Dark card with questions and answers in a responsive 2-column grid.',
    category: 'Content',
    previewClass: 'from-zinc-950 to-zinc-900',
    fields: [
      t('heading', 'Heading', 'text'),
      ...textSizePair('heading', 'Heading'),
      itemList(
        'faqItems',
        'Questions',
        [
          t('question', 'Question', 'text'),
          t('answer', 'Answer', 'textarea'),
        ],
        24,
      ),
    ],
    defaultData: { heading: 'Frequently Asked Questions' },
  },
  {
    type: 'site_service_marketing_hero',
    label: 'Service marketing hero',
    description:
      'Breadcrumb, rich headline (HTML), intro, optional image/SVG or floating label cards — matches legacy service pages.',
    category: 'Hero',
    previewClass: 'from-black to-zinc-950',
    fields: [
      t('breadcrumbParentHref', 'Breadcrumb parent link', 'text', { placeholder: '/services' }),
      t('breadcrumbParentLabel', 'Breadcrumb parent label', 'text', { placeholder: 'Services' }),
      t('breadcrumbCurrent', 'Current page label', 'text'),
      t(
        'headlineHtml',
        'Headline (HTML)',
        'textarea',
        { placeholder: 'Use <span class="…"> for gradient words.' },
      ),
      ...textSizePair('headlineHtml', 'Headline'),
      t('intro', 'Intro paragraph', 'textarea'),
      ...textSizePair('intro', 'Intro paragraph'),
      t('layout', 'Layout', 'select', {
        options: [
          { value: 'cost', label: 'Cost page (floating cards column)' },
          { value: 'marketing_split', label: 'Split hero (text + visual)' },
          { value: 'marketing_split_centered', label: 'Split hero (centered, takeoff / 3D style)' },
        ],
      }),
      t('rightVisual', 'Right column', 'select', {
        options: [
          { value: 'none', label: 'None (text only)' },
          { value: 'image', label: 'Image' },
          { value: 'floating_cards', label: 'Floating label cards' },
          { value: 'construction_svg', label: 'Construction illustration (SVG)' },
        ],
      }),
      t('imageSrc', 'Image URL (when right column is Image)', 'imageUrl'),
      t('imageAlt', 'Image alt text', 'text'),
      t('imageClassName', 'Image CSS classes (optional)', 'text'),
      t('imageWrapperClassName', 'Image wrapper CSS classes (optional)', 'text'),
      t('glowPrimary', 'Glow primary (rgba)', 'text'),
      t('glowSecondary', 'Glow secondary (rgba)', 'text'),
      t('glowTertiary', 'Glow tertiary (rgba)', 'text'),
      itemList(
        'floatingCards',
        'Floating cards (when Right column = Floating cards)',
        [
          t('title', 'Label', 'text'),
          t('top', 'Top (CSS %)', 'text', { placeholder: '6%' }),
          t('right', 'Right (CSS %, optional)', 'text'),
          t('left', 'Left (CSS %, optional)', 'text'),
          t('rotate', 'Rotate (deg)', 'text', { placeholder: '12' }),
        ],
        8,
      ),
    ],
    defaultData: {
      breadcrumbParentHref: '/services',
      breadcrumbParentLabel: 'Services',
      layout: 'marketing_split',
      rightVisual: 'none',
    },
  },
  {
    type: 'site_trade_hero',
    label: 'Trade page hero',
    description:
      'Legacy /trades/* layout: Trades breadcrumb, HTML headline, intro, hex SVG (gradient accents via spans in HTML).',
    category: 'Hero',
    previewClass: 'from-black to-zinc-950',
    fields: [
      t('breadcrumbCurrent', 'Breadcrumb current label', 'text'),
      t(
        'headlineHtml',
        'Headline (HTML)',
        'textarea',
        { placeholder: 'Example: <span class="text-[#C9A86C]">Planning</span> Costs…' },
      ),
      ...textSizePair('headlineHtml', 'Headline'),
      t('intro', 'Intro paragraph', 'textarea'),
      ...textSizePair('intro', 'Intro paragraph'),
      t('hexTopColor', 'Hex icon top color', 'text', { placeholder: '#8A6AB8' }),
      t('hexLayerColor', 'Hex icon layer color', 'text', { placeholder: '#5A4080' }),
      t('iconId', 'Unique icon ID (SVG clipPath)', 'text', { placeholder: 'exterior-hero-icon' }),
    ],
    defaultData: {
      breadcrumbCurrent: 'Trade',
      headlineHtml: '<span class="text-[#C9A86C]">Title</span>',
      intro: '',
      hexTopColor: '#8A6AB8',
      hexLayerColor: '#5A4080',
      iconId: 'trade-hero-icon',
    },
  },
  {
    type: 'site_trade_lower',
    label: 'Trade page (why + types)',
    description:
      'Cursor glow, three “why” columns, then alternating label / title+description rows (legacy trades). Optional links on the large label box and/or main title.',
    category: 'Content',
    previewClass: 'from-violet-950/50 to-black',
    fields: [
      t('glowPrimary', 'Glow primary (rgba)', 'text', {
        placeholder: 'Leave all three empty for default glow',
      }),
      t('glowSecondary', 'Glow secondary (rgba)', 'text'),
      t('glowTertiary', 'Glow tertiary (rgba)', 'text'),
      t('whyHeading', 'Why section heading', 'text'),
      ...textSizePair('whyHeading', 'Why section heading'),
      itemList(
        'whyItems',
        'Why columns (one paragraph per row)',
        [t('text', 'Text (line breaks OK)', 'textarea')],
        6,
      ),
      t('typesHeading', 'Types section heading', 'text'),
      ...textSizePair('typesHeading', 'Types section heading'),
      t('typesIntro', 'Types intro', 'textarea'),
      ...textSizePair('typesIntro', 'Types intro'),
      itemList(
        'types',
        'Type rows (alternating layout)',
        [
          t('label', 'Label (large box)', 'text'),
          t(
            'labelLinkHref',
            'Label box link (optional)',
            'text',
            { placeholder: '/contact or https://…' },
          ),
          t('title', 'Main title (linkable)', 'text'),
          t('description', 'Description', 'textarea'),
          t(
            'titleLinkHref',
            'Title link (optional)',
            'text',
            { placeholder: '/contact or https://…' },
          ),
        ],
        12,
      ),
    ],
    defaultData: {
      whyHeading: 'Why estimates matter',
      typesHeading: 'Types of estimates',
      typesIntro: '',
    },
  },
  {
    type: 'site_line_pair_grid',
    label: 'Two-line center grid',
    description: 'Centered heading + optional intro, then items with two lines each (industries / project types).',
    category: 'Content',
    previewClass: 'from-zinc-900 to-black',
    fields: [
      t('heading', 'Heading', 'text'),
      ...textSizePair('heading', 'Heading'),
      t('intro', 'Intro (optional)', 'textarea'),
      ...textSizePair('intro', 'Intro'),
      itemList(
        'items',
        'Items',
        [
          t('line1', 'Line 1', 'text'),
          t('line2', 'Line 2 (optional)', 'text'),
        ],
        24,
      ),
    ],
    defaultData: {},
  },
  {
    type: 'site_tag_cloud_row',
    label: 'Tag row (clients / supporters)',
    description: 'Centered heading + wrapped row of short labels (commercial “clients” style).',
    category: 'Content',
    previewClass: 'from-zinc-900 to-black',
    fields: [
      t('heading', 'Heading', 'text'),
      ...textSizePair('heading', 'Heading'),
      itemList('tags', 'Tags', [t('text', 'Label', 'text')], 24),
    ],
    defaultData: {},
  },
  {
    type: 'site_stacked_tag_rows',
    label: 'Stacked tag rows',
    description: 'Multiple rows of wrapped tags (residential project types).',
    category: 'Content',
    previewClass: 'from-zinc-900 to-black',
    fields: [
      t('heading', 'Heading', 'text'),
      ...textSizePair('heading', 'Heading'),
      itemList(
        'rows',
        'Rows',
        [
          t(
            'tags',
            'Tags (one per line)',
            'textarea',
            { placeholder: 'Tag A\nTag B' },
          ),
        ],
        8,
      ),
    ],
    defaultData: {},
  },
  {
    type: 'site_offerings_grid',
    label: 'Offerings grid (2×4)',
    description: 'Heading + 2×4 grid of short labels (construction “What We Offer”).',
    category: 'Content',
    previewClass: 'from-zinc-900 to-black',
    fields: [
      t('heading', 'Heading', 'text'),
      ...textSizePair('heading', 'Heading'),
      t('wrapInCursorGlow', 'Cursor glow wrapper', 'select', {
        options: [
          { value: 'false', label: 'No' },
          { value: 'true', label: 'Yes' },
        ],
      }),
      t('glowPrimary', 'Glow primary (rgba, optional)', 'text'),
      t('glowSecondary', 'Glow secondary (rgba, optional)', 'text'),
      t('glowTertiary', 'Glow tertiary (rgba, optional)', 'text'),
      itemList('items', 'Items', [t('text', 'Label', 'text')], 12),
    ],
    defaultData: { wrapInCursorGlow: 'false' },
  },
  {
    type: 'site_horizontal_pills',
    label: 'Horizontal pills row',
    description: 'Optional heading + inline labels with dividers (takeoff features / industrial capabilities).',
    category: 'Content',
    previewClass: 'from-zinc-900 to-black',
    fields: [
      t('heading', 'Heading (optional)', 'text'),
      ...textSizePair('heading', 'Heading'),
      t('variant', 'Divider width', 'select', {
        options: [
          { value: 'default', label: 'Default' },
          { value: 'compact', label: 'Compact (takeoff style)' },
        ],
      }),
      itemList('items', 'Items', [t('text', 'Label', 'text')], 12),
    ],
    defaultData: { variant: 'default' },
  },
  {
    type: 'site_title_description_matrix',
    label: 'Title + description matrix',
    description: '2-column grid of title + description pairs (preliminary estimate types).',
    category: 'Content',
    previewClass: 'from-zinc-900 to-black',
    fields: [
      t('heading', 'Heading', 'text'),
      ...textSizePair('heading', 'Heading'),
      t('intro', 'Intro paragraph', 'textarea'),
      ...textSizePair('intro', 'Intro paragraph'),
      itemList(
        'cells',
        'Cells (row by row: left then right)',
        [
          t('title', 'Bold title', 'text'),
          t('description', 'Description', 'textarea'),
        ],
        16,
      ),
    ],
    defaultData: {},
  },
  {
    type: 'site_multiline_item_grid',
    label: 'Multiline label grid',
    description: 'Heading + responsive grid of multiline labels (deliverables).',
    category: 'Content',
    previewClass: 'from-zinc-900 to-black',
    fields: [
      t('heading', 'Heading', 'text'),
      ...textSizePair('heading', 'Heading'),
      t('columns', 'Columns', 'select', {
        options: [
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          { value: '6', label: '6' },
        ],
      }),
      itemList('items', 'Items', [t('text', 'Text (use line breaks)', 'textarea')], 24),
    ],
    defaultData: { columns: '6' },
  },
  {
    type: 'site_dark_prose',
    label: 'Dark text block',
    description: 'Black section with optional heading + body (residential intro).',
    category: 'Content',
    previewClass: 'from-black to-zinc-950',
    fields: [
      t('heading', 'Heading (optional)', 'text'),
      ...textSizePair('heading', 'Heading'),
      t('body', 'Body', 'textarea'),
      ...textSizePair('body', 'Body'),
      t('align', 'Alignment', 'select', {
        options: [
          { value: 'center', label: 'Center' },
          { value: 'justify', label: 'Justify' },
        ],
      }),
    ],
    defaultData: { align: 'center' },
  },
  {
    type: 'site_service_trades_footer',
    label: 'Service trades strip',
    description: 'Same “all trades” strip as legacy service pages (not editable).',
    category: 'Conversion',
    previewClass: 'from-zinc-900 to-black',
    fields: [],
    defaultData: {},
  },
  {
    type: 'site_prose',
    label: 'Text block (light background)',
    description: 'Simple centered copy block for extra paragraphs on marketing pages.',
    category: 'Content',
    previewClass: 'from-zinc-100/10 to-zinc-950',
    fields: [
      t('heading', 'Heading (optional)', 'text'),
      ...textSizePair('heading', 'Heading'),
      t('body', 'Body', 'textarea'),
      ...textSizePair('body', 'Body'),
    ],
    defaultData: {},
  },
];

const byType = new Map(CMS_SECTION_REGISTRY.map((d) => [d.type, d]));

export function getSectionDefinition(type: string) {
  return byType.get(type);
}

export function isKnownSectionType(type: string) {
  return byType.has(type);
}

export const SITE_SECTION_TYPES = new Set(CMS_SECTION_REGISTRY.map((d) => d.type));
