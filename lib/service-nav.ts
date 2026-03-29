import type { HomeServiceItem } from '@/components/home/services-section';
import { ensureBaseCmsRecords } from '@/lib/cms';
import {
  getPublishedCmsNavLinks,
  getUnpublishedDynamicPathsForPlacement,
  normalizePath,
} from '@/lib/cms-pages';
import {
  filterServicesColumnsByUnpublished,
  hrefSetFromServicesColumns,
  normalizeNavHref,
} from '@/lib/service-nav-helpers';
import { SERVICES_DROPDOWN_COLUMNS, type DropdownLink } from '@/lib/service-nav-config';
import { connectToDatabase } from '@/lib/db';
import { PageModel } from '@/models/Page';
import { ServiceModel } from '@/models/Service';

export {
  SERVICES_DROPDOWN_COLUMNS,
  type DropdownLink,
  type DropdownGroup,
} from '@/lib/service-nav-config';

export {
  filterServicesColumnsByUnpublished,
  filterTradesColumnsByUnpublished,
  hrefSetFromServicesColumns,
  normalizeNavHref,
} from '@/lib/service-nav-helpers';

/**
 * Flat list of service links in the same order as the Services mega menu / mobile list
 * (column order, then title → sub-items; then CMS-only pages not in the static grid).
 */
export async function getServicesNavFlatLinks(): Promise<DropdownLink[]> {
  await ensureBaseCmsRecords();
  const [cms, unpublishedPaths] = await Promise.all([
    getPublishedCmsNavLinks(),
    getUnpublishedDynamicPathsForPlacement('services'),
  ]);
  const unpublished = new Set(unpublishedPaths.map(normalizeNavHref));
  const base = filterServicesColumnsByUnpublished(SERVICES_DROPDOWN_COLUMNS, unpublished);
  const staticHrefs = hrefSetFromServicesColumns(base);
  const seen = new Set<string>();
  const out: DropdownLink[] = [];

  for (const column of base) {
    for (const group of column) {
      out.push(group.title);
      for (const item of group.items) {
        out.push(item);
      }
    }
  }

  for (const link of cms.services) {
    const h = normalizeNavHref(link.href);
    if (!h || staticHrefs.has(h) || seen.has(h)) {
      continue;
    }
    seen.add(h);
    out.push({ label: link.label, href: link.href });
  }

  return out;
}

/**
 * Service cards for `site_services_carousel` (live) and any page that should match the navbar.
 * Order and membership match `getServicesNavFlatLinks`; descriptions/images come from Service or Page.
 */
export async function getLiveServicesForCarousel(): Promise<HomeServiceItem[]> {
  const links = await getServicesNavFlatLinks();
  if (links.length === 0) {
    return [];
  }

  await ensureBaseCmsRecords();
  await connectToDatabase();

  const paths = [...new Set(links.map((l) => normalizePath(l.href)))].filter(Boolean);

  const [services, pages] = await Promise.all([
    ServiceModel.find({ status: 'published' }).lean(),
    PageModel.find({
      renderMode: 'dynamic',
      placement: 'services',
      status: 'published',
      path: { $in: paths },
    })
      .select('path slug name metaDescription metaImage')
      .lean(),
  ]);

  const svcByPath = new Map<string, (typeof services)[0]>();
  for (const s of services) {
    const p = normalizePath(String(s.path || `/${s.slug}`));
    svcByPath.set(p, s);
  }

  const pageByPath = new Map<string, (typeof pages)[0]>();
  for (const p of pages) {
    pageByPath.set(normalizePath(String(p.path)), p);
  }

  return links.map((link) => {
    const path = normalizePath(link.href);
    const slugFromPath = path.replace(/^\//, '').replace(/\/$/, '') || 'service';
    const svc = svcByPath.get(path);
    if (svc) {
      return {
        slug: String(svc.slug),
        title: link.label,
        description: String(svc.shortDescription || ''),
        href: path,
        image: String(svc.image || ''),
      };
    }
    const pg = pageByPath.get(path);
    if (pg) {
      return {
        slug: String(pg.slug || slugFromPath),
        title: link.label,
        description: String(pg.metaDescription || ''),
        href: path,
        image: String(pg.metaImage || ''),
      };
    }
    return {
      slug: slugFromPath,
      title: link.label,
      description: '',
      href: path,
      image: '',
    };
  });
}
