import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ChecklistBrowser, type ChecklistInitialFilters } from "@/components/release/checklist/ChecklistBrowser";
import { ReleaseSubNav } from "@/components/release/ReleaseSubNav";
import { holyGrailKeysFromRelease } from "@/lib/holy-grail-keys";
import { sportConfig } from "@/lib/sport-config";
import { getV2ReleaseSlugs } from "@/lib/v2-release-slugs";
import { isV2ReleaseBundle, loadV2ReleaseBundle } from "@/lib/v2-release";
import { cn } from "@/lib/utils";
import type { Card } from "@/types/checklist";

type PageParams = { slug: string };

type Search = Record<string, string | string[] | undefined>;

function firstString(v: string | string[] | undefined): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return "";
}

function parsePreset(v: string): ChecklistInitialFilters["preset"] {
  if (v === "parallels" || v === "chase" || v === "grail" || v === "holy") return v;
  return "all";
}

function parseSort(v: string): ChecklistInitialFilters["sort"] {
  if (v === "player" || v === "team" || v === "rookie") return v;
  return "card";
}

function parseView(v: string): ChecklistInitialFilters["view"] {
  return v === "grid" ? "grid" : "table";
}

function parseInitial(sp: Search): ChecklistInitialFilters {
  const pageRaw = Number.parseInt(firstString(sp.page), 10);
  return {
    q: firstString(sp.q),
    subset: firstString(sp.subset),
    league: firstString(sp.league),
    teamSlug: firstString(sp.team),
    rookie: firstString(sp.rookie),
    auto: firstString(sp.auto),
    preset: parsePreset(firstString(sp.preset)),
    sort: parseSort(firstString(sp.sort)),
    view: parseView(firstString(sp.view)),
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1,
  };
}

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
    return { title: "Checklist — Rip Report", description: "Checklist not available." };
  }
  const title = `${bundle.title} — Checklist — Rip Report`;
  const description = `Full checklist for ${bundle.shortTitle ?? bundle.title}.`;
  return { title, description, openGraph: { title, description } };
}

function rarityTierUniform(cards: Card[]): boolean {
  const tiers = new Set(cards.map((c) => c.rarityTier).filter(Boolean));
  return tiers.size === 1 && tiers.has("holy-grail");
}

export default async function ChecklistPage({
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
  const checklist = bundle?._loaded?.checklist;
  if (!bundle || !checklist) notFound();

  const sport = sportConfig[bundle.sport];
  const initial = parseInitial(sp);
  const holyKeys = holyGrailKeysFromRelease(bundle.holyGrails);
  const uniform = rarityTierUniform(checklist.cards);

  return (
    <main>
      <ReleaseSubNav slug={slug} current="checklist" activeBorderClass={cn("border-b-2", sport.borderClass)} />

      <header className="border-b border-zinc-800/80 bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Checklist browser</p>
          <h1 className="mt-2 font-serif text-3xl text-paper sm:text-4xl">{bundle.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
            Every card in the release — search, filter, and expand rows for parallel ladders. URL updates when you hit{" "}
            <strong className="text-zinc-300">Apply</strong> so you can share a view.
          </p>
        </div>
      </header>

      <ChecklistBrowser
        slug={slug}
        cards={checklist.cards}
        imagery={bundle._loaded?.imagery}
        holyGrailKeys={holyKeys}
        initial={initial}
        rarityTierIsUniform={uniform}
      />
    </main>
  );
}
