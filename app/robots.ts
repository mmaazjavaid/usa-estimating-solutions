import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';

/**
 * Generates `/robots.txt`. Allows crawling of the public site, blocks private/non-content
 * routes, and advertises the sitemap so search engines can discover the CMS-driven pages.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/login', '/__cms-preview'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
