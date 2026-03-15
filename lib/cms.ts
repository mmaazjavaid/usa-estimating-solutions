import type { Metadata } from 'next';
import {
  DEFAULT_CONTACT,
  DEFAULT_PAGE_DEFINITIONS,
  DEFAULT_SERVICES,
} from '@/lib/cms-defaults';
import { connectToDatabase } from '@/lib/db';
import { ContactDataModel } from '@/models/ContactData';
import { AdminModel } from '@/models/Admin';
import { PageModel } from '@/models/Page';
import { ServiceModel } from '@/models/Service';
import { SubServiceModel } from '@/models/SubService';

type CmsBootstrapState = {
  seeded: boolean;
  promise: Promise<void> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var cmsBootstrapState: CmsBootstrapState | undefined;
}

const globalWithCms = global as typeof global & {
  cmsBootstrapState?: CmsBootstrapState;
};

const cmsBootstrapState: CmsBootstrapState = globalWithCms.cmsBootstrapState ?? {
  seeded: false,
  promise: null,
};

if (!globalWithCms.cmsBootstrapState) {
  globalWithCms.cmsBootstrapState = cmsBootstrapState;
}

async function runCmsBootstrap() {
  await connectToDatabase();

  if (process.env.ADMIN_EMAIL) {
    await AdminModel.updateOne(
      { email: process.env.ADMIN_EMAIL },
      { $setOnInsert: { email: process.env.ADMIN_EMAIL } },
      { upsert: true },
    );
  }

  await ContactDataModel.updateOne(
    {},
    { $setOnInsert: DEFAULT_CONTACT },
    { upsert: true },
  );

  for (const page of DEFAULT_PAGE_DEFINITIONS) {
    await PageModel.updateOne(
      { $or: [{ slug: page.slug }, { path: page.path }] },
      {
        $setOnInsert: {
          name: page.name,
          slug: page.slug,
          path: page.path,
          metaTitle: '',
          metaDescription: '',
        },
      },
      { upsert: true },
    );
  }

  for (const service of DEFAULT_SERVICES) {
    await ServiceModel.updateOne(
      { $or: [{ slug: service.slug }, { path: service.path }] },
      {
        $setOnInsert: {
          ...service,
          metaImage: service.image,
          metaTitle: service.name,
          metaDescription: service.shortDescription,
          indexStatus: 'index',
          status: 'published',
          displayInFooterMenu: false,
        },
      },
      { upsert: true },
    );
  }
}

export async function ensureBaseCmsRecords() {
  if (cmsBootstrapState.seeded) {
    return;
  }

  if (!cmsBootstrapState.promise) {
    cmsBootstrapState.promise = runCmsBootstrap()
      .then(() => {
        cmsBootstrapState.seeded = true;
      })
      .finally(() => {
        cmsBootstrapState.promise = null;
      });
  }

  await cmsBootstrapState.promise;
}

export async function getContactData() {
  await ensureBaseCmsRecords();
  const doc = await ContactDataModel.findOne().lean();
  return doc ?? DEFAULT_CONTACT;
}

export async function getPublishedServices() {
  await ensureBaseCmsRecords();
  return await ServiceModel.find({ status: 'published' })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getFooterMenuServices() {
  await ensureBaseCmsRecords();
  return await ServiceModel.find({
    status: 'published',
    displayInFooterMenu: true,
  })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getPublishedServiceBySlug(slug: string) {
  await ensureBaseCmsRecords();
  return await ServiceModel.findOne({ slug, status: 'published' }).lean();
}

export async function getPublishedSubServices(serviceId: string) {
  await connectToDatabase();
  return await SubServiceModel.find({
    serviceId,
    status: 'published',
  })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getPublishedSubServiceBySlug(slug: string) {
  await connectToDatabase();
  return await SubServiceModel.findOne({
    slug,
    status: 'published',
  })
    .populate('serviceId', 'name slug path')
    .lean();
}

export async function getSeoMetadataByPath(path: string): Promise<Metadata | null> {
  await ensureBaseCmsRecords();
  const page = await PageModel.findOne({ path }).lean();

  if (!page || page.status === 'unpublished') {
    return null;
  }

  const robotsValue =
    page.indexStatus === 'noindex'
      ? { index: false, follow: false }
      : { index: true, follow: true };

  return {
    title: page.metaTitle || undefined,
    description: page.metaDescription || undefined,
    robots: robotsValue,
    other: {
      headerMetaTags: page.headerMetaTags || '',
      footerMetaTags: page.footerMetaTags || '',
    },
  };
}
