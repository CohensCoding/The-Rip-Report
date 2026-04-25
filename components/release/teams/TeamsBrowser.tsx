"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import type { ImageryData } from "@/types/imagery";
import type { CardsByTeamEntry, LeagueData, Team, TeamsData } from "@/types/teams";

import type { TeamsInitialFilters } from "@/lib/teams-filters";

import { OverviewImage } from "../overview/OverviewImage";

type Props = {
  slug: string;
  data: TeamsData;
  imagery: ImageryData | undefined;
  initial: TeamsInitialFilters;
};

const LEAGUES: LeagueData["league"][] = ["NBA", "NCAA-M", "NCAA-W"];

function buildSearchParams(slug: string, s: TeamsInitialFilters): string {
  const p = new URLSearchParams();
  if (s.league) p.set("league", s.league);
  if (s.q.trim()) p.set("q", s.q.trim());
  if (s.teamSlug) p.set("team", s.teamSlug);
  const qs = p.toString();
  return qs ? `/releases/${slug}/teams?${qs}` : `/releases/${slug}/teams`;
}

function leagueLabel(league: LeagueData["league"]): string {
  if (league === "NBA") return "NBA";
  if (league === "NCAA-M") return "NCAA (Men)";
  return "NCAA (Women)";
}

function logoPath(team: Team, imagery: ImageryData | undefined): string | undefined {
  const slug = team.logoSlug;
  if (!slug) return undefined;
  return imagery?.images?.[slug]?.path;
}

function pickLeagueDefault(data: TeamsData): LeagueData["league"] {
  const existing = new Set((data.leagues ?? []).map((l) => l.league));
  for (const l of LEAGUES) if (existing.has(l)) return l;
  return "NBA";
}

function featuredPicksForLeague(data: TeamsData, league: LeagueData["league"], teamBySlug: Map<string, Team>) {
  return (data.editorialTeamsToWatch ?? [])
    .map((p) => ({ p, team: teamBySlug.get(p.teamSlug) }))
    .filter((x): x is { p: TeamsData["editorialTeamsToWatch"][number]; team: Team } => Boolean(x.team) && x.team!.league === league);
}

