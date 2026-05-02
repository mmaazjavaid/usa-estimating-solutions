'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ImageUrlInput } from '@/components/admin/image-url-input';
import { CmsSectionsPanel } from '@/components/admin/cms-sections-panel';
import { parseTradeSlugInput } from '@/lib/trade-slug-input';
import type { CmsPageSection } from '@/lib/cms-sections/types';

type LinkTarget = { label: string; path: string };

type ParentTradeKey = 'interior' | 'exterior' | 'mep' | 'structural';

const PARENT_TRADE_OPTIONS: { value: ParentTradeKey; label: string }[] = [
  { value: 'interior', label: 'Interior Estimating' },
  { value: 'exterior', label: 'Exterior Estimating' },
  { value: 'mep', label: 'MEP Estimating' },
  { value: 'structural', label: 'Structural Estimating' },
];

type PageRecord = {
  _id: string;
  name: string;
  slug: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  metaImage: string;
  headerMetaTags: string;
  footerMetaTags: string;
  indexStatus: 'index' | 'noindex';
  status: 'published' | 'unpublished';
  placement?: 'none' | 'services' | 'trades';
  renderMode?: 'seo_only' | 'dynamic';
  sections?: CmsPageSection[];
  tradeLocation?: 'independent' | 'under_trade';
  parentTrade?: ParentTradeKey | null;
  parentTradeDescription?: string;
};

const emptyForm: Omit<PageRecord, '_id'> = {
  name: '',
  slug: '',
  path: '',
  metaTitle: '',
  metaDescription: '',
  metaImage: '',
  headerMetaTags: '',
  footerMetaTags: '',
  indexStatus: 'index',
  status: 'published',
  placement: 'none',
  renderMode: 'seo_only',
  sections: [],
  tradeLocation: 'independent',
  parentTrade: null,
  parentTradeDescription: '',
};

