import { brandLabels, sportConfig } from "@/lib/sport-config";
import { cn } from "@/lib/utils";
import type { LegacyRelease } from "@/types/legacy-release";

import { formatLongDate } from "./_utils";
import { ReleaseHeroImage } from "./ReleaseHeroImage";

function StatusPill({ status }: { status: LegacyRelease["status"] }) {
  if (status === "released") return null;
  if (status === "dropped") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium tracking-wide text-emerald-300 uppercase">
        Latest drop
      </span>
    );
  }
  if (status === "preorder") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-medium tracking-wide text-amber-300 uppercase">
        Preorder
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-violet-500/15 px-2.5 py-1 text-[11px] font-medium tracking-wide text-violet-300 uppercase">
      Announced
    </span>
  );
}

export function ReleaseHero({ release }: { release: LegacyRelease }) {
  const sport = sportConfig[release.sport];
  const brand = brandLabels[release.brand] ?? release.brand;

  const kicker = `${formatLongDate(release.releaseDate)} · ${brand.toUpperCase()} · ${sport.label.toUpperCase()}`;

  return (
    <header className="relative">
      <div className={cn("h-2 w-full md:h-2.5", sport.bgClass)} />

      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
            <span className="tabular">{kicker}</span>
          </div>
          <StatusPill status={release.status} />
        </div>

        <h1 className="mt-6 text-4xl leading-[0.95] sm:text-6xl lg:text-7xl">{release.title}</h1>

        <p className="mt-6 max-w-3xl text-xl leading-relaxed text-zinc-300 sm:text-2xl">{release.tagline}</p>

        <div className="mt-10">
          <ReleaseHeroImage
            src={release.heroImage}
            alt={release.title}
            tintBgClass={`${sport.bgClass}/20`}
            sportLabel={sport.label}
          />
        </div>
      </div>
    </header>
  );
}
