import type { Metadata } from 'next';
import { connectToDatabase } from '@/lib/db';
import { BlogModel } from '@/models/Blog';

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function getPublishedBlogs() {
  await connectToDatabase();
  return await BlogModel.find({ status: 'published' })
    .sort({ publishedDate: -1, createdAt: -1 })
    .lean();
}

export async function getAllBlogsAdmin() {
  await connectToDatabase();
  return await BlogModel.find().sort({ createdAt: -1 }).lean();
}

export async function getPublishedBlogBySlug(slug: string) {
  await connectToDatabase();
  return await BlogModel.findOne({ slug, status: 'published' }).lean();
}

export async function getBlogById(id: string) {
  await connectToDatabase();
  return await BlogModel.findById(id).lean();
}

export function getBlogMetadata(blog: {
  title: string;
  slug: string;
  shortDescription?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  indexStatus?: 'index' | 'noindex';
}): Metadata {
  const title = blog.metaTitle || blog.title;
  const description = blog.metaDescription || blog.shortDescription || '';
  const image = blog.featuredImage || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/blogs/${blog.slug}` },
    robots:
      blog.indexStatus === 'noindex'
        ? { index: false, follow: false }
        : { index: true, follow: true },
    openGraph: {
      title,
      description,
      images: image ? [{ url: image, alt: blog.title }] : [],
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}
