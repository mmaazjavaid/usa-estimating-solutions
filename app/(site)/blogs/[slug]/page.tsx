import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollToTop } from '@/components/layout/scroll-to-top';
import { getBlogMetadata, getPublishedBlogBySlug } from '@/lib/blogs';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getPublishedBlogBySlug(slug);
  if (!blog) {
    return {};
  }

  return getBlogMetadata(blog);
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getPublishedBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="bg-black pt-24 text-white">
        <article className="mx-auto max-w-5xl px-6 py-14 md:py-20">
          <div className="mb-8 text-sm text-white/60">
            <Link href="/blogs" className="hover:underline">
              Blogs
            </Link>{' '}
            {'>'} <span>{blog.title}</span>
          </div>

          <p className="text-xs uppercase tracking-wide text-white/60">
            {blog.category} - {new Date(blog.publishedDate).toLocaleDateString()}
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
            {blog.title}
          </h1>

          {blog.featuredImage ? (
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/20">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="h-auto w-full object-cover"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : null}

          <div
            className="prose prose-invert mt-10 max-w-none prose-headings:text-white prose-a:text-[#f8b87f] prose-p:text-white/85"
            dangerouslySetInnerHTML={{ __html: blog.body || '' }}
          />
        </article>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
