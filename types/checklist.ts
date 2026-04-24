export interface Checklist {
  cards: Card[];
  metadata: {
    totalCards: number;
    byTeam: Record<string, number>;
    byLeague: Record<string, number>;
    rookieCount: number;
    /** Sourced Bowman JSON uses `null` — derive from `autographs.signerIndex.length` when absent */
    autoSignerCount: number | null;
    subsetCounts: Record<string, number>;
  };
}

export interface Card {
  cardNumber: string;
  subset: string;
  player: string;
  playerSlug: string;
  team: string;
  teamSlug: string;
  league: "NBA" | "NCAA-M" | "NCAA-W" | "MLB" | "NFL" | "NHL" | "MLS" | "OTHER";
  isRookie: boolean;
  isFirstBowman?: boolean;
  isSP?: boolean;
  isSSP?: boolean;
  parallelsAvailable: string[];
  autoAvailable?: {
    sets: string[];
    lowestPrintRun?: number;
  };
  relicAvailable?: boolean;
  variations?: CardVariation[];
  imageSlug?: string;
  imageBackSlug?: string;
  isHolyGrail?: boolean;
  rarityTier?: "common" | "chase" | "grail" | "holy-grail";
  editorialNote?: string;
}

export interface CardVariation {
  name: string;
  description?: string;
  odds?: string;
  imageSlug?: string;
}
