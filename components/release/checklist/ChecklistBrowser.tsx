"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { holyGrailRowKey } from "@/lib/holy-grail-keys";
import { cn } from "@/lib/utils";
import type { Card } from "@/types/checklist";
import type { ImageryData } from "@/types/imagery";

import { OverviewImage } from "../overview/OverviewImage";

const PAGE_SIZE = 50;

type Preset = "all" | "parallels" | "chase" | "grail" | "holy";
type SortKey = "card" | "player" | "team" | "rookie";
type ViewMode = "table" | "grid";

export type ChecklistInitialFilters = {
  q: string;
  subset: string;
  league: string;
  teamSlug: string;
  rookie: string;
  auto: string;
  preset: Preset;
  sort: SortKey;
  view: ViewMode;
  page: number;
};

type Props = {
  slug: string;
  cards: Card[];
  imagery: ImageryData | undefined;
  holyGrailKeys: string[];
  initial: ChecklistInitialFilters;
  rarityTierIsUniform: boolean;
};

function logoPathForCard(teamSlug: string, imagery: ImageryData | undefined): string | undefined {
  const key = `logo-${teamSlug}`;
  return imagery?.images?.[key]?.path;
}

function matchesPreset(card: Card, preset: Preset, holySet: Set<string>): boolean {
  switch (preset) {
    case "parallels":
      return (card.parallelsAvailable?.length ?? 0) > 0;
    case "chase":
      return card.rarityTier === "chase";
    case "grail":
      return card.rarityTier === "grail" || card.rarityTier === "holy-grail";
    case "holy":
      return holySet.has(holyGrailRowKey(card.cardNumber, card.player));
    default:
      return true;
  }
}

function sortCards(list: Card[], sort: SortKey): Card[] {
  const out = [...list];
  if (sort === "player") {
    out.sort((a, b) => a.player.localeCompare(b.player));
  } else if (sort === "team") {
    out.sort((a, b) => a.team.localeCompare(b.team));
  } else if (sort === "rookie") {
    out.sort(
      (a, b) =>
        Number(b.isRookie) - Number(a.isRookie) ||
        a.cardNumber.localeCompare(b.cardNumber, undefined, { numeric: true }),
    );
  } else {
    out.sort((a, b) => a.cardNumber.localeCompare(b.cardNumber, undefined, { numeric: true }));
  }
  return out;
}

function buildSearchParams(
  slug: string,
  state: ChecklistInitialFilters & { page: number },
): string {
  const p = new URLSearchParams();
  if (state.q.trim()) p.set("q", state.q.trim());
  if (state.subset) p.set("subset", state.subset);
  if (state.league) p.set("league", state.league);
  if (state.teamSlug) p.set("team", state.teamSlug);
  if (state.rookie) p.set("rookie", state.rookie);
  if (state.auto) p.set("auto", state.auto);
  if (state.preset !== "all") p.set("preset", state.preset);
  if (state.sort !== "card") p.set("sort", state.sort);
  if (state.view !== "table") p.set("view", state.view);
  if (state.page > 1) p.set("page", String(state.page));
  const qs = p.toString();
  return qs ? `/releases/${slug}/checklist?${qs}` : `/releases/${slug}/checklist`;
}

