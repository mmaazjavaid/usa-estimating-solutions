import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { requireAdminApi } from '@/lib/admin-guard';
import { revalidateAfterBlogChange } from '@/lib/cms-revalidate';
import { connectToDatabase } from '@/lib/db';
import { BlogModel } from '@/models/Blog';
import { normalizeSlug } from '@/lib/blogs';

type Params = { params: Promise<{ id: string }> };

type BlogPayload = {
  title?: string;
  slug?: string;
  category?: string;
  publishedDate?: string;
  featuredImage?: string;
  shortDescription?: string;
  body?: string;
  metaTitle?: string;
  metaDescription?: string;
  indexStatus?: 'index' | 'noindex';
  status?: 'published' | 'unpublished';
};

function clean(value?: string) {
  return value?.trim().replace(/^['"]|['"]$/g, '') ?? '';
}

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const url = new URL(request.url);
  const byId = url.searchParams.get('by') === 'id';

  await connectToDatabase();

  if (byId) {
    const auth = await requireAdminApi();
    if (!auth.authorized) {
      return auth.response;
    }

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid id.' }, { status: 400 });
    }

    const data = await BlogModel.findById(id).lean();
    if (!data) {
      return NextResponse.json({ message: 'Blog not found.' }, { status: 404 });
    }

    return NextResponse.json({ data });
  }

  const data = await BlogModel.findOne({ slug: id, status: 'published' }).lean();
  if (!data) {
    return NextResponse.json({ message: 'Blog not found.' }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PUT(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid id.' }, { status: 400 });
  }

  const body = (await request.json()) as BlogPayload;
  const title = clean(body.title);
  const slug = normalizeSlug(body.slug || title);
  const category = clean(body.category);
  const publishedDate = body.publishedDate ? new Date(body.publishedDate) : null;

  if (!title || !slug || !category || !publishedDate || Number.isNaN(publishedDate.getTime())) {
    return NextResponse.json(
      { message: 'Title, slug, category, and valid published date are required.' },
      { status: 400 },
    );
  }

  await connectToDatabase();
  const duplicateSlug = await BlogModel.findOne({
    slug,
    _id: { $ne: id },
  }).lean();
  if (duplicateSlug) {
    return NextResponse.json({ message: 'Blog slug already exists.' }, { status: 409 });
  }

  const data = await BlogModel.findByIdAndUpdate(
    id,
    {
      title,
      slug,
      category,
      publishedDate,
      featuredImage: clean(body.featuredImage),
      shortDescription: clean(body.shortDescription),
      body: body.body ?? '',
      metaTitle: clean(body.metaTitle),
      metaDescription: clean(body.metaDescription),
      indexStatus: body.indexStatus ?? 'index',
      status: body.status ?? 'published',
    },
    { new: true },
  ).lean();

  if (!data) {
    return NextResponse.json({ message: 'Blog not found.' }, { status: 404 });
  }

  revalidateAfterBlogChange(String(data.slug));

  return NextResponse.json({ data });
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
  const data = await BlogModel.findByIdAndDelete(id).lean();

  if (!data) {
    return NextResponse.json({ message: 'Blog not found.' }, { status: 404 });
  }

  revalidateAfterBlogChange(String((data as { slug?: string }).slug ?? ''));

  return NextResponse.json({ ok: true });
}
