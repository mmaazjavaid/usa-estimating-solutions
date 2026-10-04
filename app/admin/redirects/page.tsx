'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { traceRedirects, type RedirectRule } from '@/lib/redirects';

type Redirect = {
  _id: string;
  source: string;
  destination: string;
  statusCode: 301 | 302;
  enabled: boolean;
  note?: string;
  origin?: 'manual' | 'auto';
  hits?: number;
  lastHitAt?: string;
  updatedAt?: string;
};

type LinkTarget = { label: string; path: string };

type FormState = {
  source: string;
  destination: string;
  statusCode: '301' | '302';
  note: string;
};

type StatusFilter = 'all' | 'enabled' | 'disabled' | 'auto';

type ImportReport = {
  created: number;
  updated: number;
  skipped: number;
  errors: { line: number; text: string; message: string }[];
};

const emptyForm: FormState = { source: '', destination: '', statusCode: '301', note: '' };

const inputClass =
  'mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none';

function toRule(r: Redirect): RedirectRule {
  return {
    id: r._id,
    source: r.source,
    destination: r.destination,
    statusCode: r.statusCode === 302 ? 302 : 301,
    enabled: r.enabled !== false,
  };
}

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function formatDate(value?: string): string {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
}

export default function AdminRedirectsPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [linkTargets, setLinkTargets] = useState<LinkTarget[]>([]);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const [testUrl, setTestUrl] = useState('');

  const [importText, setImportText] = useState('');
  const [importOverwrite, setImportOverwrite] = useState(false);
  const [importCode, setImportCode] = useState<'301' | '302'>('301');
  const [isImporting, setIsImporting] = useState(false);
  const [importReport, setImportReport] = useState<ImportReport | null>(null);
  const [importError, setImportError] = useState('');

  async function loadRedirects() {
    setLoadError('');
    try {
      const res = await fetch('/api/admin/redirects', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const payload = (await res.json()) as { data?: Redirect[] };
      setRedirects(payload.data ?? []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load redirects.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadRedirects();

    async function loadTargets() {
      try {
        const res = await fetch('/api/admin/link-targets');
        const payload = (await res.json()) as {
          data?: {
            pages?: { name: string; path: string }[];
            services?: { name: string; path: string; slug: string }[];
          };
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
      } catch {
        // Suggestions are optional.
      }
    }
    void loadTargets();
  }, []);

  const rules = useMemo(() => redirects.map(toRule), [redirects]);

  /** Destinations that are themselves redirected (a chain) — shown as a warning in the table. */
  const chainedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const r of redirects) {
      if (!r.enabled || /^https?:\/\//i.test(r.destination)) continue;
      const { hops } = traceRedirects(rules, r.destination);
      if (hops.length > 0) ids.add(r._id);
    }
    return ids;
  }, [redirects, rules]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return redirects.filter((r) => {
      if (q && !`${r.source}\n${r.destination}\n${r.note ?? ''}`.toLowerCase().includes(q)) {
        return false;
      }
      if (statusFilter === 'enabled' && !r.enabled) return false;
      if (statusFilter === 'disabled' && r.enabled) return false;
      if (statusFilter === 'auto' && r.origin !== 'auto') return false;
      return true;
    });
  }, [redirects, searchQuery, statusFilter]);

  const testResult = useMemo(
    () => (testUrl.trim() ? traceRedirects(rules, testUrl) : null),
    [rules, testUrl],
  );

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice((current) => (current === message ? '' : current)), 4000);
  }

  function startEdit(r: Redirect) {
    setEditingId(r._id);
    setForm({
      source: r.source,
      destination: r.destination,
      statusCode: r.statusCode === 302 ? '302' : '301',
      note: r.note ?? '',
    });
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setFormError('');
    try {
      const res = await fetch(
        editingId ? `/api/admin/redirects/${editingId}` : '/api/admin/redirects',
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: form.source,
            destination: form.destination,
            statusCode: Number(form.statusCode),
            note: form.note,
          }),
        },
      );
      const payload = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setFormError(payload.message ?? 'Could not save the redirect.');
        return;
      }
      flash(editingId ? 'Redirect updated.' : 'Redirect added.');
      setEditingId(null);
      setForm(emptyForm);
      await loadRedirects();
    } catch {
      setFormError('Could not save the redirect. Check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleEnabled(r: Redirect) {
    const res = await fetch(`/api/admin/redirects/${r._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !r.enabled }),
    });
    const payload = (await res.json().catch(() => ({}))) as { message?: string };
    if (!res.ok) {
      window.alert(payload.message ?? 'Could not update the redirect.');
      return;
    }
    await loadRedirects();
  }

  async function handleDelete(r: Redirect) {
    if (!window.confirm(`Delete the redirect from ${r.source}? Visitors to that URL will get a 404.`)) {
      return;
    }
    const res = await fetch(`/api/admin/redirects/${r._id}`, { method: 'DELETE' });
    if (!res.ok) {
      window.alert('Could not delete the redirect.');
      return;
    }
    if (editingId === r._id) cancelEdit();
    flash('Redirect deleted.');
    await loadRedirects();
  }

  async function handleImport() {
    setIsImporting(true);
    setImportError('');
    setImportReport(null);
    try {
      const res = await fetch('/api/admin/redirects/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: importText,
          overwrite: importOverwrite,
          statusCode: Number(importCode),
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as ImportReport & { message?: string };
      if (!res.ok) {
        setImportError(payload.message ?? 'Import failed.');
        return;
      }
      setImportReport(payload);
      if (payload.errors.length === 0) setImportText('');
      await loadRedirects();
    } catch {
      setImportError('Import failed. Check your connection and try again.');
    } finally {
      setIsImporting(false);
    }
  }

  function exportCsv() {
    const lines = [
      'old_url,new_url,type,enabled,hits,note',
      ...redirects.map((r) =>
        [
          r.source,
          r.destination,
          String(r.statusCode),
          r.enabled ? 'yes' : 'no',
          String(r.hits ?? 0),
          r.note ?? '',
        ]
          .map(csvCell)
          .join(','),
      ),
    ];
    const blob = new Blob([`${lines.join('\n')}\n`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `redirects-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Redirects</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Send visitors and search engines from an old URL to a new one. Use{' '}
            <strong className="text-zinc-200">301 (permanent)</strong> when a page has moved for
            good — Google transfers its ranking to the new URL. Use{' '}
            <strong className="text-zinc-200">302 (temporary)</strong> only for short-term moves.
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={redirects.length === 0}
          className="rounded-md border border-zinc-600 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800 disabled:opacity-40"
        >
          Export CSV
        </button>
      </div>

      {notice ? (
        <p className="mt-4 rounded-md border border-emerald-900 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">
          {notice}
        </p>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/50 p-4"
      >
        <h2 className="text-sm font-semibold text-zinc-200">
          {editingId ? 'Edit redirect' : 'Add a redirect'}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-xs font-medium text-zinc-400">
            Old URL
            <input
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              placeholder="/old-page  or  https://yoursite.com/old-page"
              required
              className={inputClass}
            />
            <span className="mt-1 block font-normal text-zinc-500">
              End with <code className="text-zinc-300">/*</code> to redirect a whole folder, e.g.{' '}
              <code className="text-zinc-300">/old-blog/*</code>.
            </span>
          </label>
          <label className="block text-xs font-medium text-zinc-400">
            New URL
            <input
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              placeholder="/new-page  or  https://othersite.com/page"
              list="redirect-link-targets"
              required
              className={inputClass}
            />
            <datalist id="redirect-link-targets">
              {linkTargets.map((t) => (
                <option key={t.path} value={t.path}>
                  {t.label}
                </option>
              ))}
            </datalist>
            <span className="mt-1 block font-normal text-zinc-500">
              For folder redirects, <code className="text-zinc-300">*</code> carries the rest of the
              path over, e.g. <code className="text-zinc-300">/blog/*</code>.
            </span>
          </label>
          <label className="block text-xs font-medium text-zinc-400">
            Type
            <select
              value={form.statusCode}
              onChange={(e) => setForm({ ...form, statusCode: e.target.value as '301' | '302' })}
              className={inputClass}
            >
              <option value="301">301 — Permanent (recommended for SEO)</option>
              <option value="302">302 — Temporary</option>
            </select>
          </label>
          <label className="block text-xs font-medium text-zinc-400">
            Note (optional)
            <input
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Why this redirect exists"
              maxLength={500}
              className={inputClass}
            />
          </label>
        </div>
        {formError ? <p className="text-sm text-red-400">{formError}</p> : null}
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
          >
            {isSaving ? 'Saving…' : editingId ? 'Save changes' : 'Add redirect'}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-md border border-zinc-600 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
          <h2 className="text-sm font-semibold text-zinc-200">Test a URL</h2>
          <input
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            placeholder="Paste any URL or path to see where it goes"
            className={inputClass}
          />
          {testResult ? (
            <div className="mt-3 text-sm">
              {testResult.hops.length === 0 ? (
                <p className="text-zinc-400">No redirect — this URL loads normally.</p>
              ) : (
                <ol className="space-y-1">
                  {testResult.hops.map((hop, i) => (
                    <li key={i} className="break-all text-zinc-300">
                      <span className="text-zinc-500">{hop.statusCode}</span> {hop.from}{' '}
                      <span className="text-zinc-500">→</span> {hop.to}
                    </li>
                  ))}
                </ol>
              )}
              {testResult.loop ? (
                <p className="mt-2 text-red-400">Warning: this URL ends up in a redirect loop.</p>
              ) : testResult.hops.length > 1 ? (
                <p className="mt-2 text-amber-400">
                  This URL takes {testResult.hops.length} hops. Pointing the first redirect straight
                  at the final URL is better for SEO.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        <details className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-zinc-200">
            Bulk import
          </summary>
          <p className="mt-2 text-xs text-zinc-500">
            One redirect per line: <code className="text-zinc-300">old URL, new URL</code> and
            optionally <code className="text-zinc-300">, 302</code>. You can paste two or three
            columns straight from a spreadsheet.
          </p>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={6}
            placeholder={'/old-page, /new-page\n/old-service, /services, 301\nhttps://yoursite.com/promo, /pricing, 302'}
            className={`${inputClass} font-mono text-xs`}
          />
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
            <label className="flex items-center gap-2">
              Default type
              <select
                value={importCode}
                onChange={(e) => setImportCode(e.target.value as '301' | '302')}
                className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100"
              >
                <option value="301">301</option>
                <option value="302">302</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={importOverwrite}
                onChange={(e) => setImportOverwrite(e.target.checked)}
              />
              Overwrite existing redirects for the same old URL
            </label>
          </div>
          <button
            type="button"
            onClick={() => void handleImport()}
            disabled={isImporting || !importText.trim()}
            className="mt-3 rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
          >
            {isImporting ? 'Importing…' : 'Import'}
          </button>
          {importError ? <p className="mt-2 text-sm text-red-400">{importError}</p> : null}
          {importReport ? (
            <div className="mt-3 text-sm">
              <p className="text-zinc-300">
                {importReport.created} added, {importReport.updated} updated,{' '}
                {importReport.skipped} skipped (already existed), {importReport.errors.length}{' '}
                with errors.
              </p>
              {importReport.errors.length > 0 ? (
                <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-xs">
                  {importReport.errors.map((e) => (
                    <li key={e.line} className="text-red-400">
                      Line {e.line} (<code className="text-zinc-400">{e.text}</code>): {e.message}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </details>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-zinc-400">Loading redirects...</p>
      ) : loadError ? (
        <p className="mt-6 text-sm text-red-400">
          {loadError}{' '}
          <button type="button" onClick={() => void loadRedirects()} className="underline">
            Retry
          </button>
        </p>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="block flex-1 text-xs font-medium text-zinc-400">
              Search
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Old URL, new URL or note…"
                className={inputClass}
              />
            </label>
            <label className="block text-xs font-medium text-zinc-400 sm:w-48">
              Show
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className={inputClass}
              >
                <option value="all">All</option>
                <option value="enabled">Active</option>
                <option value="disabled">Paused</option>
                <option value="auto">Created automatically</option>
              </select>
            </label>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Showing {filtered.length} of {redirects.length} redirect
            {redirects.length === 1 ? '' : 's'}. Changes go live within about 30 seconds.
          </p>

          <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900 text-xs text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Old URL</th>
                  <th className="px-4 py-3 font-medium">New URL</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Hits</th>
                  <th className="px-4 py-3 font-medium">Last hit</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                      {redirects.length === 0
                        ? 'No redirects yet. Add one above or use Bulk import.'
                        : 'No redirects match your search.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r._id} className="border-t border-zinc-800 align-top">
                      <td className="max-w-xs px-4 py-3">
                        <p className="break-all text-zinc-100">{r.source}</p>
                        {r.origin === 'auto' ? (
                          <span className="mt-1 inline-block rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                            Auto
                          </span>
                        ) : null}
                        {r.note ? <p className="mt-1 text-xs text-zinc-500">{r.note}</p> : null}
                      </td>
                      <td className="max-w-xs px-4 py-3">
                        <p className="break-all text-zinc-300">{r.destination}</p>
                        {chainedIds.has(r._id) ? (
                          <p className="mt-1 text-xs text-amber-400">
                            This URL is itself redirected (chain).
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-zinc-300">{r.statusCode}</td>
                      <td className="px-4 py-3 text-zinc-300">{r.hits ?? 0}</td>
                      <td className="px-4 py-3 text-zinc-400">{formatDate(r.lastHitAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => void toggleEnabled(r)}
                          className={`rounded px-2 py-1 text-xs ${
                            r.enabled
                              ? 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
                              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                          }`}
                          title={r.enabled ? 'Click to pause' : 'Click to activate'}
                        >
                          {r.enabled ? 'Active' : 'Paused'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3 text-xs">
                          <button
                            type="button"
                            onClick={() => startEdit(r)}
                            className="text-zinc-300 underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(r)}
                            className="text-red-400 underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
