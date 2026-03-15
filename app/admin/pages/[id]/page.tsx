'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type PageForm = {
  name: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  headerMetaTags: string;
  footerMetaTags: string;
  indexStatus: 'index' | 'noindex';
  status: 'published' | 'unpublished';
};

const emptyForm: PageForm = {
  name: '',
  path: '',
  metaTitle: '',
  metaDescription: '',
  headerMetaTags: '',
  footerMetaTags: '',
  indexStatus: 'index',
  status: 'published',
};

export default function EditPagePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [formData, setFormData] = useState<PageForm>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadPage() {
      const response = await fetch(`/api/admin/pages/${params.id}`);
      const payload = (await response.json()) as { data?: PageForm };
      if (payload.data) {
        setFormData(payload.data);
      }
      setIsLoading(false);
    }

    void loadPage();
  }, [params.id]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    setIsSaving(true);

    const response = await fetch(`/api/admin/pages/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setMessage(response.ok ? 'Page updated.' : 'Failed to update page.');
    setIsSaving(false);
  }

  if (isLoading) {
    return <p className="text-sm text-zinc-400">Loading page...</p>;
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Page</h1>
        <button
          type="button"
          onClick={() => router.push('/admin/pages')}
          className="rounded-md border border-zinc-700 px-3 py-2 text-sm"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <ReadOnlyField label="Page Name" value={formData.name} />
        <ReadOnlyField label="Path" value={formData.path} />

        <TextInput
          label="Meta Title"
          value={formData.metaTitle}
          onChange={(value) => setFormData((prev) => ({ ...prev, metaTitle: value }))}
        />

        <TextArea
          label="Meta Description"
          value={formData.metaDescription}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, metaDescription: value }))
          }
        />

        <TextArea
          label="Header Meta Tags"
          value={formData.headerMetaTags}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, headerMetaTags: value }))
          }
        />

        <TextArea
          label="Footer Meta Tags"
          value={formData.footerMetaTags}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, footerMetaTags: value }))
          }
        />

        <SelectInput
          label="Index Status"
          value={formData.indexStatus}
          options={['index', 'noindex']}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, indexStatus: value as PageForm['indexStatus'] }))
          }
        />

        <SelectInput
          label="Status"
          value={formData.status}
          options={['published', 'unpublished']}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, status: value as PageForm['status'] }))
          }
        />

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-70"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>

        {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-zinc-300">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
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
