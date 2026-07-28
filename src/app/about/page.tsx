/**
 * About page (Server Component, static).
 *
 * The E-E-A-T cornerstone: explains what the site is, where data comes from
 * (public Certificate Transparency logs — a legitimate, public data source),
 * how the analysis is produced, and who runs it. Google Quality Raters look
 * for this page specifically when judging a directory/aggregator site.
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
    "GrowthRadar is a curated directory of newly launched SaaS and AI products, discovered from public Certificate Transparency logs and enriched with AI-generated analysis. Learn how it works.",
  alternates: { canonical: "/about" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "About GrowthRadar",
    description:
      "A curated directory of newly launched SaaS and AI products, discovered from public data and enriched with AI analysis.",
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
              and AI products. Every entry is a real website that was recently
              detected, automatically analyzed, and ranked by an opportunity
              score. The goal is simple: help founders, makers, and researchers
              spot interesting new products early — and study what makes them
              worth watching.
            </p>

            <h2>How we discover products</h2>
            <p>
              Discovery is fully automated and uses only{" "}
              <strong>public data sources</strong>. The primary input is the{" "}
              <a
                href="https://certificate.transparency.dev/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Certificate Transparency (CT) log ecosystem
              </a>{" "}
              — a public, append-only record of TLS certificates issued for
              domains worldwide. CT logs were built for security auditing and
              are openly queryable by anyone; we monitor them in real time to
              catch newly-registered or newly-secured domains.
            </p>
            <p>
              Each new domain is then screened with a lightweight pipeline: DNS
              resolution, an HTTP probe, and a set of heuristics that filter out
              parked pages, spam, and noise. Only domains that survive this gate
              move on to analysis.
            </p>

            <h2>How the analysis is produced</h2>
            <p>
              For each promising domain, a large language model reads the site&apos;s
              public landing page and produces a structured analysis: what the
              product does, its core features, who it targets, and why it might
              be interesting. The model also classifies the domain into a
              category (AI tool, SaaS, healthcare, etc.) and tags it with a
              subcategory.
            </p>
            <p>
              The opportunity score is a <strong>heuristic</strong> — a weighted
              combination of publicly observable signals (such as how complete
              the site appears, how recently it launched, and category
              saturation). It is a starting point for your own research,{" "}
              <strong>not an endorsement or a prediction of success</strong>.
              See our <Link href="/terms">Terms of Service</Link> for the full
              disclaimer.
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
            </ul>

            <h2>Who runs this</h2>
            <p>
              GrowthRadar is an independent project run by a single developer.
              It has no investors, no sponsorships, and (for now) no
              advertising. If you have questions, corrections, or want a domain
              removed from the directory, you can reach me directly at{" "}
              <a href="mailto:hello@growthlanding.ai">hello@growthlanding.ai</a>{" "}
              — see the <Link href="/contact">Contact page</Link> for details.
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
