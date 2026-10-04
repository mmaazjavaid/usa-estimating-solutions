/**
 * SEO redirects managed from the admin (`/admin/redirects`).
 *
 * Pure helpers only — no database or Node APIs — so the same rules run in `proxy.ts`, the admin
 * API routes (validation) and the admin UI (the "test a URL" box).
 *
 * Source rules:
 *  - Stored as a normalized path: leading `/`, no trailing slash, no query/hash, lowercase.
 *  - A trailing `/*` makes it a wildcard: `/old-blog/*` matches `/old-blog` and anything under it.
 * Destination rules:
 *  - An internal path (`/new-page`, may include `?query` / `#hash`) or a full `https://` URL.
 *  - For wildcard sources a `*` in the destination is replaced with the matched remainder,
 *    e.g. `/old-blog/*` → `/blog/*` sends `/old-blog/my-post` to `/blog/my-post`.
 */

export const REDIRECT_STATUS_CODES = [301, 302] as const;
export type RedirectStatusCode = (typeof REDIRECT_STATUS_CODES)[number];

export type RedirectRule = {
  id: string;
  source: string;
  destination: string;
  statusCode: RedirectStatusCode;
  enabled: boolean;
};

/** Paths the redirect manager must never take over. */
const RESERVED_PREFIXES = ['/admin', '/api', '/_next', '/login'];

const MAX_CHAIN_HOPS = 10;

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function safeDecode(path: string): string {
  try {
    return decodeURI(path);
  } catch {
    return path;
  }
}

/** Collapse slashes, drop the trailing slash (except for `/`) and percent-decode. */
function tidyPath(path: string): string {
  let p = safeDecode(path.trim());
  if (!p.startsWith('/')) p = `/${p}`;
  p = p.replace(/\/{2,}/g, '/');
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return p || '/';
}

/** Normalize a request pathname for lookup (case-insensitive, trailing-slash-insensitive). */
export function normalizeRequestPath(pathname: string): string {
  return tidyPath(pathname).toLowerCase();
}

