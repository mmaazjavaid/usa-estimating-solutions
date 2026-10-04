import { connectToDatabase } from '@/lib/db';
import { getSiteUrl } from '@/lib/site-url';
import {
  buildRedirectIndex,
  findRedirectLoop,
  isWildcardSource,
  normalizeRedirectDestination,
  normalizeRedirectSource,
  type RedirectIndex,
  type RedirectRule,
} from '@/lib/redirects';
import { RedirectModel } from '@/models/Redirect';

/**
 * How long a server instance reuses its copy of the redirect rules. Admin changes clear the cache
 * of the instance that handled the save; other instances (e.g. separate serverless functions on
 * Vercel) pick them up within this window.
 */
const CACHE_TTL_MS = 30_000;
/** After a failed load, wait this long before hitting the database again. */
const ERROR_RETRY_MS = 10_000;
/** Never hold a page request longer than this waiting on the database. */
const LOAD_TIMEOUT_MS = 2_500;

type Snapshot = { index: RedirectIndex; expiresAt: number };

const globalCache = globalThis as typeof globalThis & {
  redirectRulesCache?: { snapshot: Snapshot | null; loading: Promise<Snapshot> | null };
};
const cache = (globalCache.redirectRulesCache ??= { snapshot: null, loading: null });

type LeanRedirect = {
  _id: { toString(): string };
  source: string;
  destination: string;
  statusCode?: number;
  enabled?: boolean;
};

export function toRedirectRule(doc: LeanRedirect): RedirectRule {
  return {
    id: doc._id.toString(),
    source: doc.source,
    destination: doc.destination,
    statusCode: doc.statusCode === 302 ? 302 : 301,
    enabled: doc.enabled !== false,
  };
}

/** Load all redirect rules (enabled and disabled) from the database. */
export async function loadAllRedirectRules(): Promise<RedirectRule[]> {
  await connectToDatabase();
  const docs = (await RedirectModel.find({})
    .select('source destination statusCode enabled')
    .lean()) as unknown as LeanRedirect[];
  return docs.map(toRedirectRule);
}

