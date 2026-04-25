import type { LeagueData } from "@/types/teams";

export type TeamsInitialFilters = {
  league: "" | LeagueData["league"];
  q: string;
  teamSlug: string;
};

function firstString(v: string | string[] | undefined): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return "";
}

export function parseTeamsSearchParams(sp: Record<string, string | string[] | undefined>): TeamsInitialFilters {
  const leagueRaw = firstString(sp.league);
  const league =
    leagueRaw === "NBA" || leagueRaw === "NCAA-M" || leagueRaw === "NCAA-W" ? (leagueRaw as LeagueData["league"]) : "";
  return { league, q: firstString(sp.q), teamSlug: firstString(sp.team) };
}

