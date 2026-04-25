"use client";

import { BarChart3, Hash, Layers, User, Users } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { ImageryData } from "@/types/imagery";
import type { InsightTile, InsightsData, PlayerRainbow } from "@/types/insights";
import { cn } from "@/lib/utils";
import type { InsightsInitialFilters } from "@/lib/insights-filters";

import { OverviewImage } from "../overview/OverviewImage";

type Props = {
  slug: string;
  data: InsightsData;
  imagery: ImageryData | undefined;
  initial: InsightsInitialFilters;
};

function buildSearchParams(slug: string, s: InsightsInitialFilters): string {
  const p = new URLSearchParams();
  if (s.q.trim()) p.set("q", s.q.trim());
  const qs = p.toString();
  return qs ? `/releases/${slug}/insights?${qs}` : `/releases/${slug}/insights`;
}

function IconForTile({ tile, imagery, className }: { tile: InsightTile; imagery: ImageryData | undefined; className?: string }) {
  const asset =
    tile.iconSlug && imagery?.images?.[tile.iconSlug] && typeof imagery.images[tile.iconSlug] === "object"
      ? imagery.images[tile.iconSlug]
      : undefined;
  if (asset?.path) {
    return <OverviewImage src={asset.path} alt={asset.alt ?? tile.headline} className={cn("shrink-0 rounded-md object-cover", className)} />;
  }

  const common = cn("shrink-0 rounded-md border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400", className);
  switch (tile.iconType) {
    case "player":
      return <User className={common} aria-hidden />;
    case "team":
      return <Users className={common} aria-hidden />;
    case "parallel":
      return <Layers className={common} aria-hidden />;
    case "chart":
      return <BarChart3 className={common} aria-hidden />;
    case "number":
    default:
      return <Hash className={common} aria-hidden />;
  }
}

