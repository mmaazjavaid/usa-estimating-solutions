import { PageModel } from '@/models/Page';
import { deepRewriteLegacyTradesPaths, rewriteLegacyTradesSubpath } from '@/lib/legacy-trades-url';

const LEGACY_PAGE_PATH = /^\/trades\/([^/]+)$/;

/**
 * One-time–safe migration: move dynamic trade pages from `/trades/{segment}` to `/{segment}`,
 * rewrite `trade-{segment}` slugs to `{segment}`, and fix `/trades/…` strings embedded in CMS sections.
 */
export async function migrateLegacyTradesUrlsToRoot(): Promise<void> {
  const all = await PageModel.find({}).select('sections').lean();
  for (const row of all) {
    const { next, changed } = deepRewriteLegacyTradesPaths(row.sections);
    if (changed) {
      await PageModel.updateOne({ _id: row._id }, { $set: { sections: next } });
    }
  }

  const legacy = await PageModel.find({
    path: { $regex: LEGACY_PAGE_PATH },
  })
    .select('_id path slug')
    .lean();

  for (const doc of legacy) {
    const path = String((doc as { path?: string }).path ?? '');
    const m = path.match(LEGACY_PAGE_PATH);
    if (!m) {
      continue;
    }
    const segment = m[1];
    const newPath = rewriteLegacyTradesSubpath(path);
    if (newPath === path) {
      continue;
    }

    const conflict = await PageModel.findOne({
      $or: [{ path: newPath }, { slug: segment }],
      _id: { $ne: (doc as { _id: unknown })._id },
    })
      .select('_id')
      .lean();
    if (conflict) {
      console.warn('[migrate-trades-urls] skip path/slug conflict', {
        from: path,
        to: newPath,
        segment,
      });
      continue;
    }

    await PageModel.updateOne(
      { _id: (doc as { _id: unknown })._id },
      { $set: { path: newPath, slug: segment } },
    );
  }
}
