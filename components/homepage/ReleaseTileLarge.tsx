import Link from "next/link";

import { brandLabels, sportConfig } from "@/lib/sport-config";
import { cn } from "@/lib/utils";
import type { Release } from "@/types/release";

import { ReleaseHeroMedia } from "./ReleaseHeroMedia";

function formatReleaseDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  }).format(d);
}

function StatusChip({ status }: { status: Release["status"] }) {
  if (status === "released") return null;
  if (status === "preorder") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2.5 py-1 text-[11px] font-medium tracking-wide text-amber-400 uppercase">
        Preorder
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-violet-500/20 px-2.5 py-1 text-[11px] font-medium tracking-wide text-violet-400 uppercase">
      Announced
    </span>
  );
}

export function ReleaseTileLarge({ release }: { release: Release }) {
  const sport = sportConfig[release.sport];
  const brandLabel = brandLabels[release.brand] ?? release.brand;

  return (
    <Link
      href={`/releases/${release.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60",
        "transition will-change-transform hover:scale-[1.01] hover:border-zinc-600",
      )}
    >
      <div className={cn("absolute left-0 top-0 h-full w-1", sport.bgClass)} />

      <div className="pl-1">
        <ReleaseHeroMedia
          src={release.heroImage}
          alt={release.title}
          aspectClass="aspect-[4/5]"
          tintBgClass={`${sport.bgClass}/20`}
          sportLabel={sport.label}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />

        <div className="space-y-3 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11px] font-medium tracking-wide text-paper/80 uppercase">
              {brandLabel}
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase",
                sport.textClass,
              )}
            >
              {sport.label}
            </span>
            <StatusChip status={release.status} />
          </div>

          <h3 className="text-2xl leading-tight sm:text-3xl">
            <span className="line-clamp-2">{release.shortTitle ?? release.title}</span>
          </h3>

          <div className="tabular text-sm text-zinc-500">{formatReleaseDate(release.releaseDate)}</div>

          <p className="line-clamp-3 text-sm italic text-zinc-300">{release.tagline}</p>
        </div>
      </div>
    </Link>
  );
}

