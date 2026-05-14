import { PageModel } from '@/models/Page';

/**
 * Map of `oldPath -> { newPath, newSlug }` for top-level page slug renames.
 * Runs at CMS bootstrap so legacy DB rows continue powering SEO metadata at the new URL.
 */
const RENAMED_TOP_LEVEL_PAGES: Record<
  string,
  { newPath: string; newSlug: string }
> = {
  '/trades': { newPath: '/our-trades', newSlug: 'our-trades' },
  '/blogs': { newPath: '/blog', newSlug: 'blog' },
  '/prices': { newPath: '/pricing', newSlug: 'pricing' },
  '/our-works': { newPath: '/samples', newSlug: 'samples' },
};

/**
 * One-time–safe migration: rename top-level Page rows whose `path`/`slug` reflect
 * pre-rename slugs (`/trades`, `/blogs`, `/prices`, `/our-works`) to the canonical
 * slugs introduced alongside the route folder renames.
 */
export async function migrateRenamedPageSlugs(): Promise<void> {
  for (const [oldPath, { newPath, newSlug }] of Object.entries(
    RENAMED_TOP_LEVEL_PAGES,
  )) {
    const existingNew = await PageModel.findOne({
      $or: [{ path: newPath }, { slug: newSlug }],
    })
      .select('_id path slug')
      .lean();

    if (existingNew) {
      continue;
    }

    await PageModel.updateOne(
      { path: oldPath },
      { $set: { path: newPath, slug: newSlug } },
    );
  }
}
