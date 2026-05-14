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
