/**
 * Home = the featured leaderboard. Server Component: data is read at build
 * time via lib/data-server and baked into static HTML (SEO-friendly, instant).
 */

import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import LeaderboardCard from "@/components/LeaderboardCard";
import { getFeatured, getStats } from "@/lib/data-server";

export default async function HomePage() {
  const [featured, stats] = await Promise.all([getFeatured(), getStats()]);

  return (
    <>
      <Header />
      <main className="flex-1 pb-16">
        <StatsBar stats={stats} />

        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">
              🌟 Top Opportunities
            </h2>
            <span className="text-xs text-text-muted">
              {featured.total.toLocaleString()} curated sites, ranked by opportunity
            </span>
          </div>

          {featured.items.length === 0 ? (
            <p className="text-text-muted text-center py-20">
              No domains yet.
            </p>
          ) : (
            <div className="space-y-3">
              {featured.items.map((item, i) => (
                <LeaderboardCard key={item.domain} item={item} rank={i + 1} />
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="border-t border-border py-6">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-text-muted">
          <p>
            GrowthRadar surfaces newly launched, worth-studying SaaS &amp; AI
            products. Rankings are automated and heuristic — not endorsements.
          </p>
          <p className="mt-1">
            Data refreshed daily from the{" "}
            <span className="text-text-secondary">monitors + analyzers</span>{" "}
            pipeline.
          </p>
        </div>
      </footer>
    </>
  );
}
