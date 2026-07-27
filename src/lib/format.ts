/**
 * Formatting helpers. Centralizes the three-state boolean rendering so the UI
 * never confuses "null = not measured" with "false = no".
 */

/** Render a three-state boolean as a short label. */
export function triBoolLabel(
  val: boolean | null,
  labels: { yes: string; no: string; unknown: string } = {
    yes: "Yes",
    no: "No",
    unknown: "Unknown",
  },
): string {
  if (val === null || val === undefined) return labels.unknown;
  return val ? labels.yes : labels.no;
}

/** A small colored dot for a three-state boolean (green/red/grey). */
export function triBoolColor(val: boolean | null): string {
  if (val === null || val === undefined) return "var(--color-text-muted)";
  return val ? "var(--color-success)" : "var(--color-error)";
}

/** Format an opportunity score (0-1) as a percentage string, e.g. "92%". */
export function scorePct(score: number | null | undefined): string {
  if (score === null || score === undefined) return "—";
  return `${Math.round(score * 100)}%`;
}

/** Score ring geometry (0-1). Returns a fill fraction in [0,1] (min 0.05 so the arc is always visible). */
export function scoreRingFill(score: number | null | undefined): number {
  if (score === null || score === undefined) return 0;
  return Math.min(1, Math.max(0.05, score));
}

/**
 * Score ring SVG dash geometry for a circle of the given radius.
 * Returns { dasharray, dashoffset } for a fraction fill (0-1).
 * Used by the magnitude rings on leaderboard/detail — single accent color,
 * never a red/yellow/green traffic light (that would mislead readers).
 */
export function scoreRingDash(
  fraction: number,
  radius: number,
): { dasharray: string; dashoffset: string } {
  const circumference = 2 * Math.PI * radius;
  const dasharray = circumference.toFixed(2);
  const dashoffset = (circumference * (1 - fraction)).toFixed(2);
  return { dasharray, dashoffset };
}

/** Format an ISO date string as a compact absolute date, e.g. "Jul 10, 2026". */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "Unknown";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Relative time from an ISO date string, e.g. "3 days ago". */
export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return "Unknown";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "Unknown";
  const diffMs = Date.now() - then;
  const sec = Math.round(diffMs / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  if (sec < 60) return "just now";
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 30) return `${day}d ago`;
  const month = Math.round(day / 30);
  if (month < 12) return `${month}mo ago`;
  return `${Math.round(day / 365)}y ago`;
}

/** Title-case a snake_case or lowercase category/model string. */
export function titleCase(s: string | null | undefined): string {
  if (!s) return "Unknown";
  return s
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Difficulty/competition level → color of the small status dot. Uses a
 * single-hue teal ramp (weak → strong) instead of a green/yellow/red traffic
 * light, so the dot expresses "signal strength" without implying good/bad.
 * This matches the score ring's "magnitude, not verdict" philosophy.
 */
export function difficultyDotColor(level: string | null | undefined): string {
  switch ((level ?? "").toLowerCase()) {
    case "low":
      return "var(--color-level-low)"; /* zinc-400 — weak signal */
    case "medium":
      return "var(--color-level-medium)"; /* teal-600 */
    case "high":
      return "var(--color-level-high)"; /* teal-700 — strong signal */
    default:
      return "var(--color-text-muted)";
  }
}

/**
 * Human-readable label for a difficulty/competition level. The raw field names
 * ("high replication", "medium competition") are jargon — this maps them to
 * plain-English phrases a casual visitor understands at a glance:
 *
 *   replication  → how hard to build a similar product
 *     low → "Easy to copy"   medium → "Medium to copy"   high → "Hard to copy"
 *   competition  → how crowded the space is
 *     low → "Few competitors"   medium → "Some competition"   high → "Crowded space"
 */
export function difficultyLabel(
  level: string | null | undefined,
  kind: "replication" | "competition",
): string {
  const lvl = (level ?? "").toLowerCase();
  if (kind === "replication") {
    switch (lvl) {
      case "low":
        return "Easy to copy";
      case "medium":
        return "Medium to copy";
      case "high":
        return "Hard to copy";
      default:
        return "Unknown replication";
    }
  }
  switch (lvl) {
    case "low":
      return "Few competitors";
    case "medium":
      return "Some competition";
    case "high":
      return "Crowded space";
    default:
      return "Unknown competition";
  }
}

/** Compact number formatting, e.g. 54291 -> "54.3K". */
export function compactNum(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

/** Google favicon URL for a domain (used in cards/detail headers). */
export function faviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
}

/** External site URL for a domain. */
export function siteUrl(domain: string): string {
  return `https://${domain}`;
}

/**
 * True if a domain's `first_seen` is within the last `days` days — used to
 * flag a "NEW" pill. Returns false for missing/invalid dates.
 */
export function isNew(
  firstSeen: string | null | undefined,
  days = 7,
  now: number = Date.now(),
): boolean {
  if (!firstSeen) return false;
  const t = new Date(firstSeen).getTime();
  if (Number.isNaN(t)) return false;
  return now - t < days * 24 * 60 * 60 * 1000;
}

/** The first character (uppercased) of a domain, used as a favicon letter fallback. */
export function domainLetter(domain: string): string {
  const cleaned = domain.replace(/^www\./, "").trim();
  if (!cleaned) return "?";
  return cleaned[0].toUpperCase();
}
