'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Thumbnails that mirror real homepage/marketing section structure (not generic gradients).
 */
export function CmsSectionTemplatePreview({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  const frame = (children: ReactNode, shell: string) => (
    <div
      className={cn(
        'flex h-[5.75rem] w-full items-stretch overflow-hidden rounded-md border border-zinc-600/80',
        shell,
        className,
      )}
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-px p-1">{children}</div>
    </div>
  );

  const bar = (w: string, h = 'h-0.5', bg = 'bg-zinc-500') => (
    <div className={cn('rounded-sm', w, h, bg)} aria-hidden />
  );

  switch (type) {
    case 'site_hero':
      return frame(
        <div className="flex flex-1 gap-1 bg-zinc-950">
          <div className="flex flex-1 flex-col justify-center gap-0.5 pl-0.5">
            {bar('w-3/4', 'h-1', 'bg-zinc-300')}
            {bar('w-full')}
            <div className="mt-0.5 flex gap-0.5">
              <div className="h-1.5 w-5 rounded-full border border-zinc-400" />
              <div className="h-1.5 w-5 rounded-full border border-zinc-400" />
            </div>
          </div>
          <div className="w-[42%] rounded-sm bg-gradient-to-br from-zinc-700 to-zinc-800" />
        </div>,
        'bg-zinc-950',
      );

    case 'site_partners':
      return frame(
        <div className="flex flex-1 flex-col justify-center gap-1 bg-background">
          {bar('w-4/5 mx-auto', 'h-1', 'bg-zinc-400')}
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-3 w-6 rounded-sm bg-zinc-300/80" />
            ))}
          </div>
        </div>,
        'bg-background',
      );

    case 'site_services_carousel':
      return frame(
        <div className="flex flex-1 flex-col gap-1 bg-black">
          {bar('w-1/2 mx-auto', 'h-1', 'bg-white/70')}
          {bar('w-3/4 mx-auto', 'h-0.5', 'bg-white/40')}
          <div className="mt-auto flex flex-1 gap-0.5 pt-0.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 rounded-md border border-white/25 bg-white/[0.06]"
              />
            ))}
          </div>
        </div>,
        'bg-black',
      );

    case 'site_why_choose_us':
      return frame(
        <div className="flex flex-1 flex-col justify-center gap-1 bg-background">
          {bar('w-3/5 mx-auto', 'h-1', 'bg-zinc-400')}
          <div className="grid grid-cols-4 gap-0.5 px-0.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-px">
                {bar('w-full', 'h-0.5')}
                {bar('w-2/3', 'h-0.5', 'bg-zinc-600')}
              </div>
            ))}
          </div>
        </div>,
        'bg-background',
      );

    case 'site_trades_grid':
      return frame(
        <div className="grid flex-1 grid-cols-2 gap-0.5 bg-background p-0.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-sm border border-white/15 bg-white/[0.05]"
            />
          ))}
        </div>,
        'bg-background',
      );

    case 'site_how_it_works':
      return frame(
        <div className="flex flex-1 flex-col justify-center gap-1 bg-background px-1">
          {bar('w-full', 'h-1', 'bg-zinc-400')}
          <div className="flex items-center justify-center gap-0.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-0.5">
                <div className="h-1 w-6 rounded-sm bg-zinc-500/60" />
                {i < 3 ? <div className="h-px w-2 bg-zinc-500/40" /> : null}
              </div>
            ))}
          </div>
        </div>,
        'bg-background',
      );

    case 'site_our_works':
      return frame(
        <div className="flex flex-1 flex-col gap-1 bg-background">
          {bar('w-2/5 mx-auto', 'h-1')}
          <div className="grid flex-1 grid-cols-2 gap-0.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-sm bg-zinc-800" />
            ))}
          </div>
        </div>,
        'bg-background',
      );

    case 'site_service_locations':
      return frame(
        <div className="flex flex-1 flex-col items-center justify-center gap-0.5 bg-background">
          {bar('w-1/2', 'h-1', 'bg-white')}
          {bar('w-3/5', 'h-0.5', 'bg-white/50')}
          <div className="mt-1 h-8 w-[85%] rounded-sm bg-zinc-700/80" />
        </div>,
        'bg-background',
      );

    case 'site_cta':
      return frame(
        <div className="flex flex-1 flex-col items-center justify-center gap-0.5 bg-[#1E1E1E] px-1">
          {bar('w-4/5', 'h-1', 'bg-zinc-200')}
          {bar('w-3/5', 'h-0.5', 'bg-zinc-500')}
          <div className="mt-0.5 h-2 w-10 rounded-full border border-white/40" />
        </div>,
        'bg-[#1E1E1E]',
      );

    case 'site_prose':
      return frame(
        <div className="flex flex-1 flex-col justify-center gap-0.5 bg-background px-2">
          {bar('w-1/2 mx-auto', 'h-1')}
          {bar('w-full')}
          {bar('w-full')}
          {bar('w-4/5')}
        </div>,
        'bg-background',
      );

    case 'site_split_cell_grid':
      return frame(
        <div className="flex flex-1 flex-col gap-0.5 bg-black px-1">
          {bar('w-3/5 mx-auto', 'h-0.5', 'bg-zinc-400')}
          <div className="grid flex-1 grid-cols-2 gap-px rounded-sm border border-zinc-600">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-zinc-800/90" />
            ))}
          </div>
        </div>,
        'bg-black',
      );

    case 'site_three_column_text':
      return frame(
        <div className="flex flex-1 flex-col gap-1 bg-black px-1">
          {bar('w-2/5', 'h-0.5', 'bg-zinc-400')}
          <div className="flex flex-1 gap-0.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 rounded-sm bg-zinc-800/80" />
            ))}
          </div>
        </div>,
        'bg-black',
      );

    case 'site_zigzag_features':
      return frame(
        <div className="flex flex-1 flex-col justify-center gap-1 bg-black px-1">
          {bar('w-1/2 mx-auto', 'h-0.5')}
          <div className="flex gap-1">
            <div className="h-8 w-6 rounded-sm bg-zinc-700" />
            <div className="flex flex-1 flex-col justify-center gap-px">
              {bar('w-full', 'h-0.5')}
              {bar('w-4/5', 'h-0.5', 'bg-zinc-600')}
            </div>
          </div>
        </div>,
        'bg-black',
      );

    case 'site_testimonials':
      return frame(
        <div className="flex flex-1 flex-col gap-1 bg-black px-1">
          {bar('w-3/5 mx-auto', 'h-0.5', 'bg-zinc-300')}
          <div className="flex flex-1 gap-1">
            <div className="flex-[2] rounded-sm bg-zinc-800" />
            <div className="flex-1 rounded-sm bg-zinc-800/60" />
          </div>
          <div className="mx-auto flex gap-0.5">
            <div className="h-1 w-1 rounded-full bg-white" />
            <div className="h-1 w-1 rounded-full bg-zinc-600" />
          </div>
        </div>,
        'bg-black',
      );

    case 'site_faq_grid':
      return frame(
        <div className="flex flex-1 flex-col gap-1 rounded-md bg-zinc-900 p-1">
          {bar('w-2/5', 'h-1', 'bg-zinc-400')}
          <div className="grid flex-1 grid-cols-2 gap-0.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-px rounded-sm bg-zinc-950/80 p-0.5">
                {bar('w-full', 'h-0.5')}
                {bar('w-full', 'h-0.5', 'bg-zinc-700')}
              </div>
            ))}
          </div>
        </div>,
        'bg-zinc-950',
      );

    case 'site_service_marketing_hero':
      return frame(
        <div className="flex flex-1 flex-col gap-1 bg-black px-1">
          {bar('w-1/4', 'h-0.5', 'bg-zinc-500')}
          {bar('w-3/5', 'h-1', 'bg-zinc-300')}
          <div className="mt-auto grid flex-1 grid-cols-2 gap-0.5">
            <div className="rounded-sm bg-zinc-800/90" />
            <div className="rounded-sm bg-zinc-800/60" />
          </div>
        </div>,
        'bg-black',
      );

    case 'site_trade_hero':
      return frame(
        <div className="flex flex-1 gap-1 bg-black px-1">
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-px">
            {bar('w-1/4', 'h-0.5', 'bg-zinc-500')}
            {bar('w-4/5', 'h-1', 'bg-zinc-200')}
            {bar('w-full')}
          </div>
          <div className="w-[38%] rounded-sm bg-gradient-to-br from-violet-600/50 to-zinc-800" />
        </div>,
        'bg-black',
      );

    case 'site_trade_lower':
      return frame(
        <div className="flex flex-1 flex-col gap-1 bg-black px-1">
          {bar('w-1/2', 'h-0.5', 'bg-zinc-400')}
          <div className="grid grid-cols-3 gap-px">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-3 rounded-sm bg-zinc-800/90" />
            ))}
          </div>
          <div className="mt-0.5 flex flex-1 gap-0.5">
            <div className="w-5 rounded-sm bg-zinc-700" />
            <div className="flex flex-1 flex-col justify-center gap-px">
              {bar('w-full', 'h-0.5')}
              {bar('w-4/5', 'h-0.5', 'bg-zinc-600')}
            </div>
          </div>
        </div>,
        'bg-black',
      );

    case 'site_line_pair_grid':
      return frame(
        <div className="flex flex-1 flex-col gap-1 bg-black px-1">
          {bar('w-1/2 mx-auto', 'h-0.5', 'bg-zinc-400')}
          {bar('w-3/5 mx-auto', 'h-0.5', 'bg-zinc-600')}
          <div className="flex flex-wrap justify-center gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-px rounded-sm border border-zinc-600/60 px-1 py-0.5"
              >
                {bar('w-6', 'h-0.5')}
                {bar('w-4', 'h-0.5', 'bg-zinc-600')}
              </div>
            ))}
          </div>
        </div>,
        'bg-black',
      );

    case 'site_tag_cloud_row':
      return frame(
        <div className="flex flex-1 flex-col gap-1 bg-black px-1">
          {bar('w-2/5 mx-auto', 'h-1', 'bg-zinc-300')}
          <div className="flex flex-wrap justify-center gap-0.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-1.5 rounded-sm bg-zinc-600/90 px-1" />
            ))}
          </div>
        </div>,
        'bg-black',
      );

    case 'site_stacked_tag_rows':
      return frame(
        <div className="flex flex-1 flex-col gap-1 bg-black px-1">
          {bar('w-1/2 mx-auto', 'h-0.5', 'bg-zinc-400')}
          {[1, 2].map((row) => (
            <div key={row} className="flex flex-wrap justify-center gap-0.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={`${row}-${i}`} className="h-1 w-4 rounded-sm bg-zinc-700/90" />
              ))}
            </div>
          ))}
        </div>,
        'bg-black',
      );

    case 'site_offerings_grid':
      return frame(
        <div className="flex flex-1 flex-col gap-1 bg-black px-1">
          {bar('w-3/5 mx-auto', 'h-0.5', 'bg-zinc-300')}
          <div className="grid grid-cols-4 gap-px">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-2 rounded-sm bg-zinc-800/90" />
            ))}
          </div>
        </div>,
        'bg-black',
      );

    case 'site_horizontal_pills':
      return frame(
        <div className="flex flex-1 flex-col justify-center gap-1 bg-black px-1">
          {bar('w-2/5 mx-auto', 'h-0.5', 'bg-zinc-500')}
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                {i > 1 ? <div className="mx-0.5 h-px w-1.5 bg-zinc-600/60" aria-hidden /> : null}
                <div className="h-1 w-5 rounded-sm bg-zinc-600" />
              </div>
            ))}
          </div>
        </div>,
        'bg-black',
      );

    case 'site_title_description_matrix':
      return frame(
        <div className="flex flex-1 flex-col gap-1 bg-black px-1">
          {bar('w-1/2 mx-auto', 'h-0.5')}
          {bar('w-3/5 mx-auto', 'h-0.5', 'bg-zinc-600')}
          <div className="grid flex-1 grid-cols-2 gap-px border border-zinc-700">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-px bg-zinc-900/90 p-0.5">
                {bar('w-full', 'h-0.5', 'bg-zinc-400')}
                {bar('w-4/5', 'h-0.5', 'bg-zinc-600')}
              </div>
            ))}
          </div>
        </div>,
        'bg-black',
      );

    case 'site_multiline_item_grid':
      return frame(
        <div className="flex flex-1 flex-col gap-1 bg-black px-1">
          {bar('w-2/5 mx-auto', 'h-0.5', 'bg-zinc-400')}
          <div className="grid grid-cols-3 gap-0.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col gap-px rounded-sm bg-zinc-800/80 p-0.5">
                {bar('w-full', 'h-0.5')}
                {bar('w-2/3', 'h-0.5', 'bg-zinc-600')}
              </div>
            ))}
          </div>
        </div>,
        'bg-black',
      );

    case 'site_dark_prose':
      return frame(
        <div className="flex flex-1 flex-col justify-center gap-0.5 bg-black px-2">
          {bar('w-1/2 mx-auto', 'h-0.5', 'bg-zinc-300')}
          {bar('w-full', 'h-0.5', 'bg-zinc-600')}
          {bar('w-full', 'h-0.5', 'bg-zinc-600')}
          {bar('w-3/4', 'h-0.5', 'bg-zinc-600')}
        </div>,
        'bg-black',
      );

    case 'site_service_trades_footer':
      return frame(
        <div className="flex flex-1 flex-col justify-center gap-0.5 bg-zinc-950 px-1">
          <div className="flex items-center justify-center gap-0.5 border-y border-zinc-700 py-0.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-1 w-3 rounded-sm bg-zinc-500/80" />
            ))}
          </div>
        </div>,
        'bg-zinc-950',
      );

    default:
      return frame(
        <div className="flex flex-1 items-center justify-center bg-zinc-900">
          {bar('w-1/2', 'h-2')}
        </div>,
        'bg-zinc-950',
      );
  }
}
