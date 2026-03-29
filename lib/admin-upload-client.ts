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

  const raw = await res.text();
  let data: { url?: string; message?: string } = {};
  if (raw.trim()) {
    try {
      data = JSON.parse(raw) as { url?: string; message?: string };
    } catch {
      throw new Error(
        res.ok
          ? 'Invalid response from upload server.'
          : `Upload failed (${res.status}). The server did not return JSON — often this happens on serverless hosts where disk upload is not supported.`,
      );
    }
  } else if (!res.ok) {
    throw new Error(
      `Upload failed (${res.status}). Empty response — check server logs. On Vercel, saving files under /public is not supported; use an image URL or cloud storage.`,
    );
  } else {
    throw new Error('Upload returned an empty response.');
  }

  if (!res.ok) {
    throw new Error(data.message || `Upload failed (${res.status})`);
  }
  if (!data.url) {
    throw new Error(data.message || 'No URL returned');
  }
  return data.url;
}
