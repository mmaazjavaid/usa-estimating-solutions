import type { ReactNode } from 'react';
import { PromoBanner } from '@/components/common/promo-banner';

export default function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <PromoBanner />
    </>
  );
}
