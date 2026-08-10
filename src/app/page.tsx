/**
 * Home = the featured leaderboard. Server Component: data is read at build
 * time via lib/data-server and baked into static HTML (SEO-friendly, instant).
 *
 * SEO structure:
 *  - <h1> lives here (the hero), carrying the core keywords.
 *  - ItemList JSON-LD is injected at the end so every detail page is also
 *    described as a list item to search engines (rich-result eligible).
 */

import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import Leaderboard from "@/components/Leaderboard";
import SiteFooter from "@/components/SiteFooter";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";
import { getCategories, getFeatured, getStats } from "@/lib/data-server";
import { relativeTime } from "@/lib/format";

const SITE_ORIGIN = "https://growthlanding.ai";

export default async function HomePage() {
  const [featured, stats, categories] = await Promise.all([
    getFeatured(),
    getStats(),
    getCategories(),
  ]);

  // ItemList structured data — describes the whole leaderboard to crawlers.
  // (Kept to the full list so it matches the in-HTML internal links.)
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "GrowthRadar — Top SaaS & AI opportunities",
    numberOfItems: featured.total,
    itemListElement: featured.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_ORIGIN}/opportunity/${encodeURIComponent(it.domain)}`,
      name: it.domain,
    })),
  };

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1 pb-16">
        {/* Hero — carries the H1 + core keywords (fixes "no H1 on home").
            Desktop: title on the left, newsletter subscribe on the right.
            Mobile (<lg): stacks vertically (title, then subscribe, then stats). */}
        <section className="mx-auto max-w-5xl px-4 pt-14">
          {stats?.generated_at && (
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-accent-ink bg-accent-soft px-3 py-[5px] rounded-full">
              <span className="w-[7px] h-[7px] rounded-full bg-accent animate-pulse-dot" />
              Updated {relativeTime(stats.generated_at)} ·{" "}
              {featured.total.toLocaleString()} curated
            </span>
          )}
          <div className="mt-[18px] flex flex-col lg:flex-row lg:items-start lg:gap-10">
            <div className="lg:flex-1 lg:min-w-0">
              <h1 className="text-[34px] sm:text-[38px] leading-[1.12] tracking-[-0.035em] font-extrabold text-text-primary max-w-[20ch]">
                Find online business models already showing{" "}
                <em className="not-italic text-accent-ink">early market signals</em>.
              </h1>
              <p className="text-text-secondary text-[15.5px] max-w-[580px] mt-3">
                GrowthRadar tracks newly launched SaaS and AI products, then ranks
                the ones with early business signals and solo-founder-friendly
                execution paths — updated daily.
              </p>
            </div>
            {/* Newsletter subscribe — primary placement on the home hero.
                The most visible entry point; footer copy was removed to
                avoid duplication. */}
            <div className="mt-6 lg:mt-1 lg:w-[340px] shrink-0 rounded-[14px] border border-border bg-card/60 p-5">
              <p className="text-sm font-semibold text-text-primary">
                Weekly digest, free
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-text-muted">
                The best new SaaS &amp; AI launches worth studying — one email
                per week.
              </p>
              <div className="mt-3">
                <NewsletterSubscribe source="newsletter_hero" />
              </div>
            </div>
          </div>

          <div className="mt-[34px]">
            <StatsBar stats={stats} />
          </div>
        </section>

        {/* Leaderboard */}
        <section className="mx-auto max-w-5xl px-4 mt-11">
          <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
            <h2 className="text-xl font-bold tracking-tight text-text-primary">
              Top opportunities
            </h2>
            <span className="text-[12.5px] text-text-muted">
              {featured.total.toLocaleString()} curated sites, ranked for
              solo founders
            </span>
          </div>

          {featured.items.length === 0 ? (
            <p className="text-text-muted text-center py-20">No domains yet.</p>
          ) : (
            <Leaderboard items={featured.items} total={featured.total} />
          )}
        </section>
      </main>
      <SiteFooter categories={categories} total={featured.total} />

      {/* ItemList structured data for the leaderboard. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
    </>
  );
}
