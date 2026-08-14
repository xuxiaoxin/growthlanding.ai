/**
 * Watchlist server actions.
 *
 * All run server-side, guarded by `auth()`. `users.id` is a text UUID, so the
 * session user id is used directly (no integer conversion). Unauthorized calls
 * redirect to /app/login. These are the only write paths to the watchlist
 * table; client components (WatchlistButton, Leaderboard) invoke them via
 * Next's server-action RPC — they never touch the SSG SEO pages' rendering.
 *
 * See .spec/prd/002-accounts-and-watchlist.md (P0-6).
 */
"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { watchlist } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

function normalize(domain: string): string | null {
  const d = (domain ?? "").trim().toLowerCase();
  if (!d || d.length > 255) return null;
  return d;
}

/**
 * Toggle a domain in the current user's watchlist. Idempotent via the
 * (userId, domain) unique index. Redirects to /app/login when signed out.
 * Returns the resulting watched state so the caller can update its UI.
 */
export async function toggleWatchlist(
  domain: string,
): Promise<{ watched: boolean }> {
  const session = await auth();
  if (!session?.user?.id) redirect("/app/login");

  const d = normalize(domain);
  if (!d) return { watched: false };

  const userId = session.user.id; // text UUID

  const existing = await db
    .select({ id: watchlist.id })
    .from(watchlist)
    .where(and(eq(watchlist.userId, userId), eq(watchlist.domain, d)))
    .limit(1);

  if (existing.length > 0) {
    await db.delete(watchlist).where(eq(watchlist.id, existing[0].id));
    return { watched: false };
  }

  await db.insert(watchlist).values({ userId, domain: d });
  return { watched: true };
}

/**
 * Whether the current user has a single domain watchlisted. Returns false when
 * signed out (no redirect) — used for detail-page button initial state.
 */
export async function isWatchlisted(domain: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;
  const d = normalize(domain);
  if (!d) return false;
  const row = await db
    .select({ id: watchlist.id })
    .from(watchlist)
    .where(
      and(eq(watchlist.userId, session.user.id), eq(watchlist.domain, d)),
    )
    .limit(1);
  return row.length > 0;
}

/**
 * Batch lookup: returns the subset of `domains` the current user has
 * watchlisted. Used by the leaderboard (many cards) to initialize button
 * states in a single server-action call instead of N. Returns [] when signed
 * out.
 */
export async function isWatchlistedBatch(
  domains: string[],
): Promise<string[]> {
  const session = await auth();
  if (!session?.user?.id) return [];
  const cleaned = domains.map(normalize).filter((d): d is string => !!d);
  if (cleaned.length === 0) return [];
  const rows = await db
    .select({ domain: watchlist.domain })
    .from(watchlist)
    .where(
      and(
        eq(watchlist.userId, session.user.id),
        inArray(watchlist.domain, cleaned),
      ),
    );
  return rows.map((r) => r.domain);
}
