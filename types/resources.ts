import type { BoxFormatName } from "./common";

export interface ResourcesData {
  boxFormatDeepDive: BoxFormatDeepDive[];
  officialResources: OfficialLink[];
  buyLinks: BuyLinksByFormat[];
  breakProviders?: BreakProvider[];
  gradingConsiderations?: string;
  errata: ErratumEntry[];
  relatedReading?: RelatedReading[];
}

export interface BoxFormatDeepDive {
  formatName: string;
  imageSlug?: string;
  spec: {
    cardsPerPack: number;
    packsPerBox: number;
    boxesPerCase?: number;
    totalCards: number;
  };
  pricing: {
    msrp?: number;
    /** Sourced JSON uses null when unknown — codegen may use `number | null` or omit key */
    currentPrice?: number | null;
    asOf?: string;
    source?: string;
  };
  guarantees: string[];
  exclusives: string[];
  expectedValueNote?: string;
  bestForVerdict: {
    audience: string;
    reasoning: string;
  };
}

export interface OfficialLink {
  type: "odds-pdf" | "product-page" | "sell-sheet" | "press-release";
  url: string;
  label: string;
  postedAt: string;
  size?: string;
}

export interface BuyLinksByFormat {
  format: BoxFormatName;
  retailers: Retailer[];
}

export interface Retailer {
  name: string;
  url: string;
  price?: number;
  asOf?: string;
  trustLevel: "official" | "vetted-secondary" | "marketplace";
}

export interface BreakProvider {
  name: string;
  url: string;
  note?: string;
}

export interface ErratumEntry {
  date: string;
  summary: string;
  sectionsAffected: string[];
}

export interface RelatedReading {
  slug: string;
  relationship: "previous-year" | "companion-set" | "chrome-version" | "related";
  editorialBlurb?: string;
}
