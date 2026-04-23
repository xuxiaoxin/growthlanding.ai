"use client";

import { useState } from "react";
import ProductInput from "@/components/ProductInput";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: {
    description: string;
    url: string;
    targetAudience: string;
  }) => {
    setIsLoading(true);

    // Store data in sessionStorage for the loading page
    sessionStorage.setItem("generate_input", JSON.stringify(data));

    // Navigate to the loading page
    window.location.href = "/loading";
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          <span className="text-primary">Growth</span>
          <span className="text-text-primary">Landing</span>
          <span className="text-accent">.ai</span>
        </h1>
      </div>

      {/* Title */}
      <div className="text-center mb-10 max-w-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
          Turn Trends into SEO Traffic Pages
        </h2>
        <p className="text-text-secondary text-base sm:text-lg">
          Enter your product description, AI auto-generates 10 ready-to-publish SEO Landing Pages
        </p>
      </div>

      {/* Input */}
      <ProductInput onSubmit={handleSubmit} isLoading={isLoading} />

      {/* Demo entry */}
      <button
        onClick={() => (window.location.href = "/loading?demo=true")}
        className="mt-4 text-text-secondary hover:text-primary border border-border hover:border-primary/40 px-6 py-2.5 rounded-xl transition-all text-sm flex items-center gap-2"
      >
        <span>🎬</span>
        <span>Try Demo (No API Key needed)</span>
      </button>

      {/* Footer */}
      <p className="mt-8 text-text-muted text-sm text-center">
        Enter product description → Wait 30 seconds → Get 10 SEO pages
      </p>
    </main>
  );
}
