"use client";

import type { MojoLadderViz } from "@/types/insights";
import { cn } from "@/lib/utils";

type Props = {
  viz: MojoLadderViz;
  sourceUrl?: string;
};

export function MojoLadder({ viz, sourceUrl }: Props) {
  return (
    <section className="mt-10 rounded-2xl border border-zinc-800/80 bg-zinc-950/35 p-6">
      <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Featured visualization</p>
      <h2 className="mt-2 font-serif text-2xl text-paper">{viz.title}</h2>
      <p className="mt-1 text-sm text-zinc-400">{viz.subtitle}</p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="rounded px-2 py-1 text-[11px] font-medium bg-fuchsia-600/20 text-fuchsia-100 ring-1 ring-fuchsia-500/40">
          Mega-only ladder
        </span>
        <span className="rounded bg-zinc-900 px-2 py-1 text-[11px] text-zinc-300 ring-1 ring-zinc-700/60">
          Exclusive format: <span className="font-medium text-paper">{viz.exclusiveFormat}</span>
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-800/80 bg-black/20 p-5">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>Common</span>
          <span>Rarest</span>
        </div>

        <ol className="mt-4 space-y-2">
          {viz.rungs.map((r) => (
            <li
              key={r.slug}
              className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800/80 bg-zinc-950/30 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={cn("h-9 w-2.5 shrink-0 rounded-full ring-1 ring-zinc-700/80")}
                  style={{ backgroundColor: r.color.hex }}
                  aria-hidden
                />
                <div className="min-w-0">
                  <div className="truncate font-medium text-paper">{r.name}</div>
                  <div className="mt-0.5 truncate font-mono text-[11px] text-zinc-500">{r.slug}</div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-mono text-xs text-zinc-200 tabular-nums">/{r.printRun}</div>
                <div className="text-[11px] text-zinc-600">print run</div>
              </div>
            </li>
          ))}
        </ol>

        {viz.note ? <p className="mt-5 text-sm leading-relaxed text-zinc-400">{viz.note}</p> : null}
      </div>

      <p className="mt-4 text-sm text-zinc-300">{viz.caption}</p>
      {sourceUrl ? (
        <p className="mt-2 text-xs text-zinc-500">
          Source:{" "}
          <a href={sourceUrl} target="_blank" rel="noreferrer" className="text-emerald-400/90 hover:underline">
            Official Topps odds PDF
          </a>
        </p>
      ) : null}
    </section>
  );
}

