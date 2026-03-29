/**
 * Client-side upload to `/api/admin/upload`. Returns a public path like `/uploads/cms/...`.
 */
export async function uploadAdminImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    body: fd,
    credentials: 'include',
  });
  const data = (await res.json()) as { url?: string; message?: string };
  if (!res.ok) {
    throw new Error(data.message || 'Upload failed');
  }
  if (!data.url) {
    throw new Error('No URL returned');
  }
  return data.url;
}