export function TeamsBrowser({ slug, data, imagery, initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const leagueDefault = pickLeagueDefault(data);

  const [league, setLeague] = useState<LeagueData["league"]>(initial.league || leagueDefault);
  const [q, setQ] = useState(initial.q);
  const [teamSlug, setTeamSlug] = useState(initial.teamSlug);

  const leagueMap = useMemo(() => new Map((data.leagues ?? []).map((l) => [l.league, l])), [data.leagues]);

  const teamBySlug = useMemo(() => {
    const m = new Map<string, Team>();
    for (const l of data.leagues ?? []) for (const t of l.teams ?? []) m.set(t.slug, t);
    return m;
  }, [data.leagues]);

  const currentLeague = leagueMap.get(league);
  const teams = currentLeague?.teams ?? [];

  const apply = (next?: Partial<TeamsInitialFilters>) => {
    const state: TeamsInitialFilters = {
      league,
      q,
      teamSlug,
      ...next,
    };
    startTransition(() => router.replace(buildSearchParams(slug, state)));
  };

  const reset = () => {
    setQ("");
    setTeamSlug("");
    setLeague(leagueDefault);
    startTransition(() => router.replace(`/releases/${slug}/teams?league=${encodeURIComponent(leagueDefault)}`));
  };

  const chartRows = useMemo(() => {
    const rows = (data.cardsByTeamChart ?? []).filter((r) => r.league === league);
    return rows;
  }, [data.cardsByTeamChart, league]);

  const filteredTeams = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return teams;
    return teams.filter((t) => {
      const hay = `${t.name} ${t.slug} ${t.conference ?? ""} ${t.division ?? ""}`.toLowerCase();
      if (hay.includes(needle)) return true;
      // also search roster players without rendering everything
      return (t.roster ?? []).some((r) => `${r.player} ${r.cardNumber}`.toLowerCase().includes(needle));
    });
  }, [teams, q]);

  const selected = teamSlug ? teamBySlug.get(teamSlug) : null;

  return (
    <div className={cn("mx-auto max-w-6xl px-5 py-8 sm:px-8", isPending && "opacity-70")}>
      <p className="max-w-3xl text-sm leading-relaxed text-zinc-400">
        NBA + NCAA (Men) + NCAA (Women) teams are treated as first-class leagues — use the league tabs to switch. NCAA-W
        is never buried behind a collapse-only flow.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-5">
        <span className="text-xs uppercase tracking-wide text-zinc-500">League</span>
        {LEAGUES.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => {
              setLeague(l);
              setTeamSlug("");
              apply({ league: l, teamSlug: "" });
            }}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
              league === l ? "bg-zinc-800 text-paper" : "text-zinc-400 hover:text-paper",
            )}
          >
            {leagueLabel(l)}
          </button>
        ))}
      </div>

      <TeamsToWatch
        picks={featuredPicksForLeague(data, league, teamBySlug)}
        onOpen={(slugToOpen) => {
          setTeamSlug(slugToOpen);
          apply({ teamSlug: slugToOpen });
        }}
      />

      {selected ? (
        <TeamDetail
          team={selected}
          imagery={imagery}
          onBack={() => {
            setTeamSlug("");
            apply({ teamSlug: "" });
          }}
        />
      ) : (
        <>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <label className="block min-w-[220px] flex-1 text-xs text-zinc-500">
              Search teams or roster
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-paper"
                placeholder="Kentucky, Brooklyn, Flagg…"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => apply()}
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

          <p className="mt-4 text-sm text-zinc-400">
            <span className="tabular-nums text-paper">{filteredTeams.length}</span> teams in {leagueLabel(league)}
          </p>

          <CardsByTeamChartView rows={chartRows} />

          {league === "NCAA-M" || league === "NCAA-W" ? (
            <NcaaConferenceGroupings data={data} league={league} teams={teams} onOpen={(slugToOpen) => {
              setTeamSlug(slugToOpen);
              apply({ teamSlug: slugToOpen });
            }} />
          ) : (
            <TeamGrid teams={filteredTeams} imagery={imagery} onOpen={(slugToOpen) => {
              setTeamSlug(slugToOpen);
              apply({ teamSlug: slugToOpen });
            }} />
          )}
        </>
      )}
    </div>
  );
}

