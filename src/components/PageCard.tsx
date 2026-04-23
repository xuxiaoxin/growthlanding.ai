"use client";

import type { LandingPage } from "@/types";

interface PageCardProps {
  page: LandingPage;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function PageCard({ page, index, isSelected, onClick }: PageCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-card border rounded-xl p-4 transition-all hover:scale-[1.02] ${
        isSelected
          ? "border-primary ring-1 ring-primary/30"
          : "border-border hover:border-text-muted"
      }`}
    >
      {/* Trend tag */}
      <span className="inline-block bg-primary/15 text-primary text-xs font-medium px-2 py-0.5 rounded-md mb-2">
        🔥 {page.trend.name}
      </span>

      {/* Keyword */}
      <p className="text-text-muted text-xs mb-1.5">Keyword: {page.keyword}</p>

      {/* Title */}
      <h3 className="text-text-primary text-sm font-medium line-clamp-2 leading-snug">
        {page.title}
      </h3>

      {/* Index */}
      <div className="mt-2 text-text-muted text-xs">#{index + 1}</div>
    </button>
  );
}
