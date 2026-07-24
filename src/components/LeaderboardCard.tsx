/**
 * LeaderboardCard — a single ProductHunt-style ranking row.
 *
 * Layout: rank | favicon+domain+summary | score + badges | external link.
 * Clicking the row navigates to the in-site detail page (/domain/<domain>).
 * The ↗ button opens the real site in a new tab (stops propagation).
 */

"use client";

import Link from "next/link";
import type { DomainItem } from "@/types";
import SignalBadges from "./SignalBadges";
import {
  faviconUrl,
  siteUrl,
  scorePct,
  categoryColor,
  difficultyColor,
  titleCase,
} from "@/lib/format";

interface Props {
  item: DomainItem;
  rank: number;
}

export default function LeaderboardCard({ item, rank }: Props) {
  const isTop3 = rank <= 3;

  return (
    <Link
      href={`/domain/${encodeURIComponent(item.domain)}`}
      className="block bg-card border border-border rounded-xl p-4 transition-all hover:border-text-muted hover:scale-[1.005] animate-fade-in"
    >
      <div className="flex items-start gap-3">
        {/* Rank */}
        <div
          className={`shrink-0 w-8 text-right font-bold text-lg ${
            isTop3 ? "text-accent2" : "text-text-muted"
          }`}
        >
          {rank}
        </div>

        {/* Favicon */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={faviconUrl(item.domain)}
          alt=""
          width={40}
          height={40}
          className="shrink-0 w-10 h-10 rounded-lg bg-background border border-border object-contain p-1"
          loading="lazy"
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-text-primary font-semibold truncate">
              {item.domain}
            </h3>
            {item.category && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md ${categoryColor(item.category)}`}
              >
                {titleCase(item.category)}
              </span>
            )}
            {item.subcategory && (
              <span className="text-xs text-text-muted truncate">
                {item.subcategory}
              </span>
            )}
          </div>

          {item.summary ? (
            <p className="text-sm text-text-secondary mt-1 line-clamp-1">
              {item.summary}
            </p>
          ) : (
            <p className="text-sm text-text-muted mt-1 line-clamp-1 italic">
              {item.business_model ? titleCase(item.business_model) : "No analysis yet"}
              {item.page_count ? ` · ${item.page_count} pages` : ""}
            </p>
          )}

          <div className="mt-2">
            <SignalBadges item={item} />
          </div>
        </div>

        {/* Score + actions */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          <div className="text-right">
            <div className="text-xl font-bold text-accent2 tabular-nums">
              {scorePct(item.score)}
            </div>
            <div className="text-[10px] text-text-muted uppercase tracking-wide">
              score
            </div>
          </div>
          {item.replication_difficulty && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md ${difficultyColor(item.replication_difficulty)}`}
              title="Replication difficulty"
            >
              {item.replication_difficulty}
            </span>
          )}
          <a
            href={siteUrl(item.domain)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-text-muted hover:text-primary transition-colors"
            title={`Open ${item.domain}`}
          >
            ↗
          </a>
        </div>
      </div>
    </Link>
  );
}
