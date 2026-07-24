# GrowthRadar

A public, daily-updated leaderboard of newly launched, worth-studying **SaaS &
AI products** discovered across the web. Built as a ProductHunt-style ranking
of opportunities surfaced by the `monitors` + `analyzers` pipeline.

## What it is

- **Featured tab** — Top domains enriched with LLM analysis (category,
  replication difficulty, one-line summary).
- **All tab** — Every scored domain (~tens of thousands), ranked by
  opportunity score.
- **Detail pages** — `/domain/<domain>` with full signal breakdown and the
  opportunity-score composition.

## Tech stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript.

## Data source

100% static. The site reads JSON files from `public/data/`, which are produced
by `analyzers/scripts/export-webui.py` (run on bishenai2 against the internal
MySQL, committed to this repo, and served as static assets). No database, no
API at runtime.

```
bishenai2 MySQL  --export-webui.py-->  public/data/*.json  --Vercel build-->  live site
```

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

The `public/data/` directory is populated by the export script; the dev server
serves it as-is. To regenerate locally, run the export script (needs an SSH
tunnel to bishenai2 MySQL — see `analyzers/scripts/export-webui.py`).

## Data refresh

A cron job on bishenai2 runs `export-webui.py` daily, commits the JSON to this
repo, and pushes — the push triggers a Vercel rebuild.
