import { unstable_cache } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import { ensureBaseCmsRecords } from '@/lib/cms';
import { DEFAULT_CONTACT } from '@/lib/cms-defaults';
import { normalizePath, type CmsNavLink } from '@/lib/cms-pages';
import { ContactDataModel } from '@/models/ContactData';
import { PageModel } from '@/models/Page';
import { ServiceModel } from '@/models/Service';

/** Bust via `revalidateTag` when CMS pages, contact, or footer services change. */
export const CMS_SHELL_CACHE_TAG = 'cms-shell';

export type HeaderNavBundle = {
  cmsServicesLinks: CmsNavLink[];
  cmsTradesLinks: CmsNavLink[];
  unpublishedServicePaths: string[];
  unpublishedTradesPaths: string[];
};

export type FooterShellContact = {
  phones: string[];
  emails: string[];
  address: string;
};

export type FooterShell = {
  contactData: FooterShellContact;
  footerServices: Array<{
    _id: { toString(): string };
    name: string;
    slug?: string;
    path?: string;
  }>;
};

function normalizeFooterContact(raw: unknown): FooterShellContact {
  const o = raw as { phones?: unknown; emails?: unknown; address?: unknown };
  const phones = Array.isArray(o.phones)
    ? o.phones.map((p) => String(p)).filter(Boolean)
    : [...DEFAULT_CONTACT.phones];
  const emails = Array.isArray(o.emails)
    ? o.emails.map((e) => String(e)).filter(Boolean)
    : [...DEFAULT_CONTACT.emails];
  const address =
    typeof o.address === 'string' && o.address.trim()
      ? o.address.trim()
      : DEFAULT_CONTACT.address;
  return { phones, emails, address };
}

async function loadHeaderNavBundle(): Promise<HeaderNavBundle> {
  await ensureBaseCmsRecords();
  await connectToDatabase();

  const [services, trades, unpublishedServices, unpublishedTrades] = await Promise.all([
    PageModel.find({
      status: 'published',
      renderMode: 'dynamic',
      placement: 'services',
    })
      .sort({ name: 1 })
      .select('name path')
      .lean(),
    PageModel.find({
      status: 'published',
      renderMode: 'dynamic',
      placement: 'trades',
      tradeLocation: { $ne: 'under_trade' },
    })
      .sort({ name: 1 })
      .select('name path')
      .lean(),
    PageModel.find({
      renderMode: 'dynamic',
      placement: 'services',
      status: 'unpublished',
    })
      .select('path')
      .lean(),
    PageModel.find({
      renderMode: 'dynamic',
      placement: 'trades',
      status: 'unpublished',
    })
      .select('path')
      .lean(),
  ]);

  return {
    cmsServicesLinks: services.map((p) => ({
      label: String((p as { name?: string }).name ?? ''),
      href: normalizePath(String((p as { path?: string }).path ?? '')),
    })),
    cmsTradesLinks: trades.map((p) => ({
      label: String((p as { name?: string }).name ?? ''),
      href: normalizePath(String((p as { path?: string }).path ?? '')),
    })),
    unpublishedServicePaths: unpublishedServices.map((r) =>
      normalizePath(String((r as { path?: string }).path ?? '')),
    ),
    unpublishedTradesPaths: unpublishedTrades.map((r) =>
      normalizePath(String((r as { path?: string }).path ?? '')),
    ),
  };
}

const getHeaderNavBundleCached = unstable_cache(loadHeaderNavBundle, ['cms-header-nav-bundle-v1'], {
  tags: [CMS_SHELL_CACHE_TAG],
  revalidate: 3600,
});

export async function getCachedHeaderNavBundle(): Promise<HeaderNavBundle> {
  return getHeaderNavBundleCached();
}

async function loadFooterShell(): Promise<FooterShell> {
  await ensureBaseCmsRecords();
  await connectToDatabase();

  const [contactDoc, footerServices] = await Promise.all([
    ContactDataModel.findOne().lean(),
    ServiceModel.find({
      status: 'published',
      displayInFooterMenu: true,
    })
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  return {
    contactData: normalizeFooterContact(contactDoc ?? DEFAULT_CONTACT),
    footerServices: footerServices as FooterShell['footerServices'],
  };
}

const getFooterShellCached = unstable_cache(loadFooterShell, ['cms-footer-shell-v1'], {
  tags: [CMS_SHELL_CACHE_TAG],
  revalidate: 3600,
});

export async function getCachedFooterShell(): Promise<FooterShell> {
  return getFooterShellCached();
}
