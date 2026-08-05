/**
 * Client-side wrapper for the "Visit site ↗" outbound link on a detail page.
 *
 * The detail page is a Server Component, so its <a> tag cannot bind an onClick
 * directly. This wrapper owns the click handler and fires a `visit_site_click`
 * GA4 event before navigating. Params are desensitized (domain + public
 * category slug only — see webui/CLAUDE.md desensitization red line).
 */
"use client";

import { trackVisitSite } from "@/lib/track";

type Props = {
  href: string;
  domain: string;
  category?: string | null;
  children: React.ReactNode;
  className?: string;
};

export default function OutboundLink({
  href,
  domain,
  category,
  children,
  className,
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackVisitSite({ domain, category })}
    >
      {children}
    </a>
  );
}
