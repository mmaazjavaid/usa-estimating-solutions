import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { revalidateAfterBlogChange } from '@/lib/cms-revalidate';
import { getAllBlogsAdmin, getPublishedBlogs, normalizeSlug } from '@/lib/blogs';
import { connectToDatabase } from '@/lib/db';
import { BlogModel } from '@/models/Blog';

export const dynamic = 'force-dynamic';

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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const adminMode = url.searchParams.get('admin') === '1';

  if (adminMode) {
    const auth = await requireAdminApi();
    if (!auth.authorized) {
      return auth.response;
    }

    const data = await getAllBlogsAdmin();
    return NextResponse.json({ data });
  }

  const data = await getPublishedBlogs();
  return NextResponse.json(
    { data },
    {
      headers: {
        'Cache-Control': 'private, no-store, must-revalidate',
      },
    },
  );
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
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
  const existing = await BlogModel.findOne({ slug }).lean();
  if (existing) {
    return NextResponse.json({ message: 'Blog slug already exists.' }, { status: 409 });
  }

  const data = await BlogModel.create({
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
  });

  revalidateAfterBlogChange(String(data.slug));

  return NextResponse.json({ data }, { status: 201 });
}
