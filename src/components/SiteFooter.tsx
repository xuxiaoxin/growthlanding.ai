/**
 * SiteFooter — the shared site-wide footer.
 *
 * Renders on the homepage AND every domain detail page so cross-page layout is
 * consistent and the detail page no longer ends abruptly after `<main>`. It
 * carries three SEO/trust roles at once:
 *   1. Category gateway nav   → static internal links into /category/[cat]
 *      (crawlable gateway + topic-cluster signal; the leaderboard chips on the
 *      homepage stay client-side filters, so this is the only crawlable path).
 *   2. Trust-page links       → About / Privacy / Terms (E-E-A-T + AdSense).
 *   3. Disclaimer + copyright → editorial framing + GDPR cookie-settings link.
 *
 * Server Component (no interactivity of its own; CookieSettingsButton is the
 * one client island it pulls in). The caller passes the categories + curated
 * total it already fetched at build time — this component does no data fetch.
 */

import Link from "next/link";
import CookieSettingsButton from "./CookieSettingsButton";
import { categoryPlural } from "@/lib/categories";

interface Props {
  /** Category slugs with counts, as returned by getCategories(). */
  categories: { category: string; count: number }[];
  /** Total curated sites (featured.total), used in the disclaimer line. */
  total: number;
}

export default function SiteFooter({ categories, total }: Props) {
  return (
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
            users can reach every category hub page from any page on the site.
            On the homepage these duplicate the (client-side) chip filters;
            on detail pages they are the only crawlable gateway to /category.
            The Playbooks link sits alongside them as a supplementary content
            entry point (the header carries the main /playbooks link). */}
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
        <nav className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1.5">
          <Link
            href="/playbooks"
            className="text-text-secondary hover:text-accent-ink transition-colors"
          >
            Playbooks
          </Link>
        </nav>
        {/* Trust page links — E-E-A-T signal; AdSense eligibility;
            GDPR: consent must be as easy to withdraw as to give. */}
        <nav className="mt-3 flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5">
          <Link href="/about" className="hover:text-accent-ink transition-colors">
            About
          </Link>
          <Link href="/privacy" className="hover:text-accent-ink transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-accent-ink transition-colors">
            Terms
          </Link>
          <CookieSettingsButton className="hover:text-accent-ink transition-colors" />
        </nav>
        {/* Kept for parity with the old homepage footer; surfaced as a
            data-freshness hint rather than a live counter. */}
        <span className="sr-only">
          {total.toLocaleString()} curated sites in the directory.
        </span>
        <p className="mt-4">© {new Date().getUTCFullYear()} GrowthRadar</p>
      </div>
    </footer>
  );
}
