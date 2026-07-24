/**
 * LeaderboardClient — the interactive leaderboard body (client component).
 *
 * Owns the featured/all tab state, fetches the corresponding JSON, and
 * paginates the (potentially huge) "all" list client-side to avoid rendering
 * tens of thousands of DOM nodes at once. The full list is still loaded into
 * memory in one fetch so tab switches and pagination are instant.
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { DomainItem, ListEnvelope, Stats } from "@/types";
import { fetchFeatured, fetchAll, fetchStats } from "@/lib/data";
import TabSwitch, { type Tab } from "./TabSwitch";
import StatsBar from "./StatsBar";
import LeaderboardCard from "./LeaderboardCard";

const PAGE_SIZE = 30;

export default function LeaderboardClient() {
  const [tab, setTab] = useState<Tab>("featured");
  const [featured, setFeatured] = useState<ListEnvelope | null>(null);
  const [all, setAll] = useState<ListEnvelope | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true); // initial featured load
  const [allLoading, setAllLoading] = useState(false); // lazy all-list load
  const [error, setError] = useState<string | null>(null);

  // Load stats + featured immediately (small, primary content). All setState
  // calls happen inside async callbacks, not synchronously in the effect body.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, f] = await Promise.all([fetchStats(), fetchFeatured()]);
        if (cancelled) return;
        setStats(s);
        setFeatured(f);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Lazily load the (large) all list when the user first switches to it.
  // setAllLoading runs in the async start, not synchronously, to avoid the
  // set-state-in-effect rule.
  useEffect(() => {
    if (tab !== "all" || all || allLoading) return;
    let cancelled = false;
    Promise.resolve()
      .then(() => {
        if (cancelled) return;
        setAllLoading(true);
        return fetchAll();
      })
      .then((data) => {
        if (cancelled || !data) return;
        setAll(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setAllLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab, all, allLoading]);

  const switchTab = useCallback((next: Tab) => {
    setTab(next);
    setPage(1);
  }, []);

  const current: ListEnvelope | null = tab === "featured" ? featured : all;
  const items: DomainItem[] = useMemo(
    () => current?.items ?? [],
    [current],
  );
  const visible = useMemo(
    () => items.slice(0, page * PAGE_SIZE),
    [items, page],
  );
  const hasMore = visible.length < items.length;
  const showSpinner = loading || (tab === "all" && allLoading && !all);

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-error">Failed to load data.</p>
        <p className="text-text-muted text-sm mt-2 font-mono">{error}</p>
        <p className="text-text-muted text-sm mt-4">
          The data files may still be generating. Try again shortly.
        </p>
      </div>
    );
  }

  return (
    <>
      <StatsBar stats={stats} />

      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {tab === "featured" ? "🌟 Top Opportunities" : "📊 All Scored Sites"}
          </h2>
          <TabSwitch
            active={tab}
            onChange={switchTab}
            featuredCount={featured?.total}
            allCount={all?.total}
          />
        </div>

        {showSpinner ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-4 h-20 animate-pulse"
              />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <p className="text-text-muted text-center py-20">
            No domains in this list yet.
          </p>
        ) : (
          <div className="space-y-3">
            {visible.map((item, i) => (
              <LeaderboardCard key={item.domain} item={item} rank={i + 1} />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="text-center py-8">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-6 py-2.5 rounded-xl border border-border hover:border-primary/40 hover:text-primary text-text-secondary transition-all text-sm"
            >
              Load more ({(items.length - visible.length).toLocaleString()} remaining)
            </button>
          </div>
        )}
      </div>
    </>
  );
}
