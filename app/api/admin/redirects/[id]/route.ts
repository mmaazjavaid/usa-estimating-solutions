import { Types } from 'mongoose';
import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { connectToDatabase } from '@/lib/db';
import {
  clearRedirectCache,
  flattenRedirectChains,
  loadAllRedirectRules,
  prepareRedirect,
  type RedirectInput,
} from '@/lib/redirects-server';
import { RedirectModel } from '@/models/Redirect';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid id.' }, { status: 400 });
  }

  const body = (await request.json().catch(() => ({}))) as RedirectInput;
  await connectToDatabase();

  const existing = (await RedirectModel.findById(id).lean()) as
    | (RedirectInput & { source: string; destination: string })
    | null;
  if (!existing) {
    return NextResponse.json({ message: 'Redirect not found.' }, { status: 404 });
  }

  // Partial updates (e.g. just toggling `enabled`) keep the other stored values.
  const merged: RedirectInput = {
    source: body.source ?? existing.source,
    destination: body.destination ?? existing.destination,
    statusCode: body.statusCode ?? existing.statusCode,
    enabled: body.enabled ?? existing.enabled,
    note: body.note ?? existing.note,
  };

  const prepared = prepareRedirect(merged, await loadAllRedirectRules(), id);
  if (!prepared.ok) {
    return NextResponse.json({ message: prepared.error }, { status: prepared.status });
  }

  try {
    const data = await RedirectModel.findByIdAndUpdate(id, prepared.value, { new: true }).lean();
    if (prepared.value.enabled) {
      await flattenRedirectChains(prepared.value.source, prepared.value.destination);
    }
    clearRedirectCache();
    return NextResponse.json({ data });
  } catch (err) {
    if ((err as { code?: number }).code === 11000) {
      return NextResponse.json(
        { message: `A redirect for ${prepared.value.source} already exists.` },
        { status: 409 },
      );
    }
    throw err;
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid id.' }, { status: 400 });
  }

  await connectToDatabase();
  const data = await RedirectModel.findByIdAndDelete(id).lean();
  if (!data) {
    return NextResponse.json({ message: 'Redirect not found.' }, { status: 404 });
  }

  clearRedirectCache();
  return NextResponse.json({ ok: true });
}
