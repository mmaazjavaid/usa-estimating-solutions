import type { Metadata } from 'next';
import { cmsReadNoStore } from '@/lib/cms-read-no-store';
import {
  DEFAULT_CONTACT,
  DEFAULT_PAGE_DEFINITIONS,
  DEFAULT_SERVICES,
} from '@/lib/cms-defaults';
import {
  HOME_PAGE_SECTIONS,
  HOME_SECTIONS_SCHEMA_VERSION,
} from '@/lib/cms-home-sections';
import {
  SERVICE_MARKETING_PAGES,
  SERVICE_MARKETING_SECTIONS_SCHEMA_VERSION,
  buildServiceMarketingSections,
} from '@/lib/cms-service-marketing-seed';
import {
  TRADES_DYNAMIC_PAGE_SEEDS,
  TRADES_SECTIONS_SCHEMA_VERSION,
} from '@/lib/cms-trades-pages-seed';
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

/** Legacy home CMS used `{}` per section — admin looked empty while the site used component defaults. */
function shouldApplyFullHomeSectionDefaults(sections: unknown): boolean {
  if (!Array.isArray(sections)) {
    return true;
  }
  const hero = sections.find(
    (s: { type?: string }) => s && (s as { type?: string }).type === 'site_hero',
  ) as { data?: Record<string, unknown> } | undefined;
  const d = hero?.data;
  if (!d || typeof d !== 'object') {
    return true;
  }
  return Object.keys(d).length === 0 || !String(d.subtitle ?? '').trim();
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

  const homePage = await PageModel.findOne({ path: '/' })
    .select('sections slug renderMode homeSectionsVersion')
    .lean() as {
    sections?: unknown;
    slug?: string;
    renderMode?: string;
    homeSectionsVersion?: number;
  } | null;

  if (homePage && homePage.homeSectionsVersion !== HOME_SECTIONS_SCHEMA_VERSION) {
    const sections = homePage.sections;
    const needsFullDefaults =
      !Array.isArray(sections) ||
      sections.length === 0 ||
      shouldApplyFullHomeSectionDefaults(sections);

    if (needsFullDefaults) {
      await PageModel.updateOne(
        { path: '/' },
        {
          $set: {
            renderMode: 'dynamic',
            sections: HOME_PAGE_SECTIONS,
            homeSectionsVersion: HOME_SECTIONS_SCHEMA_VERSION,
          },
        },
      );
    } else {
      await PageModel.updateOne(
        { path: '/' },
        { $set: { homeSectionsVersion: HOME_SECTIONS_SCHEMA_VERSION } },
      );
    }
  }

  // Migrate root slug "/" → "homepage" (avoids clashing with a separate /home page using slug "home").
  const rootSlugConflict = await PageModel.findOne({ slug: 'homepage' })
    .select('path')
    .lean();
  const rootSlug =
    !rootSlugConflict || rootSlugConflict.path === '/'
      ? 'homepage'
      : '__homepage';
  await PageModel.updateOne(
    { path: '/', slug: '/' },
    { $set: { slug: rootSlug } },
  );

  for (const def of SERVICE_MARKETING_PAGES) {
    const existing = (await PageModel.findOne({ path: def.path })
      .select('sections serviceMarketingSectionsVersion')
      .lean()) as {
      sections?: unknown;
      serviceMarketingSectionsVersion?: number;
    } | null;

    const sections = existing?.sections;
    const hasLegacyTemplate =
      Array.isArray(sections) &&
      sections.some(
        (s: { type?: string }) => s && (s as { type?: string }).type === 'site_service_page_template',
      );
    const empty = !Array.isArray(sections) || sections.length === 0;
    const version = existing?.serviceMarketingSectionsVersion ?? 0;
    const needsFullSeed = hasLegacyTemplate || empty;
    const needsVersionBump = version !== SERVICE_MARKETING_SECTIONS_SCHEMA_VERSION && !needsFullSeed;

    if (needsFullSeed) {
      await PageModel.updateOne(
        { path: def.path },
        {
          $set: {
            renderMode: 'dynamic',
            placement: 'services',
            sections: buildServiceMarketingSections(def.slug),
            serviceMarketingSectionsVersion: SERVICE_MARKETING_SECTIONS_SCHEMA_VERSION,
          },
        },
      );
    } else if (needsVersionBump) {
      await PageModel.updateOne(
        { path: def.path },
        { $set: { serviceMarketingSectionsVersion: SERVICE_MARKETING_SECTIONS_SCHEMA_VERSION } },
      );
    }
  }

  for (const def of TRADES_DYNAMIC_PAGE_SEEDS) {
    const existing = (await PageModel.findOne({ path: def.path })
      .select('sections tradesSectionsVersion')
      .lean()) as {
      sections?: unknown;
      tradesSectionsVersion?: number;
    } | null;

    const sections = existing?.sections;
    const empty = !Array.isArray(sections) || sections.length === 0;
    const version = existing?.tradesSectionsVersion ?? 0;
    const needsFullSeed = empty || version !== TRADES_SECTIONS_SCHEMA_VERSION;

    if (needsFullSeed) {
      await PageModel.updateOne(
        { path: def.path },
        {
          $set: {
            name: def.name,
            slug: def.slug,
            renderMode: 'dynamic',
            placement: 'trades',
            status: 'published',
            indexStatus: 'index',
            sections: def.sections,
            tradesSectionsVersion: TRADES_SECTIONS_SCHEMA_VERSION,
            metaTitle: def.metaTitle,
            metaDescription: def.metaDescription,
          },
        },
      );
    }
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
  cmsReadNoStore();
  await ensureBaseCmsRecords();
  const doc = await ContactDataModel.findOne().lean();
  return doc ?? DEFAULT_CONTACT;
}

export async function getPublishedServices() {
  cmsReadNoStore();
  await ensureBaseCmsRecords();
  return await ServiceModel.find({ status: 'published' })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getFooterMenuServices() {
  cmsReadNoStore();
  await ensureBaseCmsRecords();
  return await ServiceModel.find({
    status: 'published',
    displayInFooterMenu: true,
  })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getPublishedServiceBySlug(slug: string) {
  cmsReadNoStore();
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
  cmsReadNoStore();
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
