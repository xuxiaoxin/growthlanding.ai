/**
 * Playbook content access layer (build time, server-only).
 *
 * Playbooks are evergreen "method + how-to" guides for solo founders, authored
 * as MDX under /content/playbooks (intentionally OUTSIDE src/app so the MDX
 * files are never mistaken for routes once pageExtensions includes mdx). This
 * module is the single read path used by the /playbooks routes.
 *
 * Design decisions (see SPEC-001 B.2):
 *  - **Static import map, NOT glob dynamic import.** `import(`@/.../${slug}.mdx`)`
 *    with a template string fails TypeScript (`Cannot find module`), and the
 *    `export const metadata` runtime value is only reachable via a real import
 *    (fs would just read the source string). So each article has an explicit
 *    entry in the `modules` map below. Adding an article = add one import line.
 *    This is intentional ("explicit over implicit") — it avoids a TS type hole
 *    and makes the article roster grep-able.
 *  - **No YAML frontmatter.** Article meta is a JS `export const metadata`
 *    (named export), read off the module as `mod.metadata`. Do not confuse this
 *    with Next.js's `generateMetadata` function.
 *  - **fs is only used to list filenames** (so generateStaticParams knows which
 *    slugs exist); the component + meta always come from the static import.
 *
 * Desensitization: this module touches no detection-signal fields whatsoever.
 */

import { readdirSync } from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
// ComponentType is used in the getPlaybook return type below.

// --- Type declarations -------------------------------------------------------

/** Fixed category enum — do not invent new values outside this list. */
export type PlaybookCategory = "discovery" | "validation" | "build" | "growth";

export type PlaybookMeta = {
  title: string;
  description: string;
  slug: string;
  category?: PlaybookCategory;
  order?: number;
};

/**
 * Ambient module augmentation: add the named `metadata` export to every .mdx
 * import. The default export (the React component) is already typed by
 * `@types/mdx` (which ships `declare module "*.mdx" { export default function
 * MDXContent(...): Element }`), so here we only need to declare the named
 * `metadata` export our playbook MDX files use. See the @types/mdx docstring
 * for the augmentation pattern.
 *
 * Note: the named export name is `metadata` (the const inside each .mdx), NOT
 * Next.js's `generateMetadata` function — they are unrelated.
 */
declare module "*.mdx" {
  export const metadata: PlaybookMeta;
}

// --- Slug discovery (fs, build time only) -----------------------------------

const DIR = path.join(process.cwd(), "content", "playbooks");

/**
 * All playbook slugs, derived from the .mdx filenames in /content/playbooks.
 * Used by generateStaticParams. fs is read at build time only.
 */
export function getAllPlaybookSlugs(): string[] {
  return readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

// --- Article loader (static import map) -------------------------------------

/**
 * Resolve a slug to its compiled MDX module (React component + metadata).
 *
 * The map below is the single source of truth for which articles are published.
 * To add a playbook: drop the .mdx into /content/playbooks, then add one entry
 * here. Returns null for unknown slugs so the caller can notFound().
 *
 * NOTE: the dynamic `import()` calls here are on string literals (not template
 * strings), so TypeScript resolves each module path concretely via the
 * `declare module "*.mdx"` ambient type.
 *
 * Path note: the spec skeleton used `@/content/...`, but this project's
 * tsconfig maps `@/*` → `./src/*`, and /content lives OUTSIDE src/ (by design,
 * so MDX isn't mistaken for routes). Rather than touch tsconfig (out of scope
 * per the spec's file allow-list), the imports use relative paths from
 * src/lib/ to the root /content directory. Same static-import-map design.
 */
export async function getPlaybook(slug: string): Promise<{
  Content: ComponentType<Record<string, unknown>>;
  meta: PlaybookMeta;
} | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modules: Record<string, () => Promise<any>> = {
    "find-what-to-build": () => import("../../content/playbooks/find-what-to-build.mdx"),
    "research-competitors": () => import("../../content/playbooks/research-competitors.mdx"),
  };
  const loader = modules[slug];
  if (!loader) return null;
  const mod = await loader();
  return { Content: mod.default, meta: mod.metadata };
}

/**
 * All playbooks with their metadata, sorted by category then order then title.
 * Used by the /playbooks index page to render grouped lists.
 */
export async function getAllPlaybooks(): Promise<
  { slug: string; meta: PlaybookMeta }[]
> {
  const slugs = getAllPlaybookSlugs();
  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const pb = await getPlaybook(slug);
      return pb ? { slug, meta: pb.meta } : null;
    }),
  );
  return entries
    .filter((e): e is { slug: string; meta: PlaybookMeta } => e !== null)
    .sort((a, b) => {
      const ca = a.meta.category ?? "discovery";
      const cb = b.meta.category ?? "discovery";
      if (ca !== cb) return ca.localeCompare(cb);
      const oa = a.meta.order ?? 99;
      const ob = b.meta.order ?? 99;
      if (oa !== ob) return oa - ob;
      return a.meta.title.localeCompare(b.meta.title);
    });
}
