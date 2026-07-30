/**
 * Terms of Service (Server Component, static).
 *
 * Tailored to a directory/aggregator site whose pages link out to third-party
 * products. The load-bearing clauses are the "informational only / not
 * professional advice" and "third-party links" disclaimers — these limit
 * liability for content that is, by design, approximate.
 *
 * SEO: canonical + meta description + BreadcrumbList JSON-LD.
 */

import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "GrowthRadar's terms of service: content is provided 'as is' for informational purposes only, and is not professional, investment, or business advice.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of Service — GrowthRadar",
    description:
      "Content is for information only. Full terms and disclaimers.",
    url: "/terms",
    siteName: "GrowthRadar",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

const SITE_ORIGIN = "https://growthlanding.ai";
const LAST_UPDATED = "July 27, 2026";

export default function TermsPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Leaderboard", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "Terms of Service", item: `${SITE_ORIGIN}/terms` },
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
            Terms of Service
          </h1>
          <p className="text-sm text-text-muted mt-2">Last updated: {LAST_UPDATED}</p>

          <article className="prose-trust mt-6">
            <p>
              These Terms govern your use of <strong>growthlanding.ai</strong>{" "}
              (the &quot;Site&quot;). By accessing the Site, you agree to them. If
              you do not agree, please do not use the Site.
            </p>

            <h2>1. The Site and its content</h2>
            <p>
              GrowthRadar is a free, informational directory of third-party SaaS
              and AI products. The descriptions, categories, scores, and labels
              shown on the Site are <strong>approximate</strong>, may be out of
              date, and are not manually reviewed or verified before
              publication. The Site is a discovery aid, not an authoritative
              reference.
            </p>

            <h2>2. No professional advice</h2>
            <p>
              The Site is provided strictly for general information. The content
              is <strong>not</strong> professional advice of any kind and must
              not be treated as:
            </p>
            <ul>
              <li>Investment, financial, or trading advice.</li>
              <li>Business, legal, or tax advice.</li>
              <li>An endorsement, recommendation, or rating of quality.</li>
              <li>A prediction of any product&apos;s success or failure.</li>
            </ul>
            <p>
              You are solely responsible for any decisions you make based on the
              Site, and you should do your own independent research before acting.
            </p>

            <h2>3. Accuracy and the fit score</h2>
            <p>
              The &quot;fit score&quot; and other signals (such as replication
              difficulty, competition level, and survival status) are{" "}
              <strong>approximate indicators</strong>, not measurements of fact.
              They may be out of date or simply wrong. Product features, pricing,
              and availability change frequently and may not be reflected here.
              We do not warrant that any information on the Site is accurate,
              complete, or current.
            </p>

            <h2>4. Third-party products and links</h2>
            <p>
              Each listing links to a third-party website that we do not own or
              control. We are not responsible for:
            </p>
            <ul>
              <li>The content, accuracy, or safety of those external sites.</li>
              <li>Their privacy practices, data handling, or terms of service.</li>
              <li>Any product or service you purchase or sign up for from them.</li>
              <li>Any harm, loss, or dispute arising from your interaction with them.</li>
            </ul>
            <p>
              Visiting a listed product, signing up, or paying them is a
              relationship between you and that third party. See our{" "}
              <Link href="/privacy">Privacy Policy</Link> for how (little) data
              we handle ourselves.
            </p>

            <h2>5. Removing your domain</h2>
            <p>
              If a domain you own appears on the Site and you would like it
              removed, you may request a takedown through the public channel
              associated with this project (for example, via the repository or
              project page linked from the Site). We will process reasonable
              requests, typically within a few business days. Removal from the
              Site does not affect the underlying public records the listing
              was derived from, which are outside our control.
            </p>

            <h2>6. Intellectual property</h2>
            <p>
              The Site&apos;s design, code, original text, and the GrowthRadar name
              and logo are our intellectual property. You may not copy, mirror,
              or redistribute the Site&apos;s content at scale without permission.
            </p>
            <p>
              All third-party product names, logos, and trademarks shown (for
              example as favicons) are the property of their respective owners.
              Their appearance on the Site is for identification only and does
              not imply any affiliation with, or endorsement by, those owners.
            </p>

            <h2>7. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Scrape, crawl, or harvest the Site at a volume that disrupts its operation.</li>
              <li>Attempt to access systems, data, or non-public areas of the Site.</li>
              <li>Use the Site in a way that violates applicable law.</li>
            </ul>

            <h2>8. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, the Site and all content
              are provided <strong>&quot;as is&quot;</strong> and{" "}
              <strong>&quot;as available,&quot;</strong> without warranties of any
              kind. We are not liable for any indirect, incidental, special, or
              consequential damages — including loss of profits, data, or
              goodwill — arising from your use of, or inability to use, the Site.
            </p>

            <h2>9. Changes to these Terms</h2>
            <p>
              We may update these Terms as the Site evolves. The &quot;Last
              updated&quot; date above reflects the current version. Continued use
              of the Site after changes take effect constitutes acceptance of
              the revised Terms.
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
