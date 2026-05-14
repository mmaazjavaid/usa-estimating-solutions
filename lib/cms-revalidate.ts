import { revalidatePath, revalidateTag } from 'next/cache';
import { CMS_SHELL_CACHE_TAG } from '@/lib/cms-shell-cache';
import { normalizePath } from '@/lib/cms-pages';

function revalidateShellDataCache(): void {
  try {
    revalidateTag(CMS_SHELL_CACHE_TAG, 'max');
  } catch (e) {
    console.warn('[cms-revalidate] shell tag', e);
  }
}

/**
 * Purge cached header/footer shell (`unstable_cache`) so nav and contact/footer links
 * update right after admin changes.
 */
export function revalidatePublicShellCaches(): void {
  revalidateShellDataCache();
}

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
    revalidatePath('/our-trades');
    revalidateShellDataCache();
  } catch (e) {
    console.warn('[cms-revalidate]', e);
  }
}

/** After blog create/update/delete so /blog and /blog/[slug] pick up changes immediately. */
export function revalidateAfterBlogChange(slug: string | undefined): void {
  try {
    revalidatePath('/blog');
    if (slug) {
      revalidatePath(`/blog/${slug}`);
    }
    revalidatePath('/', 'layout');
  } catch (e) {
    console.warn('[cms-revalidate]', e);
  }
}