function isReserved(path: string): boolean {
  return RESERVED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

/**
 * Validate and normalize a redirect source. Accepts a path (`/old-page`, `old-page/`) or a full URL
 * copied from the browser / Search Console (`https://www.site.com/old-page?x=1` → `/old-page`).
 */
export function normalizeRedirectSource(input: string): Result<string> {
  let raw = String(input ?? '').trim();
  if (!raw) {
    return { ok: false, error: 'Old URL is required.' };
  }
  if (/^https?:\/\//i.test(raw)) {
    try {
      raw = new URL(raw).pathname;
    } catch {
      return { ok: false, error: 'Old URL is not a valid address.' };
    }
  } else {
    raw = raw.replace(/[?#].*$/, '');
  }

  const wildcard = /\/\*$/.test(raw) || raw === '*';
  if (wildcard) raw = raw.replace(/\/?\*$/, '');
  if (raw.includes('*')) {
    return { ok: false, error: 'A * wildcard is only allowed at the end of the old URL, like /old-blog/*.' };
  }
  if (/\s/.test(raw)) {
    return { ok: false, error: 'Old URL cannot contain spaces.' };
  }

  const path = normalizeRequestPath(raw);
  if (path === '/') {
    return { ok: false, error: 'The homepage (/) cannot be redirected.' };
  }
  if (isReserved(path)) {
    return { ok: false, error: `Paths under ${RESERVED_PREFIXES.join(', ')} cannot be redirected.` };
  }
  return { ok: true, value: wildcard ? `${path}/*` : path };
}

export function isWildcardSource(source: string): boolean {
  return source.endsWith('/*');
}

/**
 * Validate and normalize a redirect destination. `siteOrigin` (e.g. `https://www.example.com`) lets
 * a full URL on this same site be stored as a plain path so it keeps working across domains.
 */
export function normalizeRedirectDestination(
  input: string,
  opts: { wildcardSource: boolean; siteOrigin?: string },
): Result<string> {
  let raw = String(input ?? '').trim();
  if (!raw) {
    return { ok: false, error: 'New URL is required.' };
  }
  if (/\s/.test(raw)) {
    return { ok: false, error: 'New URL cannot contain spaces.' };
  }
  if (raw.startsWith('//')) {
    return { ok: false, error: 'New URL must be a path like /page or a full https:// address.' };
  }
  if (raw.includes('*') && !opts.wildcardSource) {
    return { ok: false, error: 'A * in the new URL only works when the old URL ends with /*.' };
  }
  if ((raw.match(/\*/g) ?? []).length > 1) {
    return { ok: false, error: 'The new URL can contain at most one *.' };
  }

  // Bare domain (example.com/page) → external https URL.
  if (!raw.startsWith('/') && !/^https?:\/\//i.test(raw)) {
    if (/^[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i.test(raw)) {
      raw = `https://${raw}`;
    } else {
      return { ok: false, error: 'New URL must start with / (this site) or https:// (another site).' };
    }
  }

  if (/^https?:\/\//i.test(raw)) {
    let url: URL;
    try {
      url = new URL(raw.replace('*', '__wildcard__'));
    } catch {
      return { ok: false, error: 'New URL is not a valid address.' };
    }
    const sameSite = opts.siteOrigin && sameHost(url.host, opts.siteOrigin);
    if (!sameSite) {
      return { ok: true, value: raw };
    }
    raw = `${url.pathname}${url.search}${url.hash}`.replace('__wildcard__', '*');
  }

  // Internal path: tidy the path part, keep query/hash as typed.
  const match = raw.match(/^([^?#]*)(.*)$/);
  const pathPart = match?.[1] ?? raw;
  const rest = match?.[2] ?? '';
  const path = tidyPath(pathPart);
  if (isReserved(path.toLowerCase())) {
    return { ok: false, error: `New URL cannot point to ${RESERVED_PREFIXES.join(', ')}.` };
  }
  return { ok: true, value: `${path}${rest}` };
}

function sameHost(host: string, siteOrigin: string): boolean {
  try {
    const strip = (h: string) => h.toLowerCase().replace(/^www\./, '');
    return strip(host) === strip(new URL(siteOrigin).host);
  } catch {
    return false;
  }
}

export type RedirectMatch = {
  rule: RedirectRule;
  /** Final destination for this request (wildcard filled in), before query-string merging. */
  destination: string;
};

/**
 * Index enabled rules for fast lookup: exact sources in a Map, wildcards longest-prefix first.
 * Build once per rules snapshot and reuse for every request.
 */
export function buildRedirectIndex(rules: RedirectRule[]) {
  const exact = new Map<string, RedirectRule>();
  const wildcards: { prefix: string; rule: RedirectRule }[] = [];
  for (const rule of rules) {
    if (!rule.enabled) continue;
    if (isWildcardSource(rule.source)) {
      wildcards.push({ prefix: rule.source.slice(0, -2), rule });
    } else {
      exact.set(rule.source, rule);
    }
  }
  wildcards.sort((a, b) => b.prefix.length - a.prefix.length);
  return { exact, wildcards };
}

export type RedirectIndex = ReturnType<typeof buildRedirectIndex>;

/** Find the redirect for a request pathname, or `null`. Exact rules win over wildcards. */
export function matchRedirect(index: RedirectIndex, pathname: string): RedirectMatch | null {
  const tidy = tidyPath(pathname);
  const key = tidy.toLowerCase();

  const exact = index.exact.get(key);
  if (exact) {
    return { rule: exact, destination: exact.destination };
  }

  for (const { prefix, rule } of index.wildcards) {
    if (key === prefix || key.startsWith(`${prefix}/`)) {
      // Keep the visitor's original casing for the carried-over part of the path.
      const remainder = tidy.slice(prefix.length).replace(/^\//, '');
      const destination = rule.destination.includes('*')
        ? rule.destination.replace('*', remainder).replace(/\/{2,}/g, '/').replace(/^(https?:)\//i, '$1//')
        : rule.destination;
      return { rule, destination: destination.replace(/(.)\/+(?=$|[?#])/, '$1') };
    }
  }
  return null;
}

/**
 * Build the final redirect URL: resolve against the request origin and carry the visitor's query
 * string over (e.g. `?utm_source=…`), letting parameters set on the destination win.
 */
export function buildRedirectUrl(destination: string, requestUrl: string): URL {
  const incoming = new URL(requestUrl);
  const target = new URL(destination, incoming.origin);
  incoming.searchParams.forEach((value, key) => {
    if (!target.searchParams.has(key)) {
      target.searchParams.append(key, value);
    }
  });
  return target;
}

function internalPathOf(destination: string): string | null {
  if (/^https?:\/\//i.test(destination)) return null;
  return destination.replace(/[?#].*$/, '');
}

/**
 * Follow the redirect chain starting from `candidate` (as if it were saved) and report a loop or an
 * overly long chain. Returns an error message, or `null` if the rule is safe.
 */
export function findRedirectLoop(rules: RedirectRule[], candidate: RedirectRule): string | null {
  const others = rules.filter((r) => r.id !== candidate.id);
  const index = buildRedirectIndex([...others, { ...candidate, enabled: true }]);

  // For wildcards, probe with a sample path underneath the prefix.
  const start = isWildcardSource(candidate.source)
    ? `${candidate.source.slice(0, -2)}/loop-check`
    : candidate.source;

  const seen = new Set<string>([normalizeRequestPath(start)]);
  let current = start;
  for (let hop = 0; hop < MAX_CHAIN_HOPS; hop += 1) {
    const match = matchRedirect(index, current);
    if (!match) return null;
    const next = internalPathOf(match.destination);
    if (next === null) return null; // leaves the site
    const key = normalizeRequestPath(next);
    if (seen.has(key)) {
      return next === current || hop === 0
        ? 'The new URL redirects back to the old URL, which would create an endless loop.'
        : `This would create a redirect loop (it eventually comes back to ${next}).`;
    }
    seen.add(key);
    current = next;
  }
  return `This creates a chain of more than ${MAX_CHAIN_HOPS} redirects. Point it straight at the final page instead.`;
}

/** Describe every hop a URL goes through (for the admin "test a URL" tool). */
export function traceRedirects(
  rules: RedirectRule[],
  input: string,
): { hops: { from: string; to: string; statusCode: number; ruleId: string }[]; loop: boolean } {
  const index = buildRedirectIndex(rules);
  let current = input.trim();
  if (/^https?:\/\//i.test(current)) {
    try {
      current = new URL(current).pathname;
    } catch {
      return { hops: [], loop: false };
    }
  }
  current = current.replace(/[?#].*$/, '') || '/';

  const hops: { from: string; to: string; statusCode: number; ruleId: string }[] = [];
  const seen = new Set<string>([normalizeRequestPath(current)]);
  for (let hop = 0; hop < MAX_CHAIN_HOPS; hop += 1) {
    const match = matchRedirect(index, current);
    if (!match) return { hops, loop: false };
    hops.push({ from: current, to: match.destination, statusCode: match.rule.statusCode, ruleId: match.rule.id });
    const next = internalPathOf(match.destination);
    if (next === null) return { hops, loop: false };
    const key = normalizeRequestPath(next);
    if (seen.has(key)) return { hops, loop: true };
    seen.add(key);
    current = next;
  }
  return { hops, loop: true };
}

/**
 * Parse a bulk import. One redirect per line: `old, new` or `old, new, 302` (commas, tabs or
 * spaces). A header row and blank / `#` comment lines are skipped.
 */
export function parseRedirectImport(
  text: string,
): { line: number; source: string; destination: string; statusCode: RedirectStatusCode | null; raw: string }[] {
  const rows: {
    line: number;
    source: string;
    destination: string;
    statusCode: RedirectStatusCode | null;
    raw: string;
  }[] = [];
  String(text ?? '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .forEach((rawLine, i) => {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) return;
      const parts = (line.includes(',') || line.includes('\t') ? line.split(/[,\t]/) : line.split(/\s+/))
        .map((p) => p.trim().replace(/^"(.*)"$/, '$1'))
        .filter((p, idx) => p !== '' || idx < 2);
      const [source = '', destination = '', code = ''] = parts;
      if (
        /^(old([ _-]?(url|path))?|source|from)$/i.test(source) &&
        /^(new([ _-]?(url|path))?|destination|target|to)$/i.test(destination)
      ) {
        return; // header row
      }
      const n = parseInt(code, 10);
      rows.push({
        line: i + 1,
        source,
        destination,
        statusCode: n === 301 || n === 302 ? n : null,
        raw: line,
      });
    });
  return rows;
}
