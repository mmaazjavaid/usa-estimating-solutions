import { Fragment, type ReactNode } from 'react';

const PHASE_CLASSES = [
  'text-animated-gradient--phase-0',
  'text-animated-gradient--phase-2',
] as const;

/**
 * Render a heading where every even-positioned word (2nd, 4th, 6th, …)
 * is wrapped in the animated gradient span, alternating gold → green → gold.
 *
 * Whitespace and word order are preserved verbatim. Punctuation that
 * sits next to a word (e.g. "Power.") is treated as part of that word.
 */
export function renderGradientHeading(text: string): ReactNode {
  if (!text) {
    return null;
  }

  const tokens = text.split(/(\s+)/);
  let wordIndex = 0;
  let highlightIndex = 0;

  return tokens.map((token, i) => {
    if (token.length === 0) {
      return null;
    }
    if (/^\s+$/.test(token)) {
      return <Fragment key={i}>{token}</Fragment>;
    }

    wordIndex += 1;
    const isEven = wordIndex % 2 === 0;
    if (!isEven) {
      return <Fragment key={i}>{token}</Fragment>;
    }

    const phase = PHASE_CLASSES[highlightIndex % PHASE_CLASSES.length];
    highlightIndex += 1;
    return (
      <span key={i} className={`text-animated-gradient ${phase}`}>
        {token}
      </span>
    );
  });
}

/**
 * Strip HTML tags and decode the most common entities so a stored
 * `headlineHtml` string can be re-rendered with the gradient rule.
 *
 * Inline tags (e.g. `<span>`, `<em>`) are removed without inserting
 * whitespace so attached punctuation stays glued to its word
 * (`<span>Power</span>.` → `Power.`). Line-breaking tags collapse to a
 * single space so word counting stays correct.
 */
export function stripHtmlToText(html: string): string {
  if (!html) {
    return '';
  }
  return html
    .replace(/<\s*br\s*\/?\s*>/gi, ' ')
    .replace(/<\s*\/?\s*(p|div|h[1-6]|li|ul|ol|section|article|header|footer|nav|aside|tr|td|th)\b[^>]*>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}
