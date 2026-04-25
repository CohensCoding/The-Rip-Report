"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import type { BoxFormatName, PackOdds } from "@/types/common";
import type { ImageryData } from "@/types/imagery";
import type { InsertData, InsertSet } from "@/types/inserts";

import type { InsertsInitialFilters } from "@/lib/inserts-filters";

import { OverviewImage } from "../overview/OverviewImage";

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

type Props = {
  slug: string;
  data: InsertData;
  imagery: ImageryData | undefined;
  initial: InsertsInitialFilters;
};

function buildSearchParams(slug: string, s: InsertsInitialFilters): string {
  const p = new URLSearchParams();
  if (s.q.trim()) p.set("q", s.q.trim());
  if (s.tier) p.set("tier", s.tier);
  const qs = p.toString();
  return qs ? `/releases/${slug}/inserts?${qs}` : `/releases/${slug}/inserts`;
}

function perFormatOddsRows(odds: PackOdds | undefined): { format: BoxFormatName; ratioDisplay: string }[] {
  const pf = odds?.perFormat;
  if (!pf) return [];
  const out: { format: BoxFormatName; ratioDisplay: string }[] = [];
  const used = new Set<BoxFormatName>();
  for (const fmt of FORMAT_ORDER) {
    const row = pf[fmt];
    if (row?.ratioDisplay) {
      out.push({ format: fmt, ratioDisplay: row.ratioDisplay });
      used.add(fmt);
    }
  }
  for (const k of Object.keys(pf) as BoxFormatName[]) {
    if (used.has(k)) continue;
    const row = pf[k];
    if (row?.ratioDisplay) out.push({ format: k, ratioDisplay: row.ratioDisplay });
  }
  return out;
}

function setCardStyle(set: InsertSet): { border: string; badge: string; badgeText: string } {
  if (set.isCaseHit) {
    return {
      border: "border-amber-500/25",
      badge: "bg-amber-500/15 text-amber-100 ring-1 ring-amber-400/40",
      badgeText: "Case hit",
    };
  }
  if (set.editorialTier === "chase") {
    return {
      border: "border-emerald-500/20",
      badge: "bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-500/35",
      badgeText: "Chase",
    };
  }
  if (set.editorialTier === "notable") {
    return {
      border: "border-zinc-700/70",
      badge: "bg-zinc-900 text-zinc-200 ring-1 ring-zinc-700/60",
      badgeText: "Notable",
    };
  }
  if (set.editorialTier === "filler") {
    return {
      border: "border-zinc-900",
      badge: "bg-zinc-950 text-zinc-500 ring-1 ring-zinc-800",
      badgeText: "Redundant",
    };
  }
  return {
    border: "border-zinc-800/80",
    badge: "bg-zinc-950 text-zinc-400 ring-1 ring-zinc-800",
    badgeText: "Standard",
  };
}

function parallelCountLabel(set: InsertSet): string {
  const n = set.parallels?.length ?? 0;
  if (n === 0) return "No parallels";
  return `${n} parallels`;
}

