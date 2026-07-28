/**
 * Category metadata + SEO copy.
 *
 * The site's `category` values come from LLM classification and are stored as
 * snake_case slugs (e.g. `ai_tool`, `developer_tool`). `titleCase()` alone is
 * not enough for category pages because it produces "Ai Tool" (wrong acronym
 * casing) and has no plural form — both matter for matching search queries
 * like "new ai tools".
 *
 * This module centralizes the slug → human-readable mapping and generates the
 * SEO copy (H1, intro paragraph, meta description) for category pages, so the
 * wording stays consistent and data-driven (filled with live counts/dates).
 *
 * Pure module (no fs, no React) — safe to import from client or server.
 */

import { titleCase } from "@/lib/format";

/**
 * Per-category display metadata. Keys MUST match the `category` values in
 * featured.json exactly. Categories not listed here fall back to a
 * titleCase-based plural (see categoryPlural).
 */
export const CATEGORY_META: Record<string, { plural: string }> = {
  ai_tool: { plural: "AI Tools" },
  saas: { plural: "SaaS Products" },
  marketing: { plural: "Marketing Tools" },
  developer_tool: { plural: "Developer Tools" },
  finance: { plural: "Finance & Fintech" },
  other: { plural: "Other Products" },
  ecommerce: { plural: "E-commerce Sites" },
  healthcare: { plural: "Healthcare Products" },
  productivity: { plural: "Productivity Tools" },
  education: { plural: "Education Products" },
  content: { plural: "Content Tools" },
  design: { plural: "Design Tools" },
  communication: { plural: "Communication Tools" },
};

/**
 * Human-readable plural name for a category slug.
 * Unknown slugs fall back to titleCase(cat) + "s" so new categories render
 * sensibly without requiring a code change.
 */
export function categoryPlural(cat: string): string {
  const meta = CATEGORY_META[cat];
  if (meta) return meta.plural;
  return `${titleCase(cat)}s`;
}

/**
 * H1 heading for a category page.
 * Targets "new/latest" + plural (blue-ocean, matches the site's "newly
 * launched worth-studying" positioning rather than the crowded "best X" SERP).
 */
export function categoryH1(cat: string): string {
  return `Latest ${categoryPlural(cat)} — Worth-Studying Picks`;
}

/**
 * SEO intro paragraph shown under the H1. Template-generated and filled with
 * live data so it reads naturally and signals freshness to crawlers.
 *
 * @param cat    category slug
 * @param count  number of items in this category
 * @param dateStr  pre-formatted date string (e.g. "Jul 26, 2026")
 */
export function categoryIntro(cat: string, count: number, dateStr: string): string {
  const plural = categoryPlural(cat).toLowerCase();
  return `Discover ${count.toLocaleString()} newly launched ${plural} worth studying — ranked by opportunity score, with a short summary and key signals for each. Updated ${dateStr}.`;
}

/**
 * Meta description (~150 chars). Concise version of the intro for SERP snippets.
 */
export function categoryMetaDesc(cat: string, count: number): string {
  const plural = categoryPlural(cat).toLowerCase();
  return `A curated list of ${count.toLocaleString()} newly launched ${plural.toLowerCase()}, ranked by opportunity score with summaries and key signals.`;
}
