import Link from 'next/link';

const cards = [
  {
    title: 'Manage Contact Data',
    href: '/admin/contact',
    description: 'Update emails and phone numbers used on the website.',
  },
  {
    title: 'Pages',
    href: '/admin/pages',
    description: 'Edit SEO metadata, index status, and publication state.',
  },
  {
    title: 'Services',
    href: '/admin/services',
    description: 'Create and manage services displayed on your site.',
  },
  {
    title: 'Sub-Services',
    href: '/admin/sub-services',
    description: 'Create and manage nested service offerings.',
  },
  {
    title: 'Blogs',
    href: '/admin/blogs',
    description: 'Create, optimize, and publish blog posts dynamically.',
  },
];

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Welcome</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Manage content and SEO data that powers your frontend.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 hover:bg-zinc-800"
          >
            <h2 className="text-lg font-medium">{card.title}</h2>
            <p className="mt-2 text-sm text-zinc-400">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
