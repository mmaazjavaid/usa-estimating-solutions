'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type CmsPage = {
  _id: string;
  name: string;
  path: string;
  indexStatus: 'index' | 'noindex';
  status: 'published' | 'unpublished';
};

export default function AdminPagesPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadPages() {
    setIsLoading(true);
    const response = await fetch('/api/admin/pages');
    const payload = (await response.json()) as { data?: CmsPage[] };
    setPages(payload.data ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    void loadPages();
  }, []);

  async function handleDelete(id: string) {
    await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
    await loadPages();
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold">Pages</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Edit SEO metadata and index/publish states for existing pages.
      </p>

      {isLoading ? (
        <p className="mt-6 text-sm text-zinc-400">Loading pages...</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-4 py-3">Page Name</th>
                <th className="px-4 py-3">Index Status</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page._id} className="border-t border-zinc-800 bg-zinc-950">
                  <td className="px-4 py-3">
                    <p>{page.name}</p>
                    <p className="text-xs text-zinc-400">{page.path}</p>
                  </td>
                  <td className="px-4 py-3">{page.indexStatus}</td>
                  <td className="px-4 py-3">{page.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={page.path}
                        target="_blank"
                        className="text-zinc-200 underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/pages/${page._id}`}
                        className="text-zinc-200 underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(page._id)}
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
