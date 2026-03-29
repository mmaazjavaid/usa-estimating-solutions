'use client';

import { useMemo, useState } from 'react';
import { ImageUrlInput } from '@/components/admin/image-url-input';
import { CmsSectionTemplatePreview } from '@/components/admin/cms-section-template-preview';
import { CMS_SECTION_REGISTRY, getSectionDefinition } from '@/lib/cms-sections/registry';
import type {
  CmsLinkValue,
  CmsPageSection,
  CmsSectionFieldDef,
  CmsSectionItemListDef,
} from '@/lib/cms-sections/types';

type LinkTarget = { label: string; path: string };

type CmsSectionsPanelProps = {
  sections: CmsPageSection[];
  onChange: (next: CmsPageSection[]) => void;
  linkTargets: LinkTarget[];
};

const emptyLink = (): CmsLinkValue => ({
  kind: 'internal',
  href: '/',
  label: 'Learn more',
});

export function CmsSectionsPanel({
  sections,
  onChange,
  linkTargets,
}: CmsSectionsPanelProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sectionPickerQuery, setSectionPickerQuery] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  /** True when the editor was opened right after picking a new template (Cancel removes the section). */
  const [editingIsNew, setEditingIsNew] = useState(false);

  const sorted = useMemo(
    () => [...sections].sort((a, b) => a.order - b.order),
    [sections],
  );

  const filteredSectionTemplates = useMemo(() => {
    const q = sectionPickerQuery.trim().toLowerCase();
    if (!q) {
      return CMS_SECTION_REGISTRY;
    }
    const tokens = q.split(/\s+/).filter(Boolean);
    return CMS_SECTION_REGISTRY.filter((def) => {
      const haystack = `${def.label} ${def.type} ${def.category} ${def.description}`.toLowerCase();
      return tokens.every((t) => haystack.includes(t));
    });
  }, [sectionPickerQuery]);

  const editing = sorted.find((s) => s.key === editingKey) ?? null;

  function addSection(type: string) {
    const def = getSectionDefinition(type);
    if (!def) return;
    const key =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `sec-${Date.now()}`;
    const next: CmsPageSection = {
      key,
      type,
      order: sections.length,
      data: { ...(JSON.parse(JSON.stringify(def.defaultData)) as Record<string, unknown>) },
    };
    onChange([...sections, next]);
    setEditingKey(key);
    setEditingIsNew(true);
    setSectionPickerQuery('');
    setPickerOpen(false);
  }

  function updateSection(key: string, data: Record<string, unknown>) {
    onChange(
      sections.map((s) => (s.key === key ? { ...s, data } : s)),
    );
  }

  function removeSection(key: string) {
    onChange(sections.filter((s) => s.key !== key));
    if (editingKey === key) {
      setEditingKey(null);
      setEditingIsNew(false);
    }
  }

  function doneEditing() {
    setEditingKey(null);
    setEditingIsNew(false);
  }

  function cancelEditing() {
    if (editingIsNew && editingKey) {
      removeSection(editingKey);
    } else {
      setEditingKey(null);
    }
    setEditingIsNew(false);
  }

  function move(key: string, dir: -1 | 1) {
    const idx = sorted.findIndex((s) => s.key === key);
    const j = idx + dir;
    if (idx < 0 || j < 0 || j >= sorted.length) {
      return;
    }
    const reordered = [...sorted];
    [reordered[idx], reordered[j]] = [reordered[j], reordered[idx]];
    onChange(
      reordered.map((s, i) => ({
        ...s,
        order: i,
      })),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setSectionPickerQuery('');
            setPickerOpen(true);
          }}
          className="rounded-md bg-white px-3 py-2 text-sm font-medium text-black"
        >
          Add section
        </button>
        <p className="text-xs text-zinc-500">
          {sections.length} section{sections.length === 1 ? '' : 's'} — compose the page body
        </p>
      </div>

      <ul className="space-y-2">
        {sorted.map((s) => {
          const def = getSectionDefinition(s.type);
          return (
            <li
              key={s.key}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium text-zinc-100">{def?.label ?? s.type}</p>
                <p className="text-xs text-zinc-500">{s.type}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => move(s.key, -1)}
                  className="rounded border border-zinc-600 px-2 py-1 text-xs"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => move(s.key, 1)}
                  className="rounded border border-zinc-600 px-2 py-1 text-xs"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingKey(s.key);
                    setEditingIsNew(false);
                  }}
                  className="rounded border border-zinc-600 px-2 py-1 text-xs"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => removeSection(s.key)}
                  className="rounded border border-red-900 px-2 py-1 text-xs text-red-400"
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {pickerOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4">
          <div className="mt-8 w-full max-w-4xl rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Section templates</h2>
              <button
                type="button"
                onClick={() => {
                  setSectionPickerQuery('');
                  setPickerOpen(false);
                }}
                className="text-sm text-zinc-400 underline"
              >
                Close
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="cms-section-search" className="sr-only">
                Search section templates
              </label>
              <input
                id="cms-section-search"
                type="search"
                value={sectionPickerQuery}
                onChange={(e) => setSectionPickerQuery(e.target.value)}
                placeholder="Search by name, category, or description…"
                autoComplete="off"
                className="w-full rounded-md border border-zinc-600 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
            {filteredSectionTemplates.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500">
                No sections match your search. Try a different keyword.
              </p>
            ) : (
              <div className="grid max-h-[60vh] grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 md:grid-cols-3">
                {filteredSectionTemplates.map((def) => (
                  <button
                    key={def.type}
                    type="button"
                    onClick={() => addSection(def.type)}
                    className="flex flex-col rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-left transition-colors hover:border-zinc-500"
                  >
                    <div className="mb-2 shrink-0" title={def.description}>
                      <CmsSectionTemplatePreview type={def.type} />
                    </div>
                    <p className="text-sm font-medium text-zinc-100">{def.label}</p>
                    <p className="text-xs text-zinc-500">{def.category}</p>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-zinc-600">
                      {def.description}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {editing ? (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/60 p-4">
          <div className="mt-6 w-full max-w-lg rounded-lg border border-zinc-700 bg-zinc-900 p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">
                {getSectionDefinition(editing.type)?.label ?? editing.type}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="rounded-md border border-zinc-600 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={doneEditing}
                  className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black"
                >
                  Done
                </button>
              </div>
            </div>
            <SectionDataForm
              section={editing}
              linkTargets={linkTargets}
              onChange={(data) => updateSection(editing.key, data)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SectionDataForm({
  section,
  linkTargets,
  onChange,
}: {
  section: CmsPageSection;
  linkTargets: LinkTarget[];
  onChange: (data: Record<string, unknown>) => void;
}) {
  const def = getSectionDefinition(section.type);
  const data = section.data || {};

  if (!def) {
    return <p className="text-sm text-zinc-500">Unknown section type.</p>;
  }

  function setField(key: string, value: unknown) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
      {def.fields.map((field) => {
        if (field.input === 'itemList') {
          return (
            <ItemListEditor
              key={field.key}
              field={field}
              value={data[field.key]}
              linkTargets={linkTargets}
              onChange={(v) => setField(field.key, v)}
            />
          );
        }

        return (
          <FieldEditor
            key={field.key}
            field={field}
            value={data[field.key]}
            linkTargets={linkTargets}
            onChange={(v) => setField(field.key, v)}
          />
        );
      })}
    </div>
  );
}

function FieldEditor({
  field,
  value,
  linkTargets,
  onChange,
}: {
  field: CmsSectionFieldDef;
  value: unknown;
  linkTargets: LinkTarget[];
  onChange: (v: unknown) => void;
}) {
  if (field.input === 'link') {
    const link =
      value && typeof value === 'object'
        ? (value as CmsLinkValue)
        : emptyLink();
    return (
      <div className="space-y-2 rounded-md border border-zinc-800 p-3">
        <p className="text-xs font-medium text-zinc-400">{field.label}</p>
        <label className="flex items-center gap-2 text-xs text-zinc-300">
          <span>Type</span>
          <select
            value={link.kind}
            onChange={(e) =>
              onChange({
                ...link,
                kind: e.target.value as CmsLinkValue['kind'],
              })
            }
            className="rounded border border-zinc-600 bg-zinc-950 px-2 py-1 text-white"
          >
            <option value="internal">Internal</option>
            <option value="external">External</option>
          </select>
        </label>
        {link.kind === 'internal' ? (
          <select
            value={link.href}
            onChange={(e) => onChange({ ...link, href: e.target.value })}
            className="w-full rounded border border-zinc-600 bg-zinc-950 px-2 py-1 text-sm text-white"
          >
            {link.href && !linkTargets.some((t) => t.path === link.href) ? (
              <option value={link.href}>
                Saved path: {link.href}
              </option>
            ) : null}
            {linkTargets.map((t) => (
              <option key={t.path} value={t.path}>
                {t.label} ({t.path})
              </option>
            ))}
          </select>
        ) : (
          <input
            value={link.href}
            onChange={(e) => onChange({ ...link, href: e.target.value })}
            placeholder="https://"
            className="w-full rounded border border-zinc-600 bg-zinc-950 px-2 py-1 text-sm text-white"
          />
        )}
        <input
          value={link.label}
          onChange={(e) => onChange({ ...link, label: e.target.value })}
          placeholder="Button label"
          className="w-full rounded border border-zinc-600 bg-zinc-950 px-2 py-1 text-sm text-white"
        />
      </div>
    );
  }

  const strVal =
    value === undefined || value === null ? '' : String(value as string);

  if (field.input === 'imageUrl') {
    return (
      <ImageUrlInput
        label={field.label}
        value={strVal}
        onChange={onChange}
        placeholder={field.placeholder}
        labelClassName="text-xs text-zinc-400"
        hideHelperText
      />
    );
  }

  if (field.input === 'textarea') {
    return (
      <label className="block space-y-1">
        <span className="text-xs text-zinc-400">{field.label}</span>
        <textarea
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full rounded border border-zinc-600 bg-zinc-950 px-2 py-1 text-sm text-white"
        />
      </label>
    );
  }

  if (field.input === 'select' && field.options?.length) {
    const isStatePicker = field.key === 'state';
    const selectValue = field.key === 'rating' && strVal === '' ? '0' : strVal;
    return (
      <label className="block space-y-1">
        <span className="text-xs text-zinc-400">{field.label}</span>
        <select
          value={selectValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded border border-zinc-600 bg-zinc-950 px-2 py-1 text-sm text-white"
        >
          {isStatePicker ? (
            <option value="" disabled>
              — Choose state —
            </option>
          ) : null}
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="block space-y-1">
      <span className="text-xs text-zinc-400">{field.label}</span>
      <input
        value={strVal}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-zinc-600 bg-zinc-950 px-2 py-1 text-sm text-white"
      />
    </label>
  );
}

function ItemListEditor({
  field,
  value,
  linkTargets,
  onChange,
}: {
  field: CmsSectionItemListDef;
  value: unknown;
  linkTargets: LinkTarget[];
  onChange: (v: unknown) => void;
}) {
  const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];

  function updateItems(next: Record<string, unknown>[]) {
    onChange(next);
  }

  function add() {
    const row: Record<string, unknown> = {};
    for (const f of field.itemFields) {
      if (f.input === 'link') {
        row[f.key] = emptyLink();
      } else if (f.input === 'select' && f.key === 'rating') {
        row[f.key] = '0';
      } else {
        row[f.key] = '';
      }
    }
    updateItems([...items, row]);
  }

  function remove(index: number) {
    updateItems(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2 rounded-md border border-zinc-800 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-zinc-400">{field.label}</p>
        <button
          type="button"
          onClick={add}
          disabled={field.maxItems !== undefined && items.length >= field.maxItems}
          className="text-xs text-zinc-300 underline disabled:opacity-40"
        >
          Add row
        </button>
      </div>
      {field.helperText ? (
        <p className="text-[11px] leading-snug text-zinc-500">{field.helperText}</p>
      ) : null}
      <div className="space-y-3">
        {items.map((row, index) => (
          <div
            key={index}
            className="space-y-2 rounded border border-zinc-800/80 bg-zinc-950/50 p-2"
          >
            {field.itemFields.map((sub) => (
              <FieldEditor
                key={sub.key}
                field={sub}
                value={row[sub.key]}
                linkTargets={linkTargets}
                onChange={(v) => {
                  const next = [...items];
                  next[index] = { ...row, [sub.key]: v };
                  updateItems(next);
                }}
              />
            ))}
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-xs text-red-400 underline"
            >
              Remove row
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
