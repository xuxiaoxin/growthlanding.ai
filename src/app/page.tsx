/**
 * Home = the featured leaderboard. Server Component: data is read at build
 * time via lib/data-server and baked into static HTML (SEO-friendly, instant).
 *
 * SEO structure:
 *  - <h1> lives here (the hero), carrying the core keywords.
 *  - ItemList JSON-LD is injected at the end so every detail page is also
 *    described as a list item to search engines (rich-result eligible).
 */

import Link from "next/link";
import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import Leaderboard from "@/components/Leaderboard";
import { getCategories, getFeatured, getStats } from "@/lib/data-server";
import { relativeTime } from "@/lib/format";
import { categoryPlural } from "@/lib/categories";

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
      url: `${SITE_ORIGIN}/domain/${encodeURIComponent(it.domain)}`,
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
        {/* Hero — carries the H1 + core keywords (fixes "no H1 on home"). */}
        <section className="mx-auto max-w-5xl px-4 pt-14">
          {stats?.generated_at && (
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-accent-ink bg-accent-soft px-3 py-[5px] rounded-full">
              <span className="w-[7px] h-[7px] rounded-full bg-accent animate-pulse-dot" />
              Updated {relativeTime(stats.generated_at)} ·{" "}
              {featured.total.toLocaleString()} curated
            </span>
          )}
          <h1 className="text-[34px] sm:text-[38px] leading-[1.12] tracking-[-0.035em] font-extrabold text-text-primary mt-[18px] max-w-[18ch]">
            The radar for rising{" "}
            <em className="not-italic text-accent-ink">SaaS &amp; AI</em>{" "}
            products.
          </h1>
          <p className="text-text-secondary text-[15.5px] max-w-[580px] mt-3">
            A daily-updated leaderboard of newly launched, worth-studying
            products — ranked by opportunity score and enriched with AI
            analysis.
          </p>

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
              {featured.total.toLocaleString()} curated sites, ranked by
              opportunity
            </span>
          </div>

          {featured.items.length === 0 ? (
            <p className="text-text-muted text-center py-20">No domains yet.</p>
          ) : (
            <Leaderboard items={featured.items} total={featured.total} />
          )}
        </section>
      </main>
      <footer className="border-t border-border py-6">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-text-muted">
          <p>
            GrowthRadar surfaces newly launched, worth-studying SaaS &amp; AI
            products. Rankings are for discovery only — not endorsements.
          </p>
          <p className="mt-1">
            Data refreshed daily from the{" "}
            <span className="text-text-secondary">monitors + analyzers</span>{" "}
            pipeline.
          </p>
          {/* Category entry points — static internal links so crawlers and
              users can reach every category hub page from the homepage. The
              leaderboard chips above stay client-side filters (instant UX);
              this section is the crawlable gateway to /category/[cat]. */}
          <nav className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1.5">
            <span className="text-text-muted">Browse by category:</span>
            {categories.slice(0, 8).map((c) => (
              <Link
                key={c.category}
                href={`/category/${encodeURIComponent(c.category)}`}
                className="text-text-secondary hover:text-accent-ink transition-colors"
              >
                {categoryPlural(c.category)}
              </Link>
            ))}
            <Link
              href="/category"
              className="text-accent-ink hover:underline"
            >
              All →
            </Link>
          </nav>
          {/* Trust page links — E-E-A-T signal; AdSense eligibility. */}
          <nav className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1.5">
            <Link href="/about" className="hover:text-accent-ink transition-colors">
              About
            </Link>
            <Link href="/privacy" className="hover:text-accent-ink transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-accent-ink transition-colors">
              Terms
            </Link>
          </nav>
        </div>
      </footer>

      {/* ItemList structured data for the leaderboard. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
    </>
  );
}
