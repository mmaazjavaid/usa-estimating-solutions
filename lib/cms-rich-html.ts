/**
 * HTML helpers for the "Rich content" CMS section.
 *
 * - `cleanRichHtml` runs in the browser (needs DOMParser). It turns HTML pasted from Google Docs,
 *   Word or other websites into a small, predictable set of semantic tags — headings, paragraphs,
 *   line breaks, lists, links, bold/italic/underline, quotes, tables — and drops fonts, colors and
 *   classes so the copy picks up the site's own styling (pasted black text would be invisible on
 *   the dark site otherwise).
 * - `stripUnsafeHtml` is a DOM-free safety pass used when rendering on the server.
 */

/** Tags kept as-is (attributes are still filtered). */
const KEEP_TAGS = new Set([
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'hr', 'br',
  'strong', 'em', 'u', 's', 'sub', 'sup', 'a', 'img',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
]);

/** Tags renamed to their semantic equivalent. */
const RENAME_TAGS: Record<string, string> = {
  b: 'strong',
  i: 'em',
  strike: 's',
  del: 's',
  ins: 'u',
};

/** Tags removed together with everything inside them. */
const DROP_TAGS = new Set([
  'script', 'style', 'meta', 'link', 'title', 'head', 'iframe', 'object', 'embed',
  'noscript', 'template', 'svg', 'math', 'canvas', 'video', 'audio', 'form', 'input',
  'button', 'select', 'textarea',
]);

const BLOCK_TAGS = new Set([
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'pre', 'hr',
  'table', 'div', 'section', 'article', 'header', 'footer', 'main', 'aside', 'nav',
]);

const ALIGNABLE_TAGS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'th', 'td']);

