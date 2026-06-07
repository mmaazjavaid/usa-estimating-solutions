import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';

/**
 * Inline links inherit the surrounding text's color and weight (invisible at rest) and reveal a
 * subtle underline on hover. Used for editor-style backlinks that should not visually disrupt copy.
 */
export const INLINE_LINK_CLASS =
  'text-inherit font-[inherit] no-underline decoration-1 underline-offset-2 transition-colors hover:underline';

/** Matches a markdown-style inline link: `[visible text](/path-or-url)`. */
const INLINE_LINK_PATTERN = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;

/** Bare external address with no scheme, e.g. `example.com`, `www.example.com/page`, `a.co.uk?q=1`. */
const BARE_DOMAIN_PATTERN = /^[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i;

/**
 * Normalize an inline-link destination into a safe href, or return `null` to reject it.
 *
 * - `/path` and `#anchor` stay internal (client-side routing, same domain).
 * - `http(s)://…`, `mailto:` and `tel:` are kept verbatim.
 * - A bare domain like `example.com/page` is treated as an EXTERNAL site: we prepend `https://`
 *   so it opens that site, instead of resolving against our own domain (`yourdomain.com/example.com`).
 * - Anything else (e.g. `javascript:`) is rejected.
 */
function resolveHref(raw: string): string | null {
  const href = raw.trim();
  if (!href) return null;
  if (href.startsWith('/') || href.startsWith('#')) return href;
  if (/^https?:\/\//i.test(href)) return href;
  if (href.startsWith('mailto:') || href.startsWith('tel:')) return href;
  if (BARE_DOMAIN_PATTERN.test(href)) return `https://${href}`;
  return null;
}

function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  // External site links open in a new tab; mailto:/tel: are plain anchors; the rest use Next routing.
  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={INLINE_LINK_CLASS}>
        {children}
      </a>
    );
  }
  if (href.startsWith('mailto:') || href.startsWith('tel:')) {
    return (
      <a href={href} className={INLINE_LINK_CLASS}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={INLINE_LINK_CLASS}>
      {children}
    </Link>
  );
}

/**
 * Render plain CMS text, converting inline links written in markdown form — `[label](/path)` or
 * `[label](https://…)` — into anchors that inherit the surrounding styling.
 *
 * This is a safe no-op for ordinary content: text without the `](` link syntax is returned
 * unchanged, so existing copy renders identically. Unsafe hrefs (e.g. `javascript:`) are dropped
 * and only the visible label is kept.
 */
export function renderInlineLinks(text: string): ReactNode {
  if (!text || !text.includes('](')) {
    return text;
  }

  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(INLINE_LINK_PATTERN)) {
    const [full, label, href] = match;
    const start = match.index ?? 0;
    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }
    const resolved = resolveHref(href);
    if (resolved) {
      nodes.push(
        <InlineLink key={start} href={resolved}>
          {label}
        </InlineLink>,
      );
    } else {
      nodes.push(label);
    }
    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return (
    <>
      {nodes.map((node, idx) => (
        <Fragment key={idx}>{node}</Fragment>
      ))}
    </>
  );
}
