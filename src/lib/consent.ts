/**
 * Google Consent Mode v2 + Google Analytics configuration.
 *
 * Centralizes the GA measurement ID, the localStorage key for persisting a
 * visitor's consent choice, and the safe wrapper for gtag consent updates.
 * Kept framework-agnostic so it can be called from client components without
 * pulling in React.
 *
 * Compliance notes:
 *  - The `default` consent command (denied for EEA/UK, granted elsewhere via
 *    region) lives in app/layout.tsx as an inline beforeInteractive script —
 *    it MUST run before gtag.js loads to avoid setting cookies pre-consent.
 *  - This module only handles the user-driven `update` calls.
 *  - analytics_storage is the load-bearing signal for GA; ad_* signals are
 *    configured too so the site is already Consent-Mode-v2-ready for a future
 *    AdSense rollout.
 */

/** Google Analytics 4 measurement ID. */
export const GA_MEASUREMENT_ID = "G-8CC9JEF9M8";

/** localStorage key under which "granted" | "denied" is persisted. */
export const CONSENT_STORAGE_KEY = "growthradar-consent";

/** Values stored under CONSENT_STORAGE_KEY. */
export type ConsentChoice = "granted" | "denied";

/**
 * The four Consent Mode v2 signals, as a single object so Accept and Reject
 * stay perfectly symmetric (reject = all denied, accept = all granted).
 */
const CONSENT_SIGNALS = [
  "ad_storage",
  "ad_user_data",
  "ad_personalization",
  "analytics_storage",
] as const;

/** TypeScript ambient shim so window.gtag / window.reopenConsent typecheck. */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    reopenConsent?: () => void;
  }
}

/**
 * Push a consent update to gtag. Safe to call before gtag.js has loaded:
 * if window.gtag is undefined we still persist the choice to localStorage so
 * the banner state is consistent, and a future page load will re-apply it.
 */
export function updateConsent(granted: boolean): void {
  const value = granted ? "granted" : "denied";
  const update: Record<string, string> = {};
  for (const signal of CONSENT_SIGNALS) update[signal] = value;

  if (typeof window !== "undefined") {
    window.gtag?.("consent", "update", update);
  }
}

/** Read the persisted choice (or null if the visitor hasn't decided yet). */
export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage?.getItem(CONSENT_STORAGE_KEY);
  return v === "granted" || v === "denied" ? v : null;
}

/** Persist the choice so the banner doesn't reappear on every page load. */
export function writeConsent(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;
  window.localStorage?.setItem(CONSENT_STORAGE_KEY, choice);
}
