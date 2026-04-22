import { sportConfig } from "@/lib/sport-config";
import { cn } from "@/lib/utils";
import type { ChaseCard, Release } from "@/types/release";

import { ReleaseSection } from "./Section";

function ChaseCardBlock({ release, card }: { release: Release; card: ChaseCard }) {
  const sport = sportConfig[release.sport];

  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-950/25 p-8">
      <div className="font-serif text-4xl leading-none text-paper sm:text-5xl">{card.player}</div>
      {card.team ? <div className="mt-3 text-xs font-semibold tracking-[0.28em] text-zinc-500 uppercase">{card.team}</div> : null}

      <div className="mt-6 font-serif text-2xl text-paper">{card.cardName}</div>

      {card.estimatedValue ? (
        <div className="mt-5">
          <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide", sport.bgClass, "text-paper")}>
            {card.estimatedValue}
          </span>
        </div>
      ) : null}

      <p className="mt-6 text-sm leading-relaxed text-paper/80">{card.reason}</p>
    </div>
  );
}

export function ChaseCards({ release }: { release: Release }) {
  const cards = release.chaseCards ?? [];
  if (!cards.length) return null;

  return (
    <ReleaseSection eyebrow="THE CHASE">
      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((c) => (
          <ChaseCardBlock key={`${c.player}:${c.cardName}`} release={release} card={c} />
        ))}
      </div>
    </ReleaseSection>
  );
}
