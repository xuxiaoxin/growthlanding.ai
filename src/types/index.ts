/**
 * Data contracts for GrowthRadar (featured-only, desensitized public site).
 *
 * These mirror the JSON produced by analyzers/scripts/export-webui.py.
 * The site is curated to FEATURED domains only (those with LLM analysis).
 *
 * Desensitization: internal detection signals (dns_richness, page_count,
 * payment_sdk, score breakdown, etc.) are intentionally NOT exported -- only
 * the score number, the LLM analysis, and publicly-observable status survive.
 */

/** A single leaderboard-card item (featured.json `items[]`). */
export interface DomainItem {
  domain: string;
  first_seen: string | null; // ISO-8601 UTC
  score: number | null; // 0.0 - 1.0 (bare number, no breakdown)
  category: string | null; // LLM category if present, else Stage 0 guess
  subcategory: string | null;
  summary: string | null; // <=30 word LLM one-liner
  business_model: string | null;
  survival_status: "alive" | "dead" | null;
  replication_difficulty: "low" | "medium" | "high" | null;
  competition_level: "low" | "medium" | "high" | null;
}

/** Full detail-page item (featured-details.json `domains[domain]`). */
export interface DomainDetail extends DomainItem {
  description: string | null; // 100-150 word LLM product description
  key_features: string[]; // 3-5 core feature bullets
  target_users: string | null; // who it's built for
  why_interesting: string | null; // why worth studying
  unique_data_dependency: boolean | null;
  llm_confidence: number | null;
  llm_model: string | null;
}

/** Aggregate headline numbers (stats.json). */
export interface Stats {
  generated_at: string;
  total_featured: number;
  total_scored: number;
  alive: number;
  dead: number;
  discovered_today: number;
  discovered_7d: number;
  top_categories: { category: string; count: number }[];
}

/** Envelope for the featured list. */
export interface ListEnvelope {
  generated_at: string;
  total: number;
  items: DomainItem[];
}

/** Envelope for featured-details.json. */
export interface DetailEnvelope {
  generated_at: string;
  total: number;
  domains: Record<string, DomainDetail>;
}
