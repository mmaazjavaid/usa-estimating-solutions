'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

type Service = {
  _id: string;
  name: string;
  slug: string;
  path: string;
  indexStatus: 'index' | 'noindex';
  status: 'published' | 'unpublished';
};

type NewService = {
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

const emptyNewService: NewService = {
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

export default function AdminServicesPage() {
  function toSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState<NewService>(emptyNewService);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationMessage, setMigrationMessage] = useState('');

  async function loadServices() {
    setIsLoading(true);
    const response = await fetch('/api/admin/services');
    const payload = (await response.json()) as { data?: Service[] };
    setServices(payload.data ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    void loadServices();
  }, []);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);

    const response = await fetch('/api/admin/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newService),
    });

    if (response.ok) {
      setNewService(emptyNewService);
      await loadServices();
    }

    setIsSaving(false);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    await loadServices();
  }

  async function handleNormalizePaths() {
    setMigrationMessage('');
    setIsMigrating(true);

    const response = await fetch('/api/admin/services/migrate-paths', {
      method: 'POST',
    });
    const payload = (await response.json()) as {
      updated?: number;
      skipped?: number;
      message?: string;
    };

    if (response.ok) {
      setMigrationMessage(
        `Path migration complete. Updated: ${payload.updated ?? 0}, Skipped: ${payload.skipped ?? 0}.`,
      );
      await loadServices();
    } else {
      setMigrationMessage(payload.message ?? 'Path migration failed.');
    }

    setIsMigrating(false);
  }

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Services</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Add and manage services that appear on the website.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleNormalizePaths}
            disabled={isMigrating}
            className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-200 disabled:opacity-70"
          >
            {isMigrating ? 'Normalizing Paths...' : 'Normalize Existing Paths'}
          </button>
          {migrationMessage ? (
            <p className="text-sm text-zinc-300">{migrationMessage}</p>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleCreate} className="grid gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6 md:grid-cols-2">
        <Input
          label="Service Name"
          value={newService.name}
          onChange={(value) => setNewService((prev) => ({ ...prev, name: value }))}
          required
        />
        <Input
          label="Service Slug"
          value={newService.slug}
          onChange={(value) => {
            const slug = toSlug(value);
            setNewService((prev) => ({ ...prev, slug, path: slug ? `/${slug}` : '' }));
          }}
          required
        />
        <Input
          label="Service Path (URL)"
          value={newService.path}
          onChange={() => undefined}
          placeholder="/new-service"
          readOnly
        />
        <Input
          label="Short Description"
          value={newService.shortDescription}
          onChange={(value) =>
            setNewService((prev) => ({ ...prev, shortDescription: value }))
          }
        />
        <Input
          label="Image URL"
          value={newService.image}
          onChange={(value) => setNewService((prev) => ({ ...prev, image: value }))}
        />
        <Input
          label="Image Alt"
          value={newService.imageAlt}
          onChange={(value) => setNewService((prev) => ({ ...prev, imageAlt: value }))}
        />
        <Input
          label="Meta Image URL"
          value={newService.metaImage}
          onChange={(value) => setNewService((prev) => ({ ...prev, metaImage: value }))}
        />
        <Input
          label="Meta Title"
          value={newService.metaTitle}
          onChange={(value) => setNewService((prev) => ({ ...prev, metaTitle: value }))}
        />
        <Input
          label="Meta Description"
          value={newService.metaDescription}
          onChange={(value) =>
            setNewService((prev) => ({ ...prev, metaDescription: value }))
          }
        />
        <Input
          label="Header Meta Tags"
          value={newService.headerMetaTags}
          onChange={(value) =>
            setNewService((prev) => ({ ...prev, headerMetaTags: value }))
          }
        />
        <Input
          label="Footer Meta Tags"
          value={newService.footerMetaTags}
          onChange={(value) =>
            setNewService((prev) => ({ ...prev, footerMetaTags: value }))
          }
        />

        <Select
          label="Index Status"
          value={newService.indexStatus}
          options={['index', 'noindex']}
          onChange={(value) =>
            setNewService((prev) => ({
              ...prev,
              indexStatus: value as NewService['indexStatus'],
            }))
          }
        />
        <Select
          label="Status"
          value={newService.status}
          options={['published', 'unpublished']}
          onChange={(value) =>
            setNewService((prev) => ({
              ...prev,
              status: value as NewService['status'],
            }))
          }
        />

        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={newService.displayInFooterMenu}
            onChange={(event) =>
              setNewService((prev) => ({
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
          {isSaving ? 'Saving...' : 'Add Service'}
        </button>
      </form>

      {isLoading ? (
        <p className="text-sm text-zinc-400">Loading services...</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-4 py-3">Service Name</th>
                <th className="px-4 py-3">Index Status</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id} className="border-t border-zinc-800 bg-zinc-950">
                  <td className="px-4 py-3">
                    <p>{service.name}</p>
                    <p className="text-xs text-zinc-400">{service.path || `/${service.slug}`}</p>
                  </td>
                  <td className="px-4 py-3">{service.indexStatus}</td>
                  <td className="px-4 py-3">{service.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={service.path || `/${service.slug}`}
                        target="_blank"
                        className="text-zinc-200 underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/services/${service._id}`}
                        className="text-zinc-200 underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(service._id)}
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

function Input({
  label,
  value,
  onChange,
  required = false,
  placeholder,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-zinc-300">{label}</label>
      <input
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
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
