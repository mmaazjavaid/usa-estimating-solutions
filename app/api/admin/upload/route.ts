import { randomBytes } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';

/** When set (Vercel: link a Blob store — token is injected automatically), uploads go to Vercel Blob. Otherwise files are written to `public/uploads/cms` (local / self-hosted only). */
function useVercelBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

/** Node serverless (e.g. Vercel) has a read-only filesystem except /tmp — writing under public/ fails without Blob. */
const EPHEMERAL_HOST_HINT =
  'Disk upload is not available on this deployment. Add a Vercel Blob store (sets BLOB_READ_WRITE_TOKEN) or paste an image URL.';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Map<string, string>([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/gif', '.gif'],
  ['image/webp', '.webp'],
  ['image/svg+xml', '.svg'],
]);

function extForMime(mime: string): string | undefined {
  return ALLOWED.get(mime);
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdminApi();
    if (!auth.authorized) {
      return auth.response;
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ message: 'Invalid form data' }, { status: 400 });
    }

    const file = formData.get('file');
    if (!file || typeof file === 'string' || !('arrayBuffer' in file)) {
      return NextResponse.json({ message: 'Missing file' }, { status: 400 });
    }

    const mime = file.type || 'application/octet-stream';
    const ext = extForMime(mime);
    if (!ext) {
      return NextResponse.json(
        { message: 'Only JPEG, PNG, GIF, WebP, and SVG images are allowed.' },
        { status: 400 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ message: 'Empty file' }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ message: 'File must be 5MB or smaller.' }, { status: 400 });
    }

    const name = `${Date.now()}-${randomBytes(8).toString('hex')}${ext}`;

    if (useVercelBlob()) {
      try {
        const blob = await put(`cms/${name}`, file, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        return NextResponse.json({ url: blob.url });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[api/admin/upload] Vercel Blob failed:', err);
        return NextResponse.json(
          { message: `Blob upload failed: ${msg}` },
          { status: 500 },
        );
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), 'public', 'uploads', 'cms');

    try {
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, name), buffer);
    } catch (err) {
      const code = err && typeof err === 'object' && 'code' in err ? String((err as NodeJS.ErrnoException).code) : '';
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[api/admin/upload] write failed:', code, msg);
      const isReadOnlyFs =
        code === 'EROFS' ||
        code === 'EACCES' ||
        code === 'EPERM' ||
        /read-only|EROFS|EACCES|EPERM/i.test(msg);
      return NextResponse.json(
        {
          message: isReadOnlyFs ? EPHEMERAL_HOST_HINT : `Could not save file: ${msg}`,
        },
        { status: 500 },
      );
    }

    const url = `/uploads/cms/${name}`;
    return NextResponse.json({ url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    console.error('[api/admin/upload]', err);
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
