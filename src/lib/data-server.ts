/**
 * Server-side data access (build time). Reads the static JSON produced by
 * analyzers/scripts/export-webui.py directly from the filesystem during
 * `next build`, so the content is baked into static HTML (no client fetch,
 * SEO-friendly, instant page loads).
 *
 * This module MUST only be imported from Server Components / route handlers /
 * generateStaticParams -- it uses Node `fs` and must not enter the client
 * bundle.
 */

import fs from "node:fs/promises";
import path from "node:path";
import type {
  DomainDetail,
  DomainItem,
  DetailEnvelope,
  ListEnvelope,
  Stats,
} from "@/types";

const DATA_DIR = path.join(process.cwd(), "public", "data");

async function readJson<T>(name: string): Promise<T> {
  const file = path.join(DATA_DIR, name);
  const raw = await fs.readFile(file, "utf-8");
  return JSON.parse(raw) as T;
}

/** The featured leaderboard list (cards). */
export async function getFeatured(): Promise<ListEnvelope> {
  return readJson<ListEnvelope>("featured.json");
}

/** Aggregate stats for the top bar. */
export async function getStats(): Promise<Stats> {
  return readJson<Stats>("stats.json");
}

/** All featured domain names -- for generateStaticParams. */
export async function getFeaturedDomains(): Promise<string[]> {
  const f = await getFeatured();
  return f.items.map((i) => i.domain);
}

/**
 * Full detail for one domain. Reads the single featured-details.json (the
 * curated set is small, ~hundreds of domains, so one file is fine) and looks
 * up by domain. Returns null if the domain isn't in the featured set.
 */
export async function getDetail(domain: string): Promise<DomainDetail | null> {
  const env = await readJson<DetailEnvelope>("featured-details.json");
  return env.domains[domain] ?? null;
}

/**
 * Count of featured domains (the curated total shown across the site). Reads
 * the `total` field straight off featured-details.json so the detail page can
 * feed SiteFooter without pulling the whole leaderboard list.
 */
export async function getFeaturedTotal(): Promise<number> {
  const env = await readJson<DetailEnvelope>("featured-details.json");
  return env.total;
}

/**
 * All categories with their item counts, derived from featured.json (NOT
 * stats.json — the two are out of sync: stats.top_categories omits several
 * large featured categories like marketing/other/design and includes
 * scored-but-not-featured ones like landing/real_estate/legal).
 *
 * Sorted by count desc, with the catch-all "other" bucket pinned to the end
 * (matches the Leaderboard chip ordering convention).
 */
export async function getCategories(): Promise<
  { category: string; count: number }[]
> {
  const f = await getFeatured();
  const counts = new Map<string, number>();
  for (const it of f.items) {
    if (!it.category) continue;
    counts.set(it.category, (counts.get(it.category) ?? 0) + 1);
  }
  const sorted = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));
  const otherIdx = sorted.findIndex((c) => c.category.toLowerCase() === "other");
  if (otherIdx !== -1) {
    const [other] = sorted.splice(otherIdx, 1);
    sorted.push(other);
  }
  return sorted;
}

/** Category slug list — for /category/[cat] generateStaticParams. */
export async function getCategorySlugs(): Promise<string[]> {
  const cats = await getCategories();
  return cats.map((c) => c.category);
}

/**
 * Items in a single category, preserving the original (score-desc) ordering.
 * Returns [] for an unknown category so the caller can notFound().
 */
export async function getByCategory(cat: string): Promise<DomainItem[]> {
  const f = await getFeatured();
  return f.items.filter((it) => it.category === cat);
}

/**
 * Same-category "related sites" for the detail-page recommendation rail.
 *
 * Reuses getByCategory()'s score-desc ordering, excludes the current domain,
 * and caps at `limit`. Returns [] when the category is missing OR when the
 * domain is the only item in its category — the caller should then omit the
 * whole rail (rendering an empty heading looks broken).
 *
 * Server-only (reads fs via getFeatured). Only returns public DomainItem
 * fields — no desensitized detection signals are ever touched here.
 *
 * @param domain    current domain (excluded from results)
 * @param category  category slug from detail.category; null/empty → []
 * @param limit     desired count, default 6 (the page shows 4–6)
 */
export async function getRelatedByCategory(
  domain: string,
  category: string | null | undefined,
  limit = 6,
): Promise<DomainItem[]> {
  if (!category) return [];
  const items = await getByCategory(category);
  return items
    .filter((it) => it.domain !== domain)
    .slice(0, limit);
}
