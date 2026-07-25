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