function renderParallelInline(set: InsertSet) {
  const ps = set.parallels ?? [];
  if (ps.length === 0) return null;
  // Short ladders inline.
  if (ps.length <= 6) {
    return (
      <div className="mt-3 flex flex-wrap gap-1.5">
        {ps.map((p) => (
          <span key={p.slug} className="inline-flex items-center gap-1 rounded bg-zinc-900 px-2 py-0.5 text-[11px] text-zinc-300">
            <span className="h-2 w-2 rounded-sm ring-1 ring-zinc-700" style={{ backgroundColor: p.color.hex }} aria-hidden />
            <span className="truncate">{p.name}</span>
            {typeof p.printRun === "number" ? <span className="tabular-nums text-zinc-500">/{p.printRun}</span> : null}
          </span>
        ))}
      </div>
    );
  }

  // Long ladders: collapsible + per-format odds (Parallels-page pattern).
  const cap = 10;
  return (
    <details className="mt-4 rounded-lg border border-zinc-800/80 bg-black/20 p-3">
      <summary className="cursor-pointer text-sm text-zinc-300">
        Parallel ladder — <span className="tabular-nums">{ps.length}</span> rungs
        <span className="ml-2 text-xs text-zinc-600">(click to expand)</span>
      </summary>
      <div className="mt-3 space-y-2">
        {ps.slice(0, cap).map((p) => (
          <ParallelRow key={p.slug} p={p} />
        ))}
        {ps.length > cap ? (
          <div className="rounded-md border border-zinc-800 bg-zinc-950/40 p-2 text-xs text-zinc-500">
            Showing first {cap}. Scroll for the full list below.
            <div className="mt-2 max-h-48 overflow-y-auto pr-1">
              {ps.map((p) => (
                <div key={`${p.slug}-full`} className="flex items-center justify-between gap-3 border-t border-zinc-900/80 py-1.5 first:border-t-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="h-3 w-3 shrink-0 rounded-sm ring-1 ring-zinc-700" style={{ backgroundColor: p.color.hex }} aria-hidden />
                    <span className="truncate text-zinc-300">{p.name}</span>
                  </div>
                  <div className="shrink-0 font-mono text-[11px] text-zinc-500">
                    {typeof p.printRun === "number" ? `/${p.printRun}` : (p.printRunLabel ?? "—")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </details>
  );
}

function ParallelRow({ p }: { p: NonNullable<InsertSet["parallels"]>[number] }) {
  const pf = perFormatOddsRows(p.odds);
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/40 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-zinc-700" style={{ backgroundColor: p.color.hex }} aria-hidden />
          <div className="min-w-0">
            <div className="truncate font-medium text-paper">{p.name}</div>
            <div className="text-xs text-zinc-500">
              {typeof p.printRun === "number" ? `/${p.printRun}` : (p.printRunLabel ?? "—")}
            </div>
          </div>
        </div>
        {p.odds?.ratioDisplay ? <div className="text-xs font-mono text-zinc-400">{p.odds.ratioDisplay}</div> : null}
      </div>
      {pf.length > 0 ? (
        <div className="mt-2 overflow-x-auto rounded border border-zinc-800/80">
          <table className="w-full min-w-[320px] text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-500">
              <tr>
                <th className="px-3 py-2 font-medium">Format</th>
                <th className="px-3 py-2 font-medium">Odds</th>
              </tr>
            </thead>
            <tbody>
              {pf.map((row) => (
                <tr key={row.format} className="border-t border-zinc-800/80">
                  <td className="px-3 py-2 text-paper">{row.format}</td>
                  <td className="px-3 py-2 font-mono text-zinc-200">{row.ratioDisplay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

function CrossInsertChasers({ data }: { data: InsertData }) {
  const top = [...(data.crossInsertChasers ?? [])].sort((a, b) => b.insertCount - a.insertCount).slice(0, 10);
  if (top.length === 0) return null;
  return (
    <section className="mt-8 rounded-2xl border border-zinc-800/80 bg-zinc-950/35 p-6">
      <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Cross-insert chasers</p>
      <h2 className="mt-2 font-serif text-2xl text-paper">Who shows up everywhere</h2>
      <p className="mt-2 max-w-3xl text-sm text-zinc-400">
        Structured from <code className="rounded bg-black/30 px-1">crossInsertChasers</code>. These are the players with the most insert appearances across the product.
      </p>
      <div className="mt-5 overflow-x-auto rounded-lg border border-zinc-800/80">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-3 py-2">Player</th>
              <th className="px-3 py-2 tabular-nums">Insert count</th>
              <th className="px-3 py-2">Insert slugs</th>
            </tr>
          </thead>
          <tbody>
            {top.map((c) => (
              <tr key={c.playerSlug} className="border-b border-zinc-900/80">
                <td className="px-3 py-2 font-medium text-paper">{c.player}</td>
                <td className="px-3 py-2 tabular-nums text-zinc-300">{c.insertCount}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {c.inserts.map((s) => (
                      <span key={s} className="rounded bg-zinc-900 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function InsertsBrowser({ slug, data, imagery, initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(initial.q);
  const [tier, setTier] = useState<InsertsInitialFilters["tier"]>(initial.tier);

  const allSets = data.sets ?? [];

  const filteredSets = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return allSets.filter((s) => {
      if (tier === "case-hit" && !s.isCaseHit) return false;
      if (tier === "standard" && s.isCaseHit) return false;
      if (tier === "redundant" && s.editorialTier !== "filler") return false;
      if (needle) {
        const hay = `${s.name} ${s.slug} ${s.description} ${s.editorialNote ?? ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [allSets, q, tier]);

  const caseHits = filteredSets.filter((s) => s.isCaseHit);
  const standard = filteredSets.filter((s) => !s.isCaseHit);
  const redundant = standard.filter((s) => s.editorialTier === "filler");
  const standardNonFiller = standard.filter((s) => s.editorialTier !== "filler");

  const apply = () => {
    const state: InsertsInitialFilters = { q, tier };
    startTransition(() => router.replace(buildSearchParams(slug, state)));
  };

  const reset = () => {
    setQ("");
    setTier("");
    startTransition(() => router.replace(`/releases/${slug}/inserts`));
  };

  return (
    <div className={cn("mx-auto max-w-6xl px-5 py-8 sm:px-8", isPending && "opacity-70")}>
      <p className="max-w-3xl text-sm leading-relaxed text-zinc-400">{data.editorial.overview}</p>

      <div className="mt-8 flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="block min-w-[200px] flex-1 text-xs text-zinc-500">
          Search
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-paper"
            placeholder="Insert set name, slug, note…"
          />
        </label>

        <label className="block w-full min-w-[180px] sm:w-56">
          <span className="text-xs text-zinc-500">View</span>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value as InsertsInitialFilters["tier"])}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2 text-sm text-paper"
          >
            <option value="">All inserts</option>
            <option value="case-hit">Case hits only</option>
            <option value="standard">Standard inserts only</option>
            <option value="redundant">Redundant inserts (filler) only</option>
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
        <span className="tabular-nums text-paper">{filteredSets.length}</span> insert sets
      </p>

      <CrossInsertChasers data={data} />

      {caseHits.length ? (
        <section className="mt-10 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-6">
          <p className="text-xs font-medium tracking-[0.28em] text-amber-200/80 uppercase">Case hits</p>
          <h2 className="mt-2 font-serif text-2xl text-paper">The true chase tier</h2>
          <p className="mt-2 max-w-3xl text-sm text-zinc-300">
            These are not “just more inserts” — they’re case-hit level. They deserve separate billing from the standard 22-set grid.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {caseHits.map((s) => (
              <InsertSetCard key={s.slug} set={s} imagery={imagery} />
            ))}
          </div>
        </section>
      ) : null}

      {standardNonFiller.length ? (
        <section className="mt-10">
          <h2 className="font-serif text-2xl text-paper sm:text-3xl">Standard inserts</h2>
          <p className="mt-2 max-w-3xl text-sm text-zinc-400">The regular insert ecosystem — notable sets up top, common sets below.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {standardNonFiller.map((s) => (
              <InsertSetCard key={s.slug} set={s} imagery={imagery} />
            ))}
          </div>
        </section>
      ) : null}

      {redundant.length ? (
        <section className="mt-10 rounded-2xl border border-zinc-800/80 bg-zinc-950/35 p-6">
          <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Redundant inserts</p>
          <h2 className="mt-2 font-serif text-2xl text-paper">The four-identical-inserts problem</h2>
          <p className="mt-2 max-w-3xl text-sm text-zinc-400">
            These sets share the same structural role and can feel like padding. They’re deliberately dimmed and grouped here so they don’t read like equal-weight chase programs.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {redundant.map((s) => (
              <InsertSetCard key={s.slug} set={s} imagery={imagery} dim />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function InsertSetCard({ set, imagery, dim }: { set: InsertSet; imagery: ImageryData | undefined; dim?: boolean }) {
  const style = setCardStyle(set);
  const imgSlug = set.imageSlug;
  const imgPath = imgSlug && imagery?.images?.[imgSlug]?.path;

  return (
    <article
      className={cn(
        "rounded-2xl border bg-zinc-950/30 p-5",
        style.border,
        dim ? "opacity-70" : null,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-serif text-xl text-paper">{set.name}</div>
          <div className="mt-1 text-xs text-zinc-500">
            <span className="font-mono">{set.slug}</span> · <span className="tabular-nums">{set.size}</span> cards ·{" "}
            <span className="text-zinc-600">{parallelCountLabel(set)}</span>
          </div>
        </div>
        <span className={cn("shrink-0 rounded px-2 py-1 text-[11px] font-medium", style.badge)}>{style.badgeText}</span>
      </div>

      <div className="mt-4 flex gap-3">
        <div className="h-20 w-16 shrink-0 overflow-hidden rounded-md bg-zinc-900">
          {imgPath ? <OverviewImage src={imgPath} alt={set.name} className="h-full w-full object-cover" /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-zinc-300">{set.description}</p>
          {set.editorialNote ? <p className="mt-2 text-sm text-zinc-400">{set.editorialNote}</p> : null}
        </div>
      </div>

      {set.odds?.ratioDisplay ? (
        <div className="mt-4 rounded-md border border-zinc-800/80 bg-black/20 px-3 py-2 text-sm">
          <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Pack odds</div>
          <div className="mt-2 font-mono text-zinc-200">{set.odds.ratioDisplay}</div>
        </div>
      ) : null}

      {renderParallelInline(set)}
    </article>
  );
}

