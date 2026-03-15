import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { connectToDatabase } from '@/lib/db';
import { ServiceModel } from '@/models/Service';

function cleanString(value: string | undefined) {
  return value?.trim().replace(/^['"]|['"]$/g, '') ?? '';
}

function normalizePath(value: string | undefined, fallbackSlug: string) {
  const cleaned = cleanString(value);
  if (!cleaned) {
    return `/services/${fallbackSlug}`;
  }

  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
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
  const slug = cleanString(body.slug);
  const data = await ServiceModel.create({
    name: cleanString(body.name),
    slug,
    path: normalizePath(body.path, slug),
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
