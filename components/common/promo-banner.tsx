'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

/**
 * First-land promotional banner.
 *
 * - Shows once per browser session, centered, the first time a visitor lands.
 *   Dismissing it (X / Esc / clicking outside / "Get Now") suppresses it for the
 *   rest of the session, including in-site navigation (sessionStorage).
 * - The countdown is "evergreen per-visitor": each visitor gets a fresh offer
 *   window that persists across sessions until it elapses, then resets
 *   (localStorage). It never expires globally.
 */
const DISMISS_KEY = 'promo-banner-dismissed';
const DEADLINE_KEY = 'promo-banner-deadline';

/** Length of the offer window: 1 day + 12 hours. */
const OFFER_WINDOW_MS = (24 + 12) * 60 * 60 * 1000;

/** Delay before opening so the modal doesn't slam in before first paint. */
const OPEN_DELAY_MS = 600;

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

/** Returns the visitor's offer deadline, creating/resetting it when needed. */
function getOrCreateDeadline(): number {
  const now = Date.now();
  const stored = Number(localStorage.getItem(DEADLINE_KEY));
  if (stored && stored > now) return stored;
  const next = now + OFFER_WINDOW_MS;
  localStorage.setItem(DEADLINE_KEY, String(next));
  return next;
}

function computeTimeLeft(deadline: number): TimeLeft {
  const totalSeconds = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function PromoBanner() {
  const [open, setOpen] = useState(false);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  // Decide whether to show — only on the first land of this session.
  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    setDeadline(getOrCreateDeadline());
    const timer = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Tick the countdown once a second while the banner is open.
  useEffect(() => {
    if (!open || deadline == null) return;
    const update = () => setTimeLeft(computeTimeLeft(deadline));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [open, deadline]);

  // Every close path (X / Esc / outside click / Get Now) routes through here,
  // so the banner stays dismissed for the rest of the session.
  const handleOpenChange = (next: boolean) => {
    if (!next) sessionStorage.setItem(DISMISS_KEY, '1');
    setOpen(next);
  };

  const tiles: { value: number; label: string }[] = [
    { value: timeLeft?.days ?? 0, label: 'Days' },
    { value: timeLeft?.hours ?? 0, label: 'Hours' },
    { value: timeLeft?.minutes ?? 0, label: 'Minutes' },
    { value: timeLeft?.seconds ?? 0, label: 'Seconds' },
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-3xl border-white/10 bg-[#161616] p-8 text-center shadow-2xl sm:max-w-lg sm:p-10">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3">
            <DialogTitle className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
              50% Off
            </DialogTitle>
            <DialogDescription className="max-w-sm text-sm text-white/60 sm:text-base">
              Exclusive and limited-time deal. Grab it before the time runs out!
            </DialogDescription>
          </div>

          <div className="flex items-center justify-center gap-2.5 sm:gap-3">
            {tiles.map((tile) => (
              <div
                key={tile.label}
                className="flex h-[4.75rem] w-16 flex-col items-center justify-center rounded-2xl bg-white shadow-[0_0_35px_-2px_rgba(255,255,255,0.55)] sm:w-[4.5rem]"
              >
                <span className="text-2xl font-bold leading-none text-black tabular-nums sm:text-3xl">
                  {String(tile.value).padStart(2, '0')}
                </span>
                <span className="mt-1.5 text-[11px] text-black/60">
                  {tile.label}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/contact"
            onClick={() => handleOpenChange(false)}
            className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
          >
            Get Now
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
