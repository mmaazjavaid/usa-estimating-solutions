import { getCachedHeaderNavBundle } from '@/lib/cms-shell-cache';
import { HeaderClient } from '@/components/layout/header-client';

export async function Header() {
  const {
    cmsServicesLinks,
    cmsTradesLinks,
    unpublishedServicePaths,
    unpublishedTradesPaths,
  } = await getCachedHeaderNavBundle();
  return (
    <HeaderClient
      cmsServicesLinks={cmsServicesLinks}
      cmsTradesLinks={cmsTradesLinks}
      unpublishedServicePaths={unpublishedServicePaths}
      unpublishedTradesPaths={unpublishedTradesPaths}
    />
  );
}
