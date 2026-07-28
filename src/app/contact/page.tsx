/**
 * Contact page (Server Component, static).
 *
 * Minimal by design: there is no form backend and no need for one. A mailto
 * link covers the real use cases (content corrections, takedown requests,
 * partnership questions) without introducing a server endpoint or third-party
 * form service (which would add Privacy Policy surface).
 *
 * SEO: canonical + meta description + BreadcrumbList + ContactPage JSON-LD.
 */

import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with GrowthRadar: content corrections, domain takedown requests, feedback, or partnership inquiries via email at hello@growthlanding.ai.",
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Contact GrowthRadar",
    description:
      "Email hello@growthlanding.ai for corrections, takedowns, feedback, or partnerships.",
    url: "/contact",
    siteName: "GrowthRadar",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

const SITE_ORIGIN = "https://growthlanding.ai";
const EMAIL = "hello@growthlanding.ai";

export default function ContactPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Leaderboard", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "Contact", item: `${SITE_ORIGIN}/contact` },
    ],
  };
  const contactLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact GrowthRadar",
    url: `${SITE_ORIGIN}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "GrowthRadar",
      email: `mailto:${EMAIL}`,
      url: SITE_ORIGIN,
    },
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
            Contact
          </h1>

          <article className="prose-trust mt-6">
            <p>
              The fastest way to reach GrowthRadar is by email. There&apos;s no
              form, no ticketing system — just a direct line to the person who
              runs the project.
            </p>

            <p>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 !no-underline bg-accent hover:bg-accent-ink text-white font-medium px-5 py-2.5 rounded-[10px] transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                {EMAIL}
              </a>
            </p>

            <h2>What to email about</h2>
            <ul>
              <li>
                <strong>Corrections</strong> — if a product&apos;s analysis is wrong
                or outdated, tell us what to fix.
              </li>
              <li>
                <strong>Takedown requests</strong> — if you own a domain listed
                here and want it removed, email from an address at that domain.
                We honor reasonable requests. See our{" "}
                <Link href="/terms">Terms of Service</Link>.
              </li>
              <li>
                <strong>Feedback &amp; ideas</strong> — what would make the Site
                more useful to you.
              </li>
              <li>
                <strong>Partnerships</strong> — API access, data licensing, or
                editorial collaboration.
              </li>
              <li>
                <strong>Privacy questions</strong> — anything about our{" "}
                <Link href="/privacy">Privacy Policy</Link>.
              </li>
            </ul>

            <h2>Response time</h2>
            <p>
              The project is run by a single person, so replies usually come
              within 1–3 business days. Takedown requests are prioritized.
            </p>
          </article>
        </div>
      </main>
      <PageFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }}
      />
    </>
  );
}
