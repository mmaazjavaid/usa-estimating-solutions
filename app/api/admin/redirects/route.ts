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

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  await connectToDatabase();
  const data = await RedirectModel.find({}).sort({ updatedAt: -1 }).lean();
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  const body = (await request.json().catch(() => ({}))) as RedirectInput;
  await connectToDatabase();

  const prepared = prepareRedirect(body, await loadAllRedirectRules());
  if (!prepared.ok) {
    return NextResponse.json({ message: prepared.error }, { status: prepared.status });
  }

  try {
    const data = await RedirectModel.create({ ...prepared.value, origin: 'manual' });
    if (prepared.value.enabled) {
      await flattenRedirectChains(prepared.value.source, prepared.value.destination);
    }
    clearRedirectCache();
    return NextResponse.json({ data }, { status: 201 });
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
