# GrowthRadar

A public, daily-updated leaderboard of newly launched, worth-studying **SaaS &
AI products** discovered across the web. A ProductHunt-style ranking of
opportunities surfaced by the `monitors` + `analyzers` pipeline.

## What it is

A **curated, featured-only** static site. The home page lists ~700+ hand-
picked domains ranked by an opportunity score; each has a detail page with an
LLM-generated function analysis (what it does, core features, who it's for,
why it's worth studying).

- **Home** — ranked cards of all featured domains (score, category, summary).
- **Detail pages** (`/domain/<domain>`) — full function analysis for each.

## Tech stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript.

## Architecture (static-only, SSG)

The site is **100% statically generated** at build time — no client-side data
fetching, no database, no API at runtime. Data is read from `public/data/`
via Node `fs` during `next build` (see `src/lib/data-server.ts`) and baked
into static HTML.

- `/` — prerendered with all featured cards.
- `/domain/[domain]` — one static HTML per featured domain (775 pages),
  via `generateStaticParams` + `dynamicParams = false` (non-featured → 404).

This makes pages **instant** (CDN-served) and **SEO-friendly** (full content
in initial HTML, independent `<title>` per page).

## Data source (desensitized, public)

Data comes from `analyzers/scripts/export-webui.py` (run on bishenai2 against
the internal MySQL, committed to this repo as static JSON). **The export is
desensitized**: internal detection signals (score breakdown, dns_richness,
page_count, payment SDK, etc.) are intentionally stripped so the ranking
methodology can't be reverse-engineered. Only the score number, the LLM
analysis, and publicly-observable survival status are exported.

```
bishenai2 MySQL  --export-webui.py-->  public/data/*.json  --next build-->  static HTML (CDN)
```

Files under `public/data/`:
- `featured.json` — leaderboard cards (slim fields)
- `featured-details.json` — full per-domain LLM analysis (keyed by domain)
- `stats.json` — aggregate headline numbers

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (generates 775+ static pages)
npm run lint
```

The `public/data/` directory is populated by the export script. To regenerate,
run `analyzers/scripts/export-webui.py` on bishenai2, then rsync the output
into `public/data/` and commit.

## Data refresh

Currently manual: run the export on bishenai2, rsync to `public/data/`,
commit, and push. The push to the public repo triggers a Vercel rebuild.
(Automation via cron is planned.)

## Git remotes

`origin` pushes to **two** repositories simultaneously (dual push):
- `growthlanding-ai/webui` (private, fetch source)
- `xuxiaoxin/growthlanding.ai` (public, for Vercel free-tier deployment)
