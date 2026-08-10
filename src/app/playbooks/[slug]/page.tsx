/**
 * Playbook article page (Server Component, static).
 *
 * Renders one MDX playbook from /content/playbooks/{slug}.mdx. Statically
 * generated for every published playbook via generateStaticParams; unknown
 * slugs 404 (dynamicParams = false) so thin/auto-generated pages never leak.
 *
 * SEO: canonical + per-article title/description (from the MDX `metadata` named
 * export) + Article JSON-LD for rich results. The MDX body is rendered inside
 * the .prose-trust container so markdown elements (h1/h2/p/ul/a/...) pick up the
 * editorial typography shared with the trust pages. A "related playbooks" rail
 * at the bottom keeps readers inside the playbook cluster.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";
import {
  getAllPlaybookSlugs,
  getAllPlaybooks,
  getPlaybook,
} from "@/lib/playbooks";

export const dynamicParams = false;

const SITE_ORIGIN = "https://growthlanding.ai";

export async function generateStaticParams() {
  const slugs = getAllPlaybookSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pb = await getPlaybook(slug);
  if (!pb) return {};
  const { meta } = pb;
  const canonical = `/playbooks/${meta.slug}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      url: `${SITE_ORIGIN}${canonical}`,
      siteName: "GrowthRadar",
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/og.png"],
    },
  };
}

export default async function PlaybookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pb = await getPlaybook(slug);
  if (!pb) notFound();
  const { Content, meta } = pb;
  const canonical = `${SITE_ORIGIN}/playbooks/${meta.slug}`;

  // Related playbooks = the other published articles (exclude current). Capped
  // at 4 so the rail stays compact even as the library grows.
  const all = await getAllPlaybooks();
  const related = all.filter((p) => p.slug !== meta.slug).slice(0, 4);

  // Article JSON-LD for rich results. datePublished uses a stable build-time
  // constant (playbooks are evergreen; we don't track per-article publish dates
  // in the container phase).
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    url: canonical,
    publisher: {
      "@type": "Organization",
      name: "GrowthRadar",
      url: SITE_ORIGIN,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
  };

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
              href="/playbooks"
              className="text-text-secondary hover:text-accent-ink transition-colors"
            >
              ← Playbooks
            </Link>
          </nav>

          {meta.category && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-accent-ink">
              {meta.category}
            </span>
          )}
          <h1 className="mt-1 text-[30px] sm:text-[34px] leading-[1.15] tracking-[-0.03em] font-extrabold text-text-primary">
            {meta.title}
          </h1>
          <p className="mt-3 text-text-secondary text-[15px] leading-relaxed">
            {meta.description}
          </p>

          <article className="prose-trust mt-6">
            <Content />
          </article>

          {/* Newsletter lead-capture — placed right after the article body,
              before the related rail. This is the highest-converting placement
              (reader just consumed founder-targeted content). */}
          <section className="mt-10 rounded-[14px] border border-border bg-card/50 p-5">
            <h2 className="text-[15px] font-semibold text-text-primary">
              Get the weekly digest
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-text-muted">
              Newly launched SaaS &amp; AI products worth studying — ranked for
              solo-founder fit, delivered once a week.
            </p>
            <div className="mt-3">
              <NewsletterSubscribe source="newsletter_playbook" />
            </div>
          </section>

          {related.length > 0 && (
            <section className="mt-12 pt-8 border-t border-border">
              <h2 className="text-sm font-semibold text-text-primary mb-3">
                More playbooks
              </h2>
              <ul className="flex flex-col gap-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/playbooks/${r.slug}`}
                      className="group block bg-card border border-border rounded-[12px] px-4 py-3 transition-colors hover:border-accent"
                    >
                      <div className="text-[14px] font-semibold text-text-primary group-hover:text-accent-ink transition-colors">
                        {r.meta.title}
                      </div>
                      <div className="text-[12.5px] text-text-muted mt-0.5 line-clamp-2">
                        {r.meta.description}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
      <PageFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
    </>
  );
}