async function loadSnapshot(): Promise<Snapshot> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Timed out loading redirects')), LOAD_TIMEOUT_MS);
  });
  try {
    const rules = await Promise.race([loadAllRedirectRules(), timeout]);
    return { index: buildRedirectIndex(rules), expiresAt: Date.now() + CACHE_TTL_MS };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Cached redirect index for `proxy.ts`. Fails open: if the database is unreachable the site keeps
 * serving pages (using the last known rules, or none) instead of erroring or hanging.
 */
export async function getRedirectIndex(): Promise<RedirectIndex | null> {
  const now = Date.now();
  if (cache.snapshot && cache.snapshot.expiresAt > now) {
    return cache.snapshot.index;
  }
  if (!cache.loading) {
    cache.loading = loadSnapshot()
      .then((snapshot) => {
        cache.snapshot = snapshot;
        return snapshot;
      })
      .catch((err) => {
        console.warn('[redirects] could not load rules', err);
        const fallback: Snapshot = {
          index: cache.snapshot?.index ?? buildRedirectIndex([]),
          expiresAt: Date.now() + ERROR_RETRY_MS,
        };
        cache.snapshot = fallback;
        return fallback;
      })
      .finally(() => {
        cache.loading = null;
      });
  }
  // Serve stale rules while a refresh is in flight; only the very first load waits.
  if (cache.snapshot) {
    return cache.snapshot.index;
  }
  return (await cache.loading).index;
}

/** Drop this instance's cached rules so the next request reloads them. */
export function clearRedirectCache(): void {
  cache.snapshot = null;
}

/** Count a redirect hit (best effort — never throws). */
export async function recordRedirectHit(id: string): Promise<void> {
  try {
    await connectToDatabase();
    await RedirectModel.updateOne({ _id: id }, { $inc: { hits: 1 }, $set: { lastHitAt: new Date() } });
  } catch (err) {
    console.warn('[redirects] could not record hit', err);
  }
}

/**
 * Point every exact redirect that currently lands on `oldTarget` at `newTarget` instead, so visitors
 * and Google take one hop rather than a chain (A → B → C becomes A → C).
 */
export async function flattenRedirectChains(oldTarget: string, newTarget: string): Promise<void> {
  if (!oldTarget || oldTarget === newTarget) return;
  await RedirectModel.updateMany(
    { destination: oldTarget, source: { $ne: newTarget } },
    { $set: { destination: newTarget } },
  );
}

/**
 * Called when a published page/blog moves from `oldPath` to `newPath` in the admin: keeps the old
 * URL working (and its search ranking) with a permanent redirect. Best effort — a failure here must
 * not fail the page save, so errors are logged and swallowed.
 */
export async function createAutoRedirectForMove(oldPath: string, newPath: string): Promise<void> {
  try {
    const from = normalizeRedirectSource(oldPath);
    const to = normalizeRedirectSource(newPath);
    if (!from.ok || !to.ok || from.value === to.value) return;

    await connectToDatabase();

    // The new URL is live now — any redirect away from it would hide the page (or loop back).
    await RedirectModel.deleteMany({ source: to.value });

    const candidate: RedirectRule = {
      id: 'auto',
      source: from.value,
      destination: to.value,
      statusCode: 301,
      enabled: true,
    };
    const existing = (await RedirectModel.findOne({ source: from.value }).lean()) as LeanRedirect | null;
    if (existing) candidate.id = existing._id.toString();

    const loop = findRedirectLoop(await loadAllRedirectRules(), candidate);
    if (loop) {
      console.warn(`[redirects] skipped auto redirect ${from.value} → ${to.value}: ${loop}`);
      return;
    }

    await RedirectModel.updateOne(
      { source: from.value },
      {
        $set: { destination: to.value, statusCode: 301, enabled: true },
        $setOnInsert: {
          origin: 'auto',
          note: `Created automatically when ${from.value} was renamed to ${to.value}.`,
          hits: 0,
        },
      },
      { upsert: true },
    );
    await flattenRedirectChains(from.value, to.value);
    clearRedirectCache();
  } catch (err) {
    console.warn('[redirects] auto redirect failed', err);
  }
}

export type RedirectInput = {
  source?: unknown;
  destination?: unknown;
  statusCode?: unknown;
  enabled?: unknown;
  note?: unknown;
};

export type PreparedRedirect = {
  source: string;
  destination: string;
  statusCode: 301 | 302;
  enabled: boolean;
  note: string;
};

/**
 * Validate an admin-submitted redirect against the normalization rules, duplicates and loops.
 * `rules` is the current rule set; `selfId` is the redirect being edited (omit when creating).
 */
export function prepareRedirect(
  input: RedirectInput,
  rules: RedirectRule[],
  selfId?: string,
): { ok: true; value: PreparedRedirect } | { ok: false; error: string; status: number } {
  const source = normalizeRedirectSource(String(input.source ?? ''));
  if (!source.ok) return { ok: false, error: source.error, status: 400 };

  const destination = normalizeRedirectDestination(String(input.destination ?? ''), {
    wildcardSource: isWildcardSource(source.value),
    siteOrigin: getSiteUrl(),
  });
  if (!destination.ok) return { ok: false, error: destination.error, status: 400 };

  const duplicate = rules.find((r) => r.source === source.value && r.id !== selfId);
  if (duplicate) {
    return { ok: false, error: `A redirect for ${source.value} already exists.`, status: 409 };
  }

  const statusCode = Number(input.statusCode) === 302 ? 302 : 301;
  const enabled = input.enabled === undefined ? true : input.enabled !== false && input.enabled !== 'false';

  if (enabled) {
    const loop = findRedirectLoop(rules, {
      id: selfId ?? '__new__',
      source: source.value,
      destination: destination.value,
      statusCode,
      enabled: true,
    });
    if (loop) return { ok: false, error: loop, status: 400 };
  }

  return {
    ok: true,
    value: {
      source: source.value,
      destination: destination.value,
      statusCode,
      enabled,
      note: String(input.note ?? '').trim().slice(0, 500),
    },
  };
}
