/**
 * Watchlist page — the signed-in account island at /app/watchlist.
 *
 * This is a DYNAMIC Server Component (force-dynamic) that calls `auth()` and
 * reads the user's watchlist rows from Postgres at request time. It is the
 * counterpart to the static SEO pages: those never import `@/auth`, while this
 * route is explicitly dynamic and noindex (it's private account data, not
 * crawlable content).
 *
 * Site details (favicon/score/summary) are NOT stored in the watchlist table —
 * only (userId, domain). At render time we resolve each watched domain back to
 * its featured-list item via the same static JSON the rest of the site reads
 * (lib/data-server). Domains that are no longer in the featured set are shown
 * in a separate "No longer featured" section so a user can still unsave them
 * (rather than silently disappearing from their list).
 *
 * See .spec/prd/002-accounts-and-watchlist.md.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { watchlist } from "@/db/schema";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import LeaderboardCard from "@/components/LeaderboardCard";
import WatchlistButton from "@/components/WatchlistButton";
import { getFeatured } from "@/lib/data-server";
import type { DomainItem, ListEnvelope } from "@/types";

export const metadata: Metadata = {
  title: "Watchlist",
  robots: { index: false, follow: false },
};

// Account route — never statically rendered (reads session + DB per request).
export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/app/login");

  // Newest first — matches "recently added" intuition.
  const rows = await db
    .select({ domain: watchlist.domain })
    .from(watchlist)
    .where(eq(watchlist.userId, session.user.id))
    .orderBy(desc(watchlist.createdAt));

  // Resolve each watched domain to its featured-list item. One fs read of
  // featured.json (build-time SSG helper reused at runtime); a domain no longer
  // in the featured set resolves to null.
  const featured = await getFeaturedAtRuntime();
  const byDomain = new Map<string, DomainItem>();
  for (const it of featured.items) {
    byDomain.set(it.domain.toLowerCase(), it);
  }

  const resolved = rows.map((r) => ({
    domain: r.domain,
    item: byDomain.get(r.domain.toLowerCase()) ?? null,
  }));
  const present = resolved.filter((r): r is { domain: string; item: DomainItem } => !!r.item);
  const missing = resolved.filter((r) => !r.item);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1 pb-4">
        <div className="mx-auto max-w-3xl px-4 pt-14">
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <Link
              href="/"
              className="text-text-secondary hover:text-accent-ink transition-colors"
            >
              ← Leaderboard
            </Link>
          </nav>

          <h1 className="text-[34px] sm:text-[38px] leading-[1.12] tracking-[-0.035em] font-extrabold text-text-primary">
            Your watchlist
          </h1>
          <p className="text-text-secondary mt-2">
            {resolved.length === 0
              ? "Save sites worth tracking and find them here."
              : `${resolved.length} site${resolved.length === 1 ? "" : "s"} you’re tracking.`}
          </p>

          {resolved.length === 0 ? (
            <EmptyState />
          ) : (
            <ol className="flex flex-col gap-2.5 list-none p-0 m-0 mt-6">
              {present.map((r, i) => (
                <li key={r.domain}>
                  <LeaderboardCard
                    item={r.item}
                    rank={i + 1}
                    index={i}
                    initialWatched
                  />
                </li>
              ))}
            </ol>
          )}

          {missing.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                No longer featured
              </h2>
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                {missing.map((r) => (
                  <li
                    key={r.domain}
                    className="flex items-center justify-between gap-3 bg-card border border-border rounded-[14px] px-[14px] py-3"
                  >
                    <span className="text-sm text-text-secondary truncate">
                      {r.domain}
                    </span>
                    <WatchlistButton domain={r.domain} initialWatched />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
      <PageFooter />
    </>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 bg-card border border-border rounded-[14px] p-8 text-center">
      <p className="text-text-secondary">No watched sites yet.</p>
      <p className="text-text-muted text-sm mt-1">
        Discover sites worth tracking from the leaderboard.
      </p>
      <Link
        href="/"
        className="inline-block mt-4 px-4 py-2 rounded-[10px] bg-accent hover:bg-accent-ink text-white text-sm font-medium transition-colors"
      >
        Browse the leaderboard
      </Link>
    </div>
  );
}

/**
 * Resolve the featured list at runtime. Prefers the build-time fs helper
 * (getFeatured, which reads public/data/featured.json); falls back to an HTTP
 * fetch of the same static asset if the file isn't on disk in the serverless
 * runtime. The fs path is the primary one and works in local dev and where the
 * function filesystem includes public/.
 */
async function getFeaturedAtRuntime(): Promise<ListEnvelope> {
  try {
    return await getFeatured();
  } catch {
    const origin = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://growthlanding.ai";
    const res = await fetch(`${origin}/data/featured.json`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`featured.json fetch failed: ${res.status}`);
    }
    return (await res.json()) as ListEnvelope;
  }
}
