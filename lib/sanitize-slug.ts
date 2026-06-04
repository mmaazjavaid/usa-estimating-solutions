/** Shared by admin UI and server validators — keep free of server-only imports. */

/**
 * Strip invisible characters that survive `String.prototype.trim()`.
 *
 * `.trim()` only removes whitespace (category Zs) plus line terminators — it does NOT remove
 * zero-width spaces (U+200B), zero-width joiners, the BOM (U+FEFF), bidi marks, soft hyphens, or
 * control characters. These get pasted in from word processors / chat apps and break slug↔path
 * matching: the page saves with a hidden char in its path, but the real URL has none, so the route
 * 404s and the sitemap emits a `%E2%80%8B`-style encoded URL.
 *
 * `\p{Cc}` covers C0/C1 control chars; `\p{Cf}` covers format chars (zero-width spaces/joiners,
 * word joiner, BOM, bidi marks, soft hyphen). Slashes and normal characters are preserved.
 */
export function stripInvisibleChars(value: string): string {
  return value.replace(/[\p{Cc}\p{Cf}]/gu, '');
}

/** Clean a raw slug/path string: drop invisible chars, then trim surrounding whitespace. */
export function cleanSlugInput(raw: unknown): string {
  if (typeof raw !== 'string') {
    return '';
  }
  return stripInvisibleChars(raw).trim();
}
