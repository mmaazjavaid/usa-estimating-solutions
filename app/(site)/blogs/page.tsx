import Link from 'next/link';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollToTop } from '@/components/layout/scroll-to-top';
import { getPublishedBlogs } from '@/lib/blogs';
import { getSeoMetadataByPath } from '@/lib/cms';

export async function generateMetadata(): Promise<Metadata> {
  return (await getSeoMetadataByPath('/blogs')) ?? {};
}

export default async function BlogsPage() {
  const blogs = await getPublishedBlogs();

  return (
    <>
      <Header />
      <main className="bg-black pt-24 text-white">
        <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          <h1 className="text-center text-4xl font-bold md:text-5xl">Blogs</h1>
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-white/70 md:text-base">
            Insights, guides, and practical estimating knowledge for construction
            professionals.
          </p>

          <div className="mt-14 space-y-10">
            {blogs.slice(0, 6).map((blog, index) => (
              <article
                key={blog._id.toString()}
                className="grid items-center gap-8 rounded-2xl border border-white/20 bg-white/[0.03] p-5 md:grid-cols-2 md:p-8"
              >
                <div className={index % 2 === 0 ? 'order-1' : 'order-1 md:order-2'}>
                  <Link href={`/blogs/${blog.slug}`} className="block overflow-hidden rounded-xl">
                    {blog.featuredImage ? (
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="h-[260px] w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-[260px] w-full bg-white/10" />
                    )}
                  </Link>
                </div>

                <div className={index % 2 === 0 ? 'order-2' : 'order-2 md:order-1'}>
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    {blog.category} - {new Date(blog.publishedDate).toLocaleDateString()}
                  </p>
                  <h2 className="mt-3 text-2xl font-bold leading-tight md:text-3xl">
                    <Link href={`/blogs/${blog.slug}`} className="hover:underline">
                      {blog.title}
                    </Link>
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">
                    {blog.shortDescription}
                  </p>
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="mt-6 inline-flex text-sm font-medium text-white underline"
                  >
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
