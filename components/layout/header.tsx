import {
  getPublishedCmsNavLinks,
  getUnpublishedDynamicPathsForPlacement,
} from '@/lib/cms-pages';
import { HeaderClient } from '@/components/layout/header-client';

export async function Header() {
  const [cms, unpublishedServices, unpublishedTrades] = await Promise.all([
    getPublishedCmsNavLinks(),
    getUnpublishedDynamicPathsForPlacement('services'),
    getUnpublishedDynamicPathsForPlacement('trades'),
  ]);
  return (
    <HeaderClient
      cmsServicesLinks={cms.services}
      cmsTradesLinks={cms.trades}
      unpublishedServicePaths={unpublishedServices}
      unpublishedTradesPaths={unpublishedTrades}
    />
  );
}
