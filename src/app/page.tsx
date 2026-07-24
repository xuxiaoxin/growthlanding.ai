import Header from "@/components/Header";
import LeaderboardClient from "@/components/LeaderboardClient";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-16">
        <LeaderboardClient />
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
