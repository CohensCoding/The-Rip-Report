import { BarChart3, Hash, Layers, User, Users } from "lucide-react";

import type { ImageryData } from "@/types/imagery";
import type { InsightTile } from "@/types/insights";
import { cn } from "@/lib/utils";

import { OverviewImage } from "./OverviewImage";
import { OverviewShell } from "./OverviewShell";

type Props = {
  tiles: InsightTile[];
  imagery: ImageryData | undefined;
};

function IconForTile({
  tile,
  imagery,
}: {
  tile: InsightTile;
  imagery: ImageryData | undefined;
}) {
  const asset =
    tile.iconSlug && imagery?.images?.[tile.iconSlug] && typeof imagery.images[tile.iconSlug] === "object"
      ? imagery.images[tile.iconSlug]
      : undefined;
  if (asset && "path" in asset && asset.path) {
    return (
      <OverviewImage
        src={asset.path}
        alt={asset.alt ?? tile.headline}
        className="h-10 w-10 shrink-0 rounded-md object-cover"
      />
    );
  }

  const common = "h-10 w-10 shrink-0 rounded-md border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400";
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

/**
 * Module 7 — `featuredTiles` from `insights.json`.
 *
 * **Sourcing watch:** `iconSlug` values (e.g. `player-cooper-flagg`) may not exist in `imagery.json` yet;
 * we fall back to `iconType` glyphs so the grid never renders a broken <img> shell.
 * **Layout watch:** long `stat` strings (e.g. three player names) use `line-clamp-2` + `min-h` so cards stay even-height.
 */
export function Module7ByTheNumbers({ tiles, imagery }: Props) {
  const featured = tiles.filter((t) => t.tier === "featured").slice(0, 6);

  return (
    <OverviewShell id="overview-mod-7" eyebrow="BY THE NUMBERS">
      <div className="mb-8 max-w-3xl">
        <h2 className="font-serif text-2xl text-paper sm:text-3xl">What the data is screaming</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Six featured tiles from the Insights deck — same copy as the full Insights page will use later.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((tile) => (
          <article
            key={tile.slug}
            className="flex min-h-[220px] flex-col rounded-xl border border-zinc-800/90 bg-zinc-950/40 p-4 sm:p-5"
          >
            <div className="flex items-start gap-3">
              <IconForTile tile={tile} imagery={imagery} />
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-base leading-snug text-paper line-clamp-2">{tile.headline}</h3>
                <p
                  className={cn(
                    "mt-2 text-sm font-semibold tabular-nums leading-snug text-emerald-200/95",
                    "line-clamp-2 min-h-[2.5rem]",
                  )}
                >
                  {tile.stat}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-snug text-zinc-400 line-clamp-4">{tile.caption}</p>
          </article>
        ))}
      </div>

      <p className="mt-8 text-sm text-zinc-500">
        Full Insights page (charts + Patch 6 visualizations) comes after the rest of the sub-nav routes land.
      </p>
    </OverviewShell>
  );
}
