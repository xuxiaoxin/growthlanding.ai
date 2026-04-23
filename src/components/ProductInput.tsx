"use client";

import { useState } from "react";

interface ProductInputProps {
  onSubmit: (data: { description: string; url: string; targetAudience: string }) => void;
  isLoading: boolean;
}

const EXAMPLE_DESCRIPTION = "A tool that helps teachers grade student essays using AI, supporting multiple languages, auto-scoring, and personalized feedback";
const EXAMPLE_URL = "https://example.com";

export default function ProductInput({ onSubmit, isLoading }: ProductInputProps) {
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 5) return;
    onSubmit({ description: description.trim(), url: url.trim(), targetAudience: targetAudience.trim() });
  };

  const fillExample = () => {
    setDescription(EXAMPLE_DESCRIPTION);
    setUrl(EXAMPLE_URL);
    setTargetAudience("K-12 teachers, educational institutions");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      {/* Main input */}
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your product... (e.g., A tool that helps teachers grade essays with AI)"
          rows={3}
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none transition-all"
          disabled={isLoading}
        />
      </div>

      {/* URL input */}
      <div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Product URL (optional)"
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          disabled={isLoading}
        />
      </div>

      {/* Advanced options */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-text-secondary hover:text-text-primary text-sm flex items-center gap-1 transition-colors"
        >
          <svg className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Advanced options
        </button>
        {showAdvanced && (
          <div className="mt-3">
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Target audience (e.g., K-12 teachers)"
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              disabled={isLoading}
            />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={description.trim().length < 5 || isLoading}
          className="flex-1 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all active:scale-[0.98]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </span>
          ) : (
            "Generate SEO Pages"
          )}
        </button>
        <button
          type="button"
          onClick={fillExample}
          disabled={isLoading}
          className="text-text-secondary hover:text-text-primary border border-border hover:border-text-muted px-4 py-3 rounded-xl transition-all text-sm disabled:opacity-50"
        >
          Try example
        </button>
      </div>
    </form>
  );
}
