import type { AutographSet, Release } from "@/types/release";

import { ReleaseSection } from "./Section";

function AutographBlock({ set }: { set: AutographSet }) {
  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-950/25 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-serif text-2xl text-paper">{set.name}</div>
          {typeof set.signerCount === "number" ? (
            <div className="mt-2 text-sm text-zinc-500">
              <span className="tabular">{set.signerCount}</span> signers
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {set.hasRedemptions ? (
            <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-amber-300 uppercase">
              Includes redemptions
            </span>
          ) : null}
        </div>
      </div>

      {set.boxGuarantee ? (
        <div className="mt-6 border-t border-zinc-900 pt-6">
          <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Box guarantee</div>
          <div className="mt-3 text-3xl leading-snug text-paper">{set.boxGuarantee}</div>
        </div>
      ) : null}

      {set.odds ? <div className="mt-4 text-sm text-zinc-400">{set.odds}</div> : null}

      {set.description ? <p className="mt-5 text-sm leading-relaxed text-paper/80">{set.description}</p> : null}

      {set.notableSigners?.length ? (
        <div className="mt-6">
          <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Notable signers</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {set.notableSigners.map((s) => (
              <span key={s} className="rounded-full border border-zinc-800 bg-zinc-900/35 px-3 py-1 text-xs text-paper/80">
                {s}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AutographSection({ release }: { release: Release }) {
  if (!release.autographs?.length) return null;

  return (
    <ReleaseSection eyebrow="AUTOGRAPHS">
      <div className="space-y-6">
        {release.autographs.map((a) => (
          <AutographBlock key={a.name} set={a} />
        ))}
      </div>
    </ReleaseSection>
  );
}
