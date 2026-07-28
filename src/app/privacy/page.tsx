/**
 * Privacy Policy (Server Component, static).
 *
 * Written to match the actual codebase (audited 2026-07-27): no analytics, no
 * ads, no cookies, no accounts, no form submissions. The only third-party
 * runtime calls are Vercel (hosting) and Google's favicon service. Keeping
 * this accurate is required for AdSense and for GDPR/CCPA good-faith
 * compliance — over- or under-disclosing both cause problems.
 *
 * SEO: canonical + meta description + BreadcrumbList JSON-LD.
 */

import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "GrowthRadar's privacy policy: no cookies, no cross-site tracking, no advertising. We use cookie-free, anonymous Vercel analytics and collect no personal data. Read the details.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy — GrowthRadar",
    description:
      "No cookies, no cross-site tracking, no advertising. Privacy-friendly analytics only.",
    url: "/privacy",
    siteName: "GrowthRadar",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

const SITE_ORIGIN = "https://growthlanding.ai";
const LAST_UPDATED = "July 28, 2026";

export default function PrivacyPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Leaderboard", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${SITE_ORIGIN}/privacy` },
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
            Privacy Policy
          </h1>
          <p className="text-sm text-text-muted mt-2">Last updated: {LAST_UPDATED}</p>

          <article className="prose-trust mt-6">
            <p>
              This policy describes how GrowthRadar (&quot;we,&quot; &quot;us&quot;) handles data
              when you visit <strong>growthlanding.ai</strong> (the &quot;Site&quot;). It is
              written in plain language and reflects what the Site actually
              does. We have deliberately kept our data practices minimal.
            </p>

            <h2>1. Information we collect</h2>
            <p>
              <strong>Almost none.</strong> The Site has no user accounts, no
              contact forms, no newsletter sign-up, and no comment system. You
              can browse every page without identifying yourself.
            </p>
            <p>Specifically, we do <strong>not</strong> collect:</p>
            <ul>
              <li>Your name, email, or any contact details.</li>
              <li>Account credentials — there are no accounts.</li>
              <li>User-generated content — there is no way to submit content.</li>
              <li>Precise location or device fingerprints.</li>
            </ul>
            <p>
              When you load a page, standard technical data (such as your IP
              address, browser type, and the requested URL) is transmitted to
              our hosting provider as part of how the web works. This is
              described in Section 2.
            </p>

            <h2>2. Third-party services</h2>
            <p>
              The Site is intentionally lean. As of the last update, only two
              third parties process any data in connection with your visit:
            </p>

            <h3>Vercel (hosting infrastructure)</h3>
            <p>
              The Site is hosted on Vercel. When you request a page, Vercel
              processes the request and may log standard server-side data — IP
              address, timestamp, requested URL, browser user-agent, and HTTP
              status. This is operational infrastructure logging used to serve
              and secure the Site, not behavioral tracking. See{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel&apos;s Privacy Policy
              </a>
              .
            </p>

            <h3>Vercel Web Analytics &amp; Speed Insights (privacy-friendly metrics)</h3>
            <p>
              The Site uses Vercel&apos;s built-in <strong>Web Analytics</strong>{" "}
              (to count page views, referrers, and rough geography) and{" "}
              <strong>Speed Insights</strong> (to measure Core Web Vitals —
              LCP, CLS, INP). Both are <strong>cookie-free</strong> and
              <strong> anonymous</strong>: instead of cookies, a visitor is
              identified by a short-lived hash of the request that Vercel
              <strong> discards after 24 hours</strong>. No data that can
              identify or re-identify an individual across sites is collected,
              stored, or shared with third parties.
            </p>
            <p>
              The specific fields Vercel may attach to a page-view event are:
              timestamp, URL path, dynamic route, referrer, country/region,
              device OS, browser, and device type. All aggregated — never tied
              to your name, email, or a persistent profile. Because it is
              cookie-free and anonymized, no consent banner is required under
              GDPR/ePrivacy for this kind of measurement. See{" "}
              <a
                href="https://vercel.com/docs/analytics/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel Analytics privacy &amp; compliance
              </a>
              .
            </p>
            <p>
              Both services only operate in the deployed Vercel environment —
              they do not transmit data when you run the Site locally in
              development.
            </p>

            <h3>Google Favicons (site icons)</h3>
            <p>
              To show the logo of each listed product, the Site loads small
              icons from Google&apos;s public favicon service
              (<code>www.google.com/s2/favicons</code>). Your browser makes this
              request directly to Google, which means Google receives your IP
              address, the time of the request, and the specific domain whose
              icon is being loaded. We use this service only for display and do
              not control what Google does with that request data. See{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google&apos;s Privacy Policy
              </a>
              .
            </p>
            <p>
              Fonts are <strong>not</strong> loaded from a third party — they
              are bundled into the Site at build time, so no request is made to
              a font service when you visit.
            </p>

            <h2>3. Cookies and local storage</h2>
            <p>
              The Site does <strong>not</strong> set any cookies and does{" "}
              <strong>not</strong> use browser local storage or session storage.
              There is no cookie banner because there is nothing to consent to.
            </p>

            <h2>4. Analytics and advertising</h2>
            <p>
              The Site uses <strong>privacy-friendly, cookie-free</strong>{" "}
              analytics (Vercel Web Analytics and Speed Insights, detailed in
              Section 2). These produce aggregate, anonymized statistics only.
            </p>
            <p>
              We deliberately do <strong>not</strong> use Google Analytics,
              Facebook/Meta Pixel, or any cross-site behavioral tracking or
              advertising network. We do <strong>not</strong> sell or share data
              with advertisers. If we ever introduce a service that uses cookies
              or tracks you across other websites, we will update this Policy
              <strong>before</strong> doing so and request consent where
              required.
            </p>

            <h2>5. Children&apos;s privacy</h2>
            <p>
              The Site is not directed at children under 13 and we do not
              knowingly collect data from them. The content (SaaS and AI
              product analysis) is intended for adults doing product and market
              research.
            </p>

            <h2>6. Your rights</h2>
            <p>
              Because we hold essentially no personal data about you, the
              practical exercise of rights like access or deletion is simple:
              there is nothing to access or delete. If you believe otherwise —
              for example, if a listed domain is yours and you have a concern —
              you can reach out through the project&apos;s public channel (the
              repository or project page linked from the Site) and we will
              respond promptly. Depending on where you live, you may also have
              rights under GDPR (EU/UK), CCPA (California), or similar laws; we
              will honor valid requests.
            </p>

            <h2>7. External links</h2>
            <p>
              Each product page links to the product&apos;s own website. We are
              not responsible for the privacy practices or content of those
              external sites. Please review their policies separately.
            </p>

            <h2>8. Changes to this policy</h2>
            <p>
              We may update this Policy as the Site evolves. The &quot;Last
              updated&quot; date at the top will always reflect the most recent
              version. Material changes (such as introducing analytics or
              advertising) will be called out clearly.
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
