/**
 * About page (Server Component, static).
 *
 * The E-E-A-T cornerstone: explains what the site is and its editorial
 * stance at a high level. Deliberately vague about data sources and methods —
 * the point is to signal legitimacy and intent to readers and Quality Raters,
 * not to document the pipeline.
 *
 * SEO: canonical + meta description + BreadcrumbList JSON-LD.
 */

import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";

export const metadata: Metadata = {
  title: "About",
  description:
    "GrowthRadar is a curated directory of newly launched SaaS and AI products, ranked by fit for solo founders. Learn what it is and how to read the rankings.",
  alternates: { canonical: "/about" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "About GrowthRadar",
    description:
      "A curated directory of newly launched SaaS and AI products, ranked by fit for solo founders.",
    url: "/about",
    siteName: "GrowthRadar",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

const SITE_ORIGIN = "https://growthlanding.ai";

export default function AboutPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Leaderboard", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "About", item: `${SITE_ORIGIN}/about` },
    ],
  };

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1 pb-4">
        <div className="mx-auto max-w-3xl px-4 pt-14">
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <Link
              href="/"
              className="text-text-secondary hover:text-accent-ink transition-colors"
            >
              ← Leaderboard
            </Link>
          </nav>

          <h1 className="text-[34px] sm:text-[38px] leading-[1.12] tracking-[-0.035em] font-extrabold text-text-primary">
            About GrowthRadar
          </h1>

          <article className="prose-trust mt-6">
            <h2>What this is</h2>
            <p>
              GrowthRadar is a free, public directory of newly launched SaaS
              and AI products. Every entry is a real website that recently came
              online, now ranked by how well it fits a solo founder. The goal is
              simple: help founders, makers, and researchers spot interesting
              new products early — and study what makes them worth watching.
            </p>

            <h2>How to read the rankings</h2>
            <p>
              The leaderboard is ordered by how well each product fits a solo
              founder. A higher score means a product looks more worth studying
              — not that it is &quot;better&quot; or more likely to succeed. Treat the
              ranking as a discovery tool: a starting point for your own
              research, not a verdict.
            </p>
            <p>
              Each product is tagged with a category, a short summary, and a
              few signals (such as how saturated its space looks). These are
              meant to help you skim and filter — they are approximate and may
              change over time.
            </p>

            <h2>What GrowthRadar is not</h2>
            <ul>
              <li>
                Not a ranking of quality. A high score means &quot;worth studying,&quot;
                not &quot;good&quot; or &quot;successful.&quot;
              </li>
              <li>
                Not investment advice. Nothing here should inform a financial
                or business decision.
              </li>
              <li>
                Not affiliated with, or endorsed by, any of the products listed.
              </li>
              <li>
                Not exhaustive. The directory is a curated selection, not a
                complete index of the web.
              </li>
            </ul>

            <h2>Who runs this</h2>
            <p>
              GrowthRadar is an independent project. It has no investors, no
              sponsorships, and (for now) no advertising. It is maintained in
              good faith as a free resource. See our{" "}
              <Link href="/terms">Terms of Service</Link> and{" "}
              <Link href="/privacy">Privacy Policy</Link> for the details that
              matter.
            </p>
          </article>
        </div>
      </main>
      <PageFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  );
}
