/**
 * Playbooks index page (Server Component, static).
 *
 * Lists every published playbook, grouped by category. This is the hub page
 * for the /playbooks content cluster — it surfaces the full roster in one
 * crawlable place and is linked from the site header + footer so the cluster
 * is never orphaned.
 *
 * SEO: canonical + meta description. No JSON-LD needed here (the index is a
 * navigation hub; each article has its own Article JSON-LD).
 */

import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import { getAllPlaybooks, type PlaybookCategory } from "@/lib/playbooks";

export const metadata: Metadata = {
  title: "Playbooks",
  description:
    "Action-oriented playbooks for solo founders: how to discover, validate, and build on market-validated opportunities — with real early-stage sites as worked examples.",
  alternates: { canonical: "/playbooks" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Playbooks — GrowthRadar",
    description:
      "Action-oriented playbooks for solo founders: discover, validate, and build on market-validated opportunities.",
    url: "/playbooks",
    siteName: "GrowthRadar",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Playbooks — GrowthRadar",
    description:
      "Action-oriented playbooks for solo founders: discover, validate, and build on market-validated opportunities.",
    images: ["/og.png"],
  },
};

// Display labels for the fixed category enum (order = display order).
const CATEGORY_LABELS: Record<PlaybookCategory, string> = {
  discovery: "Discovery",
  validation: "Validation",
  build: "Build",
  growth: "Growth",
};
const CATEGORY_ORDER: PlaybookCategory[] = [
  "discovery",
  "validation",
  "build",
  "growth",
];

export default async function PlaybooksIndexPage() {
  const playbooks = await getAllPlaybooks();

  // Group by category, preserving the CATEGORY_ORDER. Articles already come
  // sorted by (category, order, title) from getAllPlaybooks.
  const grouped = new Map<PlaybookCategory, typeof playbooks>();
  for (const pb of playbooks) {
    const cat = (pb.meta.category ?? "discovery") as PlaybookCategory;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(pb);
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1 pb-4">
        <div className="mx-auto max-w-3xl px-4 pt-10">
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <Link
              href="/"
              className="text-text-secondary hover:text-accent-ink transition-colors"
            >
              ← Leaderboard
            </Link>
          </nav>

          <h1 className="text-[34px] sm:text-[38px] leading-[1.12] tracking-[-0.035em] font-extrabold text-text-primary">
            Playbooks
          </h1>
          <p className="mt-3 text-text-secondary text-[15px] leading-relaxed max-w-2xl">
            Action-oriented playbooks for solo founders — how to discover,
            validate, and build on market-validated opportunities. Each playbook
            pairs a method with real early-stage sites as worked examples.
          </p>

          <div className="mt-8 flex flex-col gap-10">
            {CATEGORY_ORDER.map((cat) => {
              const items = grouped.get(cat);
              if (!items || items.length === 0) return null;
              return (
                <section key={cat}>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                    {CATEGORY_LABELS[cat]}
                  </h2>
                  <ul className="flex flex-col gap-3">
                    {items.map((pb) => (
                      <li key={pb.slug}>
                        <Link
                          href={`/playbooks/${pb.slug}`}
                          className="group block bg-card border border-border rounded-[14px] px-5 py-4 transition-colors hover:border-accent"
                        >
                          <div className="text-[16px] font-semibold text-text-primary group-hover:text-accent-ink transition-colors">
                            {pb.meta.title}
                          </div>
                          <div className="text-[13.5px] text-text-muted mt-1 leading-relaxed">
                            {pb.meta.description}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <PageFooter />
    </>
  );
}
