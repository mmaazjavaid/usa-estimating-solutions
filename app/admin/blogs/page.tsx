'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type BlogRow = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  publishedDate: string;
  indexStatus: 'index' | 'noindex';
  status: 'published' | 'unpublished';
};

export default function AdminBlogsPage() {
  const [rows, setRows] = useState<BlogRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadBlogs() {
    setIsLoading(true);
    const response = await fetch('/api/blogs?admin=1');
    const payload = (await response.json()) as { data?: BlogRow[] };
    setRows(payload.data ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    void loadBlogs();
  }, []);

  async function handleDelete(id: string) {
    await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    await loadBlogs();
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Blogs</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Create and manage blog posts for your website.
          </p>
        </div>

        <Link
          href="/admin/blogs/new"
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black"
        >
          Add Blog
        </Link>
      </div>

      {isLoading ? (
        <p className="text-sm text-zinc-400">Loading blogs...</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-4 py-3">Blog Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Published Date</th>
                <th className="px-4 py-3">Index Status</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._id} className="border-t border-zinc-800 bg-zinc-950">
                  <td className="px-4 py-3">
                    <p>{row.title}</p>
                    <p className="text-xs text-zinc-400">/blogs/{row.slug}</p>
                  </td>
                  <td className="px-4 py-3">{row.category}</td>
                  <td className="px-4 py-3">
                    {new Date(row.publishedDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{row.indexStatus}</td>
                  <td className="px-4 py-3">{row.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/blogs/${row.slug}`}
                        target="_blank"
                        className="text-zinc-200 underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/blogs/${row._id}`}
                        className="text-zinc-200 underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(row._id)}
                        className="text-red-400 underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
