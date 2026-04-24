/**
 * Shared enums and odds types (Patch 7 canonical for PackOdds).
 */

export type Sport =
  | "football"
  | "baseball"
  | "basketball"
  | "hockey"
  | "soccer"
  | "racing"
  | "ufc"
  | "wrestling"
  | "multi-sport"
  | "non-sport";

export type Brand =
  | "topps"
  | "topps-chrome"
  | "topps-heritage"
  | "topps-finest"
  | "topps-stadium-club"
  | "bowman"
  | "bowman-chrome"
  | "bowman-draft"
  | "bowman-university"
  | "panini-prizm"
  | "panini-select"
  | "panini-donruss"
  | "panini-national-treasures"
  | "upper-deck"
  | "upper-deck-artifacts"
  | "upper-deck-mvp"
  | "other";

export type Manufacturer = "Topps" | "Panini" | "Upper Deck" | "Leaf" | "Other";

/** "dropped" = released within 14 days; homepage Latest Drop callout */
export type ReleaseStatus = "released" | "preorder" | "announced" | "dropped";

/** Patch 2 — includes Sapphire + Bulk (see DATA-MODEL-PATCHES.md) */
export type BoxFormatName =
  | "Hobby"
  | "Jumbo"
  | "Mega"
  | "Value"
  | "Retail"
  | "Breaker's Delight"
  | "Sapphire"
  | "Bulk";

/** Patch 7 — named types (canonical; do not use Patch 4 inline shape) */
export interface PerFormatOdds {
  onePerN: number;
  ratioDisplay: string;
}

export interface OddsSource {
  type: "official-topps-pdf" | "sell-sheet" | "reconstructed";
  url?: string;
  asOf: string;
}

export interface PackOdds {
  ratioDisplay: string;
  ratio: { onePerN: number };
  perFormat?: Partial<Record<BoxFormatName, PerFormatOdds>>;
  source?: OddsSource;
}
