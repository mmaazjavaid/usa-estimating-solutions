import React from 'react';

type RawHeadTagsProps = {
  /** Admin-authored raw head markup (JSON-LD <script> blocks, verification <meta>, <link> tags). */
  html?: string | null;
};

/**
 * Renders admin-authored `headerMetaTags` / `footerMetaTags` as REAL DOM elements in the
 * server-rendered HTML (JSON-LD `<script>`, `<meta>`, `<link>`).
 *
 * Why this exists: these strings used to be passed through Next.js `metadata.other`, which emits
 * `<meta name="headerMetaTags" content="...">` with the value HTML-escaped into an attribute — so
 * JSON-LD never became a real `<script>` element and schema.org/Google validators saw nothing.
 *
 * React 19 / Next 16 hoist `<meta>` and `<link>` rendered anywhere in the tree into `<head>`;
 * inline JSON-LD `<script>` stays where rendered (valid — crawlers parse JSON-LD anywhere in the doc).
 *
 * The input is authored only by authenticated admins (trusted), so regex extraction +
 * `dangerouslySetInnerHTML` is acceptable here. Do NOT feed untrusted/user input to this component.
 */
export function RawHeadTags({ html }: RawHeadTagsProps) {
  const nodes = parseHeadHtml(html ?? '');
  if (nodes.length === 0) {
    return null;
  }
  return <>{nodes}</>;
}

// React prop names for HTML attributes that differ in casing/spelling.
const ATTR_NAME_MAP: Record<string, string> = {
  charset: 'charSet',
  'http-equiv': 'httpEquiv',
  class: 'className',
  for: 'htmlFor',
  crossorigin: 'crossOrigin',
  referrerpolicy: 'referrerPolicy',
};

function parseAttrs(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrString)) !== null) {
    const rawName = m[1].toLowerCase();
    const value = m[3] ?? m[4] ?? m[5] ?? '';
    attrs[ATTR_NAME_MAP[rawName] ?? rawName] = value;
  }
  return attrs;
}

/**
 * Extracts top-level `<script>…</script>` blocks and standalone `<meta>` / `<link>` tags from a
 * raw HTML string and returns them as real React elements. Anything else (stray text, comments)
 * is ignored.
 */
function parseHeadHtml(raw: string): React.ReactNode[] {
  const html = raw.trim();
  if (!html) {
    return [];
  }

  const nodes: React.ReactNode[] = [];
  const tagRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>|<(meta|link)\b([^>]*?)\/?>/gi;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = tagRegex.exec(html)) !== null) {
    if (match[0].slice(0, 7).toLowerCase() === '<script') {
      const attrs = parseAttrs(match[1] ?? '');
      const inner = match[2] ?? '';
      nodes.push(
        <script key={key++} {...attrs} dangerouslySetInnerHTML={{ __html: inner }} />,
      );
      continue;
    }

    const tag = (match[3] ?? '').toLowerCase();
    const attrs = parseAttrs(match[4] ?? '');
    if (tag === 'meta') {
      nodes.push(<meta key={key++} {...attrs} />);
    } else if (tag === 'link') {
      nodes.push(<link key={key++} {...attrs} />);
    }
  }

  return nodes;
}