function TeamsToWatch({
  picks,
  onOpen,
}: {
  picks: { p: TeamsData["editorialTeamsToWatch"][number]; team: Team }[];
  onOpen: (teamSlug: string) => void;
}) {
  if (!picks.length) return null;
  return (
    <section className="mt-8 rounded-2xl border border-zinc-800/80 bg-zinc-950/35 p-6">
      <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Teams to watch</p>
      <h2 className="mt-2 font-serif text-2xl text-paper">Six teams that define the release</h2>
      <p className="mt-2 max-w-3xl text-sm text-zinc-400">
        Structured from <code className="rounded bg-black/30 px-1">editorialTeamsToWatch</code>.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {picks.map(({ p, team }) => (
          <button
            key={p.teamSlug}
            type="button"
            onClick={() => onOpen(p.teamSlug)}
            className="rounded-xl border border-zinc-800/80 bg-black/20 p-4 text-left hover:border-zinc-600"
          >
            <div className="font-serif text-lg text-paper">{team.name}</div>
            <div className="mt-1 text-xs font-medium text-emerald-300/90">{p.headline}</div>
            <p className="mt-2 text-sm text-zinc-400 line-clamp-4">{p.reasoning}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function CardsByTeamChartView({ rows }: { rows: CardsByTeamEntry[] }) {
  if (!rows.length) return null;
  const max = rows[0]?.cardCount || 1;
  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl text-paper sm:text-3xl">Cards by team</h2>
      <p className="mt-2 max-w-3xl text-sm text-zinc-400">
        Pre-sorted descending in <code className="rounded bg-black/30 px-1">cardsByTeamChart</code> — rendered as a
        comparison chart so ties (e.g. 10 cards each) stay visible.
      </p>
      <div className="mt-6 space-y-2">
        {rows.slice(0, 24).map((r) => {
          const pct = Math.round((r.cardCount / max) * 100);
          return (
            <div key={r.teamSlug} className="flex items-center gap-3 text-sm">
              <div className="w-44 shrink-0 truncate text-zinc-300">{r.teamName}</div>
              <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full rounded-full bg-emerald-500/70" style={{ width: `${pct}%` }} />
              </div>
              <div className="w-10 shrink-0 text-right tabular-nums text-zinc-300">{r.cardCount}</div>
              <div className="hidden w-20 shrink-0 text-right text-xs text-zinc-600 sm:block">
                {r.hasAutoSigner ? "Auto" : "—"}
                {r.hasHolyGrail ? <span className="ml-2 text-amber-300/90">Grail</span> : null}
              </div>
            </div>
          );
        })}
      </div>
      {rows.length > 24 ? (
        <details className="mt-4 text-sm text-zinc-500">
          <summary className="cursor-pointer text-zinc-400 hover:text-paper">+{rows.length - 24} more teams</summary>
          <div className="mt-3 space-y-2">
            {rows.slice(24).map((r) => {
              const pct = Math.round((r.cardCount / max) * 100);
              return (
                <div key={r.teamSlug} className="flex items-center gap-3 text-sm">
                  <div className="w-44 shrink-0 truncate text-zinc-300">{r.teamName}</div>
                  <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-zinc-800">
                    <div className="h-full rounded-full bg-emerald-500/50" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="w-10 shrink-0 text-right tabular-nums text-zinc-300">{r.cardCount}</div>
                </div>
              );
            })}
          </div>
        </details>
      ) : null}
    </section>
  );
}

function TeamGrid({
  teams,
  imagery,
  onOpen,
}: {
  teams: Team[];
  imagery: ImageryData | undefined;
  onOpen: (teamSlug: string) => void;
}) {
  return (
    <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {teams.map((t) => {
        const src = logoPath(t, imagery);
        return (
          <button
            key={t.slug}
            type="button"
            onClick={() => onOpen(t.slug)}
            className="rounded-xl border border-zinc-800/80 bg-zinc-950/30 p-4 text-left hover:border-zinc-600"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-zinc-900">
                {src ? <OverviewImage src={src} alt={t.name} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="min-w-0">
                <div className="truncate font-medium text-paper">{t.name}</div>
                <div className="text-xs text-zinc-500">
                  <span className="tabular-nums">{t.roster?.length ?? 0}</span> cards
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </section>
  );
}

function NcaaConferenceGroupings({
  data,
  league,
  teams,
  onOpen,
}: {
  data: TeamsData;
  league: LeagueData["league"];
  teams: Team[];
  onOpen: (teamSlug: string) => void;
}) {
  const groupings = data.ncaaEditorial?.conferenceGroupings ?? [];
  const bySlug = new Map(teams.map((t) => [t.slug, t]));
  const used = new Set<string>();

  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl text-paper sm:text-3xl">Conference groupings</h2>
      {league === "NCAA-W" ? (
        <p className="mt-2 max-w-3xl text-sm text-zinc-400">{data.ncaaEditorial?.womensSection}</p>
      ) : (
        <p className="mt-2 max-w-3xl text-sm text-zinc-400">{data.ncaaEditorial?.projectedDraftClass}</p>
      )}

      <div className="mt-6 space-y-3">
        {groupings.map((g) => {
          const teamsInGroup = g.schoolSlugs.map((s) => bySlug.get(s)).filter(Boolean) as Team[];
          if (teamsInGroup.length === 0) return null;
          for (const t of teamsInGroup) used.add(t.slug);
          return (
            <details key={g.conference} open={g.expandedByDefault} className="rounded-xl border border-zinc-800/80 bg-zinc-950/30 p-4">
              <summary className="cursor-pointer font-medium text-paper">
                {g.conference} <span className="ml-2 text-xs text-zinc-500 tabular-nums">({teamsInGroup.length})</span>
              </summary>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {teamsInGroup.map((t) => (
                  <button
                    key={t.slug}
                    type="button"
                    onClick={() => onOpen(t.slug)}
                    className="rounded-lg border border-zinc-800/80 bg-black/20 p-3 text-left hover:border-zinc-600"
                  >
                    <div className="font-medium text-paper">{t.name}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      <span className="tabular-nums">{t.roster?.length ?? 0}</span> cards
                    </div>
                  </button>
                ))}
              </div>
            </details>
          );
        })}

        {/* Any NCAA teams not in the 8 conference buckets */}
        {teams.some((t) => !used.has(t.slug)) ? (
          <details className="rounded-xl border border-zinc-800/80 bg-zinc-950/30 p-4">
            <summary className="cursor-pointer font-medium text-paper">Other programs</summary>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {teams
                .filter((t) => !used.has(t.slug))
                .map((t) => (
                  <button
                    key={t.slug}
                    type="button"
                    onClick={() => onOpen(t.slug)}
                    className="rounded-lg border border-zinc-800/80 bg-black/20 p-3 text-left hover:border-zinc-600"
                  >
                    <div className="font-medium text-paper">{t.name}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      <span className="tabular-nums">{t.roster?.length ?? 0}</span> cards
                    </div>
                  </button>
                ))}
            </div>
          </details>
        ) : null}
      </div>
    </section>
  );
}

function TeamDetail({
  team,
  imagery,
  onBack,
}: {
  team: Team;
  imagery: ImageryData | undefined;
  onBack: () => void;
}) {
  const src = logoPath(team, imagery);
  const roster = team.roster ?? [];
  const autoCount = roster.filter((r) => r.autoAvailable).length;
  return (
    <section className="mt-8">
      <button type="button" onClick={onBack} className="text-sm text-emerald-400/90 hover:underline">
        ← Back to league view
      </button>

      <div className="mt-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/35 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded bg-zinc-900">
              {src ? <OverviewImage src={src} alt={team.name} className="h-full w-full object-cover" /> : null}
            </div>
            <div>
              <h2 className="font-serif text-3xl text-paper">{team.name}</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {team.league}
                {team.conference ? <span> · {team.conference}</span> : null}
                {team.division ? <span> · {team.division}</span> : null}
              </p>
            </div>
          </div>
          <div className="text-right text-sm text-zinc-400">
            <div>
              <span className="tabular-nums text-paper">{roster.length}</span> cards
            </div>
            <div>
              <span className="tabular-nums text-paper">{autoCount}</span> with autos
            </div>
          </div>
        </div>

        {/* Editorial notes only in detail view (avoid noise in grid). */}
        {team.editorialNote ? <p className="mt-6 text-sm leading-relaxed text-zinc-300">{team.editorialNote}</p> : null}

        <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-800/80">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-3 py-2">Card</th>
                <th className="px-3 py-2">Player</th>
                <th className="px-3 py-2">Subset</th>
                <th className="px-3 py-2">RC</th>
                <th className="px-3 py-2">Auto</th>
                <th className="px-3 py-2 tabular-nums">Lowest #</th>
                <th className="px-3 py-2 tabular-nums">Rainbow</th>
                <th className="px-3 py-2">Grail</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((r) => (
                <tr key={`${r.cardNumber}-${r.playerSlug}-${r.subset}`} className="border-b border-zinc-900/80 hover:bg-zinc-900/40">
                  <td className="px-3 py-2 font-mono text-xs text-zinc-400">{r.cardNumber}</td>
                  <td className="px-3 py-2 font-medium text-paper">{r.player}</td>
                  <td className="px-3 py-2 text-zinc-500">{r.subset}</td>
                  <td className="px-3 py-2 text-zinc-500">{r.isRookie ? "RC" : "—"}</td>
                  <td className="px-3 py-2">
                    {r.autoAvailable ? (
                      <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-100 ring-1 ring-emerald-500/30">
                        Yes
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-zinc-400">
                    {typeof r.lowestParallelNumbered === "number" ? `/${r.lowestParallelNumbered}` : "—"}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-zinc-500">{r.parallelRainbowSlugs?.length ?? 0}</td>
                  <td className="px-3 py-2">{r.isHolyGrail ? <span className="text-amber-300/90">★</span> : <span className="text-zinc-700">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

