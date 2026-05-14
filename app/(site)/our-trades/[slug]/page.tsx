import { permanentRedirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Legacy `/our-trades/{segment}` URLs redirect to `/{segment}` (301) for SEO. */
export default async function LegacyTradesSubpageRedirect({ params }: PageProps) {
  const { slug } = await params;
  const segment = slug.trim().replace(/^\/+/, '');
  if (!segment) {
    permanentRedirect('/our-trades');
  }
  permanentRedirect(`/${segment}`);
}
