import Link from "next/link";

import type { ImageryData } from "@/types/imagery";
import type { InsertData, InsertSet } from "@/types/inserts";
import { cn } from "@/lib/utils";

import { OverviewImage } from "./OverviewImage";
import { OverviewShell } from "./OverviewShell";

type Props = {
  slug: string;
  inserts: InsertData | undefined;
  imagery: ImageryData | undefined;
};

function tierToPosition(tier: InsertSet["editorialTier"]): number {
  if (tier === "chase") return 92;
  if (tier === "notable") return 62;
  return 18; // common + filler
}

function tierToChipClasses(tier: InsertSet["editorialTier"]): string {
  if (tier === "chase") return "border-amber-500/30 bg-amber-500/10 text-amber-200";
  if (tier === "notable") return "border-sky-500/30 bg-sky-500/10 text-sky-200";
  return "border-zinc-700/70 bg-zinc-900/60 text-zinc-200";
}

export default function InsertsTeaser({ slug, inserts, imagery }: Props) {
  if (!inserts?.sets?.length) return null;

  const lead = inserts.editorial?.overview?.trim();

  const byTier = {
    chase: inserts.sets.filter((s) => s.editorialTier === "chase"),
    notable: inserts.sets.filter((s) => s.editorialTier === "notable"),
    common: inserts.sets.filter((s) => s.editorialTier === "common"),
  };

  const spectrum: InsertSet[] = [
    byTier.common[0],
    byTier.notable[0],
    byTier.chase[0],
    byTier.chase[1],
    byTier.notable[1],
  ].filter(Boolean) as InsertSet[];

  const highlights = byTier.chase.slice(0, 3);

  return (
    <OverviewShell id="overview-mod-inserts" eyebrow="THE INSERTS">
      <h2 className="font-serif text-2xl text-paper sm:text-3xl">Not all inserts are equal</h2>
      {lead ? <p className="mt-2 max-w-3xl text-sm text-zinc-400">{lead}</p> : null}

      <div className="mt-8 rounded-xl border border-zinc-800/90 bg-zinc-950/40 p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>Common</span>
          <span>Rare</span>
          <span>Ultra Rare</span>
        </div>
        <div className="relative mt-3 h-10 overflow-hidden rounded-full border border-zinc-800 bg-zinc-900/60">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-zinc-950/20" />
          <div className="absolute inset-y-0 left-1/3 w-1/3 bg-zinc-950/10" />
          <div className="absolute inset-y-0 left-2/3 w-1/3 bg-zinc-950/0" />

          {spectrum.map((s) => {
            const left = tierToPosition(s.editorialTier);
            const img = s.imageSlug && imagery?.images?.[s.imageSlug]?.path ? imagery.images[s.imageSlug] : undefined;
            return (
              <div
                key={s.slug}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${left}%`, transform: "translate(-50%, -50%)" }}
              >
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-2 py-1 text-[11px] font-medium shadow-sm",
                    tierToChipClasses(s.editorialTier),
                  )}
                >
                  {img?.path ? (
                    <OverviewImage src={img.path} alt={img.alt ?? s.name} className="h-4 w-4 rounded object-cover" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-current opacity-70" aria-hidden />
                  )}
                  <span className="max-w-[160px] truncate">{s.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {highlights.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((s) => {
            const img = s.imageSlug && imagery?.images?.[s.imageSlug]?.path ? imagery.images[s.imageSlug] : undefined;
            return (
              <article key={s.slug} className="rounded-xl border border-zinc-800/90 bg-zinc-950/40 p-4">
                <div className="flex items-start gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-zinc-900">
                    {img?.path ? (
                      <OverviewImage src={img.path} alt={img.alt ?? s.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-zinc-500">Insert</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-lg leading-snug text-paper">{s.name}</h3>
                    {s.editorialNote?.trim() ? (
                      <p className="mt-1 text-sm leading-snug text-zinc-400">{s.editorialNote.trim()}</p>
                    ) : (
                      <p className="mt-1 text-sm leading-snug text-zinc-500">
                        Ultra-rare tier insert set. Full checklist + odds on the Inserts page.
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      <p className="mt-8 text-sm text-zinc-500">
        <Link
          href={`/releases/${slug}/inserts`}
          className="font-medium text-emerald-400/90 underline-offset-2 hover:text-emerald-300 hover:underline"
        >
          Explore every insert
        </Link>
        <span className="text-zinc-600"> — set-by-set odds, checklists, and rarity tiers.</span>
      </p>
    </OverviewShell>
  );
}

