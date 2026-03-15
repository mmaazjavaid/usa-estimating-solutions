'use client';

import { FormEvent, useEffect, useState } from 'react';

type ContactData = {
  emails: string[];
  phones: string[];
  address: string;
};

const initialData: ContactData = {
  emails: [''],
  phones: [''],
  address: '',
};

export default function AdminContactPage() {
  const [formData, setFormData] = useState<ContactData>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchContact() {
      const response = await fetch('/api/admin/contact');
      const payload = (await response.json()) as { data?: ContactData };
      if (payload.data) {
        setFormData({
          emails: payload.data.emails.length ? payload.data.emails : [''],
          phones: payload.data.phones.length ? payload.data.phones : [''],
          address: payload.data.address ?? '',
        });
      }
      setIsLoading(false);
    }

    void fetchContact();
  }, []);

  function updateListField(
    key: 'emails' | 'phones',
    index: number,
    value: string,
  ) {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].map((item, idx) => (idx === index ? value : item)),
    }));
  }

  function addListField(key: 'emails' | 'phones') {
    setFormData((prev) => ({ ...prev, [key]: [...prev[key], ''] }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    setIsSaving(true);

    const response = await fetch('/api/admin/contact', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const payload = (await response.json()) as { message?: string };
    setMessage(response.ok ? 'Contact data saved.' : payload.message ?? 'Failed.');
    setIsSaving(false);
  }

  if (isLoading) {
    return <p className="text-sm text-zinc-400">Loading contact data...</p>;
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold">Manage Contact Data</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Update the contact information shown on your public site.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-zinc-200">Contact Emails</h2>
          {formData.emails.map((email, index) => (
            <input
              key={`email-${index}`}
              type="email"
              value={email}
              onChange={(event) => updateListField('emails', index, event.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
              placeholder="admin@example.com"
            />
          ))}
          <button
            type="button"
            onClick={() => addListField('emails')}
            className="text-sm text-zinc-300 underline"
          >
            + Add another email
          </button>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-zinc-200">Contact Phones</h2>
          {formData.phones.map((phone, index) => (
            <input
              key={`phone-${index}`}
              value={phone}
              onChange={(event) => updateListField('phones', index, event.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
              placeholder="+1 (000) 000-0000"
            />
          ))}
          <button
            type="button"
            onClick={() => addListField('phones')}
            className="text-sm text-zinc-300 underline"
          >
            + Add another phone
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-300" htmlFor="address">
            Address
          </label>
          <input
            id="address"
            value={formData.address}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, address: event.target.value }))
            }
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-70"
        >
          {isSaving ? 'Saving...' : 'Save Contact Data'}
        </button>

        {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
      </form>
    </section>
  );
}
