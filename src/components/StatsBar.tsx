/**
 * StatsBar — the headline numbers strip under the header.
 * Shows discovery / corpus size / enrichment counts from stats.json.
 */

import type { Stats } from "@/types";
import { compactNum, relativeTime } from "@/lib/format";

interface Props {
  stats: Stats | null;
}

export default function StatsBar({ stats }: Props) {
  const items = [
    { label: "Discovered today", value: stats?.discovered_today },
    { label: "Last 7 days", value: stats?.discovered_7d },
    { label: "Total tracked", value: stats?.total_domains },
    { label: "LLM analyzed", value: stats?.total_llm_enriched },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((it) => (
          <div
            key={it.label}
            className="bg-card border border-border rounded-xl px-4 py-3"
          >
            <div className="text-2xl font-bold text-text-primary">
              {compactNum(it.value)}
            </div>
            <div className="text-xs text-text-secondary mt-0.5">
              {it.label}
            </div>
          </div>
        ))}
      </div>
      {stats?.generated_at && (
        <p className="text-[11px] text-text-muted mt-3 text-center">
          Data updated {relativeTime(stats.generated_at)} · alive{" "}
          {compactNum(stats.alive)} / dead {compactNum(stats.dead)}
        </p>
      )}
    </section>
  );
}
