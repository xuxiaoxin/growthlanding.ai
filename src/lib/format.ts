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

/** Color class for a category badge. */
export function categoryColor(category: string | null | undefined): string {
  if (!category) return "bg-border/40 text-text-secondary";
  // Hash the category to a small palette for visual variety.
  const palette = [
    "bg-primary/15 text-primary",
    "bg-accent2/15 text-accent2",
    "bg-success/15 text-success",
    "bg-warning/15 text-warning",
    "bg-accent/15 text-accent",
  ];
  let h = 0;
  for (let i = 0; i < category.length; i++) h = (h * 31 + category.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

/** Color class for a replication/competition difficulty badge. */
export function difficultyColor(
  level: string | null | undefined,
): string {
  switch (level) {
    case "low":
      return "bg-success/15 text-success";
    case "medium":
      return "bg-warning/15 text-warning";
    case "high":
      return "bg-error/15 text-error";
    default:
      return "bg-border/40 text-text-muted";
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
