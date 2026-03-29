import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { connectToDatabase } from '@/lib/db';
import { PageModel } from '@/models/Page';
import {
  sanitizePagePatch,
  validateAndFinalizePagePatch,
} from '@/lib/admin-page-update';
import { migrateLegacyCmsSection } from '@/lib/cms-sections/legacy-map';

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

  return NextResponse.json({ ok: true });
}
