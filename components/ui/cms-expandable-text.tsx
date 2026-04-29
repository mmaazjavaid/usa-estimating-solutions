'use client';

import { useId, useState } from 'react';

import { CMS_CLAMP_BASE_CLASS, cmsLineClampClass } from '@/components/ui/cms-clamp';
import { cn } from '@/lib/utils';

type CmsExpandableTextProps = {
  children: string;
  /** Collapsed line count when `expandable` is false, or when `expandable` is true and not expanded. */
  lines?: number;
  /** When true, shows Read more / Read less; full copy stays in the DOM for SEO. */
  expandable?: boolean;
  className?: string;
  buttonClassName?: string;
  readMoreLabel?: string;
  readLessLabel?: string;
};

/**
 * Optional expansion control for long CMS paragraphs. Default: same behavior as a static line clamp.
 */
export function CmsExpandableText({
  children,
  lines = 3,
  expandable = false,
  className,
  buttonClassName,
  readMoreLabel = 'Read more',
  readLessLabel = 'Read less',
}: CmsExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const textId = useId();

  if (!expandable) {
    return (
      <span className={cn(CMS_CLAMP_BASE_CLASS, cmsLineClampClass(lines), className)}>
        {children}
      </span>
    );
  }

  return (
    <span className={cn('block min-w-0', className)}>
      <span
        id={textId}
        className={cn(
          CMS_CLAMP_BASE_CLASS,
          'block',
          !expanded ? cmsLineClampClass(lines) : undefined,
        )}
      >
        {children}
      </span>
      <button
        type="button"
        className={cn(
          'mt-2 text-xs font-medium text-current underline decoration-current/50 underline-offset-2 hover:decoration-current',
          buttonClassName,
        )}
        aria-expanded={expanded}
        aria-controls={textId}
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? readLessLabel : readMoreLabel}
      </button>
    </span>
  );
}
