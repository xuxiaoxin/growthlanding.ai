/**
 * Data contracts for GrowthRadar.
 *
 * These mirror the JSON produced by analyzers/scripts/export-webui.py.
 * Three-state semantics: every boolean signal is `true | false | null` where
 * `null` means "not measured / fetch failed" (distinct from `false`).
 */

/** A single leaderboard-card item (featured.json / all.json `items[]`). */
export interface DomainItem {
  domain: string;
  first_seen: string | null; // ISO-8601 UTC
  score: number | null; // 0.0 - 1.0
  category: string | null; // LLM category if present, else Stage 0 guess
  subcategory: string | null;
  summary: string | null; // <=20 word LLM description (featured only)
  replication_difficulty: "low" | "medium" | "high" | null;
  competition_level: "low" | "medium" | "high" | null;
  llm_confidence: number | null;
  business_model: string | null;
  survival_status: "alive" | "dead" | null;
  has_pricing_page: boolean | null;
  has_payment_sdk: boolean | null;
  payment_provider: string | null;
  has_adsense: boolean | null;
  detected_lang: string | null;
  page_count: number | null;
  dns_richness: number | null;
}

/** Full detail-page item (detail/<key>.json `domains[domain]`). */
export interface DomainDetail extends DomainItem {
  unique_data_dependency: boolean | null;
  llm_model: string | null;
  score_breakdown: ScoreBreakdown | null;
  score_version: string | null;
  has_upgrade_cta: boolean | null;
  checkout_detected: boolean | null;
  internal_links: number | null;
  sitemap_url_count: number | null;
  tranco_in_top_1m: boolean | null;
  crux_in_corpus: boolean | null;
  has_public_analytics: boolean | null;
  public_analytics_provider: string | null;
  alive_30d: boolean | null;
  alive_90d: boolean | null;
  alive_180d: boolean | null;
  monetized_at_90d: boolean | null;
  launched_between_t0_t14: boolean | null;
  monetization_appeared: boolean | null;
  cohort_tag: string | null;
  safety_flag: string | null;
  pipeline_stage: string | null;
}

/** Per-component opportunity-score contribution (details.opportunity_score_breakdown). */
export interface ScoreBreakdown {
  dns_richness: number;
  pricing_page: number;
  saas_model: number;
  ai_category: number;
  page_scale: number;
  payment_filtered: number;
  checkout: number;
  survival_alive: number;
  _total: number;
  _version: string;
}

/** Aggregate headline numbers (stats.json). */
export interface Stats {
  generated_at: string;
  total_domains: number;
  total_scored: number;
  total_llm_enriched: number;
  alive: number;
  dead: number;
  discovered_today: number;
  discovered_7d: number;
  top_categories: { category: string; count: number }[];
  detail_shards?: string[];
}

/** Envelope for the featured/all list files. */
export interface ListEnvelope {
  generated_at: string;
  total: number;
  items: DomainItem[];
}

/** Envelope for a detail shard. */
export interface DetailEnvelope {
  generated_at: string;
  total: number;
  domains: Record<string, DomainDetail>;
}