const BARE_DOMAIN_PATTERN = /^[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i;

/** Normalize a link destination; returns `null` for anything unsafe (e.g. `javascript:`). */
export function normalizeRichHref(raw: string): string | null {
  const href = raw.trim();
  if (!href) return null;
  if (href.startsWith('/') || href.startsWith('#')) return href;
  if (/^https?:\/\//i.test(href)) return href;
  if (/^(mailto|tel):/i.test(href)) return href;
  if (BARE_DOMAIN_PATTERN.test(href)) return `https://${href}`;
  return null;
}

function styleValue(el: Element, prop: string): string {
  return (el as HTMLElement).style?.getPropertyValue(prop)?.trim().toLowerCase() ?? '';
}

function isBoldWeight(weight: string): boolean {
  if (weight === 'bold' || weight === 'bolder') return true;
  const n = parseInt(weight, 10);
  return Number.isFinite(n) && n >= 600;
}

/** Inline formatting that editors (notably Google Docs) express with styled `<span>`s. */
function inlineStyleWrappers(el: Element): string[] {
  const wrappers: string[] = [];
  if (isBoldWeight(styleValue(el, 'font-weight'))) wrappers.push('strong');
  if (styleValue(el, 'font-style') === 'italic') wrappers.push('em');
  const decoration = `${styleValue(el, 'text-decoration')} ${styleValue(el, 'text-decoration-line')}`;
  if (decoration.includes('underline')) wrappers.push('u');
  if (decoration.includes('line-through')) wrappers.push('s');
  const va = styleValue(el, 'vertical-align');
  if (va === 'super') wrappers.push('sup');
  if (va === 'sub') wrappers.push('sub');
  return wrappers;
}

function hasBlockChild(el: Element): boolean {
  return Array.from(el.children).some((c) => BLOCK_TAGS.has(c.tagName.toLowerCase()));
}

function cleanChildren(source: Node, target: Node, doc: Document) {
  source.childNodes.forEach((child) => {
    cleanNode(child, doc).forEach((n) => target.appendChild(n));
  });
}

function cleanNode(node: Node, doc: Document): Node[] {
  if (node.nodeType === Node.TEXT_NODE) {
    return [doc.createTextNode(node.textContent ?? '')];
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return [];
  }

  const el = node as Element;
  // Word adds namespaced tags like <o:p>; strip the prefix before deciding what to do.
  const rawTag = el.tagName.toLowerCase();
  const tag = rawTag.includes(':') ? '' : rawTag;

  if (DROP_TAGS.has(tag)) {
    return [];
  }

  // Google Docs wraps the whole clipboard in <b style="font-weight:normal" id="docs-internal-guid-…">.
  const isDocsWrapper = tag === 'b' && (el.id.startsWith('docs-internal-guid') || styleValue(el, 'font-weight') === 'normal');

  let outTag = RENAME_TAGS[tag] ?? tag;
  if (isDocsWrapper) {
    outTag = '';
  } else if (tag === 'div' || tag === 'section' || tag === 'article') {
    // A plain text container becomes a paragraph; a wrapper around blocks is unwrapped.
    outTag = hasBlockChild(el) ? '' : 'p';
  }

  if (!outTag || !KEEP_TAGS.has(outTag)) {
    // Unknown/presentational tag (span, font, …): keep its content, plus any bold/italic it implied.
    const frag = doc.createDocumentFragment();
    cleanChildren(el, frag, doc);
    const wrappers = isDocsWrapper ? [] : inlineStyleWrappers(el);
    let result: Node = frag;
    for (const w of wrappers) {
      const wrap = doc.createElement(w);
      wrap.appendChild(result);
      result = wrap;
    }
    return [result];
  }

  if (outTag === 'img') {
    const src = (el.getAttribute('src') ?? '').trim();
    if (!/^https?:\/\//i.test(src) && !src.startsWith('/')) {
      return [];
    }
    const img = doc.createElement('img');
    img.setAttribute('src', src);
    const alt = el.getAttribute('alt');
    if (alt) img.setAttribute('alt', alt);
    return [img];
  }

  const out = doc.createElement(outTag);

  if (outTag === 'a') {
    const href = normalizeRichHref(el.getAttribute('href') ?? '');
    if (!href) {
      // Unsafe or empty link: keep the text only.
      const frag = doc.createDocumentFragment();
      cleanChildren(el, frag, doc);
      return [frag];
    }
    out.setAttribute('href', href);
    if (/^https?:\/\//i.test(href)) {
      out.setAttribute('target', '_blank');
      out.setAttribute('rel', 'noopener noreferrer');
    }
  }

  if (outTag === 'ol') {
    const start = el.getAttribute('start');
    if (start && /^\d+$/.test(start)) out.setAttribute('start', start);
  }

  if (outTag === 'td' || outTag === 'th') {
    for (const attr of ['colspan', 'rowspan']) {
      const v = el.getAttribute(attr);
      if (v && /^\d+$/.test(v)) out.setAttribute(attr, v);
    }
  }

  if (ALIGNABLE_TAGS.has(outTag)) {
    const align = styleValue(el, 'text-align') || (el.getAttribute('align') ?? '').toLowerCase();
    if (align === 'center' || align === 'right' || align === 'justify') {
      out.setAttribute('style', `text-align: ${align}`);
    }
  }

  cleanChildren(el, out, doc);

  // Word marks blank lines as <p>&nbsp;</p>; store them like Docs does (<p><br></p>) so both render
  // as a single empty line.
  if (outTag === 'p' && !out.querySelector('img, br') && !(out.textContent ?? '').replace(/ /g, '').trim()) {
    out.replaceChildren(doc.createElement('br'));
  }

  return [out];
}

/**
 * Wrap stray top-level inline content (text, <strong>, <a>, <br>…) into paragraphs so every line of
 * the section gets consistent paragraph spacing.
 */
function wrapLooseInline(root: HTMLElement, doc: Document) {
  let current: HTMLElement | null = null;
  Array.from(root.childNodes).forEach((child) => {
    const isBlock =
      child.nodeType === Node.ELEMENT_NODE &&
      BLOCK_TAGS.has((child as Element).tagName.toLowerCase());
    if (isBlock) {
      current = null;
      return;
    }
    if (child.nodeType === Node.TEXT_NODE && !(child.textContent ?? '').trim() && !current) {
      root.removeChild(child);
      return;
    }
    if (!current) {
      current = doc.createElement('p');
      root.insertBefore(current, child);
    }
    current.appendChild(child);
  });
}

/** Browser-only: normalize pasted/edited HTML to the allowed semantic subset. */
export function cleanRichHtml(html: string): string {
  if (typeof window === 'undefined' || !html) {
    return html || '';
  }
  // Word's clipboard includes conditional comments and <!--StartFragment--> markers.
  const withoutComments = html.replace(/<!--[\s\S]*?-->/g, '');
  const parsed = new DOMParser().parseFromString(withoutComments, 'text/html');
  const doc = document.implementation.createHTMLDocument('');
  const root = doc.createElement('div');
  cleanChildren(parsed.body, root, doc);
  wrapLooseInline(root, doc);
  return root.innerHTML.trim();
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Plain-text paste: blank lines start new paragraphs, single newlines become line breaks. */
export function plainTextToRichHtml(text: string): string {
  return text
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

/**
 * Server-side safety pass for stored rich HTML. Content is already cleaned in the admin editor;
 * this only guards against scripts, event handlers and `javascript:` URLs reaching the page.
 */
export function stripUnsafeHtml(html: string): string {
  return String(html || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|object|embed|noscript|template|svg|math|form)\b[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<(script|style|iframe|object|embed|link|meta|base|form|input|button)\b[^>]*>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s+(href|src)\s*=\s*("|')\s*(javascript|vbscript|data):[^"']*\2/gi, '')
    .replace(/\s+(href|src)\s*=\s*(javascript|vbscript|data):[^\s>]*/gi, '');
}
