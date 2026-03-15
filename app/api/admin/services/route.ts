import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { connectToDatabase } from '@/lib/db';
import { ServiceModel } from '@/models/Service';

function cleanString(value: string | undefined) {
  return value?.trim().replace(/^['"]|['"]$/g, '') ?? '';
}

function normalizeSlug(value: string | undefined) {
  return cleanString(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildPathFromSlug(slug: string) {
  return `/${slug}`;
}

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  await connectToDatabase();
  const data = await ServiceModel.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  const body = (await request.json()) as {
    name?: string;
    slug?: string;
    path?: string;
    shortDescription?: string;
    image?: string;
    imageAlt?: string;
    metaImage?: string;
    metaTitle?: string;
    metaDescription?: string;
    headerMetaTags?: string;
    footerMetaTags?: string;
    indexStatus?: 'index' | 'noindex';
    status?: 'published' | 'unpublished';
    displayInFooterMenu?: boolean;
  };

  if (!body.name?.trim() || !body.slug?.trim()) {
    return NextResponse.json(
      { message: 'Service name and slug are required.' },
      { status: 400 },
    );
  }

  await connectToDatabase();
  const slug = normalizeSlug(body.slug);
  if (!slug) {
    return NextResponse.json({ message: 'Invalid service slug.' }, { status: 400 });
  }

  const data = await ServiceModel.create({
    name: cleanString(body.name),
    slug,
    path: buildPathFromSlug(slug),
    shortDescription: cleanString(body.shortDescription),
    image: cleanString(body.image),
    imageAlt: cleanString(body.imageAlt),
    metaImage: cleanString(body.metaImage),
    metaTitle: cleanString(body.metaTitle),
    metaDescription: cleanString(body.metaDescription),
    headerMetaTags: cleanString(body.headerMetaTags),
    footerMetaTags: cleanString(body.footerMetaTags),
    indexStatus: body.indexStatus ?? 'index',
    status: body.status ?? 'published',
    displayInFooterMenu: body.displayInFooterMenu ?? false,
  });

  return NextResponse.json({ data }, { status: 201 });
}
