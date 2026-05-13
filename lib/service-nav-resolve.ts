import { normalizePath } from '@/lib/cms-pages';
import type { DropdownGroup } from '@/lib/service-nav-config';

export type ServiceHrefSource = {
  slug: string;
  path?: string;
  legacySlugs?: string[];
};

function pathSegment(href: string): string {
  const n = normalizePath(href);
  if (n === '/') {
    return '';
  }
  return n.slice(1);
}

function canonicalServicePath(svc: ServiceHrefSource): string {
  return normalizePath(String(svc.path || `/${svc.slug}`));
}

function serviceMatchesStaticHref(svc: ServiceHrefSource, href: string): boolean {
  const h = normalizePath(href);
  const canonical = canonicalServicePath(svc);
  if (canonical === h) {
    return true;
  }
  const seg = pathSegment(href);
  if (seg && svc.slug === seg) {
    return true;
  }
  const legs = svc.legacySlugs ?? [];
  for (const ls of legs) {
    const s = String(ls).trim();
    if (!s) {
      continue;
    }
    if (s === seg) {
      return true;
    }
    if (normalizePath(`/${s.replace(/^\/+/, '')}`) === h) {
      return true;
    }
  }
  return false;
}

function serviceForStaticHref(
  services: ServiceHrefSource[],
  href: string,
): ServiceHrefSource | undefined {
  return services.find((svc) => serviceMatchesStaticHref(svc, href));
}

export function resolveServicesDropdownHref(
  href: string,
  label: string,
  services: ServiceHrefSource[],
): { label: string; href: string } {
  const svc = serviceForStaticHref(services, href);
  if (!svc) {
    return { label, href };
  }
  return { label, href: canonicalServicePath(svc) };
}

export function resolveServicesDropdownColumns(
  columns: DropdownGroup[][],
  services: ServiceHrefSource[],
): DropdownGroup[][] {
  return columns.map((col) =>
    col.map((group) => ({
      title: resolveServicesDropdownHref(group.title.href, group.title.label, services),
      items: group.items.map((item) =>
        resolveServicesDropdownHref(item.href, item.label, services),
      ),
    })),
  );
}
