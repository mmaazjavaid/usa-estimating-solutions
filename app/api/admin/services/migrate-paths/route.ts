import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { connectToDatabase } from '@/lib/db';
import { ServiceModel } from '@/models/Service';

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function POST() {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  await connectToDatabase();

  const services = await ServiceModel.find().select('_id slug path').lean();

  let updated = 0;
  let skipped = 0;
  const errors: Array<{ id: string; reason: string }> = [];

  for (const service of services) {
    const normalizedSlug = normalizeSlug(service.slug || '');
    if (!normalizedSlug) {
      skipped += 1;
      errors.push({
        id: service._id.toString(),
        reason: 'Invalid slug after normalization',
      });
      continue;
    }

    const canonicalPath = `/${normalizedSlug}`;
    const needsUpdate =
      service.slug !== normalizedSlug || service.path !== canonicalPath;

    if (!needsUpdate) {
      skipped += 1;
      continue;
    }

    try {
      await ServiceModel.updateOne(
        { _id: service._id },
        { $set: { slug: normalizedSlug, path: canonicalPath } },
      );
      updated += 1;
    } catch (error) {
      skipped += 1;
      errors.push({
        id: service._id.toString(),
        reason:
          error instanceof Error ? error.message : 'Unknown update failure',
      });
    }
  }

  return NextResponse.json({
    ok: true,
    total: services.length,
    updated,
    skipped,
    errors,
  });
}
