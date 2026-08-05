/**
 * Category detail page (Server Component).
 *
 * Statically generated at build time for every category present in the
 * featured set (via generateStaticParams). dynamicParams = false means
 * unknown category slugs return 404 rather than being rendered on demand.
 *
 * SEO:
 *  - targets "new/latest {category}" blue-ocean queries (avoids the crowded
 *    "best X" SERP, leans into the site's "newly launched" positioning)
 *  - canonical + per-page title/description (titleCase'd category in the slug)
 *  - BreadcrumbList (Home → Category) + ItemList (all domains in this
 *    category) JSON-LD for rich results
 *  - the full Leaderboard link graph is preserved (all items rendered into
 *    HTML, overflow hidden via CSS — same strategy as the homepage)
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Leaderboard from "@/components/Leaderboard";
import {
  getByCategory,
  getCategories,
  getCategorySlugs,
} from "@/lib/data-server";
import {
  categoryH1,
  categoryIntro,
  categoryMetaDesc,
  categoryPlural,
} from "@/lib/categories";
import { formatDate } from "@/lib/format";

export const dynamicParams = false;

const SITE_ORIGIN = "https://growthlanding.ai";

export async function generateStaticParams() {
  const cats = await getCategorySlugs();
  return cats.map((cat) => ({ cat }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cat: string }>;
}): Promise<Metadata> {
  const { cat } = await params;
  const c = decodeURIComponent(cat);
  const items = await getByCategory(c);
  if (items.length === 0) notFound();
  const plural = categoryPlural(c);
  // Title body feeds layout.tsx's template (%s | GrowthRadar). OG/Twitter get
  // the full hand-written title since they don't use the template.
  const titleBody = `Latest ${plural} (2026)`;
  const fullTitle = `${titleBody} — GrowthRadar`;
  const description = categoryMetaDesc(c, items.length);
  const url = `${SITE_ORIGIN}/category/${encodeURIComponent(c)}`;
  return {
    title: titleBody,
    description,
    alternates: { canonical: `/category/${encodeURIComponent(c)}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "GrowthRadar",
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/og.png"],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ cat: string }>;
}) {
  const { cat: rawCat } = await params;
  const cat = decodeURIComponent(rawCat);
  const [items, allCats] = await Promise.all([getByCategory(cat), getCategories()]);
  if (items.length === 0) notFound();

  // Earliest first_seen in this category — a freshness signal for the intro.
  const latest = items
    .map((it) => it.first_seen)
    .filter((v): v is string => !!v)
    .sort()
    .at(-1);
  const dateStr = formatDate(latest ?? new Date().toISOString());

  const h1 = categoryH1(cat);
  const intro = categoryIntro(cat, items.length, dateStr);
  const canonical = `${SITE_ORIGIN}/category/${encodeURIComponent(cat)}`;
  const plural = categoryPlural(cat);

  // Structured data: breadcrumb + the full list of domains in this category.
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Leaderboard", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "Categories", item: `${SITE_ORIGIN}/category` },
      { "@type": "ListItem", position: 3, name: plural, item: canonical },
    ],
  };
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Latest ${plural} — GrowthRadar`,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
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
        <div className="mx-auto max-w-5xl px-4 pt-14">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <Link
              href="/"
              className="text-text-secondary hover:text-accent-ink transition-colors"
            >
              ← Leaderboard
            </Link>
            <span className="text-text-muted mx-2">/</span>
            <Link
              href="/category"
              className="text-text-secondary hover:text-accent-ink transition-colors"
            >
              Categories
            </Link>
          </nav>

          {/* H1 + intro — core keywords live here */}
          <h1 className="text-[32px] sm:text-[36px] leading-[1.12] tracking-[-0.035em] font-extrabold text-text-primary max-w-[20ch]">
            {h1}
          </h1>
          <p className="text-text-secondary text-[15.5px] max-w-[640px] mt-3">
            {intro}
          </p>

          {/* List — reuses the homepage Leaderboard (search + load more + the
              full-link-graph SSR pattern). hideCategoryChips because the data
              is already single-category. */}
          <div className="mt-11">
            <Leaderboard items={items} total={items.length} hideCategoryChips />
          </div>

          {/* Cross-link to other categories — spreads internal link equity
              between category hub pages. */}
          <section className="mt-14 bg-card border border-border rounded-[14px] p-6">
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
              Browse other categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {allCats.map((c) => {
                const active = c.category === cat;
                return (
                  <Link
                    key={c.category}
                    href={`/category/${encodeURIComponent(c.category)}`}
                    aria-current={active ? "page" : undefined}
                    className={`min-h-[36px] text-[12.5px] font-medium px-[13px] py-2.5 rounded-full border transition-colors ${
                      active
                        ? "bg-accent text-white border-accent"
                        : "bg-card text-text-secondary border-border hover:border-border-strong hover:text-text-primary"
                    }`}
                  >
                    {categoryPlural(c.category)}
                    <span className="ml-1.5 opacity-70">{c.count}</span>
                  </Link>
                );
              })}
            </div>
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
