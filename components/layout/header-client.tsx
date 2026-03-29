'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { USALogo } from '@/components/common/usa-logo';
import { SERVICES_DROPDOWN_COLUMNS as servicesDropdownColumns } from '@/lib/service-nav-config';
import {
  filterServicesColumnsByUnpublished,
  filterTradesColumnsByUnpublished,
  hrefSetFromServicesColumns,
  mergeCmsTradesLinksIntoColumns,
  normalizeNavHref,
} from '@/lib/service-nav-helpers';
import { cn } from '@/lib/utils';

const navLinks = [
  {
    label: 'Services',
    href: '/services',
    hasDropdown: true,
  },
  {
    label: 'Trades',
    href: '/trades',
    hasDropdown: true,
  },
  {
    label: 'Our Works',
    href: '/our-works',
  },
  {
    label: 'Prices',
    href: '/prices',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Blogs',
    href: '/blogs',
  },
];

import type { DropdownGroup } from '@/lib/service-nav-config';

const tradesDropdownColumns: DropdownGroup[][] = [
  [
    {
      title: { label: 'Interior Estimating', href: '/trades/interior' },
      items: [],
    },
    {
      title: { label: 'Exterior Estimating', href: '/trades/exterior' },
      items: [],
    },
  ],
  [
    { title: { label: 'MEP Estimating', href: '/trades/mep' }, items: [] },
    {
      title: { label: 'Structural Estimating', href: '/trades/structural' },
      items: [],
    },
  ],
];

export type CmsNavLink = { label: string; href: string };

type HeaderClientProps = {
  cmsServicesLinks?: CmsNavLink[];
  cmsTradesLinks?: CmsNavLink[];
  /** Dynamic CMS page paths (e.g. `/cost-estimation`) that are unpublished — hidden from mega menus. */
  unpublishedServicePaths?: string[];
  unpublishedTradesPaths?: string[];
};

type OpenDropdown = 'services' | 'trades' | null;

