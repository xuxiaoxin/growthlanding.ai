/**
 * SEO copy generators for the detail page (and reusable helpers).
 *
 * Centralizes the detail-page <title> body / OG-Twitter full title / meta
 * description so the wording, length budgets, and fallback rules live in one
 * audited place. Reuses ONLY public whitelist fields (domain, category,
 * summary, target_users, replication_difficulty) — never touches internal
 * detection signals (score_breakdown / dns_richness / page_count /
 * has_payment_sdk / alive_30d / llm_* / etc.).
 *
 * Copy rules (SPEC-001 Part A):
 *  - No "AI/LLM" wording (analysis is described vaguely).
 *  - title body ≤ 65 chars (validated, truncated from the target_users end).
 *  - description ≤ 155 chars (SERP snippet ceiling).
 *  - target_users has a 3-layer fallback (see resolveTargetUsers).
 */

import { titleCase } from "@/lib/format";

/** SERP length budgets. */
export const TITLE_BODY_MAX = 65;
export const DESCRIPTION_MAX = 155;

const SITE_NAME = "GrowthRadar";

/**
 * Category slug → singular display label with correct acronym casing.
 *
 * `titleCase()` alone produces "Ai Tool" / "Saas" (wrong acronym casing), which
 * looks off in a SERP title. This map fixes the known acronyms (AI, SaaS) and
 * falls back to titleCase for the rest. Mirrors the casing used in
 * categories.ts CATEGORY_META (which only carries plurals). Kept local to the
 * SEO layer so the existing detail-page badge (titleCase) is untouched.
 */
const CATEGORY_SINGULAR: Record<string, string> = {
  ai_tool: "AI Tool",
  saas: "SaaS Product",
  marketing: "Marketing Tool",
  developer_tool: "Developer Tool",
  finance: "Finance Product",
  other: "Product",
  ecommerce: "E-commerce Site",
  healthcare: "Healthcare Product",
  productivity: "Productivity Tool",
  education: "Education Product",
  content: "Content Tool",
  design: "Design Tool",
  communication: "Communication Tool",
};

/**
 * A short, lowercase noun for the category — used in the target_users fallback
 * phrase "{noun} tool" (e.g. "AI tool", "SaaS tool"). Lowercase so it reads
 * naturally mid-sentence after the em-dash. Kept in sync with
 * CATEGORY_SINGULAR (same keys, lowercase noun form).
 */
const CATEGORY_FALLBACK_NOUN: Record<string, string> = {
  ai_tool: "AI tool",
  saas: "SaaS tool",
  marketing: "marketing tool",
  developer_tool: "developer tool",
  finance: "finance product",
  other: "product",
  ecommerce: "e-commerce site",
  healthcare: "healthcare product",
  productivity: "productivity tool",
  education: "education product",
  content: "content tool",
  design: "design tool",
  communication: "communication tool",
};

/**
 * Singular display label for a category slug (correct acronym casing).
 * Unknown slugs fall back to titleCase(cat). Used for the detail-page title.
 */
function categorySingularLabel(cat: string | null | undefined): string {
  if (!cat) return "Tool";
  return CATEGORY_SINGULAR[cat] ?? titleCase(cat);
}

/**
 * Lowercase fallback noun phrase for a category (e.g. "AI tool", "SaaS tool"),
 * used when target_users is empty/short/non-Latin. Unknown slugs fall back to
 * the titleCased slug lowercased + " tool".
 */
function categoryFallbackNoun(cat: string | null | undefined): string {
  if (!cat) return "tool";
  return CATEGORY_FALLBACK_NOUN[cat] ?? `${titleCase(cat).toLowerCase()} tool`;
}

/**
 * Resolve target_users for use in a title, with a 3-layer fallback.
 * Returns `{ value: string; fellBack: boolean }` so the title builder can
 * avoid the redundant "{Category} for {Category} tool" wording when the
 * fallback fires (the spec's intended fallback title is
 * "{Domain} — {Category} tool (solo-fit: …)", not "...for {Category} tool").
 *
 *  1. Normal: present, ≥ 4 chars, AND all-Latin → use the raw value.
 *  2. Non-Latin (e.g. the LLM produced Chinese): → "{categoryFallbackNoun}"
 *     (e.g. "AI tool"), avoiding mixed CJK/Latin titles that hurt SEO.
 *  3. Empty / too short (< 4 chars): → "{categoryFallbackNoun}".
 *
 * `category` is the raw category slug; the fallback noun is derived from it via
 * categoryFallbackNoun() so it reads naturally lowercase mid-sentence.
 *
 * "Latin" here means: Latin-script letters, digits, whitespace, and common
 * English punctuation (parens, commas, hyphens, etc.). Any character outside
 * that set — CJK, Cyrillic, Arabic, emoji, etc. — triggers the layer-2
 * fallback. This matches the spec's intent (catch non-Latin output like
 * Chinese) without being so strict that normal English strings with parens
 * like "small businesses (SMEs)" get incorrectly discarded.
 */
