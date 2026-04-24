import type { PackOdds } from "./common";
import type { Parallel } from "./parallels";

export interface AutographData {
  sets: AutoSet[];
  signerIndex: SignerEntry[];
  tierRanking: SignerTiers;
  notableAbsences: NotableAbsence[];
  redemptionWatch?: RedemptionEntry[];
  editorial: {
    overview: string;
    tierExplanations: {
      tier1: string;
      tier2: string;
      tier3: string;
      tier4: string;
    };
  };
}

export interface AutoSet {
  name: string;
  slug: string;
  totalSigners: number;
  boxGuarantee?: string;
  odds?: PackOdds;
  isHardSigned: boolean;
  hasRedemptions: boolean;
  description: string;
  signers: string[];
  parallels?: Parallel[];
  imageSlug?: string;
  editorial?: string;
  /** Present in sourced JSON — editorial flags beyond DATA-MODEL core */
  isCaseHit?: boolean;
  isNew?: boolean;
}

export interface SignerEntry {
  player: string;
  playerSlug: string;
  team?: string;
  teamSlug?: string;
  league?: string;
  photoSlug?: string;
  inSets: string[];
  lowestParallelNumbered?: number | null;
  tier: 1 | 2 | 3 | 4;
  isFirstBowmanAuto?: boolean;
  isRookie?: boolean;
}

export interface SignerTiers {
  tier1: string[];
  tier2: string[];
  tier3: string[];
  tier4: string[];
}

export interface NotableAbsence {
  player: string;
  reason: string;
  expectedIn?: string;
}

export interface RedemptionEntry {
  player: string;
  autoSet: string;
  estimatedLandingWindow: string;
  notes?: string;
}
