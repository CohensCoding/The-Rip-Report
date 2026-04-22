import type { Release } from "@/types/release";

import { ReleaseSection } from "./Section";

export function Verdict({ release }: { release: Release }) {
  const { verdict } = release;
  const gridCols = verdict.rating ? "md:grid-cols-3" : "md:grid-cols-2";

  return (
    <ReleaseSection eyebrow="VERDICT">
      <blockquote className="max-w-5xl text-2xl leading-snug text-zinc-100 sm:text-3xl">{verdict.oneLineTake}</blockquote>

      <div className={["mt-10 grid gap-10", gridCols].join(" ")}>
        <div>
          <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Who this is for</div>
          <div className="mt-3 text-base leading-relaxed text-paper/85">{verdict.whoThisIsFor}</div>
        </div>

        <div className="md:border-l md:border-zinc-800 md:pl-8">
          <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Key chase</div>
          <div className="mt-3 text-base leading-relaxed text-paper/85">{verdict.keyChaseCard}</div>
        </div>

        {verdict.rating ? (
          <div className="md:border-l md:border-zinc-800 md:pl-8">
            <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Rating</div>
            <div className="mt-3">
              <div className="font-serif text-5xl leading-none text-paper">
                <span className="tabular">{verdict.rating.score}</span>
                <span className="text-2xl text-zinc-500"> / 10</span>
              </div>
              <div className="mt-2 text-sm tracking-wide text-zinc-400 uppercase">{verdict.rating.label}</div>
            </div>
          </div>
        ) : null}
      </div>
    </ReleaseSection>
  );
}
