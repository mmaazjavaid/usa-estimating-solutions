import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { ensureBaseCmsRecords } from '@/lib/cms';
import { PageModel } from '@/models/Page';

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  await ensureBaseCmsRecords();
  const data = await PageModel.find().sort({ path: 1 }).lean();
  return NextResponse.json({ data });
}
