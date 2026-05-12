/** Legacy public trade URLs used `/trades/{segment}`; canonical paths are now `/{segment}`. */

const LEGACY_TRADES_SUBPAGE = /^\/trades\/([^/]+)$/;

/** If `href` is exactly `/trades/{segment}`, return `/{segment}`; otherwise return `href` unchanged. */
export function rewriteLegacyTradesSubpath(href: string): string {
  const t = href.trim();
  const m = t.match(LEGACY_TRADES_SUBPAGE);
  return m ? `/${m[1]}` : href;
}

export function deepRewriteLegacyTradesPaths(value: unknown): { next: unknown; changed: boolean } {
  if (typeof value === 'string') {
    const next = rewriteLegacyTradesSubpath(value);
    return { next, changed: next !== value };
  }
  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((item) => {
      const r = deepRewriteLegacyTradesPaths(item);
      if (r.changed) {
        changed = true;
      }
      return r.next;
    });
    return { next, changed };
  }
  if (value && typeof value === 'object') {
    let changed = false;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const r = deepRewriteLegacyTradesPaths(v);
      if (r.changed) {
        changed = true;
      }
      out[k] = r.next;
    }
    return { next: out, changed };
  }
  return { next: value, changed: false };
}