export function HeaderClient({
  cmsServicesLinks = [],
  cmsTradesLinks = [],
  unpublishedServicePaths = [],
  unpublishedTradesPaths = [],
}: HeaderClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<OpenDropdown>(null);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);

  const servicesOpen = openDropdown === 'services';
  const tradesOpen = openDropdown === 'trades';

  const desktopNavLinkClassName =
    'text-[14px] font-medium tracking-[0.01em] transition-colors text-white/70 hover:text-white aria-[current=page]:text-[#FF771E]';
  const dropdownLinkClassName =
    'group flex items-center gap-1 text-[14px] font-medium tracking-[0.01em] transition-colors text-white/70 hover:text-[#FF771E] aria-[current=page]:text-[#FF771E]';
  const mobileNavLinkClassName =
    'text-base font-medium transition-colors text-muted-foreground hover:text-foreground aria-[current=page]:text-[#FF771E]';

  const isActiveHref = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const servicesDropdownColumnsWithCms = useMemo(() => {
    const unpublished = new Set(unpublishedServicePaths.map(normalizeNavHref));
    const base = filterServicesColumnsByUnpublished(servicesDropdownColumns, unpublished);
    const staticHrefs = hrefSetFromServicesColumns(base);
    const seen = new Set<string>();
    const extraColumns: DropdownGroup[][] = [];

    for (const link of cmsServicesLinks) {
      const h = normalizeNavHref(link.href);
      if (!h || staticHrefs.has(h) || seen.has(h)) {
        continue;
      }
      seen.add(h);
      extraColumns.push([
        { title: { label: link.label, href: link.href }, items: [] },
      ]);
    }

    return [...base, ...extraColumns];
  }, [cmsServicesLinks, unpublishedServicePaths]);

  const tradesDropdownColumnsWithCms = useMemo(() => {
    const unpublished = new Set(unpublishedTradesPaths.map(normalizeNavHref));
    const base = filterTradesColumnsByUnpublished(tradesDropdownColumns, unpublished);
    return mergeCmsTradesLinksIntoColumns(base, cmsTradesLinks);
  }, [cmsTradesLinks, unpublishedTradesPaths]);

  const servicesDropdownHrefs = useMemo(() => {
    return servicesDropdownColumnsWithCms
      .flat()
      .flatMap((group) => [
        group.title.href,
        ...group.items.map((item) => item.href),
      ]);
  }, [servicesDropdownColumnsWithCms]);

  const servicesMobileLinks = useMemo(
    () =>
      servicesDropdownColumnsWithCms
        .flat()
        .flatMap((group) => [group.title, ...group.items]),
    [servicesDropdownColumnsWithCms],
  );

  const tradesMobileLinks = useMemo(
    () => tradesDropdownColumnsWithCms.flat().map((group) => group.title),
    [tradesDropdownColumnsWithCms],
  );

  const tradesDropdownHrefs = useMemo(
    () => [
      ...tradesDropdownColumnsWithCms.flat().map((g) => g.title.href),
    ],
    [tradesDropdownColumnsWithCms],
  );

  const isServicesActive =
    pathname === '/services' ||
    servicesDropdownHrefs.some((href) => isActiveHref(href));

  const isTradesActive =
    isActiveHref('/trades') ||
    tradesDropdownHrefs.some((href) => isActiveHref(href));

  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    setOpenMobileSubmenu(null);
  }, [pathname]);

  useEffect(() => {
    if (!servicesOpen && !tradesOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current) return;
      if (
        event.target instanceof Node &&
        headerRef.current.contains(event.target)
      )
        return;
      setOpenDropdown(null);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpenDropdown(null);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [servicesOpen, tradesOpen]);

  /** Wrap like the static columns; extra CMS-only pages append as their own column. */
  const servicesGridClass =
    'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

  /** Trades mega menu: always two columns (same as static layout); CMS pages fill in round-robin. */
  const tradesGridClass = 'grid-cols-2';

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 min-h-20 w-full min-w-0 overflow-x-hidden bg-white/5 backdrop-blur-[30px]"
    >
      <div className="mx-auto flex h-20 w-full min-w-0 max-w-7xl items-center justify-between gap-2 px-3 sm:px-4 md:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <div className="flex min-w-0 items-center">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <span className="block shrink-0 [&_svg]:block [&_svg]:h-8 [&_svg]:w-auto sm:[&_svg]:h-[53px] sm:[&_svg]:w-[136px]">
              <USALogo width={136} height={53} />
            </span>
          </Link>
        </div>

        <nav className="hidden items-center justify-center gap-7 lg:flex">
          {navLinks.map((link) =>
            link.label === 'Services' ? (
              <div key={link.label} className="flex items-center gap-0.5">
                <Link
                  href={link.href}
                  aria-current={isServicesActive ? 'page' : undefined}
                  className={desktopNavLinkClassName}
                >
                  {link.label}
                </Link>
                <button
                  type="button"
                  aria-label="Toggle services dropdown"
                  aria-expanded={servicesOpen}
                  onClick={() => {
                    setOpenDropdown((prev) =>
                      prev === 'services' ? null : 'services',
                    );
                  }}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 transition-transform',
                      servicesOpen && 'rotate-180',
                    )}
                  />
                </button>
              </div>
            ) : link.label === 'Trades' ? (
              <div key={link.label} className="flex items-center gap-0.5">
                <Link
                  href={link.href}
                  aria-current={isTradesActive ? 'page' : undefined}
                  className={desktopNavLinkClassName}
                >
                  {link.label}
                </Link>
                <button
                  type="button"
                  aria-label="Toggle trades dropdown"
                  aria-expanded={tradesOpen}
                  onClick={() => {
                    setOpenDropdown((prev) =>
                      prev === 'trades' ? null : 'trades',
                    );
                  }}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 transition-transform',
                      tradesOpen && 'rotate-180',
                    )}
                  />
                </button>
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                aria-current={isActiveHref(link.href) ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-0.5',
                  desktopNavLinkClassName,
                )}
              >
                {link.label}
                {link.hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex min-w-0 shrink-0 items-center justify-end gap-3 sm:gap-4 lg:ml-0">
          <Link
            href="/contact"
            className="hidden h-9 items-center rounded-full bg-white/10 px-5 text-[14px] font-medium tracking-[0.01em] text-white transition-colors hover:bg-white hover:text-black lg:inline-flex"
          >
            Contact us
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {servicesOpen && (
        <div className="hidden lg:block">
          <div
            className={cn(
              'mx-auto grid w-full min-w-0 max-w-7xl gap-x-8 px-3 py-10 sm:gap-x-12 sm:px-4 md:gap-x-16 md:px-6',
              servicesGridClass,
            )}
          >
            {servicesDropdownColumnsWithCms.map((column, columnIndex) => (
              <div
                key={`services-column-${columnIndex}`}
                className="flex flex-col gap-3"
              >
                {column
                  .flatMap((group) => [group.title, ...group.items])
                  .map((item) => (
                    <Link
                      key={`${columnIndex}-${item.href}-${item.label}`}
                      href={item.href}
                      aria-current={
                        isActiveHref(item.href) ? 'page' : undefined
                      }
                      className={dropdownLinkClassName}
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 group-aria-[current=page]:opacity-100" />
                    </Link>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {tradesOpen && (
        <div className="hidden lg:block">
          <div
            className={cn(
              'mx-auto grid w-full min-w-0 max-w-7xl gap-x-8 px-3 py-10 sm:gap-x-12 sm:px-4 md:gap-x-16 md:px-6',
              tradesGridClass,
            )}
          >
            {tradesDropdownColumnsWithCms.map((column, columnIndex) => (
              <div
                key={`trades-column-${columnIndex}`}
                className="flex flex-col gap-3"
              >
                {column.map((group) => (
                  <Link
                    key={group.title.href}
                    href={group.title.href}
                    aria-current={
                      isActiveHref(group.title.href) ? 'page' : undefined
                    }
                    className={dropdownLinkClassName}
                  >
                    <span>{group.title.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 group-aria-[current=page]:opacity-100" />
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="w-full max-w-full min-w-0 px-3 py-6 sm:px-4 md:px-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive =
                link.label === 'Services'
                  ? isServicesActive
                  : link.label === 'Trades'
                    ? isTradesActive
                    : isActiveHref(link.href);

              if (link.label === 'Services' || link.label === 'Trades') {
                const submenuKey =
                  link.label === 'Services' ? 'services' : 'trades';
                const submenuLinks =
                  submenuKey === 'services'
                    ? servicesMobileLinks
                    : tradesMobileLinks;
                const isSubmenuOpen = openMobileSubmenu === submenuKey;

                return (
                  <div key={link.label} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-3">
                      <Link
                        href={link.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'flex items-center gap-0.5',
                          mobileNavLinkClassName,
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                      <button
                        type="button"
                        aria-label={`Toggle ${link.label} submenu`}
                        aria-expanded={isSubmenuOpen}
                        onClick={() =>
                          setOpenMobileSubmenu((prev) =>
                            prev === submenuKey ? null : submenuKey,
                          )
                        }
                        className={cn(
                          'rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground',
                          isSubmenuOpen && 'text-[#FF771E]',
                        )}
                      >
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform',
                            isSubmenuOpen && 'rotate-180',
                          )}
                        />
                      </button>
                    </div>

                    {isSubmenuOpen && (
                      <div className="ml-3 flex flex-col gap-2 border-l border-white/10 pl-3">
                        {submenuLinks.map((submenuLink) => (
                          <Link
                            key={`${submenuLink.href}-${submenuLink.label}`}
                            href={submenuLink.href}
                            aria-current={
                              isActiveHref(submenuLink.href) ? 'page' : undefined
                            }
                            className={cn(
                              'text-sm text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-[#FF771E]',
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {submenuLink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-0.5',
                    mobileNavLinkClassName,
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="mt-2 inline-flex w-fit rounded-full bg-white/10 px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
