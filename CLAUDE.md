# GrowthRadar — agent orientation

## What this project is

A public **ProductHunt-style leaderboard** (`GrowthRadar`) of newly launched,
worth-studying SaaS/AI products. A **curated, featured-only** static site
rendering data produced by the sibling `monitors/` + `analyzers/` pipeline.

This directory was previously a different product (a C-side SEO landing-page
generator) — that product was **fully removed**; only the build config, design
tokens, and root layout were kept.

## Architecture (static-only SSG — no client data fetch)

The site is **100% statically generated** at build time:
- `src/lib/data-server.ts` reads `public/data/*.json` via Node `fs` during
  `next build`. This module uses `fs` and MUST stay server-only (never imported
  into client components, or it leaks into the client bundle).
- `/` (home) — Server Component, prerendered with all featured cards.
- `/domain/[domain]` — Server Component, `generateStaticParams` returns the ~775
  featured domains, `dynamicParams = false` (non-featured → 404). One static
  HTML per domain.

No `use client` data fetching remains. Pages are instant (CDN) and SEO-friendly
(full content in initial HTML).

## CRITICAL: desensitization

This site is **public**. The export pipeline (`analyzers/scripts/export-webui.py`)
strips all internal detection signals so the ranking methodology can't be
reverse-engineered. **Do not add back** to the public output: score breakdown,
dns_richness, page_count, payment SDK/provider, internal_links, sitemap counts,
tranco, crux, survival window booleans, etc.

What IS public: the score (bare number), LLM analysis (category/summary/
description/key_features/target_users/why_interesting/replication_difficulty/
competition_level), and survival_status (alive/dead — publicly observable).

## Data contracts

`src/types/index.ts` mirrors `export-webui.py` output. Three-state semantics
apply to the few booleans that remain (null = "not measured" ≠ false).

## Commands

```bash
npm run dev      # dev server on :3000
npm run build    # production build (775+ static pages)
npm run lint
```

## Key files

```
src/
  app/layout.tsx               # root layout + metadata
  app/globals.css              # Tailwind v4 @theme tokens (dark indigo)
  app/page.tsx                 # home = featured leaderboard (Server Component)
  app/domain/[domain]/page.tsx # detail page (Server Component, SSG)
  components/                  # Header, StatsBar, LeaderboardCard
  lib/data-server.ts           # build-time fs JSON access (server-only)
  lib/format.ts                # three-state/date/score formatting
  types/index.ts               # data contracts (mirror export-webui.py)
public/data/                   # generated JSON (committed; see export script)
```

## Data refresh flow

1. Run `analyzers/scripts/export-webui.py` on bishenai2 (reads internal MySQL,
   emits desensitized JSON).
2. rsync output into `public/data/`.
3. `npm run build` to verify, then commit + push (dual-push to private + public
   repo). The push triggers a Vercel rebuild.

## Design tokens (globals.css `@theme inline`)

Dark indigo theme. Primary `#4F46E5`, accent `#6366F1`, accent2 (PH orange)
`#F97316`, card `#111827`, background `#0B0F14`.

## Git remotes

`origin` dual-pushes to `growthlanding-ai/webui` (private) and
`xuxiaoxin/growthlanding.ai` (public, Vercel deploys from this).

## Next.js 16 caveat

See `AGENTS.md`: Next.js 16 has breaking changes vs older majors. Consult
`node_modules/next/dist/docs/` before using App Router / dynamic route /
metadata APIs.
