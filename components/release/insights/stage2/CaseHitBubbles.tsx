"use client";

import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import type { CaseHitBubblesViz } from "@/types/insights";
import { cn } from "@/lib/utils";

type Props = {
  viz: CaseHitBubblesViz;
  sourceUrl?: string;
};

type Point = {
  slug: string;
  name: string;
  ipCategory: string;
  hobbyOdds: number;
  hobbyOddsDisplay: string;
  bubbleSize: number;
  size: number;
};

const CATEGORY_COLORS: Record<string, string> = {
  Anime: "#F59E0B",
  GPK: "#A855F7",
  Crystalized: "#22C55E",
  Spotlights: "#38BDF8",
  Retrofractor: "#F97316",
  "Etched In Glass": "#A1A1AA",
};

function colorForCategory(cat: string): string {
  return CATEGORY_COLORS[cat] ?? "#10B981";
}

function oddsTick(v: number): string {
  if (!Number.isFinite(v) || v <= 0) return "—";
  return `1:${v.toLocaleString()}`;
}

export function CaseHitBubbles({ viz, sourceUrl }: Props) {
  const points: Point[] = (viz.caseHits ?? []).map((c) => ({
    slug: c.slug,
    name: c.name,
    ipCategory: c.ipCategory,
    hobbyOdds: c.hobbyOdds,
    hobbyOddsDisplay: c.hobbyOddsDisplay,
    bubbleSize: c.bubbleSize,
    size: c.size,
  }));

  const categories = Array.from(new Set(points.map((p) => p.ipCategory)));

  // Use category index on X to keep spacing consistent, while labeling via ticks.
  const withX = points.map((p) => ({ ...p, x: categories.indexOf(p.ipCategory) }));

  return (
    <section className="mt-10 rounded-2xl border border-zinc-800/80 bg-zinc-950/35 p-6">
      <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Featured visualization</p>
      <h2 className="mt-2 font-serif text-2xl text-paper">{viz.title}</h2>
      <p className="mt-1 text-sm text-zinc-400">{viz.subtitle}</p>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        {categories.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-black/20 px-3 py-1 text-zinc-300"
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colorForCategory(c) }} aria-hidden />
            {c}
          </span>
        ))}
      </div>

      <div className="mt-6 h-[380px] w-full rounded-2xl border border-zinc-800/80 bg-black/20 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 14, left: 6, bottom: 10 }}>
            <CartesianGrid stroke="#27272A" strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              tickLine={false}
              axisLine={{ stroke: "#3F3F46" }}
              tick={{ fill: "#A1A1AA", fontSize: 11 }}
              ticks={categories.map((_, i) => i)}
              tickFormatter={(v) => categories[v] ?? ""}
              interval={0}
              height={38}
            />
            <YAxis
              type="number"
              dataKey="hobbyOdds"
              tickLine={false}
              axisLine={{ stroke: "#3F3F46" }}
              tick={{ fill: "#A1A1AA", fontSize: 11 }}
              tickFormatter={oddsTick}
              width={64}
            />
            <ZAxis type="number" dataKey="bubbleSize" range={[120, 1900]} />
            <Tooltip
              cursor={{ stroke: "#52525B", strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload as any as Point;
                return (
                  <div className="max-w-[320px] rounded-lg border border-zinc-700 bg-zinc-950/95 p-3 text-xs text-zinc-200 shadow-xl">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-medium text-paper">{p.name}</div>
                      <span
                        className="shrink-0 rounded px-2 py-0.5 text-[11px] text-zinc-200 ring-1 ring-zinc-700"
                        style={{ backgroundColor: `${colorForCategory(p.ipCategory)}22` }}
                      >
                        {p.ipCategory}
                      </span>
                    </div>
                    <div className="mt-2 font-mono text-zinc-200">{p.hobbyOddsDisplay}</div>
                    <div className="mt-1 text-zinc-500">Set size: {p.size}</div>
                  </div>
                );
              }}
            />
            {categories.map((cat) => (
              <Scatter
                key={cat}
                name={cat}
                data={withX.filter((p) => p.ipCategory === cat)}
                fill={colorForCategory(cat)}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
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

      {viz.easiest || viz.hardest ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {viz.easiest ? (
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/30 p-4">
              <div className="text-xs uppercase tracking-wide text-zinc-500">Most reachable (Hobby)</div>
              <div className="mt-2 font-medium text-paper">{viz.easiest.name}</div>
              <div className="mt-1 font-mono text-xs text-emerald-200">{viz.easiest.hobbyOddsDisplay}</div>
            </div>
          ) : null}
          {viz.hardest ? (
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/30 p-4">
              <div className="text-xs uppercase tracking-wide text-zinc-500">Hardest (Hobby)</div>
              <div className="mt-2 font-medium text-paper">{viz.hardest.name}</div>
              <div className="mt-1 font-mono text-xs text-amber-200">{viz.hardest.hobbyOddsDisplay}</div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