export function resolveTargetUsers(
  targetUsers: string | null | undefined,
  category: string | null | undefined,
): { value: string; fellBack: boolean } {
  const fallback = categoryFallbackNoun(category);
  const raw = (targetUsers ?? "").trim();
  // Layer 3: empty / too short.
  if (raw.length < 4) return { value: fallback, fellBack: true };
  // Layer 2: contains any non-Latin character → fall back. The allowed set is
  // Latin letters (\p{Script=Latin}, covers accented chars too), numbers
  // (\p{Number}), whitespace (\s), and the common English punctuation an
  // audience description would use. Anything else (CJK/Cyrillic/Arabic/emoji)
  // is treated as non-Latin.
  if (!/^[\p{Script=Latin}\p{Number}\s.,'&()/[\]!?;:@"#*-]+$/u.test(raw)) {
    return { value: fallback, fellBack: true };
  }
  // Layer 1: normal.
  return { value: raw, fellBack: false };
}

/**
 * Build the detail-page <title> BODY (without the site-name suffix).
 *
 * Normal format: `{Domain} — {Category} for {target_users} (solo-fit: {difficulty})`
 * Fallback format (target_users empty/short/non-Latin):
 *   `{Domain} — {Category} tool (solo-fit: {difficulty})`
 *
 * The fallback collapses "{Category} for {Category} tool" → "{Category} tool"
 * (the spec's intended fallback wording, avoiding the redundant double category).
 *
 * The body is truncated to TITLE_BODY_MAX (65). Truncation priority (what to
 * shed first when too long): target_users is the most variable/longest part and
 * the least search-critical, so it's trimmed first; if still too long, the
 * "(solo-fit: …)" suffix is dropped. Domain + category are always kept.
 *
 * Note: the final browser <title> = body + " | GrowthRadar" (via layout.tsx's
 * title.template). The hard cap here is 65 on the body.
 */
export function buildDetailTitleBody(args: {
  domain: string;
  category: string | null | undefined;
  targetUsers: string | null | undefined;
  difficulty: string | null | undefined;
}): string {
  const { domain, category, targetUsers, difficulty } = args;
  const categoryDisplay = categorySingularLabel(category);
  const { value: users, fellBack } = resolveTargetUsers(targetUsers, category);
  const soloFit = difficulty ? difficulty.toLowerCase() : "unknown";

  // When target_users fell back, the audience phrase IS "{Category} tool", so
  // we don't prepend "{Category} for " (that would read "Saas for Saas tool").
  const audience = fellBack ? users : `${categoryDisplay} for ${users}`;
  const full = `${domain} — ${audience} (solo-fit: ${soloFit})`;
  if (full.length <= TITLE_BODY_MAX) return full;

  // Drop the solo-fit suffix first.
  const noSoloFit = `${domain} — ${audience}`;
  if (noSoloFit.length <= TITLE_BODY_MAX) return noSoloFit;

  // Still too long: truncate the audience portion. Compute how many chars we
  // can afford, leaving room for the "…" ellipsis.
  const prefix = `${domain} — `;
  const budget = TITLE_BODY_MAX - prefix.length - 1; // -1 for ellipsis
  if (budget >= 4) {
    return `${prefix}${audience.slice(0, budget)}…`;
  }
  // Extremely long domain: just cap hard.
  return full.slice(0, TITLE_BODY_MAX - 1) + "…";
}

/**
 * Build the OG/Twitter full title for the detail page (does NOT go through
 * layout's title.template). Format: `{titleBody} — GrowthRadar`.
 */
export function buildDetailFullTitle(titleBody: string): string {
  return `${titleBody} — ${SITE_NAME}`;
}

/**
 * Build the detail-page meta description.
 *
 * Format: `{summary} Why it's worth studying as a solo-founder opportunity.`
 *
 * Truncated to DESCRIPTION_MAX (155). When summary is missing, a generic
 * fallback is used. `difficulty` is the replication_difficulty value — it's
 * already surfaced in the title's "(solo-fit: …)" so the description doesn't
 * repeat it; the suffix just frames the page's editorial angle.
 */
export function buildDetailDescription(
  summary: string | null | undefined,
  domain: string,
): string {
  const suffix = " Why it's worth studying as a solo-founder opportunity.";
  if (!summary || !summary.trim()) {
    const fallback = `Opportunity analysis for ${domain}: what it does and why it's worth studying as a solo-founder opportunity.`;
    return truncate(fallback, DESCRIPTION_MAX);
  }
  return truncate(`${summary.trim()}${suffix}`, DESCRIPTION_MAX);
}

/** Truncate to max, appending an ellipsis if truncation occurred. */
function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  // Reserve 1 char for the ellipsis.
  return s.slice(0, max - 1) + "…";
}
