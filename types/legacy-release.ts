/**
 * v1 prototype release schema — still used by homepage + legacy release page
 * until those routes are migrated to v2 (`types/release.ts`).
 */

import type { Brand, Sport } from "./common";
import type { Manifest, ReleaseManifestEntry } from "./manifest";

export type { Manifest, ReleaseManifestEntry };

export interface LegacyRelease {
  slug: string;
  title: string;
  shortTitle?: string;
  year: string;
  sport: Sport;
  brand: Brand;
  manufacturer: LegacyManufacturer;
  releaseDate: string;
  preorderDate?: string;
  status: LegacyReleaseStatus;

  heroImage?: string;
  tagline: string;
  summary: string;

  verdict: LegacyVerdict;

  boxFormats: LegacyBoxFormat[];
  baseSet: LegacyBaseSet;
  parallels: LegacyParallelGroup[];
  inserts: LegacyInsertSet[];
  autographs: LegacyAutographSet[];

  teamBreakdown?: LegacyTeamBreakdown[];

  commentary: LegacyCommentary;
  chaseCards?: LegacyChaseCard[];

  links: LegacyLinks;

  lastUpdated: string;
  author: string;
}

export type LegacyManufacturer = "Topps" | "Panini" | "Upper Deck" | "Leaf" | "Other";

export type LegacyReleaseStatus = "released" | "preorder" | "announced" | "dropped";

export interface LegacyVerdict {
  oneLineTake: string;
  whoThisIsFor: string;
  keyChaseCard: string;
  rating?: LegacyRating;
}

export interface LegacyRating {
  score: number;
  label: string;
}

export interface LegacyBoxFormat {
  name: string;
  cardsPerPack: number;
  packsPerBox: number;
  boxesPerCase?: number;
  msrp?: number;
  secondaryPrice?: number;
  guarantees: string[];
  exclusives?: string[];
  notes?: string;
}

export interface LegacyBaseSet {
  size: number;
  rookieCount?: number;
  variations?: LegacyVariation[];
  notes?: string;
  subsets?: LegacySubset[];
}

export interface LegacySubset {
  name: string;
  size: number;
  notes?: string;
}

export interface LegacyVariation {
  name: string;
  description?: string;
  odds?: string;
  printRun?: string;
}

export interface LegacyParallelGroup {
  appliesTo: string;
  parallels: LegacyParallel[];
}

export interface LegacyParallel {
  name: string;
  printRun?: number | string;
  odds?: string;
  exclusiveTo?: LegacyBoxFormatName[];
  isCaseHit?: boolean;
  notes?: string;
}

export type LegacyBoxFormatName =
  | "Hobby"
  | "Jumbo"
  | "Mega"
  | "Value"
  | "Retail"
  | "Breaker's Delight";

export interface LegacyInsertSet {
  name: string;
  size?: number;
  odds?: string;
  isNew?: boolean;
  isCaseHit?: boolean;
  description?: string;
  parallels?: LegacyParallel[];
  notableCards?: string[];
}

export interface LegacyAutographSet {
  name: string;
  signerCount?: number;
  odds?: string;
  boxGuarantee?: string;
  description?: string;
  parallels?: LegacyParallel[];
  notableSigners?: string[];
  isHardSigned?: boolean;
  hasRedemptions?: boolean;
}

export interface LegacyTeamBreakdown {
  team: string;
  league?: string;
  rookieCount: number;
  notableRookies: string[];
  notableVeterans?: string[];
  headlinerCard?: string;
}

export interface LegacyCommentary {
  whatsNew?: string;
  whatMatters: string;
  formatAdvice?: string;
  compToLastYear?: string;
  redFlags?: string;
  bullCase?: string;
  bearCase?: string;
}

export interface LegacyChaseCard {
  player: string;
  team?: string;
  cardName: string;
  reason: string;
  estimatedValue?: string;
}

export interface LegacyLinks {
  officialOddsPdf?: string;
  officialProductPage?: string;
  checklistSource?: string;
  buyLinks?: LegacyBuyLink[];
  relatedReleases?: LegacyRelatedRelease[];
}

export interface LegacyBuyLink {
  retailer: string;
  url: string;
  format?: LegacyBoxFormatName;
}

export interface LegacyRelatedRelease {
  slug: string;
  title: string;
  relationship: "previous-year" | "companion-set" | "chrome-version" | "related";
}
