import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { connectToDatabase } from '@/lib/db';
import { normalizeRedirectSource, parseRedirectImport, type RedirectRule } from '@/lib/redirects';
import {
  clearRedirectCache,
  flattenRedirectChains,
  loadAllRedirectRules,
  prepareRedirect,
} from '@/lib/redirects-server';
import { RedirectModel } from '@/models/Redirect';

const MAX_ROWS = 2000;

/**
 * Bulk import from pasted CSV / spreadsheet rows: `old, new[, 301|302]` per line.
 * Existing redirects for the same old URL are updated only when `overwrite` is true.
 */
export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  const body = (await request.json().catch(() => ({}))) as {
    text?: string;
    overwrite?: boolean;
    statusCode?: number;
  };
  const rows = parseRedirectImport(String(body.text ?? ''));
  if (rows.length === 0) {
    return NextResponse.json({ message: 'No redirects found in the pasted text.' }, { status: 400 });
  }
  if (rows.length > MAX_ROWS) {
    return NextResponse.json(
      { message: `Import at most ${MAX_ROWS} redirects at a time.` },
      { status: 400 },
    );
  }

  await connectToDatabase();
  // Validate each row against the rules as they will be after the earlier rows are applied,
  // so loops and duplicates *within* the import are caught too.
  const rules: RedirectRule[] = await loadAllRedirectRules();
  const defaultCode = body.statusCode === 302 ? 302 : 301;

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors: { line: number; text: string; message: string }[] = [];

  for (const row of rows) {
    const normalized = normalizeRedirectSource(row.source);
    const existing = normalized.ok ? rules.find((r) => r.source === normalized.value) : undefined;
    if (existing && !body.overwrite) {
      skipped += 1;
      continue;
    }

    const prepared = prepareRedirect(
      {
        source: row.source,
        destination: row.destination,
        statusCode: row.statusCode ?? defaultCode,
        enabled: true,
      },
      rules,
      existing?.id,
    );
    if (!prepared.ok) {
      errors.push({ line: row.line, text: row.raw, message: prepared.error });
      continue;
    }

    try {
      const { source, destination, statusCode, enabled } = prepared.value;
      if (existing) {
        await RedirectModel.updateOne(
          { _id: existing.id },
          { $set: { source, destination, statusCode, enabled } },
        );
        Object.assign(existing, { source, destination, statusCode, enabled });
        updated += 1;
      } else {
        const doc = await RedirectModel.create({
          source,
          destination,
          statusCode,
          enabled,
          origin: 'manual',
          note: 'Imported',
        });
        rules.push({ id: String(doc._id), source, destination, statusCode, enabled });
        created += 1;
      }
      await flattenRedirectChains(prepared.value.source, prepared.value.destination);
      for (const r of rules) {
        if (r.destination === prepared.value.source && r.source !== prepared.value.destination) {
          r.destination = prepared.value.destination;
        }
      }
    } catch (err) {
      errors.push({
        line: row.line,
        text: row.raw,
        message: err instanceof Error ? err.message : 'Could not save this row.',
      });
    }
  }

  clearRedirectCache();
  return NextResponse.json({ created, updated, skipped, errors });
}

