'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUrlInput } from '@/components/admin/image-url-input';
import { CmsSectionsPanel } from '@/components/admin/cms-sections-panel';
import type { CmsPageSection } from '@/lib/cms-sections/types';

type LinkTarget = { label: string; path: string };

export default function NewDynamicPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaImage, setMetaImage] = useState('');
  const [headerMetaTags, setHeaderMetaTags] = useState('');
  const [footerMetaTags, setFooterMetaTags] = useState('');
  const [indexStatus, setIndexStatus] = useState<'index' | 'noindex'>('index');
  const [status, setStatus] = useState<'published' | 'unpublished'>('unpublished');
  const [placement, setPlacement] = useState<'none' | 'services' | 'trades'>('none');
  const [sections, setSections] = useState<CmsPageSection[]>([]);
  const [linkTargets, setLinkTargets] = useState<LinkTarget[]>([
    { label: 'Home', path: '/' },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadTargets() {
      const res = await fetch('/api/admin/link-targets');
      const payload = (await res.json()) as {
        data?: { pages?: { name: string; path: string }[]; services?: { name: string; path: string; slug: string }[] };
      };
      const pages = payload.data?.pages ?? [];
      const services = payload.data?.services ?? [];
      setLinkTargets([
        { label: 'Home', path: '/' },
        ...pages.map((p) => ({ label: p.name, path: p.path })),
        ...services.map((s) => ({
          label: `Service: ${s.name}`,
          path: s.path?.startsWith('/') ? s.path : `/${s.slug}`,
        })),
      ]);
    }

    void loadTargets();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    setIsSaving(true);

    const cleanSlug = slug.trim().replace(/^\/+/, '');
    const response = await fetch('/api/admin/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        slug: cleanSlug,
        metaTitle,
        metaDescription,
        metaImage,
        headerMetaTags,
        footerMetaTags,
        indexStatus,
        status,
        placement,
        sections,
      }),
    });

    const payload = (await response.json()) as { data?: { _id: string }; message?: string };

    if (response.ok && payload.data?._id) {
      router.push(`/admin/pages/${payload.data._id}`);
      return;
    }

    setMessage(payload.message || 'Could not create page.');
    setIsSaving(false);
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New dynamic page</h1>
        <button
          type="button"
          onClick={() => router.push('/admin/pages')}
          className="rounded-md border border-zinc-700 px-3 py-2 text-sm"
        >
          Back
        </button>
      </div>

      <p className="mb-6 text-sm text-zinc-400">
        Creates a CMS-built page at <code className="text-zinc-300">/{'{slug}'}</code>. Published
        services always win the same URL segment if both exist.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">Page name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">
              {placement === 'trades' ? 'URL segment (under /trades/)' : 'Slug'}
            </span>
            <input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.replace(/^\/+/, ''))}
              placeholder={placement === 'trades' ? 'exterior' : 'my-landing-page'}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
            />
            {placement === 'trades' ? (
              <p className="text-xs text-zinc-500">
                Example: <code className="text-zinc-300">exterior</code> → path{' '}
                <code className="text-zinc-300">/trades/exterior</code>, slug{' '}
                <code className="text-zinc-300">trade-exterior</code>.
              </p>
            ) : null}
          </label>

          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">Meta title</span>
            <input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">Meta description</span>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
            />
          </label>

          <ImageUrlInput
            label="Meta / OG image URL"
            value={metaImage}
            onChange={setMetaImage}
          />

          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">Header meta tags</span>
            <textarea
              value={headerMetaTags}
              onChange={(e) => setHeaderMetaTags(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">Footer meta tags</span>
            <textarea
              value={footerMetaTags}
              onChange={(e) => setFooterMetaTags(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">Index status</span>
            <select
              value={indexStatus}
              onChange={(e) => setIndexStatus(e.target.value as 'index' | 'noindex')}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
            >
              <option value="index">index</option>
              <option value="noindex">noindex</option>
            </select>
          </label>

          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">Publish status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'published' | 'unpublished')}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
            >
              <option value="unpublished">unpublished</option>
              <option value="published">published</option>
            </select>
          </label>

          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">Placement</span>
            <select
              value={placement}
              onChange={(e) =>
                setPlacement(e.target.value as 'none' | 'services' | 'trades')
              }
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
            >
              <option value="none">None (direct link only)</option>
              <option value="services">Under Services menu</option>
              <option value="trades">Under Trades menu</option>
            </select>
          </label>
        </div>

        <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-medium text-zinc-200">Sections</h2>
          <CmsSectionsPanel
            sections={sections}
            onChange={setSections}
            linkTargets={linkTargets}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-70"
          >
            {isSaving ? 'Creating...' : 'Create page'}
          </button>
          {message ? <p className="text-sm text-red-400">{message}</p> : null}
        </div>
      </form>
    </section>
  );
}
