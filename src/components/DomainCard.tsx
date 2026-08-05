/**
 * DomainCard — a compact case-study card for embedding inside playbook
 * articles via <DomainCard domain="example.com" />.
 *
 * Async Server Component: calls getDetail(domain) at build time and renders a
 * link to the full /opportunity/{domain} detail page plus a one-line summary and a
 * replication-difficulty badge. Used to weave real early-stage sites into
 * playbook content as worked examples (internal-link equity flows from the
 * playbook page into the detail page).
 *
 * Desensitization (SPEC-001 B.2(4)): reads ONLY the public whitelist fields —
 * domain, summary, replication_difficulty, category. NEVER reads score,
 * opc_rank_score, copyability, alive_30d/90d, dns_richness, page_count,
 * has_payment_sdk, score_breakdown, llm_confidence, llm_model, or any other
 * internal detection signal.
 *
 * If the site has dropped out of the featured set (getDetail returns null),
 * the card renders null so the article never carries a dead internal link.
 */

import Link from "next/link";
import Favicon from "@/components/Favicon";
import { getDetail } from "@/lib/data-server";
import { titleCase } from "@/lib/format";

interface Props {
  domain: string;
}

async function DomainCardImpl({ domain }: Props) {
  const detail = await getDetail(domain);
  if (!detail) return null;

  // Whitelist fields only — see desensitization note in the file header.
  const summary = detail.summary;
  const difficulty = detail.replication_difficulty;
  const category = detail.category;

  return (
    <Link
      href={`/opportunity/${encodeURIComponent(domain)}`}
      className="group block my-6 bg-card border border-border rounded-[14px] p-4 transition-colors hover:border-accent"
    >
      <div className="flex items-center gap-3">
        <Favicon domain={domain} tileClassName="w-11 h-11 rounded-[11px]" size={32} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[15px] font-semibold text-text-primary truncate group-hover:text-accent-ink transition-colors">
              {domain}
            </span>
            {category && (
              <span className="text-[11px] font-semibold px-2 py-[2px] rounded-full bg-stone-100 text-stone-700">
                {titleCase(category)}
              </span>
            )}
          </div>
          {summary && (
            <p className="text-[13px] text-text-muted mt-1 line-clamp-2">
              {summary}
            </p>
          )}
        </div>
        {difficulty && (
          <span className="shrink-0 text-[11px] font-medium px-2 py-1 rounded-full bg-stone-50 border border-border text-text-secondary">
            {difficultyLabelShort(difficulty)}
          </span>
        )}
      </div>
      <div className="mt-2 text-[12px] text-accent-ink font-medium">
        Study this site →
      </div>
    </Link>
  );
}

/** Short replication-difficulty badge label (low/medium/high → copy-hardness). */
function difficultyLabelShort(level: string): string {
  switch ((level ?? "").toLowerCase()) {
    case "low":
      return "Easy to copy";
    case "medium":
      return "Medium to copy";
    case "high":
      return "Hard to copy";
    default:
      return "Replication: ?";
  }
}

/**
 * Named export for use inside MDX playbook articles
 * (`import { DomainCard } from '@/components/DomainCard'`, per SPEC-001 B.3).
 * Default export is the same component, kept for consistency with the rest of
 * the codebase (Favicon, Link, etc. all default-export).
 */
export const DomainCard = DomainCardImpl;
export default DomainCardImpl;
