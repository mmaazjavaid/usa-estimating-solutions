/** Shared by admin UI and `cms-pages` — keep free of server-only imports. */

export function parseTradeSlugInput(raw: string): string {
  const s = raw.trim().replace(/^\/+/, '').toLowerCase();
  const rest = s.startsWith('trade-') ? s.slice(6) : s;
  return rest
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
