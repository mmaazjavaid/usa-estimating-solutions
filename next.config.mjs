/**
 * When the primary domain is the bare domain (e.g. https://usaestimatingsolutions.com), send the
 * `www.` host there with a permanent redirect so Google sees one site instead of two duplicates.
 */
function wwwToApexRedirects() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return [];
  let url;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return [];
  }
  if (url.hostname.startsWith('www.') || url.hostname === 'localhost') return [];
  return [
    {
      source: '/:path*',
      has: [{ type: 'host', value: `www.${url.hostname}` }],
      destination: `${url.protocol}//${url.hostname}/:path*`,
      permanent: true,
    },
  ];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      ...wwwToApexRedirects(),
      { source: '/trades', destination: '/our-trades', permanent: true },
      // Legacy `/trades/{segment}` subpages were promoted to root `/{segment}`.
      { source: '/trades/:slug', destination: '/:slug', permanent: true },
      { source: '/blogs', destination: '/blog', permanent: true },
      { source: '/blogs/:slug', destination: '/blog/:slug', permanent: true },
      { source: '/prices', destination: '/pricing', permanent: true },
      { source: '/our-works', destination: '/samples', permanent: true },
    ];
  },
}

export default nextConfig
