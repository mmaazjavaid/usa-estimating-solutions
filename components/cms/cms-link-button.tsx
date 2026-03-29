import Link from 'next/link';
import type { CmsLinkValue } from '@/lib/cms-sections/types';

export function resolveCmsHref(link: unknown): string {
  if (!link || typeof link !== 'object') {
    return '#';
  }
  const l = link as Partial<CmsLinkValue>;
  const href = (l.href || '').trim();
  if (!href) {
    return '#';
  }
  if (l.kind === 'external') {
    return href;
  }
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return href;
  }
  return href.startsWith('/') ? href : `/${href}`;
}

type CmsLinkButtonProps = {
  link: unknown;
  className?: string;
};

export function CmsLinkButton({ link, className }: CmsLinkButtonProps) {
  const href = resolveCmsHref(link);
  const label =
    link && typeof link === 'object' && 'label' in link
      ? String((link as CmsLinkValue).label || 'Learn more')
      : 'Learn more';

  const isExternal = href.startsWith('http://') || href.startsWith('https://');

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
