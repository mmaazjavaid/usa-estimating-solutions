import { revalidatePath } from 'next/cache';
import { normalizePath } from '@/lib/cms-pages';

/**
 * Purge Next.js fetch/route cache after CMS page mutations so nav and the page URL
 * update immediately (pairs with `dynamic = 'force-dynamic'` on the root layout).
 */
export function revalidateAfterCmsPageChange(path: string | undefined): void {
  const p = path ? normalizePath(path) : '/';
  try {
    revalidatePath(p);
    revalidatePath('/', 'layout');
    revalidatePath('/services');
    revalidatePath('/trades');
  } catch (e) {
    console.warn('[cms-revalidate]', e);
  }
}

/** After blog create/update/delete so /blogs and /blogs/[slug] pick up changes immediately. */
export function revalidateAfterBlogChange(slug: string | undefined): void {
  try {
    revalidatePath('/blogs');
    if (slug) {
      revalidatePath(`/blogs/${slug}`);
    }
    revalidatePath('/', 'layout');
  } catch (e) {
    console.warn('[cms-revalidate]', e);
  }
}
