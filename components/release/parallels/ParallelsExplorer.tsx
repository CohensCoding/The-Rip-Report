"use client";

import { Fragment, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  MATRIX_BADGE_CLASS,
  MATRIX_EXCLUSIVITY_LABEL,
  MATRIX_ROW_BORDER,
  formatBadgesFromExclusiveTo,
  matrixExclusivityForParallel,
  type MatrixExclusivityKey,
} from "@/lib/parallel-exclusivity";
import type { ParallelsInitialFilters } from "@/lib/parallels-filters";
import { cn } from "@/lib/utils";
import type { BoxFormatName } from "@/types/common";
import type { Parallel, ParallelData, ParallelFamily, ParallelGroup } from "@/types/parallels";

const FAMILIES: ParallelFamily[] = ["Border", "Chrome", "Reptilian", "Geometric", "Sapphire", "Mojo"];

const FORMAT_ORDER: BoxFormatName[] = [
  "Hobby",
  "Jumbo",
  "Mega",
  "Value",
  "Retail",
  "Breaker's Delight",
  "Sapphire",
  "Bulk",
];

type Row = { group: ParallelGroup; parallel: Parallel };

type Props = {
  slug: string;
  data: ParallelData;
  initial: ParallelsInitialFilters;
};

function buildSearchParams(slug: string, s: ParallelsInitialFilters): string {
  const p = new URLSearchParams();
  if (s.q.trim()) p.set("q", s.q.trim());
  if (s.family) p.set("family", s.family);
  if (s.group) p.set("group", s.group);
  if (s.excl !== "all") p.set("excl", s.excl);
  const qs = p.toString();
  return qs ? `/releases/${slug}/parallels?${qs}` : `/releases/${slug}/parallels`;
}

function flattenRows(groups: ParallelGroup[]): Row[] {
  return groups.flatMap((g) => (g.parallels ?? []).map((parallel) => ({ group: g, parallel })));
}

function perFormatEntries(odds: Parallel["odds"]): { format: BoxFormatName; ratioDisplay: string }[] {
  const pf = odds?.perFormat;
  if (!pf) return [];
  const seen = new Set<BoxFormatName>();
  const out: { format: BoxFormatName; ratioDisplay: string }[] = [];
  for (const fmt of FORMAT_ORDER) {
    const row = pf[fmt];
    if (row?.ratioDisplay) {
      out.push({ format: fmt, ratioDisplay: row.ratioDisplay });
      seen.add(fmt);
    }
  }
  for (const k of Object.keys(pf) as BoxFormatName[]) {
    if (seen.has(k)) continue;
    const row = pf[k];
    if (row?.ratioDisplay) out.push({ format: k, ratioDisplay: row.ratioDisplay });
  }
  return out;
}

