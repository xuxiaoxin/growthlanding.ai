/**
 * LeaderboardCard — a single ranking row.
 *
 * v2 design (single teal accent, WCAG-AA contrast):
 *   rank | favicon + domain + category pill + NEW | difficulty | score ring | ↗
 * - Top3 rows get a larger accent rank + left accent border ("podium" feel).
 * - Score is a teal magnitude ring (single accent — never a red/yellow/green
 *   traffic light, which would mislead readers into thinking the score is a
 *   quality verdict rather than a heuristic opportunity number).
 * - Favicon falls back to a letter avatar on load error (Google's favicon
 *   service can return a blank/grey tile), and is lazy-loaded.
 * - Clicking the row navigates to the in-site detail page (/opportunity/<domain>).
 *
 * This is a Client Component only because favicon onError needs an event
 * handler; everything else is presentational.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import type { DomainItem } from "@/types";
import {
  faviconUrl,
  scorePct,
  titleCase,
  difficultyDotColor,
  difficultyLabel,
  scoreRingFill,
  scoreRingDash,
  isNew,
  domainLetter,
} from "@/lib/format";
import WatchlistButton from "./WatchlistButton";

interface Props {
  item: DomainItem;
  rank: number;
  /** Stagger index for the fade-in animation (capped so long lists don't lag). */
  index?: number;
  /** Presets the watch button state (e.g. the watchlist page passes true). */
  initialWatched?: boolean;
}

const RING_R = 17; // ring radius — matches the SVG viewBox 0 0 44 44
const RING_VIEWBOX = 44;

export default function LeaderboardCard({
  item,
  rank,
  index = 0,
  initialWatched = false,
}: Props) {
  const difficulty = item.replication_difficulty;
  const isTop3 = rank <= 3;
  const showNew = isNew(item.first_seen);
  const fill = scoreRingFill(item.score);
  const { dasharray, dashoffset } = scoreRingDash(fill, RING_R);

  // favicon load-error → letter avatar fallback
  const [imgFailed, setImgFailed] = useState(false);

  // stagger only the first rows so a long list doesn't animate after a delay
  const delay = Math.min(index, 12) * 0.04;

  return (
    <Link
      href={`/opportunity/${encodeURIComponent(item.domain)}`}
      className={`group animate-fade-in block bg-card border rounded-[14px] p-[14px_18px] transition-transform duration-[160ms] ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-16px_rgba(24,24,27,0.28)] ${
        isTop3
          ? "border-l-[3px] border-l-accent border-y-border border-r-border hover:border-accent"
          : "border-border hover:border-accent"
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center gap-4">
        {/* Rank — tabular; Top3 gets accent + larger weight */}
        <div
          className={`shrink-0 w-[26px] text-right tabular-nums ${
            isTop3
              ? "text-[17px] font-extrabold text-accent-ink"
              : "text-[13px] font-semibold text-text-muted"
          }`}
        >
          {rank}
        </div>

        {/* Favicon — letter-avatar fallback on error */}
        <div className="relative shrink-0 w-11 h-11 rounded-[14px] bg-stone-100 grid place-items-center overflow-hidden">
          {!imgFailed && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={faviconUrl(item.domain)}
              alt=""
              width={30}
              height={30}
              loading="lazy"
              decoding="async"
              onError={() => setImgFailed(true)}
              className="relative z-[1] w-[30px] h-[30px] rounded-[10px] object-contain"
            />
          )}
          {imgFailed && (
            <span className="absolute font-bold text-stone-700 text-[17px]">
              {domainLetter(item.domain)}
            </span>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-text-primary text-[15px] font-semibold truncate">
              {item.domain}
            </span>
            {item.category && (
              <span className="shrink-0 text-[11px] font-semibold px-2 py-[2px] rounded-full bg-stone-100 text-stone-700">
                {titleCase(item.category)}
              </span>
            )}
            {showNew && (
              <span className="shrink-0 text-[10px] font-extrabold tracking-[0.04em] text-white bg-fresh px-[7px] py-[2px] rounded-full">
                NEW
              </span>
            )}
          </div>

          {item.summary ? (
            <p className="text-[13px] text-text-secondary mt-[3px] truncate">
              {item.summary}
            </p>
          ) : (
            <p className="text-[13px] text-text-muted mt-[3px] truncate italic">
              {item.business_model ? titleCase(item.business_model) : "No analysis"}
            </p>
          )}
        </div>

        {/* Right column: watch toggle + difficulty dot + score ring + arrow */}
        <div className="shrink-0 flex items-center gap-4">
          <WatchlistButton
            domain={item.domain}
            initialWatched={initialWatched}
            compact
          />
          {difficulty && (
            <span className="hidden sm:flex items-center gap-1.5 text-[11.5px] text-text-muted">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: difficultyDotColor(difficulty) }}
              />
              {difficultyLabel(difficulty, "replication")}
            </span>
          )}

          <ScoreRing
            pct={scorePct(item.score)}
            dasharray={dasharray}
            dashoffset={dashoffset}
            viewBox={RING_VIEWBOX}
            r={RING_R}
          />

          <span
            className="text-text-muted group-hover:text-text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[15px]"
            title={`Open ${item.domain}`}
            aria-hidden
          >
            ↗
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Score magnitude ring — single accent color, expresses only the score's
 * magnitude (not a pass/fail verdict). stroke-dasharray/offset are computed
 * by the caller via scoreRingDash().
 */
function ScoreRing({
  pct,
  dasharray,
  dashoffset,
  viewBox,
  r,
}: {
  pct: string;
  dasharray: string;
  dashoffset: string;
  viewBox: number;
  r: number;
}) {
  const c = viewBox / 2;
  return (
    <svg
      width="44"
      height="44"
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      className="shrink-0"
      role="img"
      aria-label={`Fit score ${pct}`}
    >
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="3.5"
      />
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={dasharray}
        strokeDashoffset={dashoffset}
        transform={`rotate(-90 ${c} ${c})`}
      />
      <text
        x={c}
        y={c}
        fontSize="10"
        fontWeight="700"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-text-primary tabular-nums"
      >
        {pct}
      </text>
    </svg>
  );
}
