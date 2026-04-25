"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import type { PaniniShadowViz } from "@/types/insights";

type Props = {
  viz: PaniniShadowViz;
  sourceUrl?: string;
};

type Row = {
  draftPick: number;
  player: string;
  team: string;
  autoSetCount: number;
  hasAuto: boolean;
};

function formatCount(n: number): string {
  if (n === 1) return "1 set";
  return `${n} sets`;
}

function baselineZeroShape(props: any) {
  const { x, y, width, height, payload } = props;
  const value = payload?.autoSetCount ?? 0;
  const hasAuto = payload?.hasAuto ?? true;
  // For zero-height bars, draw a 1px baseline marker (no smoothing into a real bar).
  if (value === 0) {
    return (
      <rect
        x={x}
        y={(y ?? 0) + (height ?? 0) - 1}
        width={Math.max(1, width)}
        height={1}
        fill="transparent"
        stroke={hasAuto ? "#10B981" : "#A1A1AA"}
        strokeDasharray={hasAuto ? undefined : "3 2"}
      />
    );
  }
  return <rect x={x} y={y} width={width} height={height} rx={2} ry={2} />;
}

export function PaniniShadowChart({ viz, sourceUrl }: Props) {
  const data = (viz.draftPicks ?? []).map(
    (p): Row => ({
      draftPick: p.draftPick,
      player: p.player,
      team: p.team,
      autoSetCount: p.autoSetCount,
      hasAuto: p.hasAuto,
    }),
  );
  const max = Math.max(0, ...data.map((d) => d.autoSetCount));

  return (
    <section className="mt-10 rounded-2xl border border-zinc-800/80 bg-zinc-950/35 p-6">
      <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Featured visualization</p>
      <h2 className="mt-2 font-serif text-2xl text-paper">{viz.title}</h2>
      <p className="mt-1 text-sm text-zinc-400">{viz.subtitle}</p>

      <div className="mt-6 h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 12, left: 8, bottom: 10 }}>
            <CartesianGrid stroke="#27272A" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="draftPick"
              tickLine={false}
              axisLine={{ stroke: "#3F3F46" }}
              tick={{ fill: "#A1A1AA", fontSize: 11 }}
              interval={0}
              tickFormatter={(v) => String(v)}
              angle={-45}
              textAnchor="end"
              height={44}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, Math.max(3, max)]}
              tickLine={false}
              axisLine={{ stroke: "#3F3F46" }}
              tick={{ fill: "#A1A1AA", fontSize: 11 }}
              width={28}
            />
            <Tooltip
              cursor={{ fill: "rgba(63,63,70,0.25)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0].payload as Row;
                return (
                  <div className="max-w-[280px] rounded-lg border border-zinc-700 bg-zinc-950/95 p-3 text-xs text-zinc-200 shadow-xl">
                    <div className="font-medium text-paper">
                      #{row.draftPick} {row.player}
                    </div>
                    <div className="mt-1 text-zinc-400">{row.team}</div>
                    <div className={cn("mt-2 font-mono", row.autoSetCount === 0 ? "text-amber-200" : "text-emerald-200")}>
                      {row.autoSetCount === 0 ? "0 auto sets" : formatCount(row.autoSetCount)}
                    </div>
                    {row.autoSetCount === 0 ? (
                      <div className="mt-1 text-zinc-500">Hole in the ladder — absence is the story.</div>
                    ) : null}
                  </div>
                );
              }}
            />
            <Bar dataKey="autoSetCount" shape={baselineZeroShape} isAnimationActive={false}>
              {data.map((row) => (
                <Cell
                  key={row.draftPick}
                  fill={row.autoSetCount === 0 ? "transparent" : "#10B981"}
                  stroke={row.autoSetCount === 0 ? "#A1A1AA" : "#10B981"}
                  strokeWidth={row.autoSetCount === 0 ? 1 : 0}
                />
              ))}
            </Bar>
          </BarChart>
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
    </section>
  );
}

