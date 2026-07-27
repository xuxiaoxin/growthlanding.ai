/**
 * robots.txt — allow all crawling, point crawlers at the sitemap.
 * Built by Next at build time → /robots.txt.
 */

import type { MetadataRoute } from "next";

const BASE = "https://growthlanding.ai";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
