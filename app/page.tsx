import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollToTop } from '@/components/layout/scroll-to-top';
import { CmsPageSections } from '@/components/cms/cms-section-renderer';
import { ensureBaseCmsRecords, getSeoMetadataByPath } from '@/lib/cms';
import {
  HOME_PAGE_SECTIONS,
} from '@/lib/cms-home-sections';
import { loadDynamicCmsPageByPath, normalizeSectionsInput } from '@/lib/cms-pages';
import type { CmsPageSection } from '@/lib/cms-sections/types';

export async function generateMetadata(): Promise<Metadata> {
  return (await getSeoMetadataByPath('/')) ?? {};
}

export default async function HomePage() {
  await ensureBaseCmsRecords();
  const page = await loadDynamicCmsPageByPath('/');

  const fromDb = (page?.sections ?? []) as CmsPageSection[];
  const useDb =
    page &&
    (page.renderMode ?? 'seo_only') === 'dynamic' &&
    fromDb.length > 0;

  const sections = normalizeSectionsInput(
    useDb ? fromDb : HOME_PAGE_SECTIONS,
  );

  return (
    <>
      <Header />
      <main>
        <CmsPageSections sections={sections} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
