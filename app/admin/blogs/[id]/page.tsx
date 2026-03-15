'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BlogForm, type BlogFormData } from '@/components/admin/blog-form';

export default function EditBlogPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<BlogFormData | null>(null);

  useEffect(() => {
    async function loadBlog() {
      const response = await fetch(`/api/blogs/${params.id}?by=id`);
      if (!response.ok) {
        router.push('/admin/blogs');
        return;
      }

      const payload = (await response.json()) as {
        data?: {
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
      };
      const blog = payload.data;

      if (!blog) {
        router.push('/admin/blogs');
        return;
      }

      setInitialValues({
        title: blog.title ?? '',
        slug: blog.slug ?? '',
        category: blog.category ?? '',
        publishedDate: blog.publishedDate
          ? new Date(blog.publishedDate).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        featuredImage: blog.featuredImage ?? '',
        shortDescription: blog.shortDescription ?? '',
        body: blog.body ?? '',
        metaTitle: blog.metaTitle ?? '',
        metaDescription: blog.metaDescription ?? '',
        indexStatus: blog.indexStatus ?? 'index',
        status: blog.status ?? 'published',
      });
    }

    void loadBlog();
  }, [params.id, router]);

  async function handleSubmit(data: BlogFormData) {
    const response = await fetch(`/api/blogs/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const payload = (await response.json()) as { message?: string };
    if (!response.ok) {
      throw new Error(payload.message ?? 'Failed to update blog.');
    }

    router.push('/admin/blogs');
    router.refresh();
  }

  if (!initialValues) {
    return <p className="text-sm text-zinc-400">Loading blog...</p>;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Edit Blog</h1>
      <BlogForm
        initialValues={initialValues}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
      />
    </section>
  );
}
