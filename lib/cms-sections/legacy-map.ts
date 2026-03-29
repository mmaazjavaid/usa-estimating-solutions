import { cmsLinkToPair, slugFromPathOrHref } from '@/lib/cms-sections/cms-link';
import type { CmsPageSection } from '@/lib/cms-sections/types';

const TRADE_COLORS = [
  { arrowColor: '#EA7E37', topColor: '#E27B36', layerColor: '#8D5530' },
  { arrowColor: '#5BB8B0', topColor: '#5BB8B0', layerColor: '#307870' },
  { arrowColor: '#D45070', topColor: '#D45070', layerColor: '#8D3048' },
  { arrowColor: '#8A6AB8', topColor: '#8A6AB8', layerColor: '#5A4080' },
];

function asRecord(d: Record<string, unknown>) {
  return d;
}

/**
 * Maps deprecated section types + shapes to the current `site_*` models so existing CMS pages keep rendering.
 */
export function migrateLegacyCmsSection(section: CmsPageSection): CmsPageSection {
  const { type, data: raw } = section;
  const d = asRecord((raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>);

  if (type.startsWith('site_')) {
    return section;
  }

  switch (type) {
    case 'hero_banner':
    case 'hero_minimal':
    case 'hero_split':
    case 'hero_video':
      return {
        ...section,
        type: 'site_hero',
        data: {
          headline: String(d.title || ''),
          subtitle: String(d.subtitle || ''),
          primaryCta: cmsLinkToPair(d.primaryLink, {
            href: '/services',
            label: 'Explore Services',
          }),
          secondaryCta: cmsLinkToPair(d.secondaryLink, {
            href: '/contact',
            label: 'Get a Quote',
          }),
          imageSrc: String(d.image || d.posterImage || '').trim() || undefined,
          imageAlt: String(d.imageAlt || d.title || '').trim() || undefined,
        },
      };

    case 'companies_logos':
    case 'marquee_logos':
      return {
        ...section,
        type: 'site_partners',
        data: {
          intro:
            [d.heading, d.subtext]
              .map((x) => String(x || '').trim())
              .filter(Boolean)
              .join(' — ') || undefined,
          logos: Array.isArray(d.logos) ? d.logos : [],
        },
      };

    case 'services_cards':
      return {
        ...section,
        type: 'site_services_carousel',
        data: {
          sectionTitle: String(d.heading || 'Services'),
          intro: String(d.subtext || ''),
          exploreCta: cmsLinkToPair(d.link, {
            href: '/services',
            label: 'Explore All Services',
          }),
          services: Array.isArray(d.items) ? d.items : [],
        },
      };

    case 'stats_row':
      return {
        ...section,
        type: 'site_why_choose_us',
        data: {
          heading: String(d.heading || ''),
          stats: Array.isArray(d.stats)
            ? (d.stats as { value?: string; label?: string }[]).map((s) => ({
                value: String(s.value || ''),
                label: String(s.label || ''),
              }))
            : [],
        },
      };

    case 'why_choose_us':
      return {
        ...section,
        type: 'site_why_choose_us',
        data: {
          heading: String(d.heading || 'Why Choose Our USA Estimating Experts'),
          stats: Array.isArray(d.reasons)
            ? (d.reasons as { title?: string; body?: string }[]).map((r) => ({
                value: String(r.title || ''),
                label: String(r.body || ''),
              }))
            : [],
        },
      };

    case 'trades_grid':
      return {
        ...section,
        type: 'site_trades_grid',
        data: {
          heading: String(d.heading || 'Our Trades'),
          intro: String(d.subtext || ''),
          trades: Array.isArray(d.items)
            ? (d.items as Record<string, unknown>[]).map((item, i) => {
                const pair = cmsLinkToPair(item.link, {
                  href: '/trades',
                  label: 'Learn more',
                });
                const colors = TRADE_COLORS[i % TRADE_COLORS.length] ?? TRADE_COLORS[0]!;
                return {
                  title: String(item.title || 'Trade').replace(/\s+/g, '\n'),
                  description: String(item.description || ''),
                  href: pair.href,
                  arrowColor: colors.arrowColor,
                  topColor: colors.topColor,
                  layerColor: colors.layerColor,
                };
              })
            : [],
        },
      };

    case 'numbered_steps':
      return {
        ...section,
        type: 'site_how_it_works',
        data: {
          heading: String(d.heading || 'How Can You Receive Construction Estimates'),
          stepsLines: Array.isArray(d.steps)
            ? (d.steps as { title?: string }[])
                .map((s) => String(s.title || '').trim())
                .filter(Boolean)
                .join('\n')
            : '',
        },
      };

    case 'cta_banner':
    case 'cta_split':
    case 'cta_minibar':
    case 'contact_teaser':
      return {
        ...section,
        type: 'site_cta',
        data: {
          variant: 'dark',
          title: String(d.title || d.text || d.heading || 'Got Your Plans? Let’s Talk.'),
          description: String(d.subtitle || d.body || ''),
          cta: cmsLinkToPair(d.primaryLink || d.link, {
            href: '/contact',
            label: 'Get a Quote',
          }),
        },
      };

    case 'rich_text':
    case 'narrow_prose':
    case 'quote_highlight':
      return {
        ...section,
        type: 'site_prose',
        data: {
          heading: String(d.heading || d.title || d.eyebrow || ''),
          body: String(d.body || d.quote || ''),
        },
      };

    default:
      return section;
  }
}

/** Maps carousel service rows from loose CMS JSON to `HomeServiceItem` shape. */
export function normalizeCarouselServices(
  raw: unknown,
): { slug: string; title: string; description: string; href: string; image?: string }[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.map((item, index) => {
    const row = item as Record<string, unknown>;
    const href = String(row.href || '').trim() || '#';
    const slug =
      String(row.slug || '').trim() || `${slugFromPathOrHref(href)}-${index}`;
    return {
      slug,
      title: String(row.title || 'Service'),
      description: String(row.description || ''),
      href: href.startsWith('/') ? href : `/${href}`,
      image: String(row.image || '').trim() || undefined,
    };
  });
}
