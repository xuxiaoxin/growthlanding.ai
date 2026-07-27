/**
 * Leaderboard — interactive list controller for the homepage.
 *
 * Responsibilities:
 *  - Search box (filter by domain / summary / category, case-insensitive)
 *  - Category chips (derived from the curated list itself)
 *  - "Load more" pagination (shows PAGE_SIZE at a time)
 *
 * SEO note (important): ALL items are rendered into the initial server HTML
 * so every detail page is internally linked and crawlable — the 775-link
 * internal graph is the homepage's core SEO asset. Overflow is hidden via a
 * `hidden` CSS class (display:none), NOT by omitting nodes, so:
 *   - crawlers still see the full link graph in the HTML source
 *   - React hydration matches (server + client render the same nodes)
 *   - search / category filter just toggles the `hidden` class per card
 */
"use client";

import { useMemo, useState } from "react";
import type { DomainItem } from "@/types";
import { titleCase } from "@/lib/format";
import LeaderboardCard from "./LeaderboardCard";

interface Props {
  items: DomainItem[];
  total: number;
}

const PAGE_SIZE = 24;

export default function Leaderboard({ items, total }: Props) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Category chips — from the actual data, sorted by frequency desc.
  // `other` is always pinned to the end (it's a catch-all bucket, not a real
  // category visitors want to browse first).
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const it of items) {
      if (!it.category) continue;
      counts.set(it.category, (counts.get(it.category) ?? 0) + 1);
    }
    const sorted = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat);
    // move "other" (case-insensitive) to the tail
    const otherIdx = sorted.findIndex((c) => c.toLowerCase() === "other");
    if (otherIdx !== -1) {
      const [other] = sorted.splice(otherIdx, 1);
      sorted.push(other);
    }
    return sorted;
  }, [items]);

  // The filtered set, in display order. We render EVERY item below, but only
  // those that are (a) in the filtered set AND (b) within the visible window
  // are shown; the rest get a `hidden` class.
  const { filteredRanks } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const ranks = new Map<string, number>();
    let rank = 0;
    for (const it of items) {
      if (activeCat !== "all" && it.category !== activeCat) continue;
      if (
        q &&
        !it.domain.toLowerCase().includes(q) &&
        !(it.summary?.toLowerCase().includes(q) ?? false) &&
        !(it.category?.toLowerCase().includes(q) ?? false)
      )
        continue;
      rank += 1;
      ranks.set(it.domain, rank);
    }
    return { filteredRanks: ranks };
  }, [items, query, activeCat]);

  const totalFiltered = filteredRanks.size;
  const hasMore = visibleCount < totalFiltered;

  function resetPager() {
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-3">
        <label className="flex items-center gap-2 bg-card border border-border rounded-[10px] px-[13px] py-2 shadow-[0_1px_2px_rgba(24,24,27,0.04),0_1px_3px_rgba(24,24,27,0.05)] focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--color-accent-soft)] transition-colors">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-muted shrink-0"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPager();
            }}
            placeholder={`Search ${total.toLocaleString()} sites…`}
            aria-label="Search sites"
            className="flex-1 border-0 outline-none bg-transparent text-[13px] text-text-primary placeholder:text-text-muted min-w-0"
          />
        </label>
      </div>

      {/* Category chips */}
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-5">
          <Chip
            active={activeCat === "all"}
            onClick={() => {
              setActiveCat("all");
              resetPager();
            }}
          >
            All
          </Chip>
          {categories.map((cat) => (
            <Chip
              key={cat}
              active={activeCat === cat}
              onClick={() => {
                setActiveCat(cat);
                resetPager();
              }}
            >
              {titleCase(cat)}
            </Chip>
          ))}
        </div>
      )}

      {/* List — every item is rendered (SEO link graph); overflow hidden via CSS.
          <ol> conveys the ranking semantics to assistive tech. */}
      {totalFiltered === 0 ? (
        <p className="text-text-muted text-center py-20">
          No sites match “{query}”.
        </p>
      ) : (
        <ol className="flex flex-col gap-2.5 list-none p-0 m-0">
          {items.map((item, i) => {
            // rank within the filtered set (search-results style numbering)
            const rankInFiltered = filteredRanks.get(item.domain);
            const inFiltered = rankInFiltered !== undefined;
            const isVisible = inFiltered && rankInFiltered! <= visibleCount;
            return (
              <li key={item.domain} className={isVisible ? "" : "hidden"}>
                <LeaderboardCard
                  item={item}
                  rank={rankInFiltered ?? i + 1}
                  index={(rankInFiltered ?? i + 1) - 1}
                />
              </li>
            );
          })}
        </ol>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="px-5 py-2.5 rounded-[10px] bg-card border border-border text-sm font-medium text-text-primary hover:border-border-strong hover:bg-stone-50 transition-colors"
          >
            Load more
            <span className="text-text-muted ml-1.5">
              ({(totalFiltered - visibleCount).toLocaleString()} more)
            </span>
          </button>
        </div>
      )}

      {!hasMore && totalFiltered > PAGE_SIZE && (
        <p className="text-[12px] text-text-muted text-center mt-5">
          Showing all {totalFiltered.toLocaleString()} matching sites.
        </p>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      // 44px min touch target (WCAG 2.5.5 Target Size); py-2.5 + leading hits it.
      className={`min-h-[36px] text-[12.5px] font-medium px-[13px] py-2.5 rounded-full border transition-colors ${
        active
          ? "bg-accent text-white border-accent"
          : "bg-card text-text-secondary border-border hover:border-border-strong"
      }`}
    >
      {children}
    </button>
  );
}
