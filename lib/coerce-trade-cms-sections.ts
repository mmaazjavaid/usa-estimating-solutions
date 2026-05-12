import type { CmsPageSection } from '@/lib/cms-sections/types';

/** Trade dynamic pages should render the trade hero (with hex visual) from generic `site_hero` CMS rows. */
export function coerceTradeHeroSections(
  sections: CmsPageSection[],
  breadcrumbCurrent: string,
): CmsPageSection[] {
  return sections.map((section) => {
    if (section.type !== 'site_hero') {
      return section;
    }

    const d =
      section.data && typeof section.data === 'object' && !Array.isArray(section.data)
        ? (section.data as Record<string, unknown>)
        : {};

    const headlineHtml = String(d.headline ?? '').trim();
    const intro = String(d.subtitle ?? '').trim();

    return {
      ...section,
      type: 'site_trade_hero',
      data: {
        breadcrumbCurrent,
        headlineHtml,
        intro,
        iconId: String(d.iconId ?? '').trim() || 'trade-hero-icon',
      },
    } as CmsPageSection;
  });
}
