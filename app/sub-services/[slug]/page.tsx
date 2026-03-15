import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollToTop } from '@/components/layout/scroll-to-top';
import { getPublishedSubServiceBySlug } from '@/lib/cms';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const subService = await getPublishedSubServiceBySlug(slug);

  if (!subService) {
    return {};
  }

  return {
    title: subService.metaTitle || subService.name,
    description:
      subService.metaDescription ||
      subService.shortDescription ||
      'Sub-service information.',
    robots:
      subService.indexStatus === 'noindex'
        ? { index: false, follow: false }
        : { index: true, follow: true },
  };
}

export default async function SubServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const subService = await getPublishedSubServiceBySlug(slug);

  if (!subService) {
    notFound();
  }

  const parentService = subService.serviceId as
    | { name?: string; slug?: string; path?: string }
    | undefined;
  const parentPath =
    parentService?.path || `/services/${parentService?.slug || ''}`;

  return (
    <>
      <Header />
      <main className="bg-black pt-24 text-white">
        <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <h1 className="text-4xl font-bold md:text-5xl">{subService.name}</h1>
          <p className="mt-6 max-w-4xl text-lg text-white/75">
            {subService.shortDescription ||
              'Sub-service details will be updated soon.'}
          </p>
          {parentService?.name ? (
            <p className="mt-8 text-sm text-white/70">
              Parent service:{' '}
              <Link href={parentPath} className="underline">
                {parentService.name}
              </Link>
            </p>
          ) : null}
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
