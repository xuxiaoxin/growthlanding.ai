/**
 * Global MDX component map — required by the App Router when using @next/mdx.
 *
 * Maps HTML elements rendered from markdown (h1, p, a, ...) to React components.
 * Returning an empty object uses the default element mappings, which is fine for
 * the playbook article container (content is authored as plain markdown + a few
 * imported components like <DomainCard />).
 *
 * Reference: node_modules/next/dist/docs/01-app/02-guides/mdx.md
 */
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
