/**
 * TabSwitch — toggle between the Featured (LLM-enriched) and All (scored)
 * leaderboards. A segmented control.
 */

"use client";

export type Tab = "featured" | "all";

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
  featuredCount?: number;
  allCount?: number;
}

export default function TabSwitch({
  active,
  onChange,
  featuredCount,
  allCount,
}: Props) {
  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "featured", label: "Featured", count: featuredCount },
    { key: "all", label: "All", count: allCount },
  ];

  return (
    <div className="inline-flex items-center bg-card border border-border rounded-xl p-1">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            active === t.key
              ? "bg-primary text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {t.label}
          {t.count !== undefined && (
            <span
              className={`ml-1.5 text-xs ${
                active === t.key ? "text-white/70" : "text-text-muted"
              }`}
            >
              {t.count.toLocaleString()}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
