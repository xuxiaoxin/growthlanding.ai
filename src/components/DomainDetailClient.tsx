/**
 * DomainDetailClient — the full detail view for one domain (client component).
 *
 * Loads the domain's detail from the sharded JSON (one fetch by first char),
 * then renders the header, opportunity-score breakdown, detected signals,
 * and evolution (t0→t14) panels.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DomainDetail } from "@/types";
import { fetchDetail } from "@/lib/data";
import ScoreBar from "./ScoreBar";
import {
  faviconUrl,
  siteUrl,
  scorePct,
  formatDate,
  relativeTime,
  titleCase,
  categoryColor,
  difficultyColor,
  triBoolLabel,
} from "@/lib/format";

interface Props {
  domain: string;
}

interface FieldRow {
  label: string;
  value: string;
  hint?: string;
}

export default function DomainDetailClient({ domain }: Props) {
  const [detail, setDetail] = useState<DomainDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // setState calls happen in async callbacks, not synchronously in the body.
    Promise.resolve()
      .then(() => fetchDetail(domain))
      .then((d) => {
        if (cancelled) return;
        if (!d) setNotFound(true);
        else setDetail(d);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [domain]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="bg-card border border-border rounded-xl p-6 h-96 animate-pulse" />
      </div>
    );
  }

  if (notFound || !detail) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-text-primary text-lg font-semibold">{domain}</p>
        <p className="text-text-muted mt-2">
          No analysis data found for this domain.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 px-5 py-2 rounded-xl border border-border hover:border-primary/40 text-text-secondary hover:text-primary transition-all text-sm"
        >
          ← Back to leaderboard
        </Link>
      </div>
    );
  }

  const businessSignals: FieldRow[] = [
    { label: "Business model", value: titleCase(detail.business_model) || "Unknown" },
    {
      label: "Pricing page",
      value: triBoolLabel(detail.has_pricing_page, { yes: "Found", no: "None", unknown: "Unknown" }),
    },
    {
      label: "Upgrade CTA",
      value: triBoolLabel(detail.has_upgrade_cta, { yes: "Found", no: "None", unknown: "Unknown" }),
    },
    {
      label: "Payment SDK",
      value: detail.payment_provider
        ? detail.payment_provider
        : triBoolLabel(detail.has_payment_sdk),
    },
    {
      label: "Checkout",
      value: triBoolLabel(detail.checkout_detected, { yes: "Detected", no: "None", unknown: "Unknown" }),
    },
    {
      label: "AdSense",
      value: triBoolLabel(detail.has_adsense),
    },
  ];

  const techSignals: FieldRow[] = [
    { label: "DNS richness", value: detail.dns_richness != null ? `${detail.dns_richness} / 6` : "Unknown" },
    { label: "Page count", value: detail.page_count != null ? String(detail.page_count) : "Unknown" },
    { label: "Internal links", value: detail.internal_links != null ? String(detail.internal_links) : "Unknown" },
    { label: "Sitemap URLs", value: detail.sitemap_url_count != null ? String(detail.sitemap_url_count) : "Unknown" },
    { label: "Language", value: detail.detected_lang ? detail.detected_lang.toUpperCase() : "Unknown" },
    { label: "Tranco top 1M", value: triBoolLabel(detail.tranco_in_top_1m, { yes: "Yes", no: "No", unknown: "Unknown" }) },
    {
      label: "Public analytics",
      value: detail.public_analytics_provider
        ? detail.public_analytics_provider
        : triBoolLabel(detail.has_public_analytics),
    },
  ];

  const survivalSignals: FieldRow[] = [
    { label: "Status", value: titleCase(detail.survival_status) || "Unknown" },
    { label: "Alive @30d", value: triBoolLabel(detail.alive_30d) },
    { label: "Alive @90d", value: triBoolLabel(detail.alive_90d) },
    { label: "Alive @180d", value: triBoolLabel(detail.alive_180d) },
    { label: "Monetized @90d", value: triBoolLabel(detail.monetized_at_90d) },
    { label: "CrUX in corpus", value: triBoolLabel(detail.crux_in_corpus) },
  ];

  const evolutionSignals: FieldRow[] = [
    {
      label: "Launched (t0→t14)",
      value: triBoolLabel(detail.launched_between_t0_t14, { yes: "Yes", no: "No", unknown: "Not measured" }),
    },
    {
      label: "Monetization appeared",
      value: triBoolLabel(detail.monetization_appeared, { yes: "Yes", no: "No", unknown: "Not measured" }),
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
      >
        ← Leaderboard
      </Link>

      {/* Header card */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={faviconUrl(domain)}
            alt=""
            width={56}
            height={56}
            className="shrink-0 w-14 h-14 rounded-xl bg-background border border-border object-contain p-1.5"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-text-primary">{domain}</h1>
              {detail.category && (
                <span className={`text-xs px-2 py-0.5 rounded-md ${categoryColor(detail.category)}`}>
                  {titleCase(detail.category)}
                </span>
              )}
            </div>
            {detail.subcategory && (
              <p className="text-text-secondary text-sm mt-1">{detail.subcategory}</p>
            )}
            {detail.summary && (
              <p className="text-text-secondary mt-2">{detail.summary}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {detail.replication_difficulty && (
                <span className={`text-xs px-2 py-0.5 rounded-md ${difficultyColor(detail.replication_difficulty)}`}>
                  {detail.replication_difficulty} replication
                </span>
              )}
              {detail.competition_level && (
                <span className={`text-xs px-2 py-0.5 rounded-md ${difficultyColor(detail.competition_level)}`}>
                  {detail.competition_level} competition
                </span>
              )}
              {detail.unique_data_dependency !== null && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-border/40 text-text-secondary">
                  {detail.unique_data_dependency ? "Unique data dep" : "No data dep"}
                </span>
              )}
              {detail.llm_confidence != null && (
                <span className="text-xs text-text-muted">
                  LLM conf {Math.round(detail.llm_confidence * 100)}%
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-3xl font-bold text-accent2 tabular-nums">
              {scorePct(detail.score)}
            </div>
            <div className="text-[10px] text-text-muted uppercase tracking-wide">
              opportunity
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border/50">
          <a
            href={siteUrl(domain)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors"
          >
            Visit site ↗
          </a>
          <div className="text-xs text-text-muted text-right">
            <div>Discovered {formatDate(detail.first_seen)}</div>
            <div className="text-text-muted/70">{relativeTime(detail.first_seen)}</div>
          </div>
        </div>
      </div>

      {/* Score breakdown */}
      <section className="mt-6 bg-card border border-border rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-4">
          Opportunity score breakdown
        </h2>
        <ScoreBar breakdown={detail.score_breakdown} />
      </section>

      {/* Signal panels */}
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <SignalPanel title="Business & monetization" rows={businessSignals} />
        <SignalPanel title="Technical signals" rows={techSignals} />
        <SignalPanel title="Survival" rows={survivalSignals} />
        <SignalPanel title="Evolution (t0 → t14)" rows={evolutionSignals} />
      </div>

      {detail.safety_flag && detail.safety_flag !== "clean" && (
        <div className="mt-6 bg-error/10 border border-error/30 rounded-xl p-4 text-sm text-error">
          ⚠️ Safe Browsing flag: <strong>{detail.safety_flag}</strong>
        </div>
      )}

      <p className="text-[11px] text-text-muted mt-8 text-center">
        Pipeline stage: {detail.pipeline_stage || "unknown"} · Analysis is
        automated and heuristic, not an endorsement.
      </p>
    </div>
  );
}

function SignalPanel({ title, rows }: { title: string; rows: FieldRow[] }) {
  return (
    <section className="bg-card border border-border rounded-2xl p-5">
      <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
        {title}
      </h3>
      <dl className="space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-3 text-sm">
            <dt className="text-text-muted shrink-0">{r.label}</dt>
            <dd className="text-text-primary text-right truncate">{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
