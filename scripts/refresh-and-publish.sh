#!/usr/bin/env bash
# scripts/refresh-and-publish.sh - Manually refresh GrowthRadar data and publish.
#
# Run this BY HAND whenever you want to update the public site. There is NO
# automatic schedule on the Mac (it's intermittent online) — bishenai2's 05:00
# export cron keeps the staging dir fresh, so this script always pulls today's
# latest whenever you run it.
#
# Flow: rsync bishenai2 staging dir -> public/data/ -> npm run build (verify) ->
#       git commit (ONLY the 3 data files) -> git push (dual-push -> Vercel).
#
# Data direction is Mac PULLS from bishenai2 (Mac sshd is off; bishenai2 cannot
# push here). bishenai2's run-export-webui.sh writes the staging dir at 05:00.
#
# Guardrails:
#   - Only public/data/{featured,featured-details,stats}.json are staged. In-
#     progress code (Header.tsx, Leaderboard.tsx, ...) is NEVER touched, so it
#     can't be accidentally published. Do NOT change `git add` to `-A`.
#   - `npm run build` runs BEFORE the push; `set -e` aborts on build failure so
#     broken data never reaches Vercel (the live site keeps the last good build).
#   - Nothing happens if the data is unchanged (git diff --cached --quiet).
#
# Usage:  bash scripts/refresh-and-publish.sh
#         bash scripts/refresh-and-publish.sh --force   # publish even if unchanged

set -euo pipefail

FORCE=0
if [[ "${1:-}" == "--force" ]]; then FORCE=1; fi

# Resolve webui root regardless of where the script is called from.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBUI_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$WEBUI_DIR"

# bishenai2 staging dir produced by run-export-webui.sh (see analyzers/).
STAGING_SRC="bishenai2:/opt/xu/growthlanding.ai/analyzers/data/webui-export/"
DATA_DIR="public/data"

mkdir -p "$DATA_DIR"

echo "==> [1/4] Pulling latest export from bishenai2 (mesh, ~5-10s)..."
rsync -avz --delete "$STAGING_SRC" "$DATA_DIR/"

# Stage ONLY the 3 desensitized data files. Never use `git add -A` here —
# that would publish in-progress code changes.
git add "$DATA_DIR/featured.json" "$DATA_DIR/featured-details.json" "$DATA_DIR/stats.json"

if git diff --cached --quiet; then
    if [[ $FORCE -eq 1 ]]; then
        echo "    (no data change, but --force: continuing anyway)"
    else
        echo "    No data change since last publish. Nothing to do."
        echo "    (use --force to republish anyway)"
        exit 0
    fi
fi

echo "==> [2/4] Building (npm run build, ~15 min for ~1000 pages)..."
# On failure, `set -e` aborts before commit/push — the staged change is left
# for inspection but nothing is published.
npm run build

echo "==> [3/4] Committing data files..."
DATE_TAG="$(date -u +%Y-%m-%d)"
git commit -m "data: refresh $DATE_TAG"

echo "==> [4/4] Pushing (dual-push -> private + public repo -> Vercel)..."
# origin has two pushurls (growthlanding-ai/webui private + xuxiaoxin/
# growthlanding.ai public); one push hits both. The public push triggers the
# Vercel rebuild.
git push origin HEAD

echo
echo "Done. Site will redeploy on Vercel in ~1-2 min."
echo "    commit: data: refresh $DATE_TAG"
