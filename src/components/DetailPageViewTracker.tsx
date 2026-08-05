"use client";

/**
 * DetailPageViewTracker — fires the `detail_page_view` GA4 event once when a
 * detail page mounts.
 *
 * Why a dedicated client component instead of calling gtag from the (server)
 * detail page? GA4 events require window.gtag, which only exists in the
 * browser. This component is a leaf Client Component rendered inside the
 * server-rendered DetailBody, so it hydrates on the client and fires the event
 * from a useEffect with an empty dep array (mount-once semantics).
 *
 * Props are public taxonomy values only (domain / category / subcategory) — see
 * the privacy red-line comment in lib/track.ts.
 */
import { useEffect } from "react";
import { trackDetailPageView } from "@/lib/track";

export default function DetailPageViewTracker({
  domain,
  category,
  subcategory,
}: {
  domain: string;
  category?: string | null;
  subcategory?: string | null;
}) {
  useEffect(() => {
    trackDetailPageView({ domain, category, subcategory });
    // Fire once per mount; intentionally not re-fired on prop changes (a
    // detail page is one logical view even if React re-renders).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
