/**
 * WatchlistButton — client island for saving/unsaving a domain.
 *
 * The ONLY interactive element that touches the watchlist. It's a Client
 * Component (this file) that invokes the `toggleWatchlist` Server Action over
 * RPC. Because it hydrates as an island, embedding it inside SSG pages (the
 * detail page, the leaderboard) does NOT make those pages dynamic — exactly
 * like NewsletterSubscribe. The static SEO pages never import `@/auth` or call
 * `auth()`; the auth check lives entirely inside the server action.
 *
 * Behavior:
 *  - Signed-out click → the server action calls `redirect("/app/login")`, which
 *    Next turns into a client-side navigation. No special handling here.
 *  - Signed-in click → optimistic flip, then reconcile with the action result.
 *    On a genuine error (e.g. DB failure) the optimistic flip is reverted.
 *  - `compact` → icon-only chip for dense rows (LeaderboardCard). `compact=false`
 *    → icon + "Watch"/"Watching" label (detail page, watchlist page).
 *  - When rendered inside a <Link> (LeaderboardCard), onClick stops propagation
 *    so the card's navigation doesn't fire.
 */
"use client";

import { useState, useTransition } from "react";
import { toggleWatchlist } from "@/app/actions/watchlist";

interface Props {
  domain: string;
  /** Presets the rendered state (e.g. the watchlist page knows it's watched). */
  initialWatched?: boolean;
  /** Icon-only variant for tight rows. Defaults to labeled. */
  compact?: boolean;
}

export default function WatchlistButton({
  domain,
  initialWatched = false,
  compact = false,
}: Props) {
  const [watched, setWatched] = useState(initialWatched);
  const [pending, startTransition] = useTransition();

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    // Stop the click from bubbling into a parent <Link> (LeaderboardCard) so
    // tapping "Watch" doesn't also navigate to the detail page.
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    const next = !watched;
    setWatched(next); // optimistic
    startTransition(async () => {
      try {
        const res = await toggleWatchlist(domain);
        setWatched(res.watched);
      } catch {
        // Revert on a real failure. A signed-out redirect is surfaced as a
        // navigation by Next and the page is unloading regardless, so any
        // transient revert here is invisible.
        setWatched(!next);
      }
    });
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-pressed={watched}
        title={watched ? "Watching" : "Watch"}
        aria-label={
          watched
            ? `Remove ${domain} from watchlist`
            : `Add ${domain} to watchlist`
        }
        className={`shrink-0 grid place-items-center w-7 h-7 rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          watched
            ? "bg-accent text-white border-accent hover:bg-accent-ink"
            : "bg-card text-text-muted border-border hover:border-border-strong hover:text-text-primary"
        }`}
      >
        <BookmarkIcon filled={watched} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={watched}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        watched
          ? "bg-accent text-white border-accent hover:bg-accent-ink"
          : "bg-card text-text-secondary border-border hover:border-border-strong hover:text-text-primary"
      }`}
    >
      <BookmarkIcon filled={watched} />
      {watched ? "Watching" : "Watch"}
    </button>
  );
}

/** Bookmark glyph — filled (solid) when watched, outlined otherwise. */
function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
