/**
 * StatsBar — the headline numbers strip under the header.
 * v2 design: a single bordered card divided into 4 columns (instead of 4
 * separate cards), so it reads as one instrument panel.
 */

import type { Stats } from "@/types";
import { compactNum } from "@/lib/format";

interface Props {
  stats: Stats | null;
}

export default function StatsBar({ stats }: Props) {
  const items = [
    { label: "Curated sites", value: stats?.total_featured },
    { label: "Discovered 7d", value: stats?.discovered_7d },
    { label: "Total scored", value: stats?.total_scored },
    { label: "Alive", value: stats?.alive },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 bg-card border border-border rounded-[14px] shadow-[0_1px_2px_rgba(24,24,27,0.04),0_1px_3px_rgba(24,24,27,0.05)] overflow-hidden">
      {items.map((it, i) => (
        <div
          key={it.label}
          className={`px-[22px] py-[18px] ${
            i < items.length - 1
              ? "sm:border-r border-border"
              : ""
          } ${
            // 2x2 grid on mobile: bottom borders on the top row
            i < 2 ? "border-b sm:border-b-0" : ""
          }`}
        >
          <div className="text-[27px] font-bold tracking-tight tabular-nums text-text-primary">
            {compactNum(it.value)}
          </div>
          <div className="text-xs text-text-muted mt-[3px]">{it.label}</div>
        </div>
      ))}
    </div>
  );
}
