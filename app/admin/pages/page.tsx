'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type CmsPage = {
  _id: string;
  name: string;
  path: string;
  slug: string;
  indexStatus: 'index' | 'noindex';
  status: 'published' | 'unpublished';
  renderMode?: 'seo_only' | 'dynamic';
  placement?: 'none' | 'services' | 'trades';
};

type ModeFilter = 'all' | 'dynamic' | 'seo_only';
type PlacementFilter = 'all' | 'none' | 'services' | 'trades';
type StatusFilter = 'all' | 'published' | 'unpublished';
type IndexFilter = 'all' | 'index' | 'noindex';

function placementValue(p: CmsPage['placement']): 'none' | 'services' | 'trades' {
  return p ?? 'none';
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<ModeFilter>('all');
  const [filterPlacement, setFilterPlacement] = useState<PlacementFilter>('all');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [filterIndex, setFilterIndex] = useState<IndexFilter>('all');

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

  const filteredPages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return pages.filter((page) => {
      if (q) {
        const hay = `${page.name}\n${page.path}\n${page.slug}`.toLowerCase();
        if (!hay.includes(q)) {
          return false;
        }
      }
      if (filterMode !== 'all') {
        const mode = page.renderMode ?? 'seo_only';
        if (mode !== filterMode) {
          return false;
        }
      }
      if (filterPlacement !== 'all') {
        if (placementValue(page.placement) !== filterPlacement) {
          return false;
        }
      }
      if (filterStatus !== 'all' && page.status !== filterStatus) {
        return false;
      }
      if (filterIndex !== 'all' && page.indexStatus !== filterIndex) {
        return false;
      }
      return true;
    });
  }, [pages, searchQuery, filterMode, filterPlacement, filterStatus, filterIndex]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    filterMode !== 'all' ||
    filterPlacement !== 'all' ||
    filterStatus !== 'all' ||
    filterIndex !== 'all';

  function clearFilters() {
    setSearchQuery('');
    setFilterMode('all');
    setFilterPlacement('all');
    setFilterStatus('all');
    setFilterIndex('all');
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Pages</h1>
          <p className="mt-2 text-sm text-zinc-400">
            SEO overlays for static routes, plus full dynamic CMS pages built from sections.
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black"
        >
          New dynamic page
        </Link>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-zinc-400">Loading pages...</p>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-4 rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <label className="block flex-1 text-xs font-medium text-zinc-400">
                Search
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name, path, or slug…"
                  className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
                />
              </label>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="shrink-0 self-end rounded-md border border-zinc-600 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 sm:self-center"
                >
                  Clear filters
                </button>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-xs font-medium text-zinc-400">
                Mode
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value as ModeFilter)}
                  className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
                >
                  <option value="all">All</option>
                  <option value="dynamic">Dynamic CMS</option>
                  <option value="seo_only">SEO only</option>
                </select>
              </label>
              <label className="text-xs font-medium text-zinc-400">
                Placement
                <select
                  value={filterPlacement}
                  onChange={(e) => setFilterPlacement(e.target.value as PlacementFilter)}
                  className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
                >
                  <option value="all">All</option>
                  <option value="none">none</option>
                  <option value="services">services</option>
                  <option value="trades">trades</option>
                </select>
              </label>
              <label className="text-xs font-medium text-zinc-400">
                Status
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as StatusFilter)}
                  className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
                >
                  <option value="all">All</option>
                  <option value="published">published</option>
                  <option value="unpublished">unpublished</option>
                </select>
              </label>
              <label className="text-xs font-medium text-zinc-400">
                Index
                <select
                  value={filterIndex}
                  onChange={(e) => setFilterIndex(e.target.value as IndexFilter)}
                  className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
                >
                  <option value="all">All</option>
                  <option value="index">index</option>
                  <option value="noindex">noindex</option>
                </select>
              </label>
            </div>
            <p className="text-xs text-zinc-500">
              {pages.length === 0
                ? 'No pages loaded yet.'
                : `Showing ${filteredPages.length} of ${pages.length} page${pages.length === 1 ? '' : 's'}`}
            </p>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-4 py-3">Page</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Placement</th>
                <th className="px-4 py-3">Index</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.length === 0 && pages.length > 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-500">
                    No pages match your search or filters.
                  </td>
                </tr>
              ) : null}
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-500">
                    No pages yet. Create a dynamic page to get started.
                  </td>
                </tr>
              ) : null}
              {filteredPages.map((page) => (
                <tr key={page._id} className="border-t border-zinc-800 bg-zinc-950">
                  <td className="px-4 py-3">
                    <p>{page.name}</p>
                    <p className="text-xs text-zinc-400">{page.path}</p>
                  </td>
                  <td className="px-4 py-3 text-xs capitalize">
                    {page.renderMode === 'dynamic' ? 'Dynamic CMS' : 'SEO only'}
                  </td>
                  <td className="px-4 py-3 text-xs">{page.placement ?? '—'}</td>
                  <td className="px-4 py-3">{page.indexStatus}</td>
                  <td className="px-4 py-3">{page.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-3">
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
        </>
      )}
    </section>
  );
}
