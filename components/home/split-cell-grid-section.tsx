import {
  CMS_SECTION_BODY_LINES,
  CMS_SECTION_HEADING_LINES,
  CmsClamp,
  cmsClampClassNames,
} from '@/components/ui/cms-clamp';
import type { CmsTextTypography } from '@/lib/cms-text-typography';
import { cn } from '@/lib/utils';

export type SplitCellGridSectionProps = {
  heading?: string;
  intro?: string;
  /** Minimum 2; capped in parser. */
  rows: number;
  cols: number;
  /** Row-major cell copy; length should be rows × cols (padded if short). */
  cells: string[];
  /** Max width container (marketing pages often use `max-w-5xl`). */
  maxWidthClassName?: string;
  headingTypography?: CmsTextTypography;
  introTypography?: CmsTextTypography;
};

function clampDimension(n: number): number {
  if (!Number.isFinite(n)) return 2;
  return Math.min(8, Math.max(2, Math.round(n)));
}

const MD_COLS: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  7: 'md:grid-cols-7',
  8: 'md:grid-cols-8',
};

export function SplitCellGridSection({
  heading,
  intro,
  rows: rowsIn,
  cols: colsIn,
  cells: cellsIn,
  maxWidthClassName = 'max-w-3xl',
  headingTypography,
  introTypography,
}: SplitCellGridSectionProps) {
  const rows = clampDimension(rowsIn);
  const cols = clampDimension(colsIn);
  const mdCols = MD_COLS[cols] ?? 'md:grid-cols-2';

  const flat: string[] = [];
  const need = rows * cols;
  for (let i = 0; i < need; i += 1) {
    flat.push(String(cellsIn[i] ?? '').trim());
  }

  const grid: string[][] = [];
  for (let r = 0; r < rows; r += 1) {
    grid.push(flat.slice(r * cols, r * cols + cols));
  }

  return (
    <section className="px-6 py-20 text-white md:px-12 lg:px-20">
      {heading ? (
        <h2
          className={cn(
            'mb-8 text-center text-3xl font-bold md:text-4xl',
            headingTypography?.className,
          )}
          style={headingTypography?.style}
        >
          <CmsClamp as="span" lines={CMS_SECTION_HEADING_LINES}>
            {heading}
          </CmsClamp>
        </h2>
      ) : null}
      {intro ? (
        <p
          className={cn(
            'mx-auto mb-16 max-w-4xl text-center text-sm text-[#d9d9d9]/70 md:text-base',
            introTypography?.className,
          )}
          style={introTypography?.style}
        >
          <CmsClamp as="span" lines={CMS_SECTION_BODY_LINES}>
            {intro}
          </CmsClamp>
        </p>
      ) : null}

      <div className={cn('mx-auto', maxWidthClassName)}>
        {grid.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={cn(
              'grid grid-cols-1',
              mdCols,
              rowIndex < rows - 1 ? 'border-b border-[#d9d9d9]/20' : '',
            )}
          >
            {row.map((service, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  'border-[#d9d9d9]/20 px-6 py-16 text-center',
                  colIndex < cols - 1 ? 'md:border-r' : '',
                  colIndex < row.length - 1 ? 'border-b md:border-b-0' : '',
                )}
              >
                <span
                  className={cn(
                    'whitespace-pre-line text-sm text-[#d9d9d9]/90 md:text-base',
                    cmsClampClassNames(5),
                  )}
                >
                  {service}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
