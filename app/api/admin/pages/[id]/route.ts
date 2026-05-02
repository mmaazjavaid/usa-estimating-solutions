import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { revalidateAfterCmsPageChange } from '@/lib/cms-revalidate';
import { connectToDatabase } from '@/lib/db';
import { PageModel } from '@/models/Page';
import {
  sanitizePagePatch,
  validateAndFinalizePagePatch,
} from '@/lib/admin-page-update';
import { migrateLegacyCmsSection } from '@/lib/cms-sections/legacy-map';
import { syncChildTradeInParents } from '@/lib/parent-trade-sync';

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  await connectToDatabase();
  const { id } = await params;
  const raw = await PageModel.findById(id).lean();

  if (!raw) {
    return NextResponse.json({ message: 'Page not found.' }, { status: 404 });
  }

  const sections = Array.isArray(raw.sections)
    ? raw.sections.map((s: { key?: string; type?: string; order?: number; data?: unknown }) =>
        migrateLegacyCmsSection({
          key: String(s.key || ''),
          type: String(s.type || ''),
          order: typeof s.order === 'number' ? s.order : 0,
          data:
            s.data && typeof s.data === 'object' && !Array.isArray(s.data)
              ? (s.data as Record<string, unknown>)
              : {},
        }),
      )
    : raw.sections;

  const data = { ...raw, sections };

  return NextResponse.json({ data });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  const raw = (await request.json()) as Record<string, unknown>;
  const patch = sanitizePagePatch(raw);
  const { id } = await params;

  await connectToDatabase();
  const existing = await PageModel.findById(id).lean();

  if (!existing) {
    return NextResponse.json({ message: 'Page not found.' }, { status: 404 });
  }

  const finalized = await validateAndFinalizePagePatch({
    existing: {
      _id: existing._id,
      name: existing.name,
      slug: existing.slug,
      path: existing.path,
      renderMode: existing.renderMode,
    },
    patch,
  });

  if (!finalized.ok) {
    return NextResponse.json({ message: finalized.message }, { status: 400 });
  }

  if (Object.keys(finalized.update).length === 0) {
    return NextResponse.json({ data: existing });
  }

  const data = await PageModel.findByIdAndUpdate(id, finalized.update, {
    new: true,
  }).lean();

  if (!data) {
    return NextResponse.json({ message: 'Page not found.' }, { status: 404 });
  }

  revalidateAfterCmsPageChange(String(data.path ?? ''));

  // Sync child trade into parent's site_trade_lower types when relevant fields change
  const isTradePage = String(existing.path ?? '').startsWith('/trades/');
  if (isTradePage) {
    const ex = existing as Record<string, unknown>;
    const upd = data as Record<string, unknown>;
    void syncChildTradeInParents({
      childPath: String(upd.path ?? ''),
      childName: String(upd.name ?? ''),
      childDescription: String(upd.parentTradeDescription ?? ''),
      oldTradeLocation: String(ex.tradeLocation ?? 'independent'),
      oldParentTrade: (ex.parentTrade as string | null) ?? null,
      newTradeLocation: String(upd.tradeLocation ?? 'independent'),
      newParentTrade: (upd.parentTrade as string | null) ?? null,
    });
  }

  return NextResponse.json({ data });
}

export async function DELETE(_: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await params;
  await connectToDatabase();
  const data = await PageModel.findByIdAndDelete(id).lean();

  if (!data) {
    return NextResponse.json({ message: 'Page not found.' }, { status: 404 });
  }

  revalidateAfterCmsPageChange(String((data as { path?: string }).path ?? ''));

  return NextResponse.json({ ok: true });
}
