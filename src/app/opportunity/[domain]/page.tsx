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
import SiteFooter from "@/components/SiteFooter";
import DetailPageViewTracker from "@/components/DetailPageViewTracker";
import OutboundLink from "@/components/OutboundLink";
import CategoryLink from "@/components/CategoryLink";
import WatchlistButton from "@/components/WatchlistButton";
import type { DomainItem } from "@/types";
import { getDetail, getFeaturedDomains, getFeaturedTotal, getRelatedByCategory, getCategories } from "@/lib/data-server";
import {
  siteUrl,
  scorePct,
  formatDate,
  relativeTime,
  titleCase,
  faviconUrl,
  difficultyDotColor,
  difficultyLabel,
  scoreRingFill,
  scoreRingDash,
} from "@/lib/format";
import { categoryPlural } from "@/lib/categories";
import {
  buildDetailTitleBody,
  buildDetailFullTitle,
  buildDetailDescription,
} from "@/lib/seo";

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
  // Thin content (no description) → keep out of the index but still follow
  // links so internal link equity still flows. Tightened from the old
  // "!description && not alive" rule: an alive page with only a ~12-word
  // summary is still too thin to spend crawl budget on, regardless of status.
  const thin = !detail?.description;
  // Title body feeds layout.tsx's `title.template: "%s | GrowthRadar"`, so we
  // return only the body and let the template append the site name. (OG/Twitter
  // don't use the template, so they get the full hand-written title.) The body
  // is built by src/lib/seo.ts, which applies the target_users 3-layer fallback
  // and truncates to the SERP length budget. See SPEC-001 Part A.
  const titleBody = buildDetailTitleBody({
    domain: d,
    category: detail?.category,
    targetUsers: detail?.target_users,
    difficulty: detail?.replication_difficulty,
  });
  const fullTitle = buildDetailFullTitle(titleBody);
  const desc = buildDetailDescription(detail?.summary, d);
  return {
    title: titleBody,
    description: desc,
    alternates: { canonical: `/opportunity/${encodeURIComponent(d)}` },
    robots: thin
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description: desc,
      url: `${SITE_ORIGIN}/opportunity/${encodeURIComponent(d)}`,
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

  // Related sites (same category, excluding self) + category list for the
  // shared footer. All build-time reads from the static JSON.
  const [related, categories, total] = await Promise.all([
    getRelatedByCategory(domain, detail.category, 6),
    getCategories(),
    getFeaturedTotal(),
  ]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1 pb-16">
        <DetailBody domain={domain} detail={detail} related={related} />
      </main>
      <SiteFooter categories={categories} total={total} />
    </>
  );
}

