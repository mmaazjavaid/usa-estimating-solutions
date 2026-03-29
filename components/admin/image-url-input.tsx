'use client';

import { useRef, useState } from 'react';
import { uploadAdminImage } from '@/lib/admin-upload-client';

export type ImageUrlInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Label styling (default matches most admin forms). */
  labelClassName?: string;
  /** Hint under the label; default explains URL vs upload. Set `hideHelperText` in tight layouts. */
  hint?: string;
  hideHelperText?: boolean;
};

const DEFAULT_HINT =
  'Paste a URL or upload an image. With BLOB_READ_WRITE_TOKEN (Vercel Blob), files are stored in the cloud; otherwise they save under /uploads/cms/ on the server.';

export function ImageUrlInput({
  label,
  value,
  onChange,
  placeholder,
  labelClassName = 'text-sm text-zinc-300',
  hint = DEFAULT_HINT,
  hideHelperText = false,
}: ImageUrlInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file: File | undefined) {
    if (!file) {
      return;
    }
    setError('');
    setUploading(true);
    try {
      const url = await uploadAdminImage(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) {
        fileRef.current.value = '';
      }
    }
  }

  const canPreview =
    value.trim().length > 0 &&
    (value.startsWith('/') || value.startsWith('http://') || value.startsWith('https://'));

  return (
    <div className="space-y-1">
      <label className={`block ${labelClassName}`}>{label}</label>
      {!hideHelperText && hint ? (
        <p className="text-[11px] leading-snug text-zinc-500">{hint}</p>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
        />
        <div className="flex shrink-0 gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="whitespace-nowrap rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading…' : 'Upload image'}
          </button>
        </div>
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      {canPreview ? (
        <div className="pt-1">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary URL */}
          <img
            src={value}
            alt=""
            className="max-h-28 max-w-full rounded border border-zinc-700 object-contain"
          />
        </div>
      ) : null}
    </div>
  );
}
