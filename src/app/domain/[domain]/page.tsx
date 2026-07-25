/**
 * Detail page for a single domain (Server Component).
 *
 * Statically generated at build time for every featured domain (via
 * generateStaticParams). dynamicParams = false means non-featured domains
 * return 404 rather than being rendered on demand. Content is baked into
 * static HTML for SEO and instant loads.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { getDetail, getFeaturedDomains } from "@/lib/data-server";
import {
  faviconUrl,
  siteUrl,
  scorePct,
  formatDate,
  relativeTime,
  titleCase,
  categoryColor,
  difficultyColor,
} from "@/lib/format";

export const dynamicParams = false;

export async function generateStaticParams() {
  const domains = await getFeaturedDomains();
  return domains.map((domain) => ({ domain }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  const d = decodeURIComponent(domain);
  const detail = await getDetail(d);
  const desc =
    detail?.summary ??
    `Opportunity analysis for ${d}: what it does and why it's worth studying.`;
  return {
    title: `${d} — GrowthRadar`,
    description: desc,
  };
}

export default async function DomainPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain: rawDomain } = await params;
  const domain = decodeURIComponent(rawDomain);
  const detail = await getDetail(domain);
  if (!detail) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 pb-16">
        <DetailBody domain={domain} detail={detail} />
      </main>
    </>
  );
}

function DetailBody({
  domain,
  detail,
}: {
  domain: string;
  detail: NonNullable<Awaited<ReturnType<typeof getDetail>>>;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
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

      {/* Description */}
      {detail.description && (
        <Section icon="📖" title="What it does">
          <p className="text-text-secondary leading-relaxed">{detail.description}</p>
        </Section>
      )}

      {/* Key features */}
      {detail.key_features.length > 0 && (
        <Section icon="✨" title="Core features">
          <ul className="grid sm:grid-cols-2 gap-2">
            {detail.key_features.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-text-secondary bg-background/50 border border-border/50 rounded-lg px-3 py-2"
              >
                <span className="text-accent2 mt-0.5">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Target users + why interesting */}
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        {detail.target_users && (
          <Section icon="🎯" title="Who it's for">
            <p className="text-sm text-text-secondary">{detail.target_users}</p>
          </Section>
        )}
        {detail.why_interesting && (
          <Section icon="💡" title="Why it's worth studying">
            <p className="text-sm text-text-secondary">{detail.why_interesting}</p>
          </Section>
        )}
      </div>

      {/* Meta */}
      <Section icon="ℹ️" title="Details">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <MetaRow label="Status" value={titleCase(detail.survival_status) || "Unknown"} />
          <MetaRow label="Category" value={titleCase(detail.category) || "Unknown"} />
          <MetaRow label="Subcategory" value={detail.subcategory || "—"} />
          <MetaRow label="Business model" value={titleCase(detail.business_model) || "Unknown"} />
        </dl>
      </Section>

      <p className="text-[11px] text-text-muted mt-8 text-center">
        Analysis is automated (LLM-assisted) and heuristic, not an endorsement.
      </p>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 bg-card border border-border rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-3">
        {icon} {title}
      </h2>
      {children}
    </section>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-text-muted shrink-0">{label}</dt>
      <dd className="text-text-primary text-right truncate">{value}</dd>
    </div>
  );
}
