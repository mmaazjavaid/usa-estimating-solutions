import type { DropdownGroup } from '@/lib/service-nav-config';

export function normalizeNavHref(href: string): string {
  const raw = href.trim();
  if (!raw) {
    return '';
  }
  const withSlash = raw.startsWith('/') ? raw : `/${raw}`;
  return withSlash.replace(/\/+$/, '') || '/';
}

export function hrefSetFromServicesColumns(cols: DropdownGroup[][]): Set<string> {
  const set = new Set<string>();
  for (const column of cols) {
    for (const group of column) {
      set.add(normalizeNavHref(group.title.href));
      for (const item of group.items) {
        set.add(normalizeNavHref(item.href));
      }
    }
  }
  return set;
}

export function filterServicesColumnsByUnpublished(
  cols: DropdownGroup[][],
  unpublished: Set<string>,
): DropdownGroup[][] {
  if (unpublished.size === 0) {
    return cols;
  }
  return cols
    .map((column) =>
      column
        .map((group) => {
          if (unpublished.has(normalizeNavHref(group.title.href))) {
            return null;
          }
          return {
            ...group,
            items: group.items.filter(
              (i) => !unpublished.has(normalizeNavHref(i.href)),
            ),
          };
        })
        .filter((g): g is DropdownGroup => g != null),
    )
    .filter((column) => column.length > 0);
}

export function filterTradesColumnsByUnpublished(
  cols: DropdownGroup[][],
  unpublished: Set<string>,
): DropdownGroup[][] {
  if (unpublished.size === 0) {
    return cols;
  }
  return cols
    .map((column) =>
      column.filter((g) => !unpublished.has(normalizeNavHref(g.title.href))),
    )
    .filter((column) => column.length > 0);
}

/** CMS-only trade pages from the admin — same shape as header props. */
export type CmsTradesNavLink = { label: string; href: string };

/**
 * Merge extra CMS trade links into the static two-column mega menu (round-robin),
 * instead of appending a third column with a vertical list.
 */
export function mergeCmsTradesLinksIntoColumns(
  baseColumns: DropdownGroup[][],
  cmsTradesLinks: CmsTradesNavLink[],
): DropdownGroup[][] {
  const staticHrefs = hrefSetFromServicesColumns(baseColumns);
  const extras: DropdownGroup[] = [];
  const seen = new Set<string>();

  for (const link of cmsTradesLinks) {
    const h = normalizeNavHref(link.href);
    if (!h || staticHrefs.has(h) || seen.has(h)) {
      continue;
    }
    seen.add(h);
    extras.push({ title: { label: link.label, href: link.href }, items: [] });
  }

  if (extras.length === 0) {
    return baseColumns;
  }

  let columns: DropdownGroup[][] = baseColumns.map((column) => [...column]);

  if (columns.length === 0) {
    columns = [[], []];
  } else if (columns.length === 1) {
    columns = [columns[0], []];
  }

  const colCount = columns.length;
  extras.forEach((group, i) => {
    columns[i % colCount].push(group);
  });

  return columns;
}
