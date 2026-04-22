import { sportConfig } from "@/lib/sport-config";
import { cn } from "@/lib/utils";
import type { Release } from "@/types/release";

import { formatUsd } from "./_utils";
import { ReleaseSection } from "./Section";

export function BoxFormats({ release }: { release: Release }) {
  const sport = sportConfig[release.sport];
  const formatAdvice = release.commentary.formatAdvice;

  if (!release.boxFormats?.length && !formatAdvice?.trim()) return null;

  return (
    <ReleaseSection eyebrow="BOX FORMATS">
      {release.boxFormats?.length ? (
        <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {release.boxFormats.map((bf) => {
            const totalCards = bf.cardsPerPack * bf.packsPerBox;

            return (
              <div
                key={bf.name}
                className="min-w-[280px] rounded-2xl border border-zinc-900 bg-zinc-950/35 p-6 sm:min-w-0"
              >
                <div className="font-serif text-2xl text-paper">{bf.name}</div>

                <div className="mt-6">
                  <div className="text-3xl leading-none text-paper">
                    <span className="tabular">{bf.cardsPerPack}</span>
                    <span className="mx-2 text-zinc-600">×</span>
                    <span className="tabular">{bf.packsPerBox}</span>
                  </div>
                  <div className="mt-2 text-xs tracking-wide text-zinc-500 uppercase">
                    cards/pack <span className="text-zinc-700">×</span> packs/box
                  </div>
                  <div className="mt-4 text-sm text-zinc-400">
                    = <span className="tabular font-medium text-paper/90">{totalCards}</span> cards total
                  </div>
                </div>

                <div className="mt-6 space-y-2 text-sm">
                  {typeof bf.msrp === "number" ? (
                    <div className="flex items-baseline justify-between gap-6 border-t border-zinc-900 pt-4">
                      <div className="text-xs tracking-wide text-zinc-500 uppercase">MSRP</div>
                      <div className="tabular text-paper/90">{formatUsd(bf.msrp)}</div>
                    </div>
                  ) : null}
                  {typeof bf.secondaryPrice === "number" ? (
                    <div className="flex items-baseline justify-between gap-6 border-t border-zinc-900 pt-4">
                      <div className="text-xs tracking-wide text-zinc-500 uppercase">Secondary</div>
                      <div className="tabular text-paper/90">{formatUsd(bf.secondaryPrice)}</div>
                    </div>
                  ) : null}
                </div>

                {bf.guarantees?.length ? (
                  <div className="mt-6 border-t border-zinc-900 pt-6">
                    <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Guarantees</div>
                    <ul className="mt-4 space-y-3">
                      {bf.guarantees.map((g) => (
                        <li key={g} className="flex gap-3 text-sm leading-relaxed text-paper/85">
                          <span className={cn("mt-1.5 h-2 w-2 shrink-0", sport.bgClass)} aria-hidden />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {bf.exclusives?.length ? (
                  <div className="mt-6 border-t border-zinc-900 pt-6">
                    <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Exclusives</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {bf.exclusives.map((ex) => (
                        <span
                          key={ex}
                          className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/35 px-3 py-1 text-xs text-paper/80"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {bf.notes ? <p className="mt-6 text-sm italic text-zinc-500">{bf.notes}</p> : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {formatAdvice ? (
        <div className={release.boxFormats?.length ? "mt-12 border-t border-zinc-900 pt-10" : ""}>
          <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Format advice</div>
          <blockquote className="mt-4 max-w-4xl text-xl leading-relaxed text-zinc-200 sm:text-2xl">
            {formatAdvice}
          </blockquote>
        </div>
      ) : null}
    </ReleaseSection>
  );
}
