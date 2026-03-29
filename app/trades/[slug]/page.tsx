import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollToTop } from '@/components/layout/scroll-to-top';
import { CmsPageSections } from '@/components/cms/cms-section-renderer';
import {
  buildDynamicPageMetadataForPath,
  hasUnpublishedDynamicCmsPageAtPath,
  loadDynamicCmsPageByPath,
  normalizeSectionsInput,
} from '@/lib/cms-pages';
import { getAdminCookieName, verifyAdminToken } from '@/lib/auth';
import type { CmsPageSection } from '@/lib/cms-sections/types';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
};

async function adminDraftPreview(searchParams?: { preview?: string }) {
  if (searchParams?.preview !== '1') {
    return false;
  }
  try {
    const jar = await cookies();
    const token = jar.get(getAdminCookieName())?.value;
    if (!token) {
      return false;
    }
    await verifyAdminToken(token);
    return true;
  } catch {
    return false;
  }
}

function tradesPath(segment: string): string {
  const s = segment.trim().replace(/^\/+/, '');
  return `/trades/${s}`;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = tradesPath(slug);
  const sp = searchParams ? await searchParams : undefined;
  const preview = await adminDraftPreview(sp);
  const cmsPage = await loadDynamicCmsPageByPath(path, { allowDraft: preview });

  if (cmsPage && (cmsPage.renderMode ?? 'seo_only') === 'dynamic') {
    const cmsMeta = await buildDynamicPageMetadataForPath(path, { allowDraft: preview });
    return cmsMeta ?? {};
  }

  if (!preview && (await hasUnpublishedDynamicCmsPageAtPath(path))) {
    notFound();
  }

  return {};
}

export default async function TradesDynamicPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const path = tradesPath(slug);
  const sp = searchParams ? await searchParams : undefined;
  const preview = await adminDraftPreview(sp);
  const cmsPage = await loadDynamicCmsPageByPath(path, { allowDraft: preview });

  if (cmsPage && (cmsPage.renderMode ?? 'seo_only') === 'dynamic') {
    const sectionList = normalizeSectionsInput(
      (cmsPage.sections ?? []) as CmsPageSection[],
    );

    return (
      <>
        <Header />
        <main className="pt-20">
          {preview && cmsPage.status === 'unpublished' ? (
            <div className="bg-amber-900/40 px-4 py-2 text-center text-xs text-amber-100">
              Draft preview — this page is not published.
            </div>
          ) : null}
          <CmsPageSections sections={sectionList} />
        </main>
        <Footer />
        <ScrollToTop />
      </>
    );
  }

  if (!preview && (await hasUnpublishedDynamicCmsPageAtPath(path))) {
    notFound();
  }

  notFound();
}
