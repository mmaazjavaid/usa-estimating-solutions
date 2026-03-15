import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { connectToDatabase } from '@/lib/db';
import { SubServiceModel } from '@/models/SubService';

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await params;
  await connectToDatabase();
  const data = await SubServiceModel.findById(id).lean();

  if (!data) {
    return NextResponse.json(
      { message: 'Sub-service not found.' },
      { status: 404 },
    );
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  const body = (await request.json()) as Record<string, unknown>;
  const { id } = await params;
  await connectToDatabase();

  const data = await SubServiceModel.findByIdAndUpdate(id, body, {
    new: true,
  }).lean();

  if (!data) {
    return NextResponse.json(
      { message: 'Sub-service not found.' },
      { status: 404 },
    );
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
  const data = await SubServiceModel.findByIdAndDelete(id).lean();

  if (!data) {
    return NextResponse.json(
      { message: 'Sub-service not found.' },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}
