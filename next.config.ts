import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Allow .md/.mdx files to be treated as routes/pages. Order per the official
  // Next.js MDX guide. Playbook article sources live under /content (outside
  // src/app) and are only loaded via dynamic import in src/lib/playbooks.ts, so
  // this does NOT accidentally turn them into routes.
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
