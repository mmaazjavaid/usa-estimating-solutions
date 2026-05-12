import { connectToDatabase } from '@/lib/db';
import { PageModel } from '@/models/Page';
import { revalidateAfterCmsPageChange } from '@/lib/cms-revalidate';
import type { CmsPageSection } from '@/lib/cms-sections/types';

type ParentTradeKey = 'interior' | 'exterior' | 'mep' | 'structural';

const PARENT_SLUG: Record<ParentTradeKey, string> = {
  interior: 'interior',
  exterior: 'exterior',
  mep: 'mep',
  structural: 'structural',
};

const PARENT_PATH: Record<ParentTradeKey, string> = {
  interior: '/interior',
  exterior: '/exterior',
  mep: '/mep',
  structural: '/structural',
};

function isParentTradeKey(v: unknown): v is ParentTradeKey {
  return v === 'interior' || v === 'exterior' || v === 'mep' || v === 'structural';
}

/** Remove child trade entries whose `labelLinkHref` / `titleLinkHref` matches any of `paths`. */
async function removeChildFromParentTypes(parentKey: ParentTradeKey, paths: string[]) {
  const parent = await PageModel.findOne({ slug: PARENT_SLUG[parentKey] });
  if (!parent) return;

  const match = new Set(paths.filter(Boolean));

  const sections = Array.isArray(parent.sections) ? parent.sections : [];
  let changed = false;

  const updatedSections = sections.map((section: CmsPageSection) => {
    if (section.type !== 'site_trade_lower') return section;
    const data = (section.data ?? {}) as Record<string, unknown>;
    const types = Array.isArray(data.types) ? (data.types as Record<string, unknown>[]) : [];
    const filtered = types.filter((t) => {
      const label = String(t.labelLinkHref ?? '');
      const title = String(t.titleLinkHref ?? '');
      return !match.has(label) && !match.has(title);
    });
    if (filtered.length !== types.length) {
      changed = true;
      return { ...section, data: { ...data, types: filtered } };
    }
    return section;
  });

  if (changed) {
    parent.sections = updatedSections as typeof parent.sections;
    await parent.save();
    revalidateAfterCmsPageChange(PARENT_PATH[parentKey]);
  }
}

/** Add or update a child trade entry in a parent's site_trade_lower types. */
async function upsertChildInParentTypes(
  parentKey: ParentTradeKey,
  entry: {
    childPath: string;
    previousChildPath?: string;
    childName: string;
    childDescription: string;
  },
) {
  const parent = await PageModel.findOne({ slug: PARENT_SLUG[parentKey] });
  if (!parent) return;

  const newType = {
    label: entry.childName,
    labelLinkHref: entry.childPath,
    title: entry.childName,
    description: entry.childDescription,
    titleLinkHref: entry.childPath,
  };

  const matchPaths = new Set(
    [entry.childPath, entry.previousChildPath].filter(Boolean) as string[],
  );

  const sections = Array.isArray(parent.sections) ? parent.sections : [];
  let changed = false;

  const updatedSections = sections.map((section: CmsPageSection) => {
    if (section.type !== 'site_trade_lower') return section;
    const data = (section.data ?? {}) as Record<string, unknown>;
    const types = Array.isArray(data.types) ? (data.types as Record<string, unknown>[]) : [];
    const idx = types.findIndex((t) => {
      const label = String(t.labelLinkHref ?? '');
      return matchPaths.has(label);
    });
    const newTypes =
      idx >= 0
        ? types.map((t, i) => (i === idx ? { ...t, ...newType } : t))
        : [...types, newType];
    changed = true;
    return { ...section, data: { ...data, types: newTypes } };
  });

  if (changed) {
    parent.sections = updatedSections as typeof parent.sections;
    await parent.save();
    revalidateAfterCmsPageChange(PARENT_PATH[parentKey]);
  }
}

export async function syncChildTradeInParents(params: {
  childPath: string;
  /** When the page URL changed, include the prior path so parent `site_trade_lower` rows update correctly. */
  previousChildPath?: string;
  childName: string;
  childDescription: string;
  oldTradeLocation: string | undefined;
  oldParentTrade: string | null | undefined;
  newTradeLocation: string;
  newParentTrade: string | null | undefined;
}) {
  const {
    childPath,
    previousChildPath,
    childName,
    childDescription,
    oldTradeLocation,
    oldParentTrade,
    newTradeLocation,
    newParentTrade,
  } = params;

  await connectToDatabase();

  const pathAliases = [previousChildPath, childPath].filter(
    (p, i, a): p is string => Boolean(p) && a.indexOf(p) === i,
  );

  const oldEffective =
    oldTradeLocation === 'under_trade' && isParentTradeKey(oldParentTrade) ? oldParentTrade : null;
  const newEffective =
    newTradeLocation === 'under_trade' && isParentTradeKey(newParentTrade) ? newParentTrade : null;

  // Remove from old parent if parent changed or trade is no longer under a parent
  if (oldEffective && oldEffective !== newEffective) {
    await removeChildFromParentTypes(oldEffective, pathAliases);
  }

  // Add/update in new parent
  if (newEffective) {
    await upsertChildInParentTypes(newEffective, {
      childPath,
      previousChildPath,
      childName,
      childDescription,
    });
  }
}
