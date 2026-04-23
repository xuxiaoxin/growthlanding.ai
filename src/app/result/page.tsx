"use client";

import { useEffect, useState } from "react";
import PageCard from "@/components/PageCard";
import PagePreview from "@/components/PagePreview";
import ExportActions from "@/components/ExportActions";
import type { LandingPage } from "@/types";

export default function ResultPage() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const pagesStr = sessionStorage.getItem("generate_pages");
    if (!pagesStr) {
      window.location.href = "/";
      return;
    }
    const parsed = JSON.parse(pagesStr) as LandingPage[];
    setPages(parsed);
    if (parsed.length > 0) {
      setSelectedId(parsed[0].id);
    }
    setIsDemo(sessionStorage.getItem("is_demo") === "true");
  }, []);

  const selectedPage = pages.find((p) => p.id === selectedId);

  if (pages.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <span className="text-2xl">🎉</span>
              Your SEO Pages are Ready
              {isDemo && (
                <span className="text-xs bg-warning/15 text-warning border border-warning/30 px-2 py-0.5 rounded-md font-normal">
                  Demo
                </span>
              )}
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Generated <span className="text-primary font-medium">{pages.length}</span> pages
              <span className="mx-2">·</span>
              <span className="text-primary font-medium">
                {pages.reduce((acc, p) => acc + (p.faq?.length || 0), 0)}
              </span>{" "}
              FAQs
            </p>
          </div>
          <div className="flex gap-2">
            {isDemo && (
              <button
                onClick={() => {
                  sessionStorage.removeItem("is_demo");
                  window.location.href = "/";
                }}
                className="text-sm bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl transition-all"
              >
                Start Real Generation →
              </button>
            )}
            <button
              onClick={() => {
                const allMd = pages
                  .map((p) => {
                    const faqSection = p.faq
                      ?.map((item) => `### ${item.question}\n\n${item.answer}`)
                      .join("\n\n");
                    return `# ${p.h1}\n\n${p.content.replace(/<[^>]+>/g, "")}\n\n## FAQ\n\n${faqSection}`;
                  })
                  .join("\n\n---\n\n");
                const blob = new Blob([allMd], { type: "text/markdown" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "seo-pages.md";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-sm bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl transition-all"
            >
              ⬇ Download All
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="text-sm bg-card border border-border text-text-secondary hover:text-text-primary px-4 py-2 rounded-xl transition-all"
            >
              New Generation
            </button>
          </div>
        </div>
      </header>

      {/* Main content: left cards + right preview */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Left card list */}
        <aside className="w-80 lg:w-96 border-r border-border overflow-y-auto p-4 space-y-3 flex-shrink-0 max-h-[calc(100vh-80px)]">
          {pages.map((page, index) => (
            <PageCard
              key={page.id}
              page={page}
              index={index}
              isSelected={page.id === selectedId}
              onClick={() => setSelectedId(page.id)}
            />
          ))}
        </aside>

        {/* Right preview + actions */}
        <section className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          {selectedPage && (
            <div className="space-y-3">
              <ExportActions page={selectedPage} allPages={pages} />
              <PagePreview page={selectedPage} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
