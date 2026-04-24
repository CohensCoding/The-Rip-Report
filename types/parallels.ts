import type { BoxFormatName, PackOdds } from "./common";

/** Patch 1 — parallel family discriminator */
export type ParallelFamily =
  | "Border"
  | "Chrome"
  | "Reptilian"
  | "Geometric"
  | "Sapphire"
  | "Mojo";

export interface ParallelGroup {
  name: string;
  appliesTo: string;
  parallels: Parallel[];
}

export interface Parallel {
  name: string;
  slug: string;
  family: ParallelFamily;
  printRun?: number;
  printRunLabel?: string;
  odds?: PackOdds;
  exclusiveTo?: BoxFormatName[];
  isCaseHit?: boolean;
  color: {
    hex: string;
    gradient?: { from: string; to: string };
    textColor?: "light" | "dark";
  };
  editorialTier?: "chase" | "notable" | "common" | "filler";
  note?: string;
}

/** Patch 3 */
export interface ExclusivityMatrix {
  hobbyOnly: string[];
  retailOnly: string[];
  breakerOnly: string[];
  jumboOnly?: string[];
  megaOnly?: string[];
  sapphireOnly?: string[];
  hobbyAndJumboOnly?: string[];
}

/** Patch 5 — paperProspectParallelCount */
export interface RainbowSummary {
  baseParallelCount: number;
  chromeProspectParallelCount: number;
  paperProspectParallelCount?: number;
  totalRainbowPieces: number;
  headlineStat: string;
}

export interface ParallelData {
  groups: ParallelGroup[];
  editorial: {
    overview: string;
    perGroupNotes?: Record<string, string>;
  };
  exclusivityMatrix: ExclusivityMatrix;
  rainbowSummary: RainbowSummary;
}
