/**
 * Privacy Policy (Server Component, static).
 *
 * Written to match the actual codebase: Vercel Analytics (cookie-free) +
 * Google Analytics (cookie-based, gated by Consent Mode v2 with an EEA
 * consent banner) + Microsoft Clarity (cookie-based session replay, gated by
 * the same consent banner — not loaded at all until consent). Plus a voluntary
 * newsletter sign-up (email stored in Neon Postgres, synced to Resend for
 * delivery). No advertising, no user accounts (Auth.js tables are reserved
 * but not wired). Keeping this accurate is required for AdSense and for
 * GDPR/CCPA good-faith compliance — over- or under-disclosing both cause
 * problems.
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
    "GrowthRadar's privacy policy: newsletter email stored in Neon Postgres and delivered via Resend. Vercel analytics (cookie-free), Google Analytics, and Microsoft Clarity (both cookie-based, consent-gated in the EEA). No advertising, no cross-site tracking.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy — GrowthRadar",
    description:
      "Cookie-free Vercel analytics + consent-gated Google Analytics and Microsoft Clarity. No advertising, no cross-site tracking.",
    url: "/privacy",
    siteName: "GrowthRadar",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

const SITE_ORIGIN = "https://growthlanding.ai";
const LAST_UPDATED = "August 10, 2026";

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
              <strong>Very little, and only what you choose to give.</strong>{" "}
              The Site has no user accounts and no comment system. You can
              browse every page without identifying yourself. The only personal
              data we collect is your <strong>email address</strong>, and only
              if you voluntarily subscribe to the weekly digest via the sign-up
              form in the footer or on a playbook page.
            </p>
            <p>Specifically:</p>
            <ul>
              <li>
                <strong>Email address</strong> — only when you submit the
                newsletter form. Used solely to send the weekly digest. Stored
                in our database (Neon Postgres, Section 2) and synced to our
                email provider (Resend, Section 2) for delivery. You can
                unsubscribe at any time via the link in every email.
              </li>
            </ul>
            <p>We do <strong>not</strong> collect:</p>
            <ul>
              <li>Your name, physical address, or phone number.</li>
              <li>Account credentials — there are no accounts.</li>
              <li>User-generated content — there is no comment system.</li>
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
              The Site is intentionally lean. As of the last update, the
              following third parties process data in connection with your
              visit:
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

            <h3>Google Analytics (cookie-based, consent-gated)</h3>
            <p>
              The Site also uses Google Analytics 4 to measure traffic. Unlike
              the Vercel services above, Google Analytics uses{" "}
              <strong>cookies</strong> (small files stored in your browser) to
              recognize returning visitors and aggregate usage data. The main
              cookies are <code>_ga</code> (distinguishes users, ~2 years) and{" "}
              <code>_ga_&lt;id&gt;</code> (maintains session state, ~2 years).
            </p>
            <p>
              Cookie-based tracking requires your consent under EU/UK law
              (GDPR/ePrivacy). The Site implements Google Consent Mode v2 and a
              consent banner for visitors in the European Economic Area (EEA)
              and the United Kingdom:
            </p>
            <ul>
              <li>
                For <strong>EEA/UK visitors</strong>: Google Analytics cookies
                are <strong>not</strong> set until you click &quot;Accept&quot; on the
                banner. If you click &quot;Reject&quot; (or ignore it), Google still
                receives an anonymous, cookieless ping so aggregate trends can
                be modeled — but no cookie is written and you are not tracked
                across sessions.
              </li>
              <li>
                For <strong>visitors outside the EEA/UK</strong>: analytics is
                permitted by default under the region settings, so cookies are
                set without a banner. You can still opt out at any time via
                &quot;Cookie Settings&quot; in the footer.
              </li>
            </ul>
            <p>
              You can change your choice any time by clicking{" "}
              <strong>Cookie Settings</strong> in the footer. See{" "}
              <a
                href="https://support.google.com/analytics/answer/10033649"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Consent Mode reference
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/technologies/cookies"
                target="_blank"
                rel="noopener noreferrer"
              >
                how Google uses cookies
              </a>
              .
            </p>

            <h3>Microsoft Clarity (session replay, consent-gated)</h3>
            <p>
              The Site uses <strong>Microsoft Clarity</strong> to record
              anonymous <strong>session replays</strong> and generate{" "}
              <strong>heatmaps</strong> — short recordings of how visitors move
              around and click on pages, used to find usability problems. Clarity
              uses <strong>cookies</strong> (mainly <code>_clck</code> and{" "}
              <code>_clsk</code>) to stitch page views into a session.
            </p>
            <p>
              Because Clarity is cookie-based, it is held to the{" "}
              <strong>same consent gate as Google Analytics</strong>: the Clarity
              code is <strong>not loaded at all</strong> until you click
              &quot;Accept&quot; on the consent banner. If you reject (or ignore) the
              banner, <strong>no Clarity script runs, no recording is made, and
              no Clarity cookie is set</strong>. This is stricter than Clarity&apos;s
              own default, which would load immediately in a cookieless mode — we
              defer it entirely so nothing is collected before you opt in. If you
              later change your mind, clicking &quot;Reject&quot; in Cookie Settings
              tells Clarity to delete its cookies and end the session. See{" "}
              <a
                href="https://learn.microsoft.com/clarity/setup-and-installation/consent-mode"
                target="_blank"
                rel="noopener noreferrer"
              >
                Clarity Consent Mode
              </a>{" "}
              and{" "}
              <a
                href="https://privacy.microsoft.com/en-us/privacystatement"
                target="_blank"
                rel="noopener noreferrer"
              >
                Microsoft&apos;s Privacy Statement
              </a>
              .
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

            <h3>Neon Postgres (newsletter email storage)</h3>
            <p>
              When you subscribe to the weekly digest, your email address is
              stored in our database hosted on{" "}
              <strong>Neon Postgres</strong> (a managed PostgreSQL service).
              The data stored is limited to: your email address, the submission
              timestamp, the page you subscribed from, and a status field
              (pending / subscribed / unsubscribed). Neon processes this data on
              our behalf as a processor; we control the database and its
              contents. See{" "}
              <a
                href="https://neon.com/security"
                target="_blank"
                rel="noopener noreferrer"
              >
                Neon&apos;s security &amp; privacy
              </a>
              .
            </p>

            <h3>Resend (email delivery)</h3>
            <p>
              To send the weekly digest, your email address is synced to our
              email delivery provider, <strong>Resend</strong>. Resend receives
              only your email address (no other personal data) and sends on our
              behalf. Every email we send includes an unsubscribe link; using it
              updates your status in both Neon and Resend. See{" "}
              <a
                href="https://resend.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resend&apos;s Privacy Policy
              </a>
              .
            </p>

            <h2>3. Cookies and local storage</h2>
            <p>
              The Site uses three kinds of storage, and keeps them to a minimum:
            </p>
            <ul>
              <li>
                <strong>Google Analytics cookies</strong> (<code>_ga</code>,{" "}
                <code>_ga_&lt;id&gt;</code>) — only the GA service described in
                Section 2 sets these. They last about 2 years and are used to
                recognize returning visitors and aggregate usage. EEA/UK
                visitors: these are set <strong>only after</strong> you accept
                the consent banner.
              </li>
              <li>
                <strong>Microsoft Clarity cookies</strong> (<code>_clck</code>,{" "}
                <code>_clsk</code>) — set by the session-replay service described
                in Section 2 to group page views into a recording. They last
                roughly up to 1 year. Like the GA cookies, EEA/UK visitors: these
                are set <strong>only after</strong> you accept the consent banner
                (Clarity does not load until then).
              </li>
              <li>
                <strong>Local storage</strong> — the Site stores your consent
                choice (Accept / Reject) in a single local-storage entry named{" "}
                <code>growthradar-consent</code> so the banner doesn&apos;t
                reappear on every visit. This is strictly functional and
                contains no identifying information.
              </li>
            </ul>
            <p>
              We do <strong>not</strong> set any advertising cookies, marketing
              cookies, or third-party cookies other than those listed above.
              There is no Facebook/Meta Pixel or cross-site behavioral tracking.
            </p>

            <h2>4. Analytics and advertising</h2>
            <p>
              The Site uses three analytics services, described in detail in
              Section 2:
            </p>
            <ul>
              <li>
                <strong>Vercel Web Analytics &amp; Speed Insights</strong> —
                cookie-free and anonymous; no consent needed.
              </li>
              <li>
                <strong>Google Analytics 4</strong> — cookie-based and
                consent-gated for EEA/UK visitors via Consent Mode v2.
              </li>
              <li>
                <strong>Microsoft Clarity</strong> — cookie-based session
                replay; not loaded at all until consent is granted (stricter
                than its default).
              </li>
            </ul>
            <p>
              We do <strong>not</strong> use any advertising network and do
              <strong> not</strong> sell or share data with advertisers. We do
              <strong> not</strong> use cross-site behavioral trackers like the
              Facebook/Meta Pixel. If we ever add advertising or another
              cookie-based service, we will update this Policy{" "}
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
              If you have subscribed to the weekly digest, you can{" "}
              <strong>unsubscribe at any time</strong> using the link at the
              bottom of every digest email. If you want your email address
              fully deleted from our records, reply to any digest email (or
              reach out through the project&apos;s public channel linked from
              the Site) and we will remove it from both Neon and Resend.
            </p>
            <p>
              Beyond the newsletter, we hold essentially no personal data about
              you. Depending on where you live, you may have rights under GDPR
              (EU/UK), CCPA (California), or similar laws — we will honor valid
              requests to access, correct, or delete your data.
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
