/**
 * A compact row of signal icons for a leaderboard card.
 * Each icon reflects a three-state boolean (yes/no/unknown). Unknown signals
 * render dimmed so the card stays readable when data is sparse.
 */

import type { DomainItem } from "@/types";

interface Props {
  item: Pick<
    DomainItem,
    | "has_pricing_page"
    | "has_payment_sdk"
    | "payment_provider"
    | "has_adsense"
    | "survival_status"
    | "detected_lang"
    | "business_model"
  >;
}

interface Signal {
  label: string;
  icon: string;
  active: boolean | null; // null = unknown
  detail?: string;
}

export default function SignalBadges({ item }: Props) {
  const signals: Signal[] = [
    {
      label: "Pricing page",
      icon: "💲",
      active: item.has_pricing_page,
    },
    {
      label: item.payment_provider ? `Payment: ${item.payment_provider}` : "Payment SDK",
      icon: "💳",
      active: item.has_payment_sdk,
      detail: item.payment_provider ?? undefined,
    },
    {
      label: "AdSense",
      icon: "📰",
      active: item.has_adsense,
    },
    {
      label: item.survival_status === "dead" ? "Dead" : "Alive",
      icon: item.survival_status === "dead" ? "💀" : "●",
      active:
        item.survival_status === "alive"
          ? true
          : item.survival_status === "dead"
            ? false
            : null,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {item.business_model && (
        <span className="text-[10px] uppercase tracking-wide text-text-muted">
          {item.business_model}
        </span>
      )}
      {signals.map((s) => {
        const known = s.active !== null;
        return (
          <span
            key={s.label}
            title={s.label}
            className={`inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-md border ${
              known
                ? s.active
                  ? "border-border text-text-secondary"
                  : "border-border/40 text-text-muted line-through"
                : "border-border/20 text-text-muted/40"
            }`}
          >
            <span>{s.icon}</span>
            {s.detail && (
              <span className="text-[10px] text-text-secondary">{s.detail}</span>
            )}
          </span>
        );
      })}
      {item.detected_lang && (
        <span className="text-[10px] uppercase tracking-wide text-text-muted ml-1">
          {item.detected_lang}
        </span>
      )}
    </div>
  );
}
