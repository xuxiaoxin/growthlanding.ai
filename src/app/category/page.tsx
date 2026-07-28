/**
 * Category index page — the hub that lists all categories.
 *
 * Static (no generateStaticParams needed: this is a fixed single route).
 * Forms the middle layer of the 4-level internal link structure:
 *   Home → /category (this) → /category/[cat] → /domain/[domain]
 *
 * SEO:
 *  - canonical + meta description
 *  - BreadcrumbList (Home → Categories) + ItemList (all category pages)
 *  - every category links out, so crawlers discover all 13 hub pages + their
 *    detail pages in one hop from here
 */

import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import { getCategories } from "@/lib/data-server";
import { categoryPlural } from "@/lib/categories";

const SITE_ORIGIN = "https://growthlanding.ai";

export const metadata: Metadata = {
  // Title body only — layout.tsx appends "| GrowthRadar" via template.
  title: "Browse Categories",
  description:
    "Browse all SaaS & AI product categories on GrowthRadar — AI tools, SaaS, developer tools, fintech, healthcare, and more. Curated and ranked by opportunity score.",
  alternates: { canonical: "/category" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Browse Categories — GrowthRadar",
    description:
      "Browse all SaaS & AI product categories on GrowthRadar, ranked by opportunity score.",
    url: `${SITE_ORIGIN}/category`,
    siteName: "GrowthRadar",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Categories — GrowthRadar",
    description:
      "Browse all SaaS & AI product categories on GrowthRadar, ranked by opportunity score.",
    images: ["/og.png"],
  },
};

export default async function CategoryIndexPage() {
  const cats = await getCategories();
  const totalDomains = cats.reduce((sum, c) => sum + c.count, 0);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Leaderboard", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "Categories", item: `${SITE_ORIGIN}/category` },
    ],
  };
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "GrowthRadar — Categories",
    numberOfItems: cats.length,
    itemListElement: cats.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_ORIGIN}/category/${encodeURIComponent(c.category)}`,
      name: categoryPlural(c.category),
    })),
  };

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1 pb-16">
        <div className="mx-auto max-w-5xl px-4 pt-14">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <Link
              href="/"
              className="text-text-secondary hover:text-accent-ink transition-colors"
            >
              ← Leaderboard
            </Link>
          </nav>

          {/* H1 + intro */}
          <h1 className="text-[34px] sm:text-[38px] leading-[1.12] tracking-[-0.035em] font-extrabold text-text-primary">
            Browse by category
          </h1>
          <p className="text-text-secondary text-[15.5px] max-w-[580px] mt-3">
            {cats.length.toLocaleString()} categories covering{" "}
            {totalDomains.toLocaleString()} curated products — ranked by
            opportunity score and enriched with AI analysis.
          </p>

          {/* Category card grid */}
          <section className="mt-11 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cats.map((c) => (
              <Link
                key={c.category}
                href={`/category/${encodeURIComponent(c.category)}`}
                className="group animate-fade-in flex items-center justify-between gap-3 bg-card border border-border rounded-[14px] p-5 transition-all duration-[160ms] ease-out hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_14px_34px_-16px_rgba(24,24,27,0.28)]"
              >
                <div className="min-w-0">
                  <div className="text-text-primary text-[15px] font-semibold group-hover:text-accent-ink transition-colors">
                    {categoryPlural(c.category)}
                  </div>
                  <div className="text-[12px] text-text-muted mt-0.5">
                    {c.count.toLocaleString()} curated
                  </div>
                </div>
                <span
                  className="shrink-0 text-text-muted group-hover:text-text-primary group-hover:translate-x-0.5 transition-transform text-[15px]"
                  aria-hidden
                >
                  ↗
                </span>
              </Link>
            ))}
          </section>
        </div>
      </main>

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
    </>
  );
}
