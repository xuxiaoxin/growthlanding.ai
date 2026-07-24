/**
 * ScoreBar — renders the opportunity-score composition as horizontal bars.
 * Each component's contribution (0..maxWeight) is shown with its value.
 * Used on the detail page.
 */

import type { ScoreBreakdown } from "@/types";

interface Props {
  breakdown: ScoreBreakdown | null;
}

// Display config: label + the max possible contribution for that component
// (from opportunity_score.py weight constants). Lets us scale each bar.
const COMPONENTS: { key: keyof ScoreBreakdown; label: string; max: number }[] = [
  { key: "dns_richness", label: "DNS richness", max: 0.2 },
  { key: "pricing_page", label: "Pricing page", max: 0.2 },
  { key: "saas_model", label: "SaaS model", max: 0.15 },
  { key: "ai_category", label: "AI/SaaS category", max: 0.1 },
  { key: "page_scale", label: "Page scale", max: 0.15 },
  { key: "payment_filtered", label: "Payment (filtered)", max: 0.1 },
  { key: "checkout", label: "Checkout", max: 0.05 },
  { key: "survival_alive", label: "Survival alive", max: 0.05 },
];

export default function ScoreBar({ breakdown }: Props) {
  if (!breakdown) {
    return (
      <p className="text-text-muted text-sm">No score breakdown available.</p>
    );
  }

  return (
    <div className="space-y-2">
      {COMPONENTS.map(({ key, label, max }) => {
        const val = (breakdown[key] as number) ?? 0;
        const pct = max > 0 ? Math.min(100, (val / max) * 100) : 0;
        const earned = val > 0.0001;
        return (
          <div key={key} className="flex items-center gap-3 text-xs">
            <span className="w-32 shrink-0 text-text-secondary text-right">
              {label}
            </span>
            <div className="flex-1 h-2 rounded-full bg-card overflow-hidden border border-border/50">
              <div
                className={`h-full rounded-full transition-all ${
                  earned ? "bg-gradient-to-r from-primary to-accent" : "bg-transparent"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-14 shrink-0 font-mono text-text-muted text-right">
              {val.toFixed(2)}
            </span>
          </div>
        );
      })}
      <div className="flex items-center gap-3 text-xs pt-2 border-t border-border/50 mt-3">
        <span className="w-32 shrink-0 text-text-primary font-semibold text-right">
          Total
        </span>
        <div className="flex-1" />
        <span className="w-14 shrink-0 font-mono text-accent2 font-bold text-right">
          {((breakdown._total ?? 0) * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}
