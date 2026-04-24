import type { LegacyRelease } from "@/types/legacy-release";

import { ReleaseSection } from "./Section";

export function TeamBreakdown({ release }: { release: LegacyRelease }) {
  const teams = release.teamBreakdown ?? [];
  if (!teams.length) return null;

  return (
    <ReleaseSection eyebrow="BY TEAM">
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {teams.map((t) => (
          <div key={`${t.team}:${t.league ?? "na"}`} className="rounded-2xl border border-zinc-900 bg-zinc-950/25 p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 font-serif text-lg text-paper">{t.team}</div>
              {t.league ? (
                <span className="shrink-0 rounded-full border border-zinc-800 bg-zinc-900/35 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-zinc-300 uppercase">
                  {t.league}
                </span>
              ) : null}
            </div>

            <div className="mt-6">
              <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Rookie count</div>
              <div className="mt-2 font-serif text-5xl leading-none text-paper">
                <span className="tabular">{t.rookieCount}</span>
              </div>
            </div>

            {t.notableRookies?.length ? (
              <div className="mt-6">
                <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Notable rookies</div>
                <ul className="mt-3 space-y-2 text-sm text-paper/80">
                  {t.notableRookies.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {t.headlinerCard ? (
              <div className="mt-6 border-t border-zinc-900 pt-6">
                <div className="text-[10px] font-semibold tracking-[0.28em] text-zinc-500 uppercase">Headliner</div>
                <div className="mt-2 font-serif text-base text-paper">{t.headlinerCard}</div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </ReleaseSection>
  );
}
