/**
 * PageFooter — shared footer for the trust pages (About / Privacy / Terms /
 * Contact).
 *
 * The homepage has its own bespoke footer (with the category nav), so this
 * component is intentionally separate and minimal: just cross-links between
 * the trust pages + a copyright line. Keeps the trust pages visually
 * consistent without touching the homepage.
 *
 * Server Component (no interactivity).
 */

import Link from "next/link";
import CookieSettingsButton from "./CookieSettingsButton";

export default function PageFooter() {
  const year = new Date().getUTCFullYear();
  return (
    <footer className="border-t border-border py-6 mt-8">
      <div className="mx-auto max-w-3xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
        <nav className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5" aria-label="Footer">
          <Link href="/about" className="hover:text-accent-ink transition-colors">
            About
          </Link>
          <Link href="/privacy" className="hover:text-accent-ink transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-accent-ink transition-colors">
            Terms
          </Link>
          {/* GDPR: consent must be as easy to withdraw as to give. */}
          <CookieSettingsButton className="hover:text-accent-ink transition-colors" />
        </nav>
        <p>© {year} GrowthRadar</p>
      </div>
    </footer>
  );
}
