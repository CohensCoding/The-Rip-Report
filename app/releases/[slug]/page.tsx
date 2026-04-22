import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AutographSection } from "@/components/release/AutographSection";
import { BoxFormats } from "@/components/release/BoxFormats";
import { ChaseCards } from "@/components/release/ChaseCards";
import { Commentary } from "@/components/release/Commentary";
import { InsertArchitecture } from "@/components/release/InsertArchitecture";
import { Links } from "@/components/release/Links";
import { ParallelLadder } from "@/components/release/ParallelLadder";
import { ReleaseHero } from "@/components/release/ReleaseHero";
import { TeamBreakdown } from "@/components/release/TeamBreakdown";
import { Verdict } from "@/components/release/Verdict";
import { getAllReleaseSlugs, getReleaseBySlug } from "@/lib/releases";

type PageParams = { slug: string };

export async function generateStaticParams() {
  return getAllReleaseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug } = await params;
  const release = getReleaseBySlug(slug);

  if (!release) {
    return {
      title: "Release not found — Rip Report",
      description: "This release breakdown is not available (yet).",
      openGraph: {
        title: "Release not found — Rip Report",
        description: "This release breakdown is not available (yet).",
      },
    };
  }

  const title = `${release.title} — Rip Report`;
  const description = release.summary?.trim() ? release.summary.trim() : release.tagline;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function ReleasePage({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const release = getReleaseBySlug(slug);
  if (!release) notFound();

  return (
    <main>
      <ReleaseHero release={release} />
      <Verdict release={release} />
      <BoxFormats release={release} />
      <ParallelLadder release={release} />
      <InsertArchitecture release={release} />
      <AutographSection release={release} />
      <TeamBreakdown release={release} />
      <Commentary release={release} />
      <ChaseCards release={release} />
      <Links release={release} />
    </main>
  );
}
