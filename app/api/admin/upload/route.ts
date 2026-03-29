import { randomBytes } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';

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

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now()}-${randomBytes(8).toString('hex')}${ext}`;
  const dir = path.join(process.cwd(), 'public', 'uploads', 'cms');
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer);

  const url = `/uploads/cms/${name}`;
  return NextResponse.json({ url });
}
