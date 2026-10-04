import { stripUnsafeHtml } from '@/lib/cms-rich-html';
import { cn } from '@/lib/utils';

const WIDTH_CLASS = {
  narrow: 'max-w-3xl',
  default: 'max-w-4xl',
  wide: 'max-w-6xl',
} as const;

export type SiteRichContentWidth = keyof typeof WIDTH_CLASS;

/**
 * Free-form formatted copy (pasted from Docs/Word/web in the admin). Styling for headings,
 * paragraphs, lists and links comes from `.cms-rich-content` in `app/globals.css`.
 */
export function SiteRichContentSection({
  html,
  width = 'default',
}: {
  html: string;
  width?: SiteRichContentWidth;
}) {
  const safe = stripUnsafeHtml(html).trim();
  if (!safe) {
    return null;
  }
  return (
    <section className="px-6 py-12 md:px-12 md:py-16">
      <div
        className={cn(
          'cms-rich-content mx-auto text-sm text-white/80 md:text-base',
          WIDTH_CLASS[width],
        )}
        dangerouslySetInnerHTML={{ __html: safe }}
      />
    </section>
  );
}
