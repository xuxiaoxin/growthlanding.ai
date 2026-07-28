# GrowthRadar

A public, daily-updated leaderboard of newly launched, worth-studying **SaaS &
AI products** discovered across the web. A ProductHunt-style ranking of
opportunities surfaced by the `monitors` + `analyzers` pipeline.

## What it is

A **curated, featured-only** static site. The home page lists ~775 hand-picked
domains ranked by an opportunity score; each has a detail page with an
analysis of what it does, core features, who it's for, and why it's worth
studying.

- **Home** — ranked cards of all featured domains (score, category, summary).
- **Category index** (`/category`) + 13 category pages (`/category/<cat>`) —
  browse by category (ai_tool, saas, marketing, …).
- **Detail pages** (`/domain/<domain>`) — full analysis for each.
- **Trust pages** — `/about`, `/privacy`, `/terms`.

## Tech stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript.

## Architecture (static-only, SSG)

The site is **100% statically generated** at build time — no client-side data
fetching, no database, no API at runtime. Data is read from `public/data/`
via Node `fs` during `next build` (see `src/lib/data-server.ts`) and baked
into static HTML.

Routes (~799 static pages in total):

- `/` — home, prerendered with all featured cards.
- `/category` — category index (gateway to the 13 categories).
- `/category/[cat]` — one page per category (13 pages), also
  `generateStaticParams` + `dynamicParams = false`.
- `/domain/[domain]` — one static HTML per featured domain (~775 pages),
  via `generateStaticParams` + `dynamicParams = false` (non-featured → 404).
- `/about`, `/privacy`, `/terms` — 3 trust/legal pages.

This makes pages **instant** (CDN-served) and **SEO-friendly** (full content
in initial HTML, independent `<title>` per page).

## SEO surface

Built on `sitemap.ts` + `robots.ts` + per-page `canonical`/`metadataBase`, with
JSON-LD on every page type (`ItemList` on home/category, `SoftwareApplication`
+ `BreadcrumbList` on detail pages) and a 4-layer internal-link graph
(Home → `/category` → `/category/[cat]` → `/domain/[domain]`). Thin content
(no description + not alive) is auto-marked `noindex,follow`. See `CLAUDE.md`
for the full breakdown.

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

Currently **manual**, assisted by `/tmp/wait-llm-and-export.sh` on bishenai2.
The script polls (every 5 min, over SSH) for the `llm-enrich` process to
finish, then automatically runs the export → rsync into `public/data/` →
`npm run build` → dual-push. The push to the public repo triggers a Vercel
rebuild. Formal cron automation (so the wait is unattended) is **not yet
configured**.

## Git remotes

`origin` pushes to **two** repositories simultaneously (dual push):
- `growthlanding-ai/webui` (private, fetch source)
- `xuxiaoxin/growthlanding.ai` (public, for Vercel free-tier deployment)

## Roadmap

- **Dark mode** (P2, pending product decision) — Tailwind v4
  `prefers-color-scheme` + a second token set.
- **Favicon self-hosted proxy/cache** — replace the Google third-party favicon
  domain (also fixes the letter fallback + latency in one go).
- **Home "Discovered 7d" mini-trend** — show a sparkline / delta (e.g.
  `↑ 23.5K`) alongside the stat.
- **Score-ring tooltip** — explain the score basis ("heuristic score from N
  signals, 0–100"); the current bare `opportunity` label is too vague.
