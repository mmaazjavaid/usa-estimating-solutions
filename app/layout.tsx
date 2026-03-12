import type { Metadata, Viewport } from 'next';
import { Inter, Manrope } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

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
