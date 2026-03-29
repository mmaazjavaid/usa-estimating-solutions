import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { ensureBaseCmsRecords } from '@/lib/cms';
import { connectToDatabase } from '@/lib/db';
import { PageModel } from '@/models/Page';
import { validateNewDynamicPage } from '@/lib/admin-page-update';

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  await ensureBaseCmsRecords();
  const data = await PageModel.find().sort({ path: 1 }).lean();
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  const body = (await request.json()) as Record<string, unknown>;
  const validated = await validateNewDynamicPage(body);

  if (!validated.ok) {
    return NextResponse.json({ message: validated.message }, { status: 400 });
  }

  await ensureBaseCmsRecords();
  await connectToDatabase();
  const created = await PageModel.create(validated.doc);
  const data = created.toObject();

  return NextResponse.json({ data }, { status: 201 });
}
