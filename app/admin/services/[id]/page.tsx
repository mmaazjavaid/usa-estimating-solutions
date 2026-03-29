'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ImageUrlInput } from '@/components/admin/image-url-input';

type ServiceForm = {
  name: string;
  slug: string;
  path: string;
  shortDescription: string;
  image: string;
  imageAlt: string;
  metaImage: string;
  metaTitle: string;
  metaDescription: string;
  headerMetaTags: string;
  footerMetaTags: string;
  indexStatus: 'index' | 'noindex';
  status: 'published' | 'unpublished';
  displayInFooterMenu: boolean;
};

const initialForm: ServiceForm = {
  name: '',
  slug: '',
  path: '',
  shortDescription: '',
  image: '',
  imageAlt: '',
  metaImage: '',
  metaTitle: '',
  metaDescription: '',
  headerMetaTags: '',
  footerMetaTags: '',
  indexStatus: 'index',
  status: 'published',
  displayInFooterMenu: false,
};

export default function EditServicePage() {
  function toSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [formData, setFormData] = useState<ServiceForm>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadService() {
      const response = await fetch(`/api/admin/services/${params.id}`);
      const payload = (await response.json()) as { data?: ServiceForm };
      if (payload.data) {
        setFormData(payload.data);
      }
      setIsLoading(false);
    }

    void loadService();
  }, [params.id]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    setIsSaving(true);

    const response = await fetch(`/api/admin/services/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setMessage(response.ok ? 'Service updated.' : 'Failed to update service.');
    setIsSaving(false);
  }

  if (isLoading) {
    return <p className="text-sm text-zinc-400">Loading service...</p>;
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Service</h1>
        <button
          type="button"
          onClick={() => router.push('/admin/services')}
          className="rounded-md border border-zinc-700 px-3 py-2 text-sm"
        >
          Back
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6 md:grid-cols-2"
      >
        <Input
          label="Service Name"
          value={formData.name}
          onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
        />
        <Input
          label="Service Slug"
          value={formData.slug}
          onChange={(value) => {
            const slug = toSlug(value);
            setFormData((prev) => ({ ...prev, slug, path: slug ? `/${slug}` : '' }));
          }}
        />
        <Input
          label="Service Path (URL)"
          value={formData.path}
          onChange={() => undefined}
          readOnly
        />
        <Input
          label="Short Description"
          value={formData.shortDescription}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, shortDescription: value }))
          }
        />
        <ImageUrlInput
          label="Image URL"
          value={formData.image}
          onChange={(value) => setFormData((prev) => ({ ...prev, image: value }))}
        />
        <Input
          label="Image Alt"
          value={formData.imageAlt}
          onChange={(value) => setFormData((prev) => ({ ...prev, imageAlt: value }))}
        />
        <ImageUrlInput
          label="Meta Image URL"
          value={formData.metaImage}
          onChange={(value) => setFormData((prev) => ({ ...prev, metaImage: value }))}
        />
        <Input
          label="Meta Title"
          value={formData.metaTitle}
          onChange={(value) => setFormData((prev) => ({ ...prev, metaTitle: value }))}
        />
        <Input
          label="Meta Description"
          value={formData.metaDescription}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, metaDescription: value }))
          }
        />
        <Input
          label="Header Meta Tags"
          value={formData.headerMetaTags}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, headerMetaTags: value }))
          }
        />
        <Input
          label="Footer Meta Tags"
          value={formData.footerMetaTags}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, footerMetaTags: value }))
          }
        />

        <Select
          label="Index Status"
          value={formData.indexStatus}
          options={['index', 'noindex']}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              indexStatus: value as ServiceForm['indexStatus'],
            }))
          }
        />
        <Select
          label="Status"
          value={formData.status}
          options={['published', 'unpublished']}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              status: value as ServiceForm['status'],
            }))
          }
        />

        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={formData.displayInFooterMenu}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                displayInFooterMenu: event.target.checked,
              }))
            }
          />
          Display in Footer Menu
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="w-fit rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-70"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>

        {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
      </form>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-zinc-300">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        readOnly={readOnly}
        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
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
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
