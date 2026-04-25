import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ReleaseSubNav } from "@/components/release/ReleaseSubNav";
import { InsightsStage1 } from "@/components/release/insights/InsightsStage1";
import { parseInsightsSearchParams } from "@/lib/insights-filters";
import { sportConfig } from "@/lib/sport-config";
import { getV2ReleaseSlugs } from "@/lib/v2-release-slugs";
import { isV2ReleaseBundle, loadV2ReleaseBundle } from "@/lib/v2-release";
import { cn } from "@/lib/utils";

type PageParams = { slug: string };
type Search = Record<string, string | string[] | undefined>;

export async function generateStaticParams() {
  return getV2ReleaseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bundle = isV2ReleaseBundle(slug) ? loadV2ReleaseBundle(slug) : null;
  if (!bundle) {
    return { title: "Insights — Rip Report", description: "Insights not available." };
  }
  const title = `${bundle.title} — Insights — Rip Report`;
  const description = `Tile deck, player rainbows, and takeaways for ${bundle.shortTitle ?? bundle.title}.`;
  return { title, description, openGraph: { title, description } };
}

export default async function InsightsPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<Search>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  if (!isV2ReleaseBundle(slug)) notFound();
  const bundle = loadV2ReleaseBundle(slug);
  const insights = bundle?._loaded?.insights;
  if (!bundle || !insights) notFound();

  const sport = sportConfig[bundle.sport];
  const initial = parseInsightsSearchParams(sp);
  const oddsPdfUrl =
    bundle._loaded?.resources?.officialResources?.find((r) => r.type === "odds-pdf")?.url ?? undefined;

  return (
    <main>
      <ReleaseSubNav slug={slug} current="insights" activeBorderClass={cn("border-b-2", sport.borderClass)} />

      <header className="border-b border-zinc-800/80 bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Insights</p>
          <h1 className="mt-2 font-serif text-3xl text-paper sm:text-4xl">{bundle.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
            Stage 1: tiles + structure only (no custom charts yet). URL updates when you hit{" "}
            <strong className="text-zinc-300">Apply</strong>.
          </p>
        </div>
      </header>

      <InsightsStage1
        slug={slug}
        data={insights}
        imagery={bundle._loaded?.imagery}
        initial={initial}
        oddsPdfUrl={oddsPdfUrl}
      />
    </main>
  );
}

