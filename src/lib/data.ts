/**
 * Static-data fetch helpers. All data lives under /data/*.json (served from
 * public/data/ by Next.js). No database, no API.
 *
 * Detail data is sharded by the domain's first character to keep each file
 * small (~1-2 MB). The shard key MUST match analyzers/scripts/export-webui.py
 * `_shard_key`: letter -> that letter; digit -> '0'; else -> '_'.
 */

import type {
  DomainDetail,
  DetailEnvelope,
  ListEnvelope,
  Stats,
} from "@/types";

/** Compute the shard filename for a domain. Mirrors export-webui._shard_key. */
export function shardKey(domain: string): string {
  if (!domain) return "_";
  const c = domain[0].toLowerCase();
  if (/[a-z]/.test(c)) return c;
  if (/[0-9]/.test(c)) return "0";
  return "_";
}

/** Fetch the featured list (LLM-enriched top domains). */
export async function fetchFeatured(): Promise<ListEnvelope> {
  const res = await fetch("/data/featured.json", { cache: "force-cache" });
  if (!res.ok) throw new Error(`featured.json: ${res.status}`);
  return res.json();
}

/** Fetch the full scored list (all domains). Can be large (~30 MB). */
export async function fetchAll(): Promise<ListEnvelope> {
  // no-cache so a refreshed export is picked up, but the file itself is static
  const res = await fetch("/data/all.json", { cache: "no-cache" });
  if (!res.ok) throw new Error(`all.json: ${res.status}`);
  return res.json();
}

/** Fetch aggregate stats for the top bar. */
export async function fetchStats(): Promise<Stats> {
  const res = await fetch("/data/stats.json", { cache: "no-cache" });
  if (!res.ok) throw new Error(`stats.json: ${res.status}`);
  return res.json();
}

/** Fetch a single domain's full detail (loads one shard by first char). */
export async function fetchDetail(domain: string): Promise<DomainDetail | null> {
  const key = shardKey(domain);
  const res = await fetch(`/data/detail/${key}.json`, { cache: "force-cache" });
  if (!res.ok) return null;
  const env: DetailEnvelope = await res.json();
  return env.domains[domain] ?? null;
}
