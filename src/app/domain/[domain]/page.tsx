/**
 * Detail page for a single domain (Server Component).
 *
 * Statically generated at build time for every featured domain (via
 * generateStaticParams). dynamicParams = false means non-featured domains
 * return 404 rather than being rendered on demand. Content is baked into
 * static HTML for SEO and instant loads.
 *
 * SEO:
 *  - canonical + per-page title/description
 *  - thin pages (no description AND not alive) get noindex,follow
 *  - SoftwareApplication + BreadcrumbList JSON-LD for rich results
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Favicon from "@/components/Favicon";
import { getDetail, getFeaturedDomains } from "@/lib/data-server";
import {
  siteUrl,
  scorePct,
  formatDate,
  relativeTime,
  titleCase,
  difficultyDotColor,
  difficultyLabel,
  scoreRingFill,
  scoreRingDash,
} from "@/lib/format";

export const dynamicParams = false;

const SITE_ORIGIN = "https://growthlanding.ai";

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
  // Thin content (no description AND not alive) → keep out of the index but
  // still follow links so internal link equity still flows.
  const thin = !detail?.description && detail?.survival_status !== "alive";
  const categorySuffix = detail?.category ? ` ${titleCase(detail.category)}` : "";
  // Title here feeds layout.tsx's `title.template: "%s | GrowthRadar"`, so we
  // return only the body and let the template append the site name. (OG/Twitter
  // don't use the template, so they get the full hand-written title.)
  const titleBody = `${d}${categorySuffix}`;
  const fullTitle = `${titleBody} — GrowthRadar`;
  return {
    title: titleBody,
    description: desc,
    alternates: { canonical: `/domain/${encodeURIComponent(d)}` },
    robots: thin
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description: desc,
      url: `${SITE_ORIGIN}/domain/${encodeURIComponent(d)}`,
      siteName: "GrowthRadar",
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: ["/og.png"],
    },
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
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1 pb-16">
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
  const fill = scoreRingFill(detail.score);
  const ringR = 26;
  const viewBox = 64;
  const { dasharray, dashoffset } = scoreRingDash(fill, ringR);

  // Structured data: describe the product (SoftwareApplication) + breadcrumb.
  const canonical = `${SITE_ORIGIN}/domain/${encodeURIComponent(domain)}`;
  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: domain,
    applicationCategory: detail.category
      ? titleCase(detail.category)
      : "WebApplication",
    url: siteUrl(domain),
    description:
      detail.summary ??
      detail.description ??
      `Opportunity analysis for ${domain}.`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Leaderboard",
        item: SITE_ORIGIN,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: domain,
        item: canonical,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
      >
        ← Leaderboard
      </Link>

      {/* Header card */}
      <div className="bg-card border border-border rounded-[14px] p-6">
        <div className="flex items-start gap-4">
          <Favicon domain={domain} tileClassName="w-14 h-14 rounded-[14px]" size={48} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold text-text-primary">{domain}</h1>
              {detail.category && (
                <span className="text-[11px] font-semibold px-2 py-[2px] rounded-full bg-stone-100 text-stone-700">
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
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
              {detail.replication_difficulty && (
                <DifficultyTag
                  level={detail.replication_difficulty}
                  label="replication"
                />
              )}
              {detail.competition_level && (
                <DifficultyTag
                  level={detail.competition_level}
                  label="competition"
                />
              )}
              {detail.unique_data_dependency !== null && (
                <span className="text-xs text-text-muted">
                  {detail.unique_data_dependency ? "Unique data dep" : "No data dep"}
                </span>
              )}
            </div>
          </div>
          {/* Score as a teal magnitude ring (consistent with the leaderboard). */}
          <div className="shrink-0">
            <svg
              width={viewBox}
              height={viewBox}
              viewBox={`0 0 ${viewBox} ${viewBox}`}
              role="img"
              aria-label={`Opportunity score ${scorePct(detail.score)}`}
            >
              <circle
                cx={viewBox / 2}
                cy={viewBox / 2}
                r={ringR}
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="4"
              />
              <circle
                cx={viewBox / 2}
                cy={viewBox / 2}
                r={ringR}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={dasharray}
                strokeDashoffset={dashoffset}
                transform={`rotate(-90 ${viewBox / 2} ${viewBox / 2})`}
              />
              <text
                x={viewBox / 2}
                y={viewBox / 2}
                fontSize="15"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-text-primary tabular-nums"
              >
                {scorePct(detail.score)}
              </text>
            </svg>
            <div className="text-[10px] text-text-muted uppercase tracking-wider text-center mt-1">
              opportunity
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border">
          <a
            href={siteUrl(domain)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-4 py-2.5 rounded-[10px] bg-accent hover:bg-accent-ink text-white text-sm font-medium transition-colors"
          >
            Visit site ↗
          </a>
          <div className="text-xs text-text-muted text-right">
            <div>Discovered {formatDate(detail.first_seen)}</div>
            <div className="text-text-muted">{relativeTime(detail.first_seen)}</div>
          </div>
        </div>
      </div>

      {/* Description */}
      {detail.description && (
        <Section title="What it does">
          <p className="text-text-secondary leading-relaxed max-w-3xl">
            {detail.description}
          </p>
        </Section>
      )}

      {/* Key features */}
      {detail.key_features.length > 0 && (
        <Section title="Core features">
          <ul className="grid sm:grid-cols-2 gap-2">
            {detail.key_features.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-text-secondary bg-background border border-border rounded-[10px] px-3 py-2"
              >
                <span className="text-text-muted mt-0.5">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Target users + why interesting */}
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        {detail.target_users && (
          <Section title="Who it's for">
            <p className="text-sm text-text-secondary">{detail.target_users}</p>
          </Section>
        )}
        {detail.why_interesting && (
          <Section title="Why it's worth studying">
            <p className="text-sm text-text-secondary">{detail.why_interesting}</p>
          </Section>
        )}
      </div>

      {/* Meta */}
      <Section title="Details">
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

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </div>
  );
}

/** Small dot + muted label — renders a plain-English difficulty/competition phrase. */
function DifficultyTag({
  level,
  label,
}: {
  level: string;
  label: "replication" | "competition";
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: difficultyDotColor(level) }}
      />
      <span className="text-xs text-text-muted">
        {difficultyLabel(level, label)}
      </span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 bg-card border border-border rounded-[14px] p-6">
      <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
        {title}
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
