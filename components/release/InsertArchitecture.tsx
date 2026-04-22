import { sportConfig } from "@/lib/sport-config";
import { cn } from "@/lib/utils";
import type { InsertSet, Release } from "@/types/release";

import { ReleaseSection } from "./Section";

function InsertBlock({ release, insert }: { release: Release; insert: InsertSet }) {
  const sport = sportConfig[release.sport];

  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-950/25 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-serif text-xl font-semibold text-paper">{insert.name}</div>
          {typeof insert.size === "number" ? (
            <div className="mt-2 text-sm text-zinc-500">
              <span className="tabular">{insert.size}</span> cards
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {insert.odds ? (
            <span className="rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-200">
              {insert.odds}
            </span>
          ) : null}
          {insert.isNew ? (
            <span className={cn("rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase", sport.textClass)}>
              New
            </span>
          ) : null}
        </div>
      </div>

      {insert.description ? <p className="mt-4 text-sm leading-relaxed text-paper/80">{insert.description}</p> : null}

      {insert.notableCards?.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {insert.notableCards.map((c) => (
            <span key={c} className="rounded-full border border-zinc-800 bg-zinc-900/35 px-3 py-1 text-xs text-paper/80">
              {c}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function InsertArchitecture({ release }: { release: Release }) {
  const inserts = release.inserts ?? [];
  if (!inserts.length) return null;
  const standard = inserts.filter((i) => !i.isCaseHit);
  const caseHits = inserts.filter((i) => i.isCaseHit);

  return (
    <ReleaseSection eyebrow="INSERTS">
      <div className="space-y-14">
        <div>
          <div className="mb-6 text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Standard inserts</div>
          <div className="grid gap-6 md:grid-cols-2">
            {standard.map((i) => (
              <InsertBlock key={i.name} release={release} insert={i} />
            ))}
          </div>
        </div>

        {caseHits.length ? (
          <div>
            <div className="mb-6 text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Case hits</div>
            <div className="grid gap-6 md:grid-cols-2">
              {caseHits.map((i) => (
                <InsertBlock key={i.name} release={release} insert={i} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </ReleaseSection>
  );
}
