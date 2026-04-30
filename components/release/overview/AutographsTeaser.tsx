import Link from "next/link";

import type { AutographData } from "@/types/autographs";
import { cn } from "@/lib/utils";

import { sportConfig } from "@/lib/sport-config";

import { OverviewShell } from "./OverviewShell";

type Props = {
  slug: string;
  sport: keyof typeof sportConfig;
  autographs: AutographData | undefined;
};

export default function AutographsTeaser({ slug, sport, autographs }: Props) {
  if (!autographs?.signerIndex?.length || !autographs?.tierRanking) return null;

  const t1 = autographs.tierRanking.tier1?.length ?? 0;
  const t2 = autographs.tierRanking.tier2?.length ?? 0;
  const t3 = autographs.tierRanking.tier3?.length ?? 0;
  const t4 = autographs.tierRanking.tier4?.length ?? 0;
  const max = Math.max(t1, t2, t3, t4, 1);

  const sportAccent = sportConfig[sport];

  const rows: {
    key: "tier1" | "tier2" | "tier3" | "tier4";
    label: string;
    count: number;
    note: string | undefined;
    opacity: string;
  }[] = [
    { key: "tier1", label: "Tier 1", count: t1, note: autographs.editorial?.tierExplanations?.tier1, opacity: "opacity-90" },
    { key: "tier2", label: "Tier 2", count: t2, note: autographs.editorial?.tierExplanations?.tier2, opacity: "opacity-70" },
    { key: "tier3", label: "Tier 3", count: t3, note: autographs.editorial?.tierExplanations?.tier3, opacity: "opacity-50" },
    { key: "tier4", label: "Tier 4", count: t4, note: autographs.editorial?.tierExplanations?.tier4, opacity: "opacity-35" },
  ];

  return (
    <OverviewShell id="overview-mod-autographs" eyebrow="THE AUTOGRAPHS">
      <h2 className="font-serif text-2xl text-paper sm:text-3xl">Not all autos are equal</h2>
      <p className="mt-2 max-w-3xl text-sm text-zinc-400">
        {autographs.editorial?.overview?.trim() ? autographs.editorial.overview : null}
        {autographs.editorial?.overview?.trim() ? " " : null}
        <span className="tabular-nums">{autographs.signerIndex.length}</span> total signers, ranked into four tiers.
      </p>

      <div className="mt-8 space-y-4">
        {rows.map((r) => {
          const pct = Math.round((r.count / max) * 100);
          return (
            <div key={r.key} className="rounded-xl border border-zinc-800/90 bg-zinc-950/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-serif text-lg text-paper">{r.label}</div>
                <div className="text-sm tabular-nums text-zinc-300">{r.count} signers</div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div className={cn("h-full rounded-full", sportAccent.bgClass, r.opacity)} style={{ width: `${pct}%` }} />
              </div>
              {r.note?.trim() ? <p className="mt-3 text-sm leading-snug text-zinc-400">{r.note.trim()}</p> : null}
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-sm text-zinc-500">
        <Link
          href={`/releases/${slug}/autographs`}
          className="font-medium text-emerald-400/90 underline-offset-2 hover:text-emerald-300 hover:underline"
        >
          See every signer
        </Link>
        <span className="text-zinc-600"> — full index, set-by-set breakdown, and tier rankings.</span>
      </p>
    </OverviewShell>
  );
}

