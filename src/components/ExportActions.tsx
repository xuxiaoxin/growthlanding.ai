"use client";

import { useState } from "react";
import type { LandingPage } from "@/types";
import { pageToMarkdown } from "@/lib/export/markdown";
import { pageToHTML } from "@/lib/export/html";

interface ExportActionsProps {
  page: LandingPage;
  allPages: LandingPage[];
}

export default function ExportActions({ page, allPages }: ExportActionsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyMarkdown = () => {
    const md = pageToMarkdown(page);
    copyToClipboard(md, "markdown");
  };

  const handleCopyHTML = () => {
    const html = pageToHTML(page);
    copyToClipboard(html, "html");
  };

  const handleDownloadAll = () => {
    const allMd = allPages.map((p) => pageToMarkdown(p)).join("\n\n---\n\n");
    const blob = new Blob([allMd], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "seo-pages.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleCopyMarkdown}
        className="text-sm bg-card border border-border hover:border-text-muted text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-lg transition-all"
      >
        {copied === "markdown" ? "✓ Copied" : "📋 Markdown"}
      </button>
      <button
        onClick={handleCopyHTML}
        className="text-sm bg-card border border-border hover:border-text-muted text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-lg transition-all"
      >
        {copied === "html" ? "✓ Copied" : "📋 HTML"}
      </button>
      <button
        onClick={handleDownloadAll}
        className="text-sm bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 px-3 py-1.5 rounded-lg transition-all"
      >
        ⬇ Download All
      </button>
    </div>
  );
}
