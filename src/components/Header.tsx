/**
 * Header — sticky top bar with the GrowthRadar wordmark + a lightweight nav.
 * Editorial style: ink mark (with a small teal accent dot) + wordmark on
 * off-white, hairline bottom border, frosted when scrolling.
 *
 * The nav carries the Playbooks link as a main-content link (header links pass
 * significantly more internal-link equity + crawl priority than footer links,
 * which matters for /playbooks cold-start ranking signals). The tagline stays
 * on the right at the sm: breakpoint (mobile-hidden, matching the old layout).
 */

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-[rgba(250,250,249,0.82)] backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto max-w-5xl px-4 h-[62px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* ink mark — rounded square with a small teal accent dot */}
            <span className="relative w-[26px] h-[26px] rounded-[10px] bg-gradient-to-br from-primary to-zinc-700 shadow-[0_1px_2px_rgba(24,24,27,0.04),0_1px_3px_rgba(24,24,27,0.05)]">
              <span className="absolute top-[5px] right-[5px] w-[7px] h-[7px] rounded-full bg-accent ring-2 ring-primary" />
            </span>
            <span className="text-base font-bold tracking-tight text-text-primary">
              GrowthRadar
            </span>
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-4">
            <Link
              href="/playbooks"
              className="text-sm font-medium text-text-secondary hover:text-accent-ink transition-colors"
            >
              Playbooks
            </Link>
          </nav>
        </div>
        <span className="text-xs text-text-muted hidden sm:block">
          Solo-founder opportunities, discovered daily
        </span>
      </div>
    </header>
  );
}
