"use client";

import type { SSEEvent } from "@/types";

interface GenerateProgressProps {
  events: SSEEvent[];
  currentStep: number;
}

const STEPS = [
  { label: "Analyzing product", icon: "🧠" },
  { label: "Finding trends", icon: "🔥" },
  { label: "Generating keywords", icon: "🔍" },
  { label: "Creating SEO pages", icon: "📝" },
];

export default function GenerateProgress({ events, currentStep }: GenerateProgressProps) {
  const latestLogs = events.slice(-5);
  const progress = Math.min(
    currentStep >= 4
      ? Math.round(
          ((events.filter((e) => e.type === "page_generated").length) /
            10) *
            100
        )
      : currentStep * 20,
    95
  );

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center">
        <div className="text-4xl mb-3 animate-pulse">🧠</div>
        <h2 className="text-xl font-semibold text-text-primary">
          AI is generating your SEO pages...
        </h2>
        <p className="text-text-secondary text-sm mt-1">Estimated time: 20-40 seconds</p>
      </div>

      {/* Step list */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
        {STEPS.map((step, index) => {
          const isActive = index === currentStep - 1;
          const isDone = index < currentStep - 1;

          return (
            <div
              key={index}
              className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all ${
                isActive ? "bg-primary/10 border border-primary/20" : ""
              }`}
            >
              <span className="text-lg">{step.icon}</span>
              <span
                className={`flex-1 text-sm ${
                  isDone
                    ? "text-success line-through"
                    : isActive
                    ? "text-text-primary font-medium"
                    : "text-text-muted"
                }`}
              >
                {step.label}
              </span>
              {isDone && <span className="text-success text-sm">✓</span>}
              {isActive && (
                <svg className="animate-spin h-4 w-4 text-primary" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Progress</span>
          <span className="text-text-primary">{progress}%</span>
        </div>
        <div className="h-2 bg-card rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Live log */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-1.5 max-h-48 overflow-y-auto">
        {latestLogs.map((event, index) => (
          <div
            key={index}
            className="text-sm text-text-secondary animate-fade-in"
          >
            <span className="text-text-muted mr-2">
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
            {event.message}
          </div>
        ))}
      </div>
    </div>
  );
}
