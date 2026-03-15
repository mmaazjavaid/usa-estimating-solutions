'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

type ServiceOption = {
  _id: string;
  name: string;
};

type SubService = {
  _id: string;
  name: string;
  slug: string;
  indexStatus: 'index' | 'noindex';
  status: 'published' | 'unpublished';
};

type NewSubService = {
  serviceId: string;
  name: string;
  slug: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  indexStatus: 'index' | 'noindex';
  status: 'published' | 'unpublished';
};

const initialForm: NewSubService = {
  serviceId: '',
  name: '',
  slug: '',
  shortDescription: '',
  metaTitle: '',
  metaDescription: '',
  indexStatus: 'index',
  status: 'published',
};

export default function AdminSubServicesPage() {
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [rows, setRows] = useState<SubService[]>([]);
  const [formData, setFormData] = useState<NewSubService>(initialForm);
  const [isSaving, setIsSaving] = useState(false);

  async function loadData() {
    const [servicesResponse, subServicesResponse] = await Promise.all([
      fetch('/api/admin/services'),
      fetch('/api/admin/sub-services'),
    ]);

    const servicesPayload = (await servicesResponse.json()) as {
      data?: ServiceOption[];
    };
    const subServicesPayload = (await subServicesResponse.json()) as {
      data?: SubService[];
    };

    setServices(servicesPayload.data ?? []);
    setRows(subServicesPayload.data ?? []);
    setFormData((prev) => ({
      ...prev,
      serviceId: prev.serviceId || servicesPayload.data?.[0]?._id || '',
    }));
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);

    const response = await fetch('/api/admin/sub-services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setFormData((prev) => ({ ...initialForm, serviceId: prev.serviceId }));
      await loadData();
    }

    setIsSaving(false);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/sub-services/${id}`, { method: 'DELETE' });
    await loadData();
  }

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Sub-Services</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Create and manage sub-services mapped to a parent service.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="grid gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6 md:grid-cols-2"
      >
        <div className="space-y-1">
          <label className="text-sm text-zinc-300">Parent Service</label>
          <select
            value={formData.serviceId}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, serviceId: event.target.value }))
            }
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
            required
          >
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <Field
          label="Sub-Service Name"
          value={formData.name}
          onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
          required
        />
        <Field
          label="Sub-Service Slug"
          value={formData.slug}
          onChange={(value) => setFormData((prev) => ({ ...prev, slug: value }))}
          required
        />
        <Field
          label="Short Description"
          value={formData.shortDescription}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, shortDescription: value }))
          }
        />
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

        <div className="space-y-1">
          <label className="text-sm text-zinc-300">Index Status</label>
          <select
            value={formData.indexStatus}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                indexStatus: event.target.value as NewSubService['indexStatus'],
              }))
            }
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          >
            <option value="index">index</option>
            <option value="noindex">noindex</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-zinc-300">Status</label>
          <select
            value={formData.status}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                status: event.target.value as NewSubService['status'],
              }))
            }
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          >
            <option value="published">published</option>
            <option value="unpublished">unpublished</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-fit rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-70"
        >
          {isSaving ? 'Saving...' : 'Add Sub-Service'}
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900">
            <tr>
              <th className="px-4 py-3">Sub-Service Name</th>
              <th className="px-4 py-3">Index Status</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id} className="border-t border-zinc-800 bg-zinc-950">
                <td className="px-4 py-3">
                  <p>{row.name}</p>
                  <p className="text-xs text-zinc-400">/{row.slug}</p>
                </td>
                <td className="px-4 py-3">{row.indexStatus}</td>
                <td className="px-4 py-3">{row.status}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/sub-services/${row.slug}`}
                      target="_blank"
                      className="text-zinc-200 underline"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/sub-services/${row._id}`}
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
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-zinc-300">{label}</label>
      <input
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
      />
    </div>
  );
}
