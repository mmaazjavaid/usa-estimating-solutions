import type { Metadata, Viewport } from 'next';
import { Inter, Manrope } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

/**
 * CMS-driven header, footer, and pages read from MongoDB — must not be statically cached
 * (Vercel CDN / Full Route Cache) or new pages disappear from nav until redeploy.
 * SEO: each request still runs `generateMetadata` on the relevant route; crawlers receive
 * full HTML with canonical/meta from the database (same as typical SSR).
 */
export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title:
    'USA Estimating Solutions - Professional Construction Estimating Services',
  description:
    'We provide professional construction estimating services and detailed material takeoff solutions. Bid smarter, price accurately, and win more work.',
  keywords: [
    'construction estimating',
    'material takeoff',
    'cost estimation',
    'construction takeoff',
    'bid estimation',
  ],
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${manrope.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