export function ParallelsExplorer({ slug, data, initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(initial.q);
  const [family, setFamily] = useState<"" | ParallelFamily>(initial.family);
  const [group, setGroup] = useState(initial.group);
  const [excl, setExcl] = useState<ParallelsInitialFilters["excl"]>(initial.excl);
  const [expanded, setExpanded] = useState<string | null>(null);

  const matrix = data.exclusivityMatrix;

  const allRows = useMemo(() => flattenRows(data.groups ?? []), [data.groups]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const exclFilter = excl === "all" ? null : excl;
    return allRows.filter(({ group: g, parallel: p }) => {
      if (group && g.name !== group) return false;
      if (family && p.family !== family) return false;
      if (exclFilter && matrixExclusivityForParallel(p.name, matrix) !== exclFilter) return false;
      if (needle) {
        const hay = `${p.name} ${p.slug} ${g.name} ${g.appliesTo}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [allRows, q, family, group, excl, matrix]);

  const apply = () => {
    const state: ParallelsInitialFilters = { q, family, group, excl };
    startTransition(() => router.replace(buildSearchParams(slug, state)));
  };

  const reset = () => {
    setQ("");
    setFamily("");
    setGroup("");
    setExcl("all");
    setExpanded(null);
    startTransition(() => router.replace(`/releases/${slug}/parallels`));
  };

  const groupNames = useMemo(() => (data.groups ?? []).map((g) => g.name), [data.groups]);

  const rowsByGroup = useMemo(() => {
    const m = new Map<string, Row[]>();
    for (const row of filtered) {
      const k = row.group.name;
      const arr = m.get(k) ?? [];
      arr.push(row);
      m.set(k, arr);
    }
    return m;
  }, [filtered]);

  return (
    <div className={cn("mx-auto max-w-6xl px-5 py-8 sm:px-8", isPending && "opacity-70")}>
      <p className="max-w-3xl text-sm leading-relaxed text-zinc-400">{data.editorial.overview}</p>

      <div className="mt-8 space-y-3 border-b border-zinc-800 pb-6">
        <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
          Parallel family — filter chips; ladders stay Base / Paper / Chrome sections (not re-nested by family).
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFamily("")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium ring-1 transition-colors",
              family === "" ? "bg-zinc-100 text-zinc-900 ring-zinc-100" : "bg-zinc-900 text-zinc-400 ring-zinc-700 hover:text-paper",
            )}
          >
            All families
          </button>
          {FAMILIES.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFamily(f)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium ring-1 transition-colors",
                family === f ? "bg-zinc-100 text-zinc-900 ring-zinc-100" : "bg-zinc-900 text-zinc-400 ring-zinc-700 hover:text-paper",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="block min-w-[200px] flex-1 text-xs text-zinc-500">
          Search
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-paper"
            placeholder="Parallel name, slug, ladder…"
          />
        </label>
        <label className="block w-full min-w-[160px] sm:w-52">
          <span className="text-xs text-zinc-500">Ladder (group)</span>
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2 text-sm text-paper"
          >
            <option value="">All ladders</option>
            {groupNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="block w-full min-w-[200px] sm:w-64">
          <span className="text-xs text-zinc-500">Format exclusivity</span>
          <select
            value={excl}
            onChange={(e) => setExcl(e.target.value as ParallelsInitialFilters["excl"])}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2 text-sm text-paper"
          >
            <option value="all">All parallels</option>
            {(Object.keys(MATRIX_EXCLUSIVITY_LABEL) as MatrixExclusivityKey[]).map((k) => (
              <option key={k} value={k}>
                {MATRIX_EXCLUSIVITY_LABEL[k]}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={apply}
            className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white"
          >
            Apply &amp; share URL
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:border-zinc-500"
          >
            Reset
          </button>
        </div>
      </div>

      <p className="py-4 text-sm text-zinc-400">
        <span className="tabular-nums text-paper">{filtered.length}</span> parallels
        {filtered.length !== allRows.length ? <span> of {allRows.length}</span> : null}
      </p>

      <div className="space-y-10">
        {(data.groups ?? []).map((g) => {
          const rows = rowsByGroup.get(g.name);
          if (!rows?.length) return null;
          const note = data.editorial.perGroupNotes?.[g.name];
          return (
            <section key={g.name}>
              <h3 className="font-serif text-xl text-paper">{g.name}</h3>
              <p className="mt-1 text-sm text-zinc-500">{g.appliesTo}</p>
              {note ? <p className="mt-2 text-sm text-zinc-400">{note}</p> : null}
              <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-800/80">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase tracking-wide text-zinc-500">
                    <tr>
                      <th className="px-3 py-2">Parallel</th>
                      <th className="px-3 py-2">Family</th>
                      <th className="px-3 py-2 tabular-nums">Run</th>
                      <th className="px-3 py-2">Formats</th>
                      <th className="px-3 py-2"> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ parallel: p }) => {
                      const k = `${g.name}:${p.slug}`;
                      const open = expanded === k;
                      const mx = matrixExclusivityForParallel(p.name, matrix);
                      const border = mx ? MATRIX_ROW_BORDER[mx] : "border-l-transparent";
                      const run =
                        typeof p.printRun === "number" ? `/${p.printRun}` : (p.printRunLabel ?? "—");
                      const explicit = !mx && p.exclusiveTo?.length ? formatBadgesFromExclusiveTo(p.exclusiveTo) : [];
                      return (
                        <Fragment key={k}>
                          <tr
                            className={cn(
                              "border-b border-zinc-900/80 border-l-4 hover:bg-zinc-900/40",
                              border,
                              open && "bg-zinc-900/30",
                            )}
                          >
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className="h-6 w-2 shrink-0 rounded-sm ring-1 ring-zinc-700/80"
                                  style={{ backgroundColor: p.color.hex }}
                                  aria-hidden
                                />
                                <span className="font-medium text-paper">{p.name}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-zinc-500">{p.family}</td>
                            <td className="px-3 py-2 tabular-nums text-zinc-400">{run}</td>
                            <td className="px-3 py-2">
                              <div className="flex flex-wrap gap-1">
                                {mx ? (
                                  <span
                                    className={cn(
                                      "inline-flex max-w-full truncate rounded px-2 py-0.5 text-[10px] font-medium",
                                      MATRIX_BADGE_CLASS[mx],
                                    )}
                                  >
                                    {MATRIX_EXCLUSIVITY_LABEL[mx]}
                                  </span>
                                ) : null}
                                {explicit.map((fmt) => (
                                  <span
                                    key={fmt}
                                    className="inline-flex rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300 ring-1 ring-zinc-600/60"
                                  >
                                    {fmt}
                                  </span>
                                ))}
                                {!mx && !explicit.length ? (
                                  <span className="text-[11px] text-zinc-600">All / mixed formats</span>
                                ) : null}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button
                                type="button"
                                onClick={() => setExpanded(open ? null : k)}
                                className="text-xs text-emerald-400/90 hover:underline"
                              >
                                {open ? "Close" : "Odds & detail"}
                              </button>
                            </td>
                          </tr>
                          {open ? (
                            <tr className="bg-zinc-950/80">
                              <td colSpan={5} className="border-b border-zinc-900 px-3 py-4">
                                <ParallelDetailPanel parallel={p} />
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-10 max-w-3xl text-xs leading-relaxed text-zinc-600">
        Pack odds: when Topps supplies Patch 7 <code className="rounded bg-zinc-900 px-1">perFormat</code>, the detail
        panel lists every format row — not only the primary <code className="rounded bg-zinc-900 px-1">ratioDisplay</code>.
      </p>
    </div>
  );
}

function ParallelDetailPanel({ parallel: p }: { parallel: Parallel }) {
  const pfRows = perFormatEntries(p.odds);
  const primary = p.odds?.ratioDisplay;

  return (
    <div className="space-y-4 text-sm text-zinc-300">
      {p.note ? <p className="text-zinc-400">{p.note}</p> : null}
      {p.isCaseHit ? (
        <p className="text-xs font-medium uppercase tracking-wide text-amber-200/90">Case hit</p>
      ) : null}
      <div>
        <h4 className="text-xs font-medium uppercase tracking-wide text-zinc-500">Pack odds</h4>
        {pfRows.length > 0 ? (
          <div className="mt-2 overflow-x-auto rounded-md border border-zinc-800">
            <table className="w-full min-w-[320px] text-left text-xs">
              <thead className="bg-zinc-900/80 text-zinc-500">
                <tr>
                  <th className="px-3 py-2 font-medium">Format</th>
                  <th className="px-3 py-2 font-medium">Odds</th>
                </tr>
              </thead>
              <tbody>
                {pfRows.map((row) => (
                  <tr key={row.format} className="border-t border-zinc-800/80">
                    <td className="px-3 py-2 text-paper">{row.format}</td>
                    <td className="px-3 py-2 font-mono text-zinc-300">{row.ratioDisplay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : primary ? (
          <p className="mt-2 text-zinc-400">
            Primary: <span className="font-mono text-zinc-200">{primary}</span>
          </p>
        ) : (
          <p className="mt-2 text-zinc-600">No odds in bundle for this parallel.</p>
        )}
        {primary && pfRows.length > 0 ? (
          <p className="mt-2 text-[11px] text-zinc-600">
            Summary line from Topps: <span className="font-mono text-zinc-400">{primary}</span>
          </p>
        ) : null}
      </div>
      {p.odds?.source?.url ? (
        <p className="text-xs text-zinc-500">
          Source:{" "}
          <a href={p.odds.source.url} className="text-emerald-400/90 underline hover:text-emerald-300" target="_blank" rel="noreferrer">
            {p.odds.source.type}
          </a>
          {p.odds.source.asOf ? <span className="text-zinc-600"> · as of {p.odds.source.asOf}</span> : null}
        </p>
      ) : null}
      <p className="text-[11px] text-zinc-600">
        Slug: <code className="rounded bg-black/40 px-1">{p.slug}</code>
      </p>
    </div>
  );
}
