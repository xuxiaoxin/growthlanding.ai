"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import GenerateProgress from "@/components/GenerateProgress";
import { simulateDemo } from "@/lib/data/demo-data";
import type { SSEEvent, LandingPage } from "@/types";

export default function LoadingPage() {
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  const addEvent = useCallback((event: SSEEvent) => {
    setEvents((prev) => [...prev, event]);
  }, []);

  // Handle events: update step + redirect on complete
  const handleEvent = useCallback((event: SSEEvent) => {
    addEvent(event);

    if (event.type === "error") {
      setError(event.message);
      return;
    }

    // Update step
    if (event.type === "parsing") setCurrentStep(1);
    else if (event.type === "parsed") setCurrentStep(2);
    else if (event.type === "selecting_trends") setCurrentStep(2);
    else if (event.type === "trends_selected") setCurrentStep(3);
    else if (event.type === "generating_keywords") setCurrentStep(3);
    else if (event.type === "keywords_generated") setCurrentStep(4);
    else if (event.type === "generating_page") setCurrentStep(4);
    else if (event.type === "page_generated") setCurrentStep(4);
    else if (event.type === "complete") {
      const resultData = event.data;
      const pages = (resultData.pages || []) as LandingPage[];
      sessionStorage.setItem("generate_result", JSON.stringify(resultData));
      sessionStorage.setItem("generate_pages", JSON.stringify(pages));
      sessionStorage.setItem("is_demo", "true");
      window.location.href = "/result";
    }
  }, [addEvent]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const isDemo = params.get("demo") === "true";

    if (isDemo) {
      // Demo mode: use simulated data
      simulateDemo(
        (event) => handleEvent(event),
        () => {} // complete already handled in handleEvent
      );
      return;
    }

    // Real generation mode
    const inputStr = sessionStorage.getItem("generate_input");
    if (!inputStr) {
      window.location.href = "/";
      return;
    }

    const input = JSON.parse(inputStr);

    const startGeneration = async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const err = await response.json();
          setError(err.error || "Generation failed");
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          setError("Failed to read response stream");
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const event: SSEEvent = JSON.parse(data);
              handleEvent(event);
            } catch {
              // skip invalid JSON
            }
          }
        }
      } catch {
        setError("Network error, please retry");
      }
    };

    startGeneration();
  }, [handleEvent]);

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="bg-card border border-error/30 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Generation Failed
          </h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <button
            onClick={() => window.location.href = "/"}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl transition-all"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <GenerateProgress events={events} currentStep={currentStep} />
    </main>
  );
}
