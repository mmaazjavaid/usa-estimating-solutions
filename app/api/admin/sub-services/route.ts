import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { connectToDatabase } from '@/lib/db';
import { SubServiceModel } from '@/models/SubService';

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  await connectToDatabase();
  const data = await SubServiceModel.find()
    .populate('serviceId', 'name slug')
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  const body = (await request.json()) as {
    serviceId?: string;
    name?: string;
    slug?: string;
    shortDescription?: string;
    metaTitle?: string;
    metaDescription?: string;
    indexStatus?: 'index' | 'noindex';
    status?: 'published' | 'unpublished';
  };

  if (!body.serviceId || !body.name?.trim() || !body.slug?.trim()) {
    return NextResponse.json(
      { message: 'Service, name, and slug are required.' },
      { status: 400 },
    );
  }

  await connectToDatabase();
  const data = await SubServiceModel.create({
    serviceId: body.serviceId,
    name: body.name.trim(),
    slug: body.slug.trim(),
    shortDescription: body.shortDescription ?? '',
    metaTitle: body.metaTitle ?? '',
    metaDescription: body.metaDescription ?? '',
    indexStatus: body.indexStatus ?? 'index',
    status: body.status ?? 'published',
  });

  return NextResponse.json({ data }, { status: 201 });
}
