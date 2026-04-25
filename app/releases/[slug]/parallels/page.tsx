import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ParallelsExplorer } from "@/components/release/parallels/ParallelsExplorer";
import { RainbowStripSummary } from "@/components/release/parallels/RainbowStripSummary";
import { ReleaseSubNav } from "@/components/release/ReleaseSubNav";
import { pickRainbowStrip } from "@/lib/pick-rainbow-strip";
import { parseParallelsSearchParams } from "@/lib/parallels-filters";
import { sportConfig } from "@/lib/sport-config";
import { getV2ReleaseSlugs } from "@/lib/v2-release-slugs";
import { isV2ReleaseBundle, loadV2ReleaseBundle } from "@/lib/v2-release";
import { cn } from "@/lib/utils";
import { parallelVariationCount } from "@/lib/overview-stats";

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
    return { title: "Parallels — Rip Report", description: "Parallels explorer not available." };
  }
  const title = `${bundle.title} — Parallels — Rip Report`;
  const description = `Parallel ladders, pack odds, and format exclusivity for ${bundle.shortTitle ?? bundle.title}.`;
  return { title, description, openGraph: { title, description } };
}

export default async function ParallelsPage({
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
  const parallels = bundle?._loaded?.parallels;
  if (!bundle || !parallels) notFound();

  const sport = sportConfig[bundle.sport];
  const initial = parseParallelsSearchParams(sp);
  const allParallels = parallels.groups.flatMap((g) => g.parallels ?? []);
  const strip = pickRainbowStrip(allParallels, 14);
  const total = parallelVariationCount(parallels);

  return (
    <main>
      <ReleaseSubNav slug={slug} current="parallels" activeBorderClass={cn("border-b-2", sport.borderClass)} />

      <header className="border-b border-zinc-800/80 bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Parallel explorer</p>
          <h1 className="mt-2 font-serif text-3xl text-paper sm:text-4xl">{bundle.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
            Same rainbow teaser as{" "}
            <Link href={`/releases/${slug}#overview-mod-5`} className="text-emerald-400/90 underline hover:text-emerald-300">
              Overview → The Rainbow
            </Link>
            ; below is the full breakdown ({typeof total === "number" ? `${total} variations` : "all groups"}). Filters
            sync to the URL when you hit <strong className="text-zinc-300">Apply</strong>.
          </p>
        </div>
      </header>

      <section className="border-b border-zinc-800/80 bg-zinc-950/20">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <h2 className="font-serif text-xl text-paper sm:text-2xl">Rainbow summary</h2>
          <p className="mt-2 max-w-3xl text-sm text-zinc-400">{parallels.rainbowSummary.headlineStat}</p>
          <div className="mt-6">
            <RainbowStripSummary strip={strip} />
          </div>
        </div>
      </section>

      <ParallelsExplorer slug={slug} data={parallels} initial={initial} />
    </main>
  );
}
