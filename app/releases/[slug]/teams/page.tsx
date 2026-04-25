import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ReleaseSubNav } from "@/components/release/ReleaseSubNav";
import { TeamsBrowser } from "@/components/release/teams/TeamsBrowser";
import { parseTeamsSearchParams } from "@/lib/teams-filters";
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
    return { title: "Teams — Rip Report", description: "Teams explorer not available." };
  }
  const title = `${bundle.title} — Teams — Rip Report`;
  const description = `Cards-by-team charting and per-team roster drilldowns for ${bundle.shortTitle ?? bundle.title}.`;
  return { title, description, openGraph: { title, description } };
}

export default async function TeamsPage({
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
  const teams = bundle?._loaded?.teams;
  if (!bundle || !teams) notFound();

  const sport = sportConfig[bundle.sport];
  const initial = parseTeamsSearchParams(sp);

  return (
    <main>
      <ReleaseSubNav slug={slug} current="teams" activeBorderClass={cn("border-b-2", sport.borderClass)} />

      <header className="border-b border-zinc-800/80 bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Teams explorer</p>
          <h1 className="mt-2 font-serif text-3xl text-paper sm:text-4xl">{bundle.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
            League tabs (NBA / NCAA Men / NCAA Women), chart-ready team counts, and drilldowns that make autograph
            availability visually obvious. URL updates when you hit <strong className="text-zinc-300">Apply</strong>.
          </p>
        </div>
      </header>

      <TeamsBrowser slug={slug} data={teams} imagery={bundle._loaded?.imagery} initial={initial} />
    </main>
  );
}

