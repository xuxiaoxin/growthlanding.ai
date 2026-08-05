/**
 * Client-side wrapper for an internal category link (e.g. the breadcrumb trail
 * or related-rail on a detail page).
 *
 * The detail page is a Server Component, so its <Link> cannot bind an onClick
 * directly. This wrapper fires a `category_click` GA4 event (source:
 * "detail_page") on click. Params are desensitized (public category slug only).
 */
"use client";

import Link from "next/link";
import { trackCategoryClick } from "@/lib/track";

type Props = {
  category: string;
  className?: string;
  children: React.ReactNode;
};

export default function CategoryLink({ category, className, children }: Props) {
  return (
    <Link
      href={`/category/${encodeURIComponent(category)}`}
      className={className}
      onClick={() => trackCategoryClick({ category, source: "detail_page" })}
    >
      {children}
    </Link>
  );
}