function FeaturedVizPlaceholderNav() {
  const items = [
    { id: "viz-panini-shadow", label: "Panini shadow" },
    { id: "viz-mojo-ladder", label: "Mojo ladder" },
    { id: "viz-case-hit-bubbles", label: "Case hit bubbles" },
    { id: "viz-young-kings-timeline", label: "Young Kings timeline" },
    { id: "viz-identical-insert-quartet", label: "Identical insert quartet" },
  ];
  return (
    <nav className="mt-8 rounded-2xl border border-zinc-800/80 bg-zinc-950/35 p-5" aria-label="Featured visualizations">
      <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Featured visualizations</p>
      <p className="mt-2 text-sm text-zinc-400">
        Stage 1 reserves these slots. Stage 2 and Stage 3 will fill them with real charts.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className="rounded-md border border-zinc-800 bg-black/20 px-3 py-2 text-sm text-zinc-300 hover:border-zinc-600"
          >
            {it.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function VizPlaceholder({ id, title, subtitle }: { id: string; title: string; subtitle: string }) {
  return (
    <section id={id} className="mt-10 rounded-2xl border border-dashed border-zinc-800/80 bg-zinc-950/20 p-6">
      <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Reserved</p>
      <h2 className="mt-2 font-serif text-2xl text-paper">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm text-zinc-400">{subtitle}</p>
      <div className="mt-6 h-48 rounded-xl border border-zinc-800 bg-black/20" />
    </section>
  );
}

function PlayerRainbowCard({ r }: { r: PlayerRainbow }) {
  const totalInserts = (r as unknown as { insertAppearances?: number }).insertAppearances;
  const totalAutoSets = (r as unknown as { autoSetSlugs?: string[] }).autoSetSlugs?.length;
  const insertSets = (r as unknown as { insertSetSlugs?: string[] }).insertSetSlugs?.length;

  return (
    <article className="rounded-2xl border border-zinc-800/80 bg-zinc-950/35 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-2xl text-paper">{r.playerName}</h3>
          <p className="mt-1 text-sm text-zinc-500">
            <span className="tabular-nums text-paper">{r.totalParallels}</span> total parallels
            {r.rarestParallelSlug ? <span className="ml-2 font-mono text-xs text-zinc-600">rarest: {r.rarestParallelSlug}</span> : null}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {typeof insertSets === "number" ? (
            <span className="rounded bg-zinc-900 px-2 py-1 text-zinc-300">
              <span className="tabular-nums">{insertSets}</span> inserts
            </span>
          ) : null}
          {typeof totalAutoSets === "number" ? (
            <span className="rounded bg-zinc-900 px-2 py-1 text-zinc-300">
              <span className="tabular-nums">{totalAutoSets}</span> auto sets
            </span>
          ) : null}
          {typeof totalInserts === "number" ? (
            <span className="rounded bg-zinc-900 px-2 py-1 text-zinc-300">
              <span className="tabular-nums">{totalInserts}</span> insert apps
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {r.breakdown.map((b) => (
          <div key={b.groupName} className="rounded-xl border border-zinc-800/80 bg-black/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="font-medium text-paper">{b.groupName}</div>
              <div className="text-xs text-zinc-500 tabular-nums">{b.parallelSlugs.length}</div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {b.parallelSlugs.slice(0, 18).map((s) => (
                <span key={s} className="rounded bg-zinc-900 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                  {s}
                </span>
              ))}
              {b.parallelSlugs.length > 18 ? (
                <span className="rounded bg-zinc-950 px-2 py-0.5 text-[10px] text-zinc-600 ring-1 ring-zinc-800">
                  +{b.parallelSlugs.length - 18} more
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-zinc-600">
        Stage 1: this is a synthesis placeholder using <code className="rounded bg-black/30 px-1">playerRainbows</code>. Stage 2/3 will
        make these feel less like a checklist by adding richer joins and viz.
      </p>
    </article>
  );
}

function FunTakeaways({ items }: { items: InsightsData["funTakeaways"] }) {
  if (!items?.length) return null;
  return (
    <section className="mt-12 rounded-2xl border border-zinc-800/80 bg-zinc-950/35 p-6">
      <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Fun takeaways</p>
      <h2 className="mt-2 font-serif text-2xl text-paper">Things you’ll quote in a group chat</h2>
      <div className="mt-6 space-y-6">
        {items.slice(0, 5).map((t) => (
          <article key={t.headline} className="max-w-3xl">
            <h3 className="font-serif text-xl text-paper">{t.headline}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">{t.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function InsightsStage1({ slug, data, imagery, initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState(initial.q);

  const featured = data.featuredTiles.slice(0, 6);

  const allTiles = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return data.allTiles;
    return data.allTiles.filter((t) => `${t.headline} ${t.stat} ${t.caption} ${t.slug}`.toLowerCase().includes(needle));
  }, [data.allTiles, q]);

  const secondary = allTiles.filter((t) => t.tier !== "featured");

  const apply = () => startTransition(() => router.replace(buildSearchParams(slug, { q })));
  const reset = () => {
    setQ("");
    startTransition(() => router.replace(`/releases/${slug}/insights`));
  };

  return (
    <div className={cn("mx-auto max-w-6xl px-5 py-8 sm:px-8", isPending && "opacity-70")}>
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-end">
        <label className="block min-w-[240px] flex-1 text-xs text-zinc-500">
          Search tiles
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-paper"
            placeholder="Boozer, Mojo, no autos…"
          />
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={apply}
            className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white"
          >
            Apply &amp; share URL
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:border-zinc-500"
          >
            Reset
          </button>
        </div>
      </div>

      <FeaturedVizPlaceholderNav />

      {/* Stage 1: reserve featured viz slots */}
      <VizPlaceholder id="viz-panini-shadow" title="Panini shadow" subtitle="Draft picks vs autograph access (Stage 2)." />
      <VizPlaceholder id="viz-mojo-ladder" title="Mojo ladder" subtitle="Mega-only rainbow as a ladder visualization (Stage 2)." />
      <VizPlaceholder id="viz-case-hit-bubbles" title="Case hit bubbles" subtitle="Relative pull difficulty vs set size (Stage 2)." />
      <VizPlaceholder id="viz-young-kings-timeline" title="Young Kings timeline" subtitle="Current vs legend eras over time (Stage 3)." />
      <VizPlaceholder id="viz-identical-insert-quartet" title="Identical insert quartet" subtitle="The four-insert padding story (Stage 3)." />

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-paper sm:text-3xl">Featured insights</h2>
        <p className="mt-2 max-w-3xl text-sm text-zinc-400">
          Six tiles — heavier typography and larger cards. These should read like editorial statements, not a wall of cards.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tile) => (
            <article
              key={tile.slug}
              className="flex min-h-[260px] flex-col rounded-2xl border border-zinc-700/80 bg-zinc-950/45 p-5"
            >
              <div className="flex items-start gap-3">
                <IconForTile tile={tile} imagery={imagery} className="h-12 w-12" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-lg leading-snug text-paper line-clamp-2">{tile.headline}</h3>
                  <p className="mt-2 text-base font-semibold leading-snug text-emerald-200/95 line-clamp-2 min-h-[2.5rem]">
                    {tile.stat}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-snug text-zinc-300 line-clamp-5">{tile.caption}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-paper sm:text-3xl">All insights</h2>
        <p className="mt-2 max-w-3xl text-sm text-zinc-400">
          {allTiles.length} tiles total. Secondary tiles are intentionally lighter — supporting evidence, not equal billing.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {secondary.map((tile) => (
            <article
              key={tile.slug}
              className="flex min-h-[220px] flex-col rounded-xl border border-zinc-800/80 bg-zinc-950/30 p-4"
            >
              <div className="flex items-start gap-3">
                <IconForTile tile={tile} imagery={imagery} className="h-10 w-10" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-base leading-snug text-paper line-clamp-2">{tile.headline}</h3>
                  <p className="mt-2 text-sm font-semibold leading-snug text-emerald-200/90 line-clamp-2 min-h-[2.25rem]">
                    {tile.stat}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-snug text-zinc-400 line-clamp-4">{tile.caption}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-paper sm:text-3xl">Player rainbows</h2>
        <p className="mt-2 max-w-3xl text-sm text-zinc-400">
          Five deep dives meant to read like synthesis (parallels + insert appearances + auto set presence), not a rehash of the Checklist.
        </p>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {data.playerRainbows.slice(0, 5).map((r) => (
            <PlayerRainbowCard key={r.playerSlug} r={r} />
          ))}
        </div>
      </section>

      <FunTakeaways items={data.funTakeaways} />

      <p className="mt-12 max-w-3xl text-xs leading-relaxed text-zinc-600">
        Stage 1 intentionally avoids custom visualizations. Stage 2 and Stage 3 will fill the reserved viz sections once the tile tone and page rhythm feel right.
      </p>
    </div>
  );
}

