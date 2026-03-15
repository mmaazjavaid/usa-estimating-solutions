'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { USALogo } from '@/components/common/usa-logo';
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

type DropdownLink = { label: string; href: string };
type DropdownGroup = { title: DropdownLink; items: DropdownLink[] };

const servicesDropdownColumns: DropdownGroup[][] = [
  [
    {
      title: { label: 'Cost Estimation', href: '/cost-estimation' },
      items: [
        { label: 'Construction Estimation', href: '/construction-estimation' },
        { label: 'Construction Takeoff', href: '/construction-takeoff' },
      ],
    },
  ],
  [
    {
      title: {
        label: 'Residential Estimating',
        href: '/residential-estimation',
      },
      items: [
        { label: 'Commercial Estimating', href: '/commercial-estimating' },
        { label: 'Industrial Estimating', href: '/industrial-estimating' },
      ],
    },
  ],
  [
    {
      title: {
        label: 'Preliminary Estimating',
        href: '/preliminary-estimating',
      },
      items: [
        { label: 'CPM Scheduling', href: '/cpm-scheduling' },
        { label: '3D Modeling & Visualization', href: '/3d-visualization' },
      ],
    },
  ],
  [
    {
      title: {
        label: 'Interior Design Services',
        href: '/interior-design-services',
      },
      items: [],
    },
  ],
];

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

type OpenDropdown = 'services' | 'trades' | null;

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
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

  const servicesDropdownHrefs = useMemo(() => {
    return servicesDropdownColumns
      .flat()
      .flatMap((group) => [
        group.title.href,
        ...group.items.map((item) => item.href),
      ]);
  }, []);

  const isServicesActive =
    pathname === '/services' ||
    servicesDropdownHrefs.some((href) => isActiveHref(href));
  const isTradesActive = isActiveHref('/trades');

  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
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

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 min-h-20 bg-white/5 backdrop-blur-[30px]"
    >
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <USALogo width={136} height={53} />
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

        <div className="flex items-center justify-end gap-4">
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
          <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-16 px-6 py-10">
            {servicesDropdownColumns.map((column, columnIndex) => (
              <div
                key={`services-column-${columnIndex}`}
                className="flex flex-col gap-3"
              >
                {column
                  .flatMap((group) => [group.title, ...group.items])
                  .map((item) => (
                    <Link
                      key={item.href}
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
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-16 px-6 py-10">
            {tradesDropdownColumns.map((column, columnIndex) => (
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
        <div className="px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive =
                link.label === 'Services'
                  ? isServicesActive
                  : link.label === 'Trades'
                    ? isTradesActive
                    : isActiveHref(link.href);

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
