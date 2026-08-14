/**
 * Dashboard page (Server Component, dynamic account island).
 *
 * The post-login home for the account subtree. Shows the signed-in user's
 * profile (avatar / name / email) and an entry-card grid to the account
 * surfaces. Unauthenticated visitors are redirected to /app/login.
 *
 * SSG note: lives under /app/* (dynamic, noindex). Calls `auth()` — this
 * module is never imported by the static SEO pages.
 */
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  const { name, email, image } = session.user;
  // Initials for the avatar — shown if the image URL is unavailable.
  const initials =
    (name ?? email ?? "?")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part: string) => part[0]?.toUpperCase() ?? "")
      .join("") || "?";

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
            Your account
          </h1>

          {/* Profile card — avatar + identity. The initials sit behind the
              image as a graceful fallback for missing/broken avatars. */}
          <section className="mt-6 bg-card border border-border rounded-[14px] shadow-[0_1px_2px_rgba(24,24,27,0.04),0_1px_3px_rgba(24,24,27,0.05)] p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-accent/10 flex items-center justify-center text-accent-ink text-base font-semibold">
                <span aria-hidden="true">{initials}</span>
                {image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={name ?? "Your avatar"}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                {name && (
                  <p className="truncate text-[15px] font-semibold text-text-primary">
                    {name}
                  </p>
                )}
                {email && (
                  <p className="truncate text-sm text-text-secondary">
                    {email}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Entry-card grid — Watchlist is live, Billing & Settings are
              placeholders gated for later phases. */}
          <section className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/app/watchlist"
              className="group bg-card border border-border rounded-[14px] shadow-[0_1px_2px_rgba(24,24,27,0.04),0_1px_3px_rgba(24,24,27,0.05)] p-5 hover:border-border-strong transition-colors"
            >
              <div className="flex items-center gap-2 text-text-primary">
                <span className="text-[15px] font-semibold">Watchlist</span>
                <span className="text-text-muted transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">
                Sites you&apos;re tracking
              </p>
            </Link>

            <div className="cursor-not-allowed opacity-60 bg-card border border-border rounded-[14px] p-5">
              <div className="text-[15px] font-semibold text-text-primary">
                Billing
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">
                Coming soon
              </p>
            </div>

            <div className="cursor-not-allowed opacity-60 bg-card border border-border rounded-[14px] p-5">
              <div className="text-[15px] font-semibold text-text-primary">
                Settings
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">
                Coming soon
              </p>
            </div>
          </section>
        </div>
      </main>
      <PageFooter />
    </>
  );
}
