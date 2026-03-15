import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollToTop } from '@/components/layout/scroll-to-top';
import { CTASection } from '@/components/home/cta-section';
import { ServiceTradesSection } from '@/components/services/service-trades-section';
import {
  getPublishedServiceBySlug,
  getPublishedSubServices,
} from '@/lib/cms';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublishedServiceBySlug(slug);

  if (!service) {
    return {};
  }

  const imageUrl = normalizeImageUrl(service.metaImage || service.image);
  const keywords = [
    ...extractKeywords(service.headerMetaTags),
    ...extractKeywords(service.footerMetaTags),
  ];

  return {
    title: service.metaTitle || service.name,
    description: service.metaDescription || service.shortDescription || '',
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: service.path || `/${service.slug}`,
    },
    openGraph: {
      title: service.metaTitle || service.name,
      description: service.metaDescription || service.shortDescription || '',
      images: imageUrl ? [{ url: imageUrl, alt: service.imageAlt || service.name }] : [],
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: service.metaTitle || service.name,
      description: service.metaDescription || service.shortDescription || '',
      images: imageUrl ? [imageUrl] : [],
    },
    robots:
      service.indexStatus === 'noindex'
        ? { index: false, follow: false }
        : { index: true, follow: true },
    other: {
      headerMetaTags: service.headerMetaTags || '',
      footerMetaTags: service.footerMetaTags || '',
    },
  };
}

export default async function DynamicServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getPublishedServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const subServices = await getPublishedSubServices(service._id.toString());
  const serviceImageUrl = normalizeImageUrl(service.image);

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="bg-black text-white">
          <section className="relative overflow-hidden px-6 pb-16 pt-6 md:px-12 lg:px-20">
            <nav className="mb-16 text-sm text-[#d9d9d9]/60">
              <Link href="/services">Services</Link>
              <span className="mx-2">{'>'}</span>
              <span>{service.name}</span>
            </nav>

            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              <div className="max-w-2xl">
                <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
                  {service.name}
                </h1>
                <p className="text-sm leading-relaxed text-[#d9d9d9]/75 md:text-base">
                  {service.shortDescription ||
                    'Service details will be updated soon.'}
                </p>
              </div>

              <div className="flex justify-center lg:justify-end">
                {serviceImageUrl ? (
                  <img
                    src={serviceImageUrl}
                    alt={service.imageAlt?.trim() || service.name}
                    className="h-auto w-full max-w-[700px] rounded-xl border border-white/20"
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-[360px] w-full max-w-[700px] rounded-xl border border-white/20 bg-white/[0.03]" />
                )}
              </div>
            </div>
          </section>

          {subServices.length > 0 ? (
            <section className="px-6 py-16 md:px-12 lg:px-20">
              <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
                Sub-Services
              </h2>
              <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
                {subServices.map((subService) => (
                  <article
                    key={subService._id.toString()}
                    className="rounded-lg border border-white/20 bg-white/[0.03] p-5"
                  >
                    <h3 className="text-xl font-semibold">{subService.name}</h3>
                    <p className="mt-2 text-sm text-white/70">
                      {subService.shortDescription ||
                        'Sub-service details are available on request.'}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section className="px-6 md:px-12 lg:px-20">
            <ServiceTradesSection />
          </section>
        </section>
        <CTASection variant="dark" />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

function extractKeywords(tags: string): string[] {
  if (!tags) {
    return [];
  }

  return tags
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeImageUrl(value?: string): string {
  const raw = value?.trim().replace(/^['"]|['"]$/g, '') || '';
  if (!raw) {
    return '';
  }

  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('/')) {
    return raw;
  }

  if (raw.startsWith('www.')) {
    return `https://${raw}`;
  }

  return raw;
}
