/**
 * XML sitemap — emits the homepage + every featured detail page.
 *
 * Built by Next at build time (`next build`), so it's always in sync with the
 * statically generated pages. Without this, the 775 detail pages are
 * discoverable only via the homepage's internal links — slow + lossy at scale.
 */

import type { MetadataRoute } from "next";
import { getFeatured } from "@/lib/data-server";

const BASE = "https://growthlanding.ai";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const featured = await getFeatured();
  const now = new Date();

  return [
    {
      url: `${BASE}/`,
      lastModified: featured.generated_at
        ? new Date(featured.generated_at)
        : now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...featured.items.map((it) => ({
      url: `${BASE}/domain/${encodeURIComponent(it.domain)}`,
      lastModified: it.first_seen ? new Date(it.first_seen) : now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
