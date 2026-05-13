import { getCachedHeaderNavBundle } from '@/lib/cms-shell-cache';
import { getPublishedServices } from '@/lib/cms';
import { SERVICES_DROPDOWN_COLUMNS } from '@/lib/service-nav-config';
import { resolveServicesDropdownColumns } from '@/lib/service-nav-resolve';
import { HeaderClient } from '@/components/layout/header-client';

export async function Header() {
  const [navBundle, publishedServices] = await Promise.all([
    getCachedHeaderNavBundle(),
    getPublishedServices(),
  ]);

  const servicesDropdownColumns = resolveServicesDropdownColumns(
    SERVICES_DROPDOWN_COLUMNS,
    publishedServices.map((s) => ({
      slug: String(s.slug),
      path: String((s as { path?: string }).path ?? ''),
      legacySlugs: (s as { legacySlugs?: string[] }).legacySlugs,
    })),
  );

  return (
    <HeaderClient
      cmsServicesLinks={navBundle.cmsServicesLinks}
      cmsTradesLinks={navBundle.cmsTradesLinks}
      unpublishedServicePaths={navBundle.unpublishedServicePaths}
      unpublishedTradesPaths={navBundle.unpublishedTradesPaths}
      servicesDropdownColumns={servicesDropdownColumns}
    />
  );
}
