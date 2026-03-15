import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { connectToDatabase } from '@/lib/db';
import { ServiceModel } from '@/models/Service';

type Params = { params: Promise<{ id: string }> };

function cleanString(value: unknown) {
  if (typeof value !== 'string') {
    return value;
  }

  return value.trim().replace(/^['"]|['"]$/g, '');
}

function normalizeSlug(value: unknown) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildPathFromSlug(slug: string) {
  return `/${slug}`;
}

export async function GET(_: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await params;
  await connectToDatabase();
  const data = await ServiceModel.findById(id).lean();

  if (!data) {
    return NextResponse.json({ message: 'Service not found.' }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  const body = (await request.json()) as Record<string, unknown>;
  const updatePayload: Record<string, unknown> = { ...body };

  for (const key of [
    'name',
    'slug',
    'shortDescription',
    'image',
    'imageAlt',
    'metaImage',
    'metaTitle',
    'metaDescription',
    'headerMetaTags',
    'footerMetaTags',
  ] as const) {
    if (key in updatePayload) {
      updatePayload[key] = cleanString(updatePayload[key]);
    }
  }

  if ('slug' in updatePayload) {
    const normalizedSlug = normalizeSlug(updatePayload.slug);
    if (!normalizedSlug) {
      return NextResponse.json({ message: 'Invalid service slug.' }, { status: 400 });
    }

    updatePayload.slug = normalizedSlug;
    updatePayload.path = buildPathFromSlug(normalizedSlug);
  } else if ('path' in updatePayload) {
    delete updatePayload.path;
  }
  const { id } = await params;

  await connectToDatabase();
  const data = await ServiceModel.findByIdAndUpdate(id, updatePayload, {
    new: true,
  }).lean();

  if (!data) {
    return NextResponse.json({ message: 'Service not found.' }, { status: 404 });
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
  const data = await ServiceModel.findByIdAndDelete(id).lean();

  if (!data) {
    return NextResponse.json({ message: 'Service not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
