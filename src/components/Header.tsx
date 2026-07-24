/**
 * Header — sticky top bar with the GrowthRadar logo.
 * Keeps the leaderboard visually anchored (ProductHunt-style).
 */

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl">🚀</span>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-primary">Growth</span>
            <span className="text-text-primary">Radar</span>
          </span>
        </Link>
        <span className="text-xs text-text-muted hidden sm:block">
          Rising SaaS &amp; AI sites, discovered daily
        </span>
      </div>
    </header>
  );
}
