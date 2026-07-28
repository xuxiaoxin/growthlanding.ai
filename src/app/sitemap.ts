/**
 * XML sitemap — emits the homepage + every featured detail page.
 *
 * Built by Next at build time (`next build`), so it's always in sync with the
 * statically generated pages. Without this, the 775 detail pages are
 * discoverable only via the homepage's internal links — slow + lossy at scale.
 */

import type { MetadataRoute } from "next";
import { getCategories, getFeatured } from "@/lib/data-server";

const BASE = "https://growthlanding.ai";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [featured, categories] = await Promise.all([
    getFeatured(),
    getCategories(),
  ]);
  const now = new Date();
  const homeLastMod = featured.generated_at
    ? new Date(featured.generated_at)
    : now;

  return [
    {
      url: `${BASE}/`,
      lastModified: homeLastMod,
      changeFrequency: "daily",
      priority: 1,
    },
    // Category hub pages — high priority (they target competitive
    // "new/latest {category}" queries and act as internal link hubs).
    {
      url: `${BASE}/category`,
      lastModified: homeLastMod,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...categories.map((c) => ({
      url: `${BASE}/category/${encodeURIComponent(c.category)}`,
      lastModified: homeLastMod,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Trust pages — low priority (they don't compete for search traffic, they
    // exist for E-E-A-T and AdSense eligibility). Crawlable but never central.
    {
      url: `${BASE}/about`,
      lastModified: homeLastMod,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE}/privacy`,
      lastModified: homeLastMod,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE}/terms`,
      lastModified: homeLastMod,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...featured.items.map((it) => ({
      url: `${BASE}/domain/${encodeURIComponent(it.domain)}`,
      lastModified: it.first_seen ? new Date(it.first_seen) : now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