function DetailBody({
  domain,
  detail,
  related,
}: {
  domain: string;
  detail: NonNullable<Awaited<ReturnType<typeof getDetail>>>;
  related: DomainItem[];
}) {
  const fill = scoreRingFill(detail.score);
  const ringR = 26;
  const viewBox = 64;
  const { dasharray, dashoffset } = scoreRingDash(fill, ringR);
  // Mirrors the generateMetadata noindex rule: no description → too thin to
  // show the (skipped) content sections, so we render a fallback card instead.
  const isThin = !detail.description;

  // Structured data: describe the product (SoftwareApplication) + breadcrumb.
  const canonical = `${SITE_ORIGIN}/opportunity/${encodeURIComponent(domain)}`;
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
    // 3-segment trail when a category is present (Home › Category › Domain),
    // 2-segment fallback (Home › Domain) otherwise — kept in lockstep with the
    // visible breadcrumb below so schema and UI never disagree.
    itemListElement: detail.category
      ? [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_ORIGIN}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: categoryPlural(detail.category),
            item: `${SITE_ORIGIN}/category/${encodeURIComponent(detail.category)}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: domain,
            item: canonical,
          },
        ]
      : [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_ORIGIN}/`,
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
      {/* GA4 detail_page_view — fires once on mount. Placed at the top of the
          DetailBody return so it's independent of any downstream restructuring
          of the sections below. */}
      <DetailPageViewTracker domain={domain} category={detail.category} subcategory={detail.subcategory} />
      {/* Visible breadcrumb — mirrors BreadcrumbList JSON-LD exactly so the
          on-page trail and the rich-result schema never disagree. The current
          domain is a plain (non-clickable) span; Home and Category are links. */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-text-muted">
          <li>
            <Link
              href="/"
              className="hover:text-text-primary transition-colors"
            >
              Home
            </Link>
          </li>
          {detail.category && (
            <>
              <li aria-hidden className="text-text-muted">›</li>
              <li>
                <CategoryLink
                  category={detail.category}
                  className="hover:text-text-primary transition-colors"
                >
                  {categoryPlural(detail.category)}
                </CategoryLink>
              </li>
            </>
          )}
          <li aria-hidden className="text-text-muted">›</li>
          <li aria-current="page" className="text-text-secondary font-medium truncate max-w-[40ch]">
            {domain}
          </li>
        </ol>
      </nav>

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
              aria-label={`Fit score ${scorePct(detail.score)}`}
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

        <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-border">
          <OutboundLink
            href={siteUrl(domain)}
            domain={domain}
            category={detail.category}
            className="flex-1 min-w-[140px] text-center px-4 py-2.5 rounded-[10px] bg-accent hover:bg-accent-ink text-white text-sm font-medium transition-colors"
          >
            Visit site ↗
          </OutboundLink>
          {/* Watch toggle — a Client island. This page is SSG and must NOT call
              auth(), so the button is mounted with the default (unwatched)
              state; it reconciles to the true state on click via the server
              action (and via the optimistic UI). */}
          <WatchlistButton domain={domain} />
          <div className="text-xs text-text-muted text-right sm:ml-auto">
            <div>Discovered {formatDate(detail.first_seen)}</div>
            <div className="text-text-muted">{relativeTime(detail.first_seen)}</div>
          </div>
        </div>
      </div>

      {isThin ? (
        // Thin-page empty state — these domains have only a ~12-word summary,
        // so the content sections above would be skipped and the page would
        // collapse to Hero + a lone Details card. This fallback explains the
        // gap instead of leaving an awkward void (and the page is noindexed).
        <Section title="Full analysis coming soon">
          <div className="flex flex-col items-center text-center py-6 gap-3">
            <p className="text-text-secondary max-w-md">
              We&apos;re still analyzing{" "}
              <span className="font-semibold text-text-primary">{domain}</span>{" "}
              — a detailed breakdown (what it does, core features, who it&apos;s
              for) is being put together. In the meantime, here&apos;s the
              snapshot we have so far.
            </p>
            <Link
              href={
                detail.category
                  ? `/category/${encodeURIComponent(detail.category)}`
                  : "/"
              }
              className="text-sm font-medium text-accent-ink hover:text-accent transition-colors"
            >
              {detail.category
                ? `Browse more ${categoryPlural(detail.category).toLowerCase()} →`
                : "Back to leaderboard →"}
            </Link>
          </div>
        </Section>
      ) : (
        <>
          {/* 2. Opportunity Summary — the long-form description gives the
              reader the elevator pitch before the analytical sections. The
              summary also appears in the Header card as a one-line subhead, so
              we don't repeat it here. */}
          <Section title="Opportunity Summary">
            <p className="text-text-secondary leading-relaxed max-w-3xl">
              {detail.description}
            </p>
          </Section>

          {/* 3. Solo Founder Angle — derived from why_interesting, reframed for
              the solo-founder audience ("is this worth my time?"). */}
          {detail.why_interesting && (
            <Section title="Solo Founder Angle">
              <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
                {detail.why_interesting}
              </p>
            </Section>
          )}

          {/* 4. What to Study — derived from key_features; framed as the parts
              worth studying rather than a feature list. */}
          {detail.key_features.length > 0 && (
            <Section title="What to Study">
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

          {/* 5. Who it's for — derived from target_users. */}
          {detail.target_users && (
            <Section title="Who it's for">
              <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
                {detail.target_users}
              </p>
            </Section>
          )}

          {/* 6. Risks / Avoid If — text explanations of the risk signals that
              already surface as badges in the Header. Built as a list of risk
              factors derived from field values, so the section renders nothing
              when there are no signals (it is conditionally mounted below).
              Falls back to a positive "low-risk profile" note when all signals
              are low/absent, so the reader always gets a take-away. */}
          {(() => {
            const risks: string[] = [];
            if (detail.replication_difficulty === "high") {
              risks.push(
                "High replication difficulty — building this needs significant engineering or resources, which can be a real cost for a solo founder."
              );
            } else if (detail.replication_difficulty === "medium") {
              risks.push(
                "Moderate replication difficulty — expect non-trivial engineering effort to reach parity."
              );
            }
            if (detail.competition_level === "high") {
              risks.push(
                "Crowded market — many direct competitors already compete for the same users, so differentiation is hard."
              );
            } else if (detail.competition_level === "medium") {
              risks.push(
                "Moderate competition — several players are already active in this space, so a clear angle matters."
              );
            }
            if (detail.unique_data_dependency === true) {
              risks.push(
                "Unique data dependency — the product's advantage relies on data access that's hard to acquire from scratch."
              );
            }
            const hasRisks = risks.length > 0;
            return (
              <Section title="Risks / Avoid If">
                {hasRisks ? (
                  <ul className="flex flex-col gap-2 max-w-3xl">
                    {risks.map((r, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-text-secondary"
                      >
                        <span className="text-text-muted mt-0.5">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
                    Low-risk profile for a solo founder — small surface area and
                    no hard-to-acquire dependencies.
                  </p>
                )}
              </Section>
            );
          })()}
        </>
      )}

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
        For informational purposes only. Not an endorsement.
      </p>

      {/* Related sites — same-category internal links. The last link in the
          4-layer graph (detail → detail). Omit entirely when there's nothing
          to recommend (e.g. this domain is the only one in its category) so we
          never render an empty heading. */}
      {related.length > 0 && (
        <RelatedRail related={related} category={detail.category} />
      )}

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

/**
 * "Related {Category}" rail — same-category internal links, the last edge in
 * the 4-layer graph (detail → detail). Renders a section heading + a responsive
 * grid of compact cards. The cards echo the leaderboard card shape (favicon +
 * domain + summary + small score ring) but are server-rendered <Link>s, so they
 * are crawlable and instant.
 */
function RelatedRail({
  related,
  category,
}: {
  related: DomainItem[];
  category: string | null;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-baseline gap-2">
        {category ? `More ${categoryPlural(category)}` : "Related Opportunities"}
        <span className="text-xs font-normal text-text-muted">
          worth studying
        </span>
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {related.map((it) => (
          <li key={it.domain}>
            <RelatedCard item={it} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * A single related-site card. Server Component (no onError handler needed — the
 * favicon image tag degrades to a blank tile if Google's favicon service
 * returns nothing, which is acceptable here since these are secondary links).
 */
function RelatedCard({ item }: { item: DomainItem }) {
  const fill = scoreRingFill(item.score);
  const r = 13;
  const vb = 34;
  const { dasharray, dashoffset } = scoreRingDash(fill, r);
  return (
    <Link
      href={`/opportunity/${encodeURIComponent(item.domain)}`}
      className="group flex items-center gap-3 bg-card border border-border rounded-[12px] px-3 py-2.5 transition-colors hover:border-accent"
    >
      <div className="relative shrink-0 w-9 h-9 rounded-[10px] bg-stone-100 grid place-items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={faviconUrl(item.domain)}
          alt=""
          width={24}
          height={24}
          loading="lazy"
          decoding="async"
          className="w-[24px] h-[24px] rounded-[8px] object-contain"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-text-primary text-[14px] font-semibold truncate group-hover:text-accent-ink transition-colors">
          {item.domain}
        </div>
        <p className="text-[12.5px] text-text-muted truncate">
          {item.summary ?? (item.business_model ? titleCase(item.business_model) : "")}
        </p>
      </div>
      {/* Small score ring — single accent, magnitude only (same philosophy as
          the leaderboard). */}
      <svg
        width={vb}
        height={vb}
        viewBox={`0 0 ${vb} ${vb}`}
        className="shrink-0"
        role="img"
        aria-label={`Fit score ${scorePct(item.score)}`}
      >
        <circle
          cx={vb / 2}
          cy={vb / 2}
          r={r}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="3"
        />
        <circle
          cx={vb / 2}
          cy={vb / 2}
          r={r}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={dasharray}
          strokeDashoffset={dashoffset}
          transform={`rotate(-90 ${vb / 2} ${vb / 2})`}
        />
        <text
          x={vb / 2}
          y={vb / 2}
          fontSize="8"
          fontWeight="700"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-text-primary tabular-nums"
        >
          {scorePct(item.score)}
        </text>
      </svg>
    </Link>
  );
}
