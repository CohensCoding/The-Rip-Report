import type { BoxFormatName } from "./common";

export interface InsightsData {
  featuredTiles: InsightTile[];
  allTiles: InsightTile[];
  playerRainbows: PlayerRainbow[];
  teamDataViz: {
    autographDensityByTeam: TeamAutoDensity[];
    rookieDistributionByConference?: ConferenceRookieStats[];
  };
  productDataViz: {
    parallelCountDistribution: ParallelCountBucket[];
    caseHitProbability?: CaseHitProbability;
    autoTierDistribution: { tier: 1 | 2 | 3 | 4; count: number }[];
  };
  /** Patch 6 — optional; loaders default to [] when absent */
  featuredVisualizations?: FeaturedViz[];
  funTakeaways: FunTakeaway[];
}

export interface InsightTile {
  slug: string;
  headline: string;
  stat: string;
  caption: string;
  iconType?: "player" | "team" | "parallel" | "number" | "chart";
  iconSlug?: string;
  tier: "featured" | "secondary";
}

export interface PlayerRainbow {
  playerSlug: string;
  playerName: string;
  teamSlug?: string;
  totalParallels: number;
  breakdown: {
    groupName: string;
    parallelSlugs: string[];
  }[];
  rarestParallelSlug?: string;
  /** Stage 2 rewrite — narrative grounding for the rainbow. */
  narrativeFraming?: string;
  /** Insert set slugs where the player appears. */
  insertAppearances?: string[];
  /** Count of autograph sets the player appears in (from autographs.json). */
  autoSetCount?: number;
  /** Autograph set slugs where the player appears. */
  autoSets?: string[];
}

export interface TeamAutoDensity {
  teamSlug: string;
  teamName: string;
  autoSignerCount: number;
  totalCards: number;
  densityRatio: number;
}

export interface ConferenceRookieStats {
  conference: string;
  rookieCount: number;
  schoolCount: number;
  notableRookies: string[];
}

export interface ParallelCountBucket {
  label: string;
  printRunRange: [number, number] | "unnumbered";
  parallelCount: number;
}

export interface CaseHitProbability {
  description: string;
  pullRate: string;
  notes?: string;
  source?: string;
}

export interface FunTakeaway {
  headline: string;
  body: string;
  relatedSlugs?: string[];
}

// ─── Patch 6 — Featured visualizations (discriminated union) ───────────────

interface FeaturedVizBase {
  slug: string;
  title: string;
  subtitle: string;
  caption: string;
}

export interface PaniniShadowViz extends FeaturedVizBase {
  type: "panini-shadow";
  draftPicks: Array<{
    draftPick: number;
    player: string;
    playerSlug: string;
    team: string;
    teamSlug: string;
    autoSetCount: number;
    hasAuto: boolean;
  }>;
  xAxis: string;
  yAxis: string;
}

export interface YoungKingsTimelineViz extends FeaturedVizBase {
  type: "young-kings-timeline";
  players: Array<{
    cardNumber: string;
    player: string;
    era: "current" | "legend";
    peakYear: number;
    iconicTeam: string;
    iconicTeamSlug: string | null;
    annotation?: string;
  }>;
  xAxis: string;
  note: string;
}

export interface IdenticalInsertQuartetViz extends FeaturedVizBase {
  type: "identical-insert-quartet";
  quartet: Array<{
    slug: string;
    name: string;
    size: number;
    oddsDisplay: string;
    editorialTier: "chase" | "notable" | "common" | "filler";
  }>;
  sharedPlayerPool: string[];
  editorialStatement: string;
}

export interface MojoLadderViz extends FeaturedVizBase {
  type: "mojo-ladder";
  rungs: Array<{
    name: string;
    slug: string;
    printRun: number;
    color: { hex: string; gradient?: { from: string; to: string } };
    exclusiveTo: BoxFormatName[];
  }>;
  exclusiveFormat: BoxFormatName;
  note: string;
}

export interface CaseHitBubblePoint {
  slug: string;
  name: string;
  ipCategory: string;
  hobbyOdds: number;
  hobbyOddsDisplay: string;
  bubbleSize: number;
  size: number;
  editorialTier: "chase" | "notable" | "common" | "filler";
}

export interface CaseHitBubblesViz extends FeaturedVizBase {
  type: "case-hit-bubbles";
  caseHits: CaseHitBubblePoint[];
  easiest: CaseHitBubblePoint | null;
  hardest: CaseHitBubblePoint | null;
}

export type FeaturedViz =
  | PaniniShadowViz
  | YoungKingsTimelineViz
  | IdenticalInsertQuartetViz
  | MojoLadderViz
  | CaseHitBubblesViz;
