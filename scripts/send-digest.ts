/**
 * send-digest.ts — send a weekly digest to all subscribed readers.
 *
 * The content engine (analyzers/scripts/export-digest.py) produces a digest
 * JSON; this script consumes it, renders an HTML email, and sends it to every
 * subscriber with status='subscribed' in Neon, via Resend's batch endpoint.
 *
 * The two scripts are deliberately decoupled: export-digest needs the analyzers
 * MySQL (bishenai2 over mesh VPN), this script needs Neon + Resend (both
 * public-internet). Run export-digest first, then this.
 *
 * Usage:
 *   npx tsx scripts/send-digest.ts --digest <path/to/digest.json>
 *   npx tsx scripts/send-digest.ts --digest ...json --dry-run        # preview, no send
 *   npx tsx scripts/send-digest.ts --digest ...json --to you@x.com  # single test recipient
 *   npx tsx scripts/send-digest.ts --digest ...json --from me@x.com # override sender
 *
 * Prerequisites:
 *   - growthlanding.ai verified as a sending domain in Resend (else 422).
 *   - At least one subscribed reader (or use --to for a test send).
 *   - .env.local: RESEND_API_KEY, DATABASE_URL (Neon pooler) — same as /api/subscribe.
 *
 * Desensitization: inherits export-digest's red lines — the digest JSON never
 * contains opc_rank_score/copyability/leverage, so neither does this email.
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { neon } from "@neondatabase/serverless";

// ---------------------------------------------------------------------------
// .env.local loader (tsx doesn't auto-load it, unlike next dev/build).
// Same pattern as list-subscribers.ts — no dotenv dependency.
// ---------------------------------------------------------------------------
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const idx = t.indexOf("=");
    const key = t.slice(0, idx).trim();
    const val = t.slice(idx + 1).trim();
    if (key && !(key in process.env)) process.env[key] = val;
  }
}

// ---------------------------------------------------------------------------
// CLI parsing
// ---------------------------------------------------------------------------
interface Args {
  digestPath: string;
  dryRun: boolean;
  to: string | null;
  from: string;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const get = (flag: string): string | null => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] ?? null : null;
  };
  const digestPath = get("--digest");
  if (!digestPath) {
    console.error(
      "Usage: npx tsx scripts/send-digest.ts --digest <path.json> [--dry-run] [--to email] [--from email]"
    );
    process.exit(1);
  }
  return {
    digestPath,
    dryRun: argv.includes("--dry-run"),
    to: get("--to"),
    from: get("--from") ?? "GrowthRadar <digest@growthlanding.ai>",
  };
}

// ---------------------------------------------------------------------------
// Types — mirrors export-digest.py output shape
// ---------------------------------------------------------------------------
interface DigestJSON {
  generated_at: string;
  generated_date: string;
  category: string | null;
  window_days: number;
  sections: {
    where_you_stand: {
      category: string | null;
      cohort: { n: number; pct_pricing: number | null; pct_pay: number | null };
      pool_benchmark: { n: number; pct_pricing: number | null; pct_pay: number | null };
      category_leaderboard: {
        category: string;
        n: number;
        pct_pay: number | null;
        pct_pricing: number | null;
      }[];
    };
    who_is_taking_money: {
      n: number;
      small_sample: boolean;
      sites: {
        domain: string;
        born: string | null;
        subcategory: string | null;
        summary: string | null;
        provider: string;
      }[];
      insight: {
        lead_provider: string;
        lead_n: number;
        lead_pct: number | null;
        total_n: number;
        small_sample: boolean;
        global_counts: Record<string, number>;
      } | null;
    };
    new_in_your_lane: {
      window_days: number;
      n: number;
      empty_warning: boolean;
      sites: {
        domain: string;
        subcategory: string | null;
        category: string | null;
        summary: string | null;
        replication_difficulty: string | null;
      }[];
    };
    what_changed: {
      changed_homepages_cumulative: number;
      cadence_note: string;
    };
    if_you_do_one_thing: {
      suggestion: string | null;
    };
  };
}

// ---------------------------------------------------------------------------
// HTML email renderer
// ---------------------------------------------------------------------------
// Email HTML is its own world: tables for layout, inline styles (many clients
// strip <style>), no flexbox/grid. Kept deliberately simple and text-forward
// — the digest's value is the data, not the design.

function esc(s: string | null | undefined): string {
  if (!s) return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderEmailHtml(d: DigestJSON, unsubscribeUrl: string): string {
  const s = d.sections;
  const scope = s.where_you_stand.category || "all categories";
  const cohort = s.where_you_stand.cohort;
  const pool = s.where_you_stand.pool_benchmark;

  const h2 = (text: string) =>
    `<h2 style="font-size:17px;font-weight:700;color:#18181b;margin:28px 0 12px 0;border-bottom:1px solid #e7e5e4;padding-bottom:6px;">${esc(text)}</h2>`;

  const sections: string[] = [];

  // ① Where you stand
  let s1 = h2("① Where you stand");
  if (cohort.n > 0) {
    s1 += `<p style="margin:0 0 8px 0;">Of <strong>${cohort.n}</strong> sites in <strong>${esc(scope)}</strong>:</p>`;
    s1 += `<ul style="margin:0 0 8px 0;padding-left:22px;">`;
    s1 += `<li><strong>${cohort.pct_pricing}%</strong> have a pricing page</li>`;
    s1 += `<li><strong>${cohort.pct_pay}%</strong> have a detected payment SDK</li></ul>`;
    const gap = pctGap(cohort.pct_pricing, cohort.pct_pay);
    if (gap !== 0) {
      s1 += `<p style="margin:0 0 8px 0;">That <strong>${gap}-point gap</strong> is the whole story. Almost everyone looks like they're selling. Almost nobody can actually collect.</p>`;
    }
    s1 += `<p style="margin:0 0 8px 0;">Across all <strong>${pool.n}</strong> enriched sites we track: <strong>${pool.pct_pricing}%</strong> priced, <strong>${pool.pct_pay}%</strong> able to charge.</p>`;
  }
  if (s.where_you_stand.category_leaderboard.length) {
    s1 += `<p style="margin:12px 0 6px 0;"><strong>Category leaderboard</strong> (detected payment SDK, n≥30):</p>`;
    s1 += `<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:8px;">`;
    s1 += `<tr><th align="left" style="padding:4px 8px;border-bottom:1px solid #e7e5e4;">Category</th><th align="right" style="padding:4px 8px;border-bottom:1px solid #e7e5e4;">n</th><th align="right" style="padding:4px 8px;border-bottom:1px solid #e7e5e4;">% payment</th></tr>`;
    for (const r of s.where_you_stand.category_leaderboard) {
      const you = r.category === s.where_you_stand.category ? " ← you" : "";
      s1 += `<tr><td style="padding:4px 8px;border-bottom:1px solid #f5f5f4;">${esc(r.category)}${you}</td><td align="right" style="padding:4px 8px;border-bottom:1px solid #f5f5f4;">${r.n}</td><td align="right" style="padding:4px 8px;border-bottom:1px solid #f5f5f4;">${r.pct_pay}%</td></tr>`;
    }
    s1 += `</table>`;
  }
  sections.push(s1);

  // ② Who is taking money
  let s2 = h2("② Who is taking money");
  if (s.who_is_taking_money.n === 0) {
    s2 += `<p style="margin:0 0 8px 0;color:#71717a;">No sites in ${esc(scope)} with a detected payment SDK yet.</p>`;
  } else {
    s2 += `<p style="margin:0 0 8px 0;">All <strong>${s.who_is_taking_money.n}</strong> sites in ${esc(scope)} with live payments:</p>`;
    s2 += `<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:8px;">`;
    for (const site of s.who_is_taking_money.sites) {
      const born = site.born ? ` <span style="color:#a1a1aa;">b.${esc(site.born)}</span>` : "";
      const summ = site.summary ? `<br><span style="color:#71717a;font-size:12px;">${esc(site.summary)}</span>` : "";
      s2 += `<tr><td style="padding:5px 8px;border-bottom:1px solid #f5f5f4;"><strong>${esc(site.domain)}</strong>${born} — ${esc(site.provider)}${summ}</td></tr>`;
    }
    s2 += `</table>`;
    const ins = s.who_is_taking_money.insight;
    if (ins) {
      const small = ins.small_sample ? " <em>(small n, treat as a lead, not a law)</em>" : "";
      const glob = Object.entries(ins.global_counts).map(([k, v]) => `${esc(k)}: ${v}`).join(", ");
      s2 += `<p style="margin:8px 0;padding:10px;background:#fafaf9;border-left:3px solid #0d9488;font-size:13px;">Signal: <strong>${ins.lead_n}</strong> of ${ins.total_n} use <strong>${esc(ins.lead_provider)}</strong> (${ins.lead_pct}%). Globally: ${esc(glob)}.${small}</p>`;
    }
  }
  sections.push(s2);

  // ③ New in your lane
  const s3 = s.new_in_your_lane;
  let s3html = h2("③ New in your lane");
  s3html += `<p style="margin:0 0 8px 0;">Last <strong>${s3.window_days} days</strong>, <strong>${s3.n}</strong> new site(s) entered the cohort.</p>`;
  if (s3.empty_warning) {
    s3html += `<p style="margin:0 0 8px 0;color:#71717a;">None in the last ${s3.window_days} days. This happens because enrichment is batched — widen the window or rely on ① and ②.</p>`;
  } else {
    s3html += `<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:8px;">`;
    for (const site of s3.sites) {
      const sub = site.subcategory || site.category || "—";
      const rd = site.replication_difficulty ? ` <span style="color:#a1a1aa;">[diff: ${esc(site.replication_difficulty)}]</span>` : "";
      const summ = site.summary ? `<br><span style="color:#71717a;font-size:12px;">${esc(site.summary)}</span>` : "";
      s3html += `<tr><td style="padding:5px 8px;border-bottom:1px solid #f5f5f4;"><strong>${esc(site.domain)}</strong> — ${esc(sub)}${rd}${summ}</td></tr>`;
    }
    s3html += `</table>`;
  }
  sections.push(s3html);

  // ④ What changed
  const s4 = s.what_changed;
  let s4html = h2("④ What changed");
  s4html += `<p style="margin:0 0 8px 0;">Since we first started tracking, <strong>${s4.changed_homepages_cumulative}</strong> site(s) changed their homepage at least once.</p>`;
  s4html += `<p style="margin:0 0 8px 0;color:#71717a;font-size:12px;">${esc(s4.cadence_note)}</p>`;
  sections.push(s4html);

  // ⑤ If you do one thing
  const s5 = s.if_you_do_one_thing;
  let s5html = h2("⑤ If you do one thing");
  if (s5.suggestion) {
    s5html += `<p style="margin:0 0 8px 0;">${esc(s5.suggestion)}</p>`;
  }
  sections.push(s5html);

  // Honesty notes footer
  const notes: string[] = [
    `"detected payment SDK" ≠ "actually monetizing" — page-scan is a lower bound; checkout-only SDKs on sub-pages are missed.`,
    `We never infer "dead" — ④ only reports homepage changes or reachability.`,
  ];
  if (s.who_is_taking_money.small_sample) {
    notes.push(`Provider insight based on n&lt;30 — treat as a lead, not a law.`);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GrowthRadar Digest</title></head>
<body style="margin:0;padding:0;background:#fafaf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e7e5e4;border-radius:8px;padding:28px 32px;">
        <tr><td>
          <p style="font-size:11px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:#0d9488;margin:0 0 4px 0;">GrowthRadar Digest</p>
          <h1 style="font-size:22px;font-weight:800;margin:0 0 4px 0;">Your weekly cohort update</h1>
          <p style="font-size:13px;color:#71717a;margin:0 0 8px 0;">${esc(d.generated_date)} · ${esc(scope)}</p>
          ${sections.join("\n          ")}
          <hr style="border:none;border-top:1px solid #e7e5e4;margin:24px 0 12px 0;">
          <p style="font-size:11px;color:#a1a1aa;margin:0 0 8px 0;"><strong>Notes:</strong></p>
          <ul style="font-size:11px;color:#a1a1aa;margin:0 0 16px 0;padding-left:18px;">
            ${notes.map((n) => `<li>${n}</li>`).join("\n            ")}
          </ul>
          <p style="font-size:12px;color:#71717a;margin:0 0 4px 0;">— GrowthRadar · Tracked from the day the domain appeared.</p>
          <p style="font-size:11px;color:#a1a1aa;margin:12px 0 0 0;">
            You're receiving this because you subscribed at growthlanding.ai.
            <a href="${esc(unsubscribeUrl)}" style="color:#0d9488;">Unsubscribe</a>.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// Null-safe gap calc (pct_pricing - pct_pay), returns 0 if either is null.
function pctGap(a: number | null, b: number | null): number {
  if (a == null || b == null) return 0;
  return Math.round(a - b);
}

// ---------------------------------------------------------------------------
// Resend batch send
// ---------------------------------------------------------------------------
const BATCH_SIZE = 100; // Resend /emails/batch max per call

async function sendBatch(
  apiKey: string,
  emails: { to: string; html: string; subject: string; unsubscribeUrl: string; from: string }[]
): Promise<{ sent: number; failed: number; errors: string[] }> {
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);
    // Resend /emails/batch expects an array of single-email payloads.
    const payload = batch.map((e) => ({
      from: e.from,
      to: [e.to],
      subject: e.subject,
      html: e.html,
      headers: {
        "List-Unsubscribe": `<${e.unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    }));

    try {
      const resp = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        sent += batch.length;
        console.log(`  batch ${i / BATCH_SIZE + 1}: sent ${batch.length}`);
      } else {
        const text = await resp.text().catch(() => "");
        failed += batch.length;
        errors.push(`batch ${i / BATCH_SIZE + 1} (${resp.status}): ${text.slice(0, 200)}`);
        console.error(`  batch ${i / BATCH_SIZE + 1} FAILED (${resp.status}): ${text.slice(0, 200)}`);
      }
    } catch (err) {
      failed += batch.length;
      errors.push(`batch ${i / BATCH_SIZE + 1} threw: ${String(err).slice(0, 200)}`);
      console.error(`  batch ${i / BATCH_SIZE + 1} threw:`, err);
    }
  }
  return { sent, failed, errors };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const args = parseArgs();

  // 1. Load digest JSON
  const digestAbs = resolve(process.cwd(), args.digestPath);
  if (!existsSync(digestAbs)) {
    console.error(`ERROR: digest file not found: ${digestAbs}`);
    process.exit(1);
  }
  const digest: DigestJSON = JSON.parse(readFileSync(digestAbs, "utf-8"));
  console.log(`Loaded digest: ${digest.generated_date} · category=${digest.category || "ALL"}`);

  // 2. Resolve recipients
  let recipients: string[];
  if (args.to) {
    recipients = [args.to];
    console.log(`--to override: sending only to ${args.to}`);
  } else {
    const dbUrl =
      process.env.growthlanding_ai_DATABASE_URL || process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error("ERROR: no DATABASE_URL for Neon (need it to read subscribers)");
      process.exit(1);
    }
    const sql = neon(dbUrl);
    const rows = await sql`SELECT email FROM subscribers WHERE status = 'subscribed' ORDER BY id`;
    recipients = rows.map((r: { email: string }) => r.email);
    if (recipients.length === 0) {
      console.error(
        "No subscribed recipients (all are 'pending'). Use --to you@email.com to send a test."
      );
      process.exit(1);
    }
    console.log(`Recipients: ${recipients.length} subscribed reader(s)`);
  }

  // 3. Build per-recipient email payloads
  const subject = `GrowthRadar Digest — ${digest.generated_date}${
    digest.category ? ` (${digest.category})` : ""
  }`;
  const emails = recipients.map((email) => {
    const unsubscribeUrl = `https://growthlanding.ai/unsubscribe?email=${encodeURIComponent(email)}`;
    return {
      to: email,
      from: args.from,
      subject,
      html: renderEmailHtml(digest, unsubscribeUrl),
      unsubscribeUrl,
    };
  });

  // 4. Dry-run: preview + stop
  if (args.dryRun) {
    console.log("\n=== DRY RUN (no emails sent) ===");
    console.log(`Would send ${emails.length} email(s):`);
    emails.forEach((e) => console.log(`  → ${e.to}`));
    console.log(`\nSubject: ${subject}`);
    console.log(`From: ${args.from}`);
    console.log(`\n--- HTML preview (first 1500 chars) ---\n`);
    console.log(emails[0].html.slice(0, 1500));
    console.log("\n...(truncated)...");
    return;
  }

  // 5. Send
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("ERROR: RESEND_API_KEY not set in .env.local");
    process.exit(1);
  }
  console.log(`\nSending ${emails.length} email(s) via Resend batch...`);
  const result = await sendBatch(apiKey, emails);
  console.log(`\n=== DONE ===`);
  console.log(`  sent:   ${result.sent}`);
  console.log(`  failed: ${result.failed}`);
  if (result.errors.length) {
    console.log(`  errors:`);
    result.errors.forEach((e) => console.log(`    - ${e}`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
