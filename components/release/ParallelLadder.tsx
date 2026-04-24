import { sportConfig } from "@/lib/sport-config";
import { cn } from "@/lib/utils";
import type {
  LegacyParallel,
  LegacyParallelGroup,
  LegacyRelease,
} from "@/types/legacy-release";

import { parallelBarWidthPercent, printRunDisplay } from "./_utils";
import { ReleaseSection } from "./Section";

function sortParallels(parallels: LegacyParallel[]): LegacyParallel[] {
  const key = (p: LegacyParallel) => {
    if (typeof p.printRun === "number" && Number.isFinite(p.printRun) && p.printRun > 0) return p.printRun;
    return Number.POSITIVE_INFINITY;
  };

  return [...parallels].sort((a, b) => key(a) - key(b));
}

function exclusivityChips(parallel: LegacyParallel) {
  const ex = parallel.exclusiveTo;
  if (!ex?.length) return null;

  const set = new Set(ex);
  const hobbyOnly = set.size === 1 && set.has("Hobby");
  const retailOnly = set.size === 1 && set.has("Retail");

  return (
    <div className="flex shrink-0 flex-wrap justify-end gap-2">
      {hobbyOnly ? (
        <span className="rounded-full border border-zinc-800 bg-zinc-900/40 px-2 py-0.5 text-[10px] font-medium tracking-wide text-zinc-300 uppercase">
          Hobby only
        </span>
      ) : null}
      {retailOnly ? (
        <span className="rounded-full border border-zinc-800 bg-zinc-900/40 px-2 py-0.5 text-[10px] font-medium tracking-wide text-zinc-300 uppercase">
          Retail exclusive
        </span>
      ) : null}
      {!hobbyOnly && !retailOnly && ex.length ? (
        <span className="rounded-full border border-zinc-800 bg-zinc-900/40 px-2 py-0.5 text-[10px] font-medium tracking-wide text-zinc-300 uppercase">
          Exclusive
        </span>
      ) : null}
    </div>
  );
}

function ParallelRow({
  release,
  parallel,
}: {
  release: LegacyRelease;
  parallel: LegacyParallel;
}) {
  const sport = sportConfig[release.sport];
  const widthPct = parallelBarWidthPercent(parallel);
  const run = printRunDisplay(parallel);

  const isTinyNumbered =
    typeof parallel.printRun === "number" &&
    Number.isFinite(parallel.printRun) &&
    parallel.printRun > 0 &&
    parallel.printRun <= 25;

  const vividness =
    typeof parallel.printRun === "number" && Number.isFinite(parallel.printRun) && parallel.printRun > 0
      ? Math.max(0.25, 1 - Math.log10(parallel.printRun) / 3.5)
      : 0.35;

  const hex = sport.hex.replace("#", "");
  const alpha = Math.round(Math.min(1, Math.max(0, vividness)) * 255)
    .toString(16)
    .padStart(2, "0");

  return (
    <div className="py-3">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-paper/90">{parallel.name}</div>
          {parallel.odds ? <div className="mt-1 text-xs text-zinc-500">{parallel.odds}</div> : null}
        </div>

        <div className="flex items-start gap-3">
          <div
            className={cn(
              "tabular text-right leading-none text-zinc-400",
              isTinyNumbered ? "text-2xl text-paper" : "text-lg",
            )}
          >
            {run.kind === "slash" ? (
              <span className="tabular">{run.value}</span>
            ) : (
              <span className="text-xs font-semibold tracking-[0.22em] text-zinc-400 uppercase">{run.value}</span>
            )}
          </div>
          {exclusivityChips(parallel)}
        </div>
      </div>

      <div className="mt-3 flex justify-center">
        <div
          className="relative h-2.5 overflow-hidden rounded-full bg-zinc-900"
          style={{ width: `${widthPct}%` }}
        >
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-r from-zinc-800 via-zinc-700 to-transparent",
              // sport tint on the “rarer” (right) edge
            )}
          />
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background: `linear-gradient(90deg, rgba(255,255,255,0.05), #${hex}${alpha})`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ParallelGroupBlock({
  release,
  group,
}: {
  release: LegacyRelease;
  group: LegacyParallelGroup;
}) {
  const parallels = sortParallels(group.parallels ?? []);

  return (
    <div className="mt-14 first:mt-0">
      <div className="text-sm font-medium tracking-wide text-zinc-400">{group.appliesTo}</div>
      <div className="mt-6 divide-y divide-zinc-900 rounded-2xl border border-zinc-900 bg-zinc-950/25 px-5 py-2 sm:px-6">
        {parallels.map((p) => (
          <ParallelRow key={`${group.appliesTo}:${p.name}`} release={release} parallel={p} />
        ))}
      </div>
    </div>
  );
}

export function ParallelLadder({ release }: { release: LegacyRelease }) {
  if (!release.parallels?.length) return null;

  return (
    <ReleaseSection eyebrow="PARALLEL LADDER">
      {release.parallels.map((g) => (
        <ParallelGroupBlock key={g.appliesTo} release={release} group={g} />
      ))}
    </ReleaseSection>
  );
}
