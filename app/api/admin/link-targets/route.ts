import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-guard';
import { ensureBaseCmsRecords } from '@/lib/cms';
import { PageModel } from '@/models/Page';
import { ServiceModel } from '@/models/Service';

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  await ensureBaseCmsRecords();
  const [pages, services] = await Promise.all([
    PageModel.find()
      .sort({ path: 1 })
      .select('name slug path renderMode status')
      .lean(),
    ServiceModel.find()
      .sort({ name: 1 })
      .select('name slug path status')
      .lean(),
  ]);

  return NextResponse.json({
    data: {
      pages: pages.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        path: p.path,
        renderMode: p.renderMode ?? 'seo_only',
        status: p.status,
      })),
      services: services.map((s) => ({
        id: s._id.toString(),
        name: s.name,
        slug: s.slug,
        path: s.path,
        status: s.status,
      })),
    },
  });
}
