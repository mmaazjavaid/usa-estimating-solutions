'use client';

import { useRouter } from 'next/navigation';
import { BlogForm, type BlogFormData } from '@/components/admin/blog-form';

const initialValues: BlogFormData = {
  title: '',
  slug: '',
  category: '',
  publishedDate: new Date().toISOString().slice(0, 10),
  featuredImage: '',
  shortDescription: '',
  body: '',
  metaTitle: '',
  metaDescription: '',
  indexStatus: 'index',
  status: 'published',
};

export default function NewBlogPage() {
  const router = useRouter();

  async function handleSubmit(data: BlogFormData) {
    const response = await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const payload = (await response.json()) as { message?: string };
    if (!response.ok) {
      throw new Error(payload.message ?? 'Failed to create blog.');
    }

    router.push('/admin/blogs');
    router.refresh();
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Add Blog</h1>
      <BlogForm
        initialValues={initialValues}
        submitLabel="Create Blog"
        onSubmit={handleSubmit}
      />
    </section>
  );
}
