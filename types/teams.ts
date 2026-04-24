export interface TeamsData {
  leagues: LeagueData[];
  editorialTeamsToWatch: EditorialTeamPick[];
  ncaaEditorial?: {
    overview: string;
    projectedDraftClass: string;
    womensSection: string;
    conferenceGroupings: ConferenceGrouping[];
  };
  cardsByTeamChart: CardsByTeamEntry[];
}

export interface LeagueData {
  league: "NBA" | "NCAA-M" | "NCAA-W" | "MLB" | "NFL" | "NHL";
  teams: Team[];
}

export interface Team {
  name: string;
  slug: string;
  league: string;
  conference?: string;
  division?: string;
  accentColor?: { hex: string };
  logoSlug?: string;
  roster: TeamRosterEntry[];
  editorialNote?: string;
  relatedTeamSlugs?: string[];
}

export interface TeamRosterEntry {
  cardNumber: string;
  player: string;
  playerSlug: string;
  subset: string;
  isRookie: boolean;
  autoAvailable?: boolean;
  lowestParallelNumbered?: number;
  parallelRainbowSlugs?: string[];
  isHolyGrail?: boolean;
}

export interface EditorialTeamPick {
  teamSlug: string;
  headline: string;
  reasoning: string;
}

export interface CardsByTeamEntry {
  teamSlug: string;
  teamName: string;
  league: string;
  cardCount: number;
  rookieCount: number;
  notablePlayer?: string;
  hasAutoSigner: boolean;
  hasHolyGrail: boolean;
}

export interface ConferenceGrouping {
  conference: string;
  schoolSlugs: string[];
  expandedByDefault: boolean;
}
