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
