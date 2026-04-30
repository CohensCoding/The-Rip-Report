/**
 * v2 canonical release root (`release.json`) per DATA-MODEL.md + sourcing patches.
 * Aggregated sub-files attach on `_loaded` at runtime (loader responsibility).
 */

import type { AutographData } from "./autographs";
import type { Checklist } from "./checklist";
import type { ImageryData } from "./imagery";
import type { InsightsData } from "./insights";
import type { InsertData } from "./inserts";
import type { ParallelData } from "./parallels";
import type { ResourcesData } from "./resources";
import type { TeamsData } from "./teams";
import type { Brand, Manufacturer, ReleaseStatus, Sport } from "./common";

export type { Brand, Manufacturer, ReleaseStatus, Sport } from "./common";

export interface Release {
  slug: string;
  title: string;
  shortTitle?: string;
  year: string;
  sport: Sport;
  brand: Brand;
  manufacturer: Manufacturer;
  releaseDate: string;
  preorderDate?: string | null;
  status: ReleaseStatus;

  tagline: string;
  heroImagery?: {
    boxShotsSlug?: string;
  };

  synopsis: string;

  verdict: Verdict;

  boxFormats: BoxFormat[];

  /** Subset / size rollup (Module 3). Canonical field name for content + types. */
  baseSetSummary: BaseSetSummary;

  commentary: Commentary;

  holyGrails?: HolyGrail[];

  /** Sourcing metadata — add to JSON when available */
  lastUpdated?: string;
  author?: string;

  _loaded?: {
    checklist?: Checklist;
    parallels?: ParallelData;
    autographs?: AutographData;
    inserts?: InsertData;
    teams?: TeamsData;
    insights?: InsightsData;
    resources?: ResourcesData;
    imagery?: ImageryData;
  };
}

export interface Verdict {
  oneLineTake: string;
  whoThisIsFor: string;
  keyChaseCard: string;
  releaseWindow?: string;
  /** Omit entirely until anchored — do not infer or placeholder in UI */
  rating?: Rating;
}

export interface Rating {
  score: number;
  label: "Must Own" | "Rip" | "Hold" | "Pass" | "Watch";
}

export interface BoxFormat {
  name:
    | "Hobby"
    | "Jumbo"
    | "Mega"
    | "Value"
    | "Breaker's Delight"
    | "Retail Blaster"
    | "Retail Hanger";
  tier: "retail" | "hobby" | "premium";
  cardsPerPack: number;
  packsPerBox: number;
  boxesPerCase?: number;
  msrp?: number;
  currentPrice?: {
    amount: number;
    source: string;
    asOf: string;
  };
  bestFor: string;
  guarantees: string[];
  exclusives?: string[];
  imageSlug?: string;
  notes?: string;
}

export interface BaseSetSummary {
  totalCards: number;
  subsets: SubsetSummary[];
  rookieCount?: number;
  variations?: VariationSummary[];
  notes?: string;
}

export interface SubsetSummary {
  name: string;
  size: number;
  description?: string;
}

export interface VariationSummary {
  name: string;
  description?: string;
  odds?: string;
  printRun?: string;
}

export interface Commentary {
  whatsNew?: string;
  formatAdvice?: string;
  compToLastYear?: string;
  redFlags?: string;
  bullCase?: string;
  bearCase?: string;
  notableAbsences?: string;
  /** Overview Module 2 — 2–3 paragraph editorial framing. */
  setFraming?: string;
}

export interface HolyGrail {
  player: string;
  team?: string;
  teamSlug?: string;
  cardName: string;
  cardNumber?: string;
  parallelSlug?: string;
  reason: string;
  estimatedValue?: string;
  imageSlug?: string;
  rarityRank: number;
}
