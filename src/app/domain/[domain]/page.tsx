import type { Metadata } from "next";
import Header from "@/components/Header";
import DomainDetailClient from "@/components/DomainDetailClient";

/** Detail page for a single domain. The body is a client component that
 * loads its data from the sharded detail JSON by first char. */
export default async function DomainPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  return (
    <>
      <Header />
      <main className="flex-1 pb-16">
        <DomainDetailClient domain={decodeURIComponent(domain)} />
      </main>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  const d = decodeURIComponent(domain);
  return {
    title: `${d} — GrowthRadar`,
    description: `Opportunity analysis for ${d}: signals, score breakdown, and survival status.`,
  };
}
