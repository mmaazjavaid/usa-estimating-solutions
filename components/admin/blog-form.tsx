'use client';

import { FormEvent, useMemo, useState } from 'react';
import { ImageUrlInput } from '@/components/admin/image-url-input';
import { RichTextEditor } from '@/components/admin/rich-text-editor';

export type BlogFormData = {
  title: string;
  slug: string;
  category: string;
  publishedDate: string;
  featuredImage: string;
  shortDescription: string;
  body: string;
  metaTitle: string;
  metaDescription: string;
  indexStatus: 'index' | 'noindex';
  status: 'published' | 'unpublished';
};

type BlogFormProps = {
  initialValues: BlogFormData;
  submitLabel: string;
  onSubmit: (data: BlogFormData) => Promise<void>;
};

export function BlogForm({ initialValues, submitLabel, onSubmit }: BlogFormProps) {
  const [formData, setFormData] = useState<BlogFormData>(initialValues);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const normalizedSlug = useMemo(() => toSlug(formData.slug), [formData.slug]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      await onSubmit({ ...formData, slug: normalizedSlug });
      setMessage('Saved successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6 md:grid-cols-2"
    >
      <Field
        label="Blog Post Name"
        value={formData.title}
        onChange={(value) => setFormData((prev) => ({ ...prev, title: value }))}
        required
      />
      <Field
        label="Blog Slug"
        value={formData.slug}
        onChange={(value) => setFormData((prev) => ({ ...prev, slug: value }))}
        required
      />

      <Field
        label="Published Date"
        value={formData.publishedDate}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, publishedDate: value }))
        }
        type="date"
        required
      />
      <Field
        label="Category"
        value={formData.category}
        onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
        required
      />

      <ImageUrlInput
        label="Featured Image URL"
        value={formData.featuredImage}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, featuredImage: value }))
        }
      />

      <Field
        label="Short Description"
        value={formData.shortDescription}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, shortDescription: value }))
        }
      />

      <div className="md:col-span-2 space-y-1">
        <label className="text-sm text-zinc-300">Blog Body</label>
        <RichTextEditor
          value={formData.body}
          onChange={(value) => setFormData((prev) => ({ ...prev, body: value }))}
        />
      </div>

      <Field
        label="Meta Title"
        value={formData.metaTitle}
        onChange={(value) => setFormData((prev) => ({ ...prev, metaTitle: value }))}
      />
      <Field
        label="Meta Description"
        value={formData.metaDescription}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, metaDescription: value }))
        }
      />

      <SelectField
        label="Index Status"
        value={formData.indexStatus}
        options={['index', 'noindex']}
        onChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            indexStatus: value as BlogFormData['indexStatus'],
          }))
        }
      />
      <SelectField
        label="Status"
        value={formData.status}
        options={['published', 'unpublished']}
        onChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            status: value as BlogFormData['status'],
          }))
        }
      />

      <button
        type="submit"
        disabled={isSaving}
        className="w-fit rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-70"
      >
        {isSaving ? 'Saving...' : submitLabel}
      </button>

      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-zinc-300">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
      />
    </div>
  );
}

function SelectField({
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

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