export default function EditPagePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [formData, setFormData] = useState<PageRecord | null>(null);
  const [sections, setSections] = useState<CmsPageSection[]>([]);
  const [linkTargets, setLinkTargets] = useState<LinkTarget[]>([
    { label: 'Home', path: '/' },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const isDynamic = formData?.renderMode === 'dynamic';
  const isHomePath = formData?.path === '/';

  const previewUrl = useMemo(() => {
    if (!formData?.path) {
      return '';
    }
    const base = formData.path.startsWith('/') ? formData.path : `/${formData.path}`;
    return isDynamic ? `${base}?preview=1` : base;
  }, [formData?.path, isDynamic]);

  useEffect(() => {
    async function loadTargets() {
      const res = await fetch('/api/admin/link-targets');
      const payload = (await res.json()) as {
        data?: {
          pages?: { name: string; path: string }[];
          services?: { name: string; path: string; slug: string }[];
        };
      };
      const pages = payload.data?.pages ?? [];
      const services = payload.data?.services ?? [];
      const merged: LinkTarget[] = [
        { label: 'Home', path: '/' },
        ...pages.map((p) => ({ label: p.name, path: p.path })),
        ...services.map((s) => ({
          label: `Service: ${s.name}`,
          path: s.path?.startsWith('/') ? s.path : `/${s.slug}`,
        })),
      ];
      setLinkTargets(merged);
    }

    void loadTargets();
  }, []);

  useEffect(() => {
    async function loadPage() {
      const response = await fetch(`/api/admin/pages/${params.id}`);
      const payload = (await response.json()) as { data?: PageRecord };
      if (payload.data) {
        setFormData({
          ...emptyForm,
          ...payload.data,
          sections: payload.data.sections ?? [],
        });
        setSections(payload.data.sections ?? []);
      }
      setIsLoading(false);
    }

    void loadPage();
  }, [params.id]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!formData) {
      return;
    }
    setMessage('');
    setIsSaving(true);

    const body = {
      ...formData,
      sections: isDynamic ? sections : formData.sections,
    };
    delete (body as { _id?: string })._id;

    const response = await fetch(`/api/admin/pages/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const payload = (await response.json()) as { message?: string };
    setMessage(
      response.ok ? 'Page updated.' : payload.message || 'Failed to update page.',
    );
    setIsSaving(false);
  }

  if (isLoading || !formData) {
    return <p className="text-sm text-zinc-400">Loading page...</p>;
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Edit Page</h1>
        <div className="flex flex-wrap gap-2">
          {previewUrl ? (
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-zinc-600 px-3 py-2 text-sm text-zinc-200"
            >
              {isDynamic ? 'Preview draft (admin)' : 'View path'}
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => router.push('/admin/pages')}
            className="rounded-md border border-zinc-700 px-3 py-2 text-sm"
          >
            Back
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-medium text-zinc-200">Core</h2>

          <TextInput
            label="Page name"
            value={formData.name}
            onChange={(value) => setFormData((prev) => (prev ? { ...prev, name: value } : prev))}
            disabled={!isDynamic}
          />

          {isDynamic ? (
            isHomePath ? (
              <>
                <TextInput
                  label="Slug (label only — URL stays /)"
                  value={formData.slug === '/' ? 'homepage' : formData.slug}
                  onChange={(value) =>
                    setFormData((prev) =>
                      prev
                        ? {
                            ...prev,
                            slug: value.trim().replace(/^\/+/, '') || 'homepage',
                          }
                        : prev,
                    )
                  }
                />
                <ReadOnlyField label="Path" value="/" />
                <p className="text-xs text-zinc-500">
                  Homepage is always <code className="text-zinc-300">/</code>. Slug is for admin reference
                  only.
                </p>
              </>
            ) : (
              <>
                <TextInput
                  label={
                    formData.path.startsWith('/trades/')
                      ? 'Slug (trade-{segment})'
                      : 'Slug (URL segment)'
                  }
                  value={formData.slug}
                  onChange={(value) =>
                    setFormData((prev) => {
                      if (!prev) {
                        return prev;
                      }
                      const raw = value.trim().replace(/^\/+/, '');
                      if (prev.path.startsWith('/trades/')) {
                        const segment = parseTradeSlugInput(raw);
                        if (!segment) {
                          return { ...prev, slug: raw };
                        }
                        return {
                          ...prev,
                          slug: `trade-${segment}`,
                          path: `/trades/${segment}`,
                        };
                      }
                      return {
                        ...prev,
                        slug: raw,
                        path: `/${raw}`,
                      };
                    })
                  }
                />
                <ReadOnlyField label="Path" value={formData.path} />
                {formData.path.startsWith('/trades/') ? (
                  <p className="text-xs text-zinc-500">
                    Trades URLs use <code className="text-zinc-300">/trades/…</code>. Slug is stored as{' '}
                    <code className="text-zinc-300">trade-{'{segment}'}</code>.
                  </p>
                ) : null}
              </>
            )
          ) : (
            <>
              <ReadOnlyField label="Slug" value={formData.slug} />
              <ReadOnlyField label="Path" value={formData.path} />
            </>
          )}

          <TextInput
            label="Meta title"
            value={formData.metaTitle}
            onChange={(value) => setFormData((prev) => (prev ? { ...prev, metaTitle: value } : prev))}
          />

          <TextArea
            label="Meta description"
            value={formData.metaDescription}
            onChange={(value) =>
              setFormData((prev) => (prev ? { ...prev, metaDescription: value } : prev))
            }
          />

          <ImageUrlInput
            label="Meta / OG image URL"
            value={formData.metaImage ?? ''}
            onChange={(value) => setFormData((prev) => (prev ? { ...prev, metaImage: value } : prev))}
          />

          <TextArea
            label="Header meta tags (scripts / extra meta)"
            value={formData.headerMetaTags}
            onChange={(value) =>
              setFormData((prev) => (prev ? { ...prev, headerMetaTags: value } : prev))
            }
          />

          <TextArea
            label="Footer meta tags"
            value={formData.footerMetaTags}
            onChange={(value) =>
              setFormData((prev) => (prev ? { ...prev, footerMetaTags: value } : prev))
            }
          />

          <SelectInput
            label="Index status"
            value={formData.indexStatus}
            options={['index', 'noindex']}
            onChange={(value) =>
              setFormData((prev) =>
                prev ? { ...prev, indexStatus: value as PageRecord['indexStatus'] } : prev,
              )
            }
          />

          <SelectInput
            label="Publish status"
            value={formData.status}
            options={['published', 'unpublished']}
            onChange={(value) =>
              setFormData((prev) =>
                prev ? { ...prev, status: value as PageRecord['status'] } : prev,
              )
            }
          />

          {isDynamic ? (
            <SelectInput
              label="Placement (navigation)"
              value={formData.placement ?? 'none'}
              options={[
                { v: 'none', l: 'None (direct link only)' },
                { v: 'services', l: 'Under Services' },
                { v: 'trades', l: 'Under Trades' },
              ]}
              onChange={(value) =>
                setFormData((prev) =>
                  prev
                    ? {
                        ...prev,
                        placement: value as NonNullable<PageRecord['placement']>,
                      }
                    : prev,
                )
              }
            />
          ) : null}

          {isDynamic && formData.path.startsWith('/trades/') ? (
            <div className="space-y-3">
              <p className="text-sm text-zinc-300">Trade location</p>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="tradeLocation"
                    value="independent"
                    checked={(formData.tradeLocation ?? 'independent') === 'independent'}
                    onChange={() =>
                      setFormData((prev) =>
                        prev
                          ? { ...prev, tradeLocation: 'independent', parentTrade: null, parentTradeDescription: '' }
                          : prev,
                      )
                    }
                    className="accent-white"
                  />
                  <span className="text-sm text-zinc-200">Independent trade</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="tradeLocation"
                    value="under_trade"
                    checked={formData.tradeLocation === 'under_trade'}
                    onChange={() =>
                      setFormData((prev) =>
                        prev ? { ...prev, tradeLocation: 'under_trade' } : prev,
                      )
                    }
                    className="accent-white"
                  />
                  <span className="text-sm text-zinc-200">Trade under another trade</span>
                </label>
              </div>

              {formData.tradeLocation === 'under_trade' ? (
                <div className="ml-5 space-y-3 border-l border-zinc-700 pl-4">
                  <p className="text-xs text-zinc-400">Select parent trade</p>
                  <div className="flex flex-wrap gap-2">
                    {PARENT_TRADE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) =>
                            prev ? { ...prev, parentTrade: opt.value } : prev,
                          )
                        }
                        className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                          formData.parentTrade === opt.value
                            ? 'border-white bg-white text-black'
                            : 'border-zinc-600 text-zinc-300 hover:border-zinc-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <TextArea
                    label="Description (shown in parent trade's types section)"
                    value={formData.parentTradeDescription ?? ''}
                    onChange={(value) =>
                      setFormData((prev) =>
                        prev ? { ...prev, parentTradeDescription: value } : prev,
                      )
                    }
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          {!isDynamic ? (
            <p className="text-xs text-zinc-500">
              This path is a static site page with SEO overrides only. Create a new dynamic page to
              compose sections.
            </p>
          ) : null}
        </div>

        {isDynamic ? (
          <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-medium text-zinc-200">Sections</h2>
            <CmsSectionsPanel
              sections={sections}
              onChange={setSections}
              linkTargets={linkTargets}
            />
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-70"
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
          {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
        </div>
      </form>
    </section>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-zinc-300">{label}</p>
      <p className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200">
        {value}
      </p>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-zinc-300">{label}</label>
      <input
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white disabled:opacity-60"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-zinc-300">{label}</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
      />
    </div>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[] | { v: string; l: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-zinc-300">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
      >
        {options.map((option) =>
          typeof option === 'string' ? (
            <option key={option} value={option}>
              {option}
            </option>
          ) : (
            <option key={option.v} value={option.v}>
              {option.l}
            </option>
          ),
        )}
      </select>
    </div>
  );
}
