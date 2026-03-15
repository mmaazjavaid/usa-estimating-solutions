import Link from 'next/link';
import { LogoutButton } from '@/components/admin/logout-button';

const adminNav = [
  { href: '/admin/contact', label: 'Manage Contact Data' },
  { href: '/admin/pages', label: 'Pages' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/sub-services', label: 'Sub-Services' },
  { href: '/admin/blogs', label: 'Blogs' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex max-w-7xl">
        <aside className="w-72 border-r border-zinc-800 p-6">
          <Link href="/admin" className="mb-8 block text-lg font-semibold">
            Admin Dashboard
          </Link>

          <nav className="space-y-2">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8">
            <LogoutButton />
          </div>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
