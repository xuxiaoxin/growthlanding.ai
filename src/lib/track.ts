/**
 * GA4 custom business-event helpers.
 *
 * Thin wrapper around window.gtag for the four core business events defined in
 * the GrowthRadar analytics plan (business-analysis/explorations/2026-08-03-
 * growthlanding-discussion-plan.md §9, stage A):
 *   - detail_page_view : a visitor opened a /opportunity/<d> detail page
 *   - visit_site_click : a visitor clicked the "Visit site ↗" outbound link
 *   - category_click   : a visitor clicked a category (filter chip or link)
 *   - email_submit     : a visitor submitted an email (lead capture)
 *
 * Consent: gtag is initialized with Consent Mode v2 in app/layout.tsx — in
 * denied regions (EEA/UK) analytics_storage defaults to 'denied' and gtag
 * itself suppresses event sends, so we do NOT re-gate here. Calling gtag is a
 * no-op for those users.
 *
 * Privacy red line (脱敏红线): event params may ONLY contain public, non-
 * sensitive values — domain, category slug, subcategory, a source string, or
 * page path. NEVER pass internal scoring fields such as: score,
 * opportunity_score, opc_rank_score, copyability, leverage, dns_richness,
 * page_count, has_payment_sdk, score_breakdown, alive_30d, alive_90d, etc.
 * Those are proprietary and must not reach GA4.
 */

// Ambient re-declaration (merges with the one in consent.ts; identical
// signature, so this is safe and keeps track.ts self-contained for readers).
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Low-level event sender. SSR-safe (no-ops on the server) and safe to call
 * before gtag.js has loaded (optional-chained; events fired pre-load are lost,
 * which is acceptable — all current call sites are client-side user gestures).
 */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

/**
 * detail_page_view — fired once when a detail page mounts (see
 * DetailPageViewTracker). `category` / `subcategory` are public taxonomy
 * slugs; omitting them when null keeps the GA4 param list clean.
 */
export function trackDetailPageView(p: {
  domain: string;
  category?: string | null;
  subcategory?: string | null;
}): void {
  trackEvent("detail_page_view", {
    domain: p.domain,
    category: p.category ?? undefined,
    subcategory: p.subcategory ?? undefined,
  });
}

/**
 * visit_site_click — fired when a visitor clicks the "Visit site ↗" outbound
 * link on a detail page. `category` is the public taxonomy slug of the page
 * the click originated from.
 *
 * NOTE: helper is defined here but NOT yet wired into opportunity/[domain]/page.tsx
 * — the detail page is being restructured in parallel; the outbound-link click
 * handler will be connected in the main session once that merge settles.
 */
export function trackVisitSite(p: {
  domain: string;
  category?: string | null;
}): void {
  trackEvent("visit_site_click", {
    domain: p.domain,
    category: p.category ?? undefined,
  });
}

/**
 * category_click — fired when a visitor clicks a category. `source` records
 * where the click happened:
 *   - leaderboard_filter : a homepage/category-page filter chip (Leaderboard.tsx)
 *   - detail_page        : a category link on a detail page (reserved, not wired)
 *   - category_index     : a link in the category index / footer (reserved)
 */
export function trackCategoryClick(p: {
  category: string;
  source: "detail_page" | "leaderboard_filter" | "category_index";
}): void {
  trackEvent("category_click", {
    category: p.category,
    source: p.source,
  });
}

/**
 * email_submit — fired when a visitor submits an email via a lead-capture form.
 * `source` identifies which form/placement (e.g. "newsletter_footer"). No email
 * address is ever sent — only the source label.
 */
export function trackEmailSubmit(p: { source: string }): void {
  trackEvent("email_submit", {
    source: p.source,
  });
}
