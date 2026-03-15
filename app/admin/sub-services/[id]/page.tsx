'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type SubServiceForm = {
  serviceId: string;
  name: string;
  slug: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  indexStatus: 'index' | 'noindex';
  status: 'published' | 'unpublished';
};

type ServiceOption = {
  _id: string;
  name: string;
};

const initialForm: SubServiceForm = {
  serviceId: '',
  name: '',
  slug: '',
  shortDescription: '',
  metaTitle: '',
  metaDescription: '',
  indexStatus: 'index',
  status: 'published',
};

export default function EditSubServicePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [formData, setFormData] = useState<SubServiceForm>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      const [subServiceResponse, servicesResponse] = await Promise.all([
        fetch(`/api/admin/sub-services/${params.id}`),
        fetch('/api/admin/services'),
      ]);

      const subServicePayload = (await subServiceResponse.json()) as {
        data?: SubServiceForm;
      };
      const servicesPayload = (await servicesResponse.json()) as {
        data?: ServiceOption[];
      };

      if (subServicePayload.data) {
        setFormData(subServicePayload.data);
      }

      setServices(servicesPayload.data ?? []);
      setIsLoading(false);
    }

    void loadData();
  }, [params.id]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    setIsSaving(true);

    const response = await fetch(`/api/admin/sub-services/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setMessage(response.ok ? 'Sub-service updated.' : 'Failed to update.');
    setIsSaving(false);
  }

  if (isLoading) {
    return <p className="text-sm text-zinc-400">Loading sub-service...</p>;
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Sub-Service</h1>
        <button
          type="button"
          onClick={() => router.push('/admin/sub-services')}
          className="rounded-md border border-zinc-700 px-3 py-2 text-sm"
        >
          Back
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
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
          >
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Sub-Service Name"
          value={formData.name}
          onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
        />
        <Input
          label="Sub-Service Slug"
          value={formData.slug}
          onChange={(value) => setFormData((prev) => ({ ...prev, slug: value }))}
        />
        <Input
          label="Short Description"
          value={formData.shortDescription}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, shortDescription: value }))
          }
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

        <div className="space-y-1">
          <label className="text-sm text-zinc-300">Index Status</label>
          <select
            value={formData.indexStatus}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                indexStatus: event.target.value as SubServiceForm['indexStatus'],
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
                status: event.target.value as SubServiceForm['status'],
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