export function ChecklistBrowser({
  slug,
  cards,
  imagery,
  holyGrailKeys,
  initial,
  rarityTierIsUniform,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const holySet = useMemo(() => new Set(holyGrailKeys), [holyGrailKeys]);

  const [q, setQ] = useState(initial.q);
  const [subset, setSubset] = useState(initial.subset);
  const [league, setLeague] = useState(initial.league);
  const [teamSlug, setTeamSlug] = useState(initial.teamSlug);
  const [rookie, setRookie] = useState(initial.rookie);
  const [auto, setAuto] = useState(initial.auto);
  const [preset, setPreset] = useState<Preset>(initial.preset);
  const [sort, setSort] = useState<SortKey>(initial.sort);
  const [view, setView] = useState<ViewMode>(initial.view);
  const [page, setPage] = useState(initial.page);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAllParallels, setShowAllParallels] = useState(false);

  const subsets = useMemo(() => {
    const s = new Set<string>();
    for (const c of cards) s.add(c.subset);
    return [...s].sort();
  }, [cards]);

  const leagues = useMemo(() => {
    const s = new Set<string>();
    for (const c of cards) s.add(c.league);
    return [...s].sort();
  }, [cards]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = cards.filter((c) => {
      if (needle) {
        const hay = `${c.cardNumber} ${c.player} ${c.team} ${c.playerSlug} ${c.teamSlug}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (subset && c.subset !== subset) return false;
      if (league && c.league !== league) return false;
      if (teamSlug && c.teamSlug !== teamSlug) return false;
      if (rookie === "yes" && !c.isRookie) return false;
      if (rookie === "no" && c.isRookie) return false;
      if (auto === "yes" && !c.autoAvailable) return false;
      if (auto === "no" && c.autoAvailable) return false;
      if (!matchesPreset(c, preset, holySet)) return false;
      return true;
    });
    return sortCards(out, sort);
  }, [cards, q, subset, league, teamSlug, rookie, auto, preset, sort, holySet]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const navigate = (next: Partial<ChecklistInitialFilters> & { page?: number }) => {
    const state = {
      q,
      subset,
      league,
      teamSlug,
      rookie,
      auto,
      preset,
      sort,
      view,
      page: next.page ?? page,
      ...next,
    };
    const href = buildSearchParams(slug, state);
    startTransition(() => {
      router.replace(href);
    });
  };

  const applyFilters = () => {
    setPage(1);
    navigate({ page: 1 });
  };

  const rowKey = (c: Card) => `${c.cardNumber}:${c.playerSlug}:${c.subset}`;

  const expandedCard = expanded ? cards.find((c) => rowKey(c) === expanded) : null;

  return (
    <div className={cn("mx-auto max-w-6xl px-5 py-8 sm:px-8", isPending && "opacity-70")}>
      {rarityTierIsUniform ? (
        <aside className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
          <strong className="font-medium">Sourcing note:</strong> every checklist row currently shares{" "}
          <code className="rounded bg-black/30 px-1">rarityTier: &quot;holy-grail&quot;</code>, so tier-based presets are
          not selective. Use <strong>Holy Grails (catalog)</strong> for the five cards in <code>release.json</code>{" "}
          holyGrails — or plan a <strong>Patch 8</strong> curation field for filters.
        </aside>
      ) : null}

      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="block min-w-[200px] flex-1 text-xs text-zinc-500">
          Search
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-paper"
            placeholder="Player, team, #…"
          />
        </label>
        <label className="block w-full min-w-[140px] sm:w-40">
          <span className="text-xs text-zinc-500">Subset</span>
          <select
            value={subset}
            onChange={(e) => setSubset(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2 text-sm text-paper"
          >
            <option value="">All</option>
            {subsets.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block w-full min-w-[120px] sm:w-36">
          <span className="text-xs text-zinc-500">League</span>
          <select
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2 text-sm text-paper"
          >
            <option value="">All</option>
            {leagues.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block w-full min-w-[160px] sm:w-44">
          <span className="text-xs text-zinc-500">Team slug</span>
          <input
            value={teamSlug}
            onChange={(e) => setTeamSlug(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2 text-sm text-paper"
            placeholder="e.g. dallas-mavericks"
          />
        </label>
        <label className="block w-full min-w-[100px] sm:w-28">
          <span className="text-xs text-zinc-500">Rookie</span>
          <select
            value={rookie}
            onChange={(e) => setRookie(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2 text-sm text-paper"
          >
            <option value="">All</option>
            <option value="yes">Rookie</option>
            <option value="no">Not rookie</option>
          </select>
        </label>
        <label className="block w-full min-w-[100px] sm:w-28">
          <span className="text-xs text-zinc-500">Auto</span>
          <select
            value={auto}
            onChange={(e) => setAuto(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2 text-sm text-paper"
          >
            <option value="">All</option>
            <option value="yes">Has auto</option>
            <option value="no">No auto</option>
          </select>
        </label>
        <label className="block w-full min-w-[200px] sm:w-60">
          <span className="text-xs text-zinc-500">Rarity preset</span>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value as Preset)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2 text-sm text-paper"
          >
            <option value="all">All cards</option>
            <option value="parallels">Has parallels</option>
            <option value="chase">Chase (rarityTier = chase)</option>
            <option value="grail">Grail + holy-grail tiers</option>
            <option value="holy">Holy Grails (catalog — 5 in release.json)</option>
          </select>
        </label>
        <label className="block w-full min-w-[120px] sm:w-36">
          <span className="text-xs text-zinc-500">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2 text-sm text-paper"
          >
            <option value="card">Card #</option>
            <option value="player">Player A–Z</option>
            <option value="team">Team</option>
            <option value="rookie">Rookie first</option>
          </select>
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={applyFilters}
            className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white"
          >
            Apply &amp; share URL
          </button>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setSubset("");
              setLeague("");
              setTeamSlug("");
              setRookie("");
              setAuto("");
              setPreset("all");
              setSort("card");
              setView("table");
              setPage(1);
              startTransition(() => router.replace(`/releases/${slug}/checklist`));
            }}
            className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:border-zinc-500"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm text-zinc-400">
        <p>
          <span className="tabular-nums text-paper">{filtered.length}</span> results
          {filtered.length !== cards.length ? <span> of {cards.length}</span> : null}
          {preset === "chase" && filtered.length === 0 ? (
            <span className="ml-2 text-amber-300/90">— no rows tagged chase in this release.</span>
          ) : null}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-zinc-500">View</span>
          <button
            type="button"
            className={cn(
              "rounded-md px-2 py-1 text-xs",
              view === "table" ? "bg-zinc-800 text-paper" : "text-zinc-500 hover:text-paper",
            )}
            onClick={() => {
              setView("table");
              setPage(1);
              navigate({ view: "table", page: 1 });
            }}
          >
            Table
          </button>
          <button
            type="button"
            className={cn(
              "rounded-md px-2 py-1 text-xs",
              view === "grid" ? "bg-zinc-800 text-paper" : "text-zinc-500 hover:text-paper",
            )}
            onClick={() => {
              setView("grid");
              setPage(1);
              navigate({ view: "grid", page: 1 });
            }}
          >
            Grid
          </button>
        </div>
      </div>

      {view === "table" ? (
        <div className="overflow-x-auto rounded-lg border border-zinc-800/80">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Player</th>
                <th className="px-3 py-2">Team</th>
                <th className="px-3 py-2">Subset</th>
                <th className="px-3 py-2">Rk</th>
                <th className="px-3 py-2">Auto</th>
                <th className="px-3 py-2 tabular-nums">Par.</th>
                <th className="px-3 py-2"> </th>
              </tr>
            </thead>
            <tbody>
              {slice.map((c) => {
                const k = rowKey(c);
                const open = expanded === k;
                const logo = logoPathForCard(c.teamSlug, imagery);
                const parCount = c.parallelsAvailable?.length ?? 0;
                return (
                  <ChecklistTableRow
                    key={k}
                    card={c}
                    open={open}
                    logo={logo}
                    parCount={parCount}
                    imagery={imagery}
                    showAllParallels={showAllParallels}
                    onToggle={() => {
                      setExpanded(open ? null : k);
                      setShowAllParallels(false);
                    }}
                    onToggleShowAllParallels={() => setShowAllParallels((v) => !v)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {slice.map((c) => {
            const k = rowKey(c);
            const logo = logoPathForCard(c.teamSlug, imagery);
            return (
              <button
                key={k}
                type="button"
                onClick={() => setExpanded((e) => (e === k ? null : k))}
                className={cn(
                  "rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 text-left hover:border-zinc-600",
                  expanded === k && "border-emerald-700/60",
                )}
              >
                <div className="flex items-center gap-2">
                  {logo ? (
                    <OverviewImage src={logo} alt="" className="h-8 w-8 shrink-0 rounded object-cover" />
                  ) : (
                    <div className="h-8 w-8 shrink-0 rounded bg-zinc-800" />
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-xs text-zinc-500">{c.cardNumber}</div>
                    <div className="truncate font-medium text-paper">{c.player}</div>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-zinc-500">{c.subset}</div>
              </button>
            );
          })}
        </div>
      )}

      {expandedCard && view === "grid" ? (
        <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
          <ExpandedDetail
            card={expandedCard}
            imagery={imagery}
            showAllParallels={showAllParallels}
            onToggleShowAllParallels={() => setShowAllParallels((v) => !v)}
          />
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between text-sm text-zinc-400">
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => {
            const next = Math.max(1, safePage - 1);
            setPage(next);
            navigate({ page: next });
          }}
          className="rounded-md border border-zinc-800 px-3 py-1 disabled:opacity-30"
        >
          Previous
        </button>
        <span className="tabular-nums">
          Page {safePage} / {pageCount} ({PAGE_SIZE} per page)
        </span>
        <button
          type="button"
          disabled={safePage >= pageCount}
          onClick={() => {
            const next = Math.min(pageCount, safePage + 1);
            setPage(next);
            navigate({ page: next });
          }}
          className="rounded-md border border-zinc-800 px-3 py-1 disabled:opacity-30"
        >
          Next
        </button>
      </div>

      <p className="mt-10 max-w-3xl text-xs leading-relaxed text-zinc-600">
        Performance: 400 rows stay client-filtered in memory; pagination limits DOM to {PAGE_SIZE} visible cards. Expanded
        rows render parallel slugs in a capped block first, then a scrollable region — full Chrome Prospect ladders (~58)
        stay usable without mounting thousands of nodes. If we add multi-expand or much larger releases, switch to
        virtualization (e.g. TanStack Virtual).
      </p>
    </div>
  );
}

function ChecklistTableRow({
  card,
  open,
  logo,
  parCount,
  imagery,
  showAllParallels,
  onToggle,
  onToggleShowAllParallels,
}: {
  card: Card;
  open: boolean;
  logo: string | undefined;
  parCount: number;
  imagery: ImageryData | undefined;
  showAllParallels: boolean;
  onToggle: () => void;
  onToggleShowAllParallels: () => void;
}) {
  return (
    <>
      <tr className="border-b border-zinc-900/80 hover:bg-zinc-900/40">
        <td className="px-3 py-2 tabular-nums text-zinc-500">{card.cardNumber}</td>
        <td className="px-3 py-2">
          <div className="flex items-center gap-2">
            {logo ? (
              <OverviewImage src={logo} alt="" className="h-7 w-7 shrink-0 rounded object-cover" />
            ) : (
              <div className="h-7 w-7 shrink-0 rounded bg-zinc-800" />
            )}
            <span className="text-paper">{card.player}</span>
          </div>
        </td>
        <td className="px-3 py-2 text-zinc-400">{card.team}</td>
        <td className="px-3 py-2 text-zinc-500">{card.subset}</td>
        <td className="px-3 py-2 text-zinc-500">{card.isRookie ? "RC" : "—"}</td>
        <td className="px-3 py-2 text-zinc-500">{card.autoAvailable ? "Yes" : "—"}</td>
        <td className="px-3 py-2 tabular-nums text-zinc-400">{parCount}</td>
        <td className="px-3 py-2 text-right">
          <button type="button" onClick={onToggle} className="text-xs text-emerald-400/90 hover:underline">
            {open ? "Close" : "Details"}
          </button>
        </td>
      </tr>
      {open ? (
        <tr className="bg-zinc-950/80">
          <td colSpan={8} className="px-3 py-4">
            <ExpandedDetail
              card={card}
              imagery={imagery}
              showAllParallels={showAllParallels}
              onToggleShowAllParallels={onToggleShowAllParallels}
            />
          </td>
        </tr>
      ) : null}
    </>
  );
}

function ExpandedDetail({
  card,
  imagery,
  showAllParallels,
  onToggleShowAllParallels,
}: {
  card: Card;
  imagery: ImageryData | undefined;
  showAllParallels: boolean;
  onToggleShowAllParallels: () => void;
}) {
  const slugs = card.parallelsAvailable ?? [];
  const cap = 28;
  const shown = showAllParallels ? slugs : slugs.slice(0, cap);
  const imgSlug = card.imageSlug;
  const imgPath = imgSlug && imagery?.images?.[imgSlug]?.path;

  return (
    <div className="space-y-3 text-sm text-zinc-300">
      <div className="flex flex-wrap gap-4">
        <div className="h-36 w-28 shrink-0 overflow-hidden rounded-md bg-zinc-900">
          {imgPath ? (
            <OverviewImage src={imgPath} alt={card.player} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center p-2 text-center text-[11px] text-zinc-500">
              No card image slug
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="font-serif text-lg text-paper">
            {card.player}{" "}
            <span className="text-zinc-500">
              #{card.cardNumber} · {card.subset}
            </span>
          </div>
          {card.editorialNote ? <p className="text-zinc-400">{card.editorialNote}</p> : null}
          <p className="text-xs text-zinc-600">
            rarityTier: {card.rarityTier ?? "—"} · isHolyGrail: {String(card.isHolyGrail ?? false)}
          </p>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-medium uppercase tracking-wide text-zinc-500">Parallels ({slugs.length})</h4>
          {slugs.length > cap ? (
            <button
              type="button"
              onClick={onToggleShowAllParallels}
              className="text-xs text-emerald-400/90 hover:underline"
            >
              {showAllParallels ? "Show fewer" : `Show all ${slugs.length}`}
            </button>
          ) : null}
        </div>
        <div
          className={cn(
            "mt-2 flex flex-wrap gap-1 rounded-md border border-zinc-800/80 bg-black/20 p-2",
            showAllParallels ? "max-h-64 overflow-y-auto" : "max-h-40 overflow-y-auto",
          )}
        >
          {shown.map((s) => (
            <span key={s} className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
              {s}
            </span>
          ))}
        </div>
        {!showAllParallels && slugs.length > cap ? (
          <p className="mt-1 text-[11px] text-zinc-600">
            Showing first {cap} slugs — largest Chrome Prospect rows (~58) stay scroll-contained.
          </p>
        ) : null}
      </div>
    </div>
  );
}
