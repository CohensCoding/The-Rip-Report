/**
 * Rip Report — Release Schema
 *
 * Every release page is rendered from a single Release object (stored as JSON
 * in /content/releases/*.json). The homepage is rendered from the manifest
 * plus individual Release files.
 *
 * When adding new fields, keep backward compatibility in mind — older JSON
 * files shouldn't break. Prefer optional fields (with `?`) over required ones.
 */

// ─── Top-level Release ──────────────────────────────────────────────────────

export interface Release {
  // Identity
  slug: string;                  // URL slug, e.g. "2025-26-bowman-basketball"
  title: string;                 // Full title, e.g. "2025-26 Bowman Basketball"
  shortTitle?: string;           // For tight tile layouts
  year: string;                  // "2025" or "2025-26"
  sport: Sport;
  brand: Brand;
  manufacturer: Manufacturer;
  releaseDate: string;           // ISO format: "2026-04-22"
  preorderDate?: string;
  status: ReleaseStatus;

  // Hero
  heroImage?: string;            // Path to hero image, e.g. "/images/2025-26-bowman-basketball/hero.jpg"
  tagline: string;               // Short, punchy, 1 sentence
  summary: string;               // 2-3 sentences, sets context for the page

  // Verdict / TL;DR
  verdict: Verdict;

  // Set structure
  boxFormats: BoxFormat[];
  baseSet: BaseSet;
  parallels: ParallelGroup[];
  inserts: InsertSet[];
  autographs: AutographSet[];

  // Team breakdown (optional — not every sport has clean team rookie breakdowns)
  teamBreakdown?: TeamBreakdown[];

  // Editorial
  commentary: Commentary;
  chaseCards?: ChaseCard[];

  // Links
  links: Links;

  // Meta
  lastUpdated: string;           // ISO format
  author: string;                // "Jake Cohen"
}

// ─── Enums / Literal Unions ─────────────────────────────────────────────────

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
  | "panini-prizm"
  | "panini-select"
  | "panini-donruss"
  | "panini-national-treasures"
  | "upper-deck"
  | "upper-deck-artifacts"
  | "upper-deck-mvp"
  | "other";

export type Manufacturer = "Topps" | "Panini" | "Upper Deck" | "Leaf" | "Other";

export type ReleaseStatus = "released" | "preorder" | "announced";

// ─── Verdict ────────────────────────────────────────────────────────────────

export interface Verdict {
  oneLineTake: string;           // The TL;DR headline
  whoThisIsFor: string;          // "Prospectors chasing the 2026 MLB draft class"
  keyChaseCard: string;          // "Cooper Flagg Superfractor 1/1"
  rating?: Rating;               // Optional Rip Report rating
}

export interface Rating {
  score: number;                 // 1-10
  label: string;                 // "Rip", "Hold", "Skip", "Must Own"
}

// ─── Box Formats ────────────────────────────────────────────────────────────

export interface BoxFormat {
  name: string;                  // "Hobby", "Jumbo", "Mega", "Value", "Breaker's Delight"
  cardsPerPack: number;
  packsPerBox: number;
  boxesPerCase?: number;
  msrp?: number;                 // Manufacturer/preorder price
  secondaryPrice?: number;       // Current secondary market price
  guarantees: string[];          // ["1 Autograph", "12 Inserts", "1 Mini-Diamond Refractor"]
  exclusives?: string[];         // ["Orange Border /25", "Black Border /10"]
  notes?: string;                // Any extra context
}

// ─── Base Set ───────────────────────────────────────────────────────────────

export interface BaseSet {
  size: number;                  // Total cards in the base set
  rookieCount?: number;
  variations?: Variation[];      // SP variations, Red RCs, Etched in Glass, etc.
  notes?: string;
  subsets?: Subset[];            // E.g. Prospects set in Bowman
}

export interface Subset {
  name: string;                  // "Paper Prospects", "Chrome Prospects", "NCAA Prospects"
  size: number;
  notes?: string;
}

export interface Variation {
  name: string;                  // "Rookie Red Variation", "Etched In Glass"
  description?: string;
  odds?: string;
  printRun?: string;             // "SP" or "1:300 packs" or specific number
}

// ─── Parallels ──────────────────────────────────────────────────────────────

export interface ParallelGroup {
  appliesTo: string;             // "Base", "Chrome Prospects", "NCAA Prospects", etc.
  parallels: Parallel[];
}

export interface Parallel {
  name: string;                  // "Gold Refractor"
  printRun?: number | string;    // Number if numbered. Use string for "unnumbered" or "SSP"
  odds?: string;                 // "1:12 packs"
  exclusiveTo?: BoxFormatName[]; // ["Hobby"] or ["Hobby", "Jumbo"]
  isCaseHit?: boolean;
  notes?: string;
}

export type BoxFormatName = "Hobby" | "Jumbo" | "Mega" | "Value" | "Retail" | "Breaker's Delight";

// ─── Inserts ────────────────────────────────────────────────────────────────

export interface InsertSet {
  name: string;                  // "Bowman Spotlights"
  size?: number;
  odds?: string;                 // "1:8 packs"
  isNew?: boolean;               // First appearance in this brand?
  isCaseHit?: boolean;
  description?: string;
  parallels?: Parallel[];
  notableCards?: string[];       // ["Cooper Flagg", "AJ Dybantsa"]
}

// ─── Autographs ─────────────────────────────────────────────────────────────

export interface AutographSet {
  name: string;                  // "Chrome Prospect Autographs"
  signerCount?: number;
  odds?: string;                 // "1 per Hobby box"
  boxGuarantee?: string;         // "1 NBA auto + 1 NIL auto per Hobby box"
  description?: string;
  parallels?: Parallel[];
  notableSigners?: string[];     // Feature a few top names
  isHardSigned?: boolean;
  hasRedemptions?: boolean;
}

// ─── Team Breakdown ─────────────────────────────────────────────────────────

export interface TeamBreakdown {
  team: string;                  // "Dallas Mavericks"
  league?: string;               // "NBA", "NCAA", etc.
  rookieCount: number;
  notableRookies: string[];
  notableVeterans?: string[];
  headlinerCard?: string;        // The one card from this team to chase
}

// ─── Commentary ─────────────────────────────────────────────────────────────

export interface Commentary {
  whatsNew?: string;             // What's new vs. last year's product
  whatMatters: string;           // Long-form take on what actually matters in this set (REQUIRED)
  formatAdvice?: string;         // "Skip Jumbo, buy Hobby" — breakdown of which format to buy
  compToLastYear?: string;       // How it stacks up vs. the 20XX version
  redFlags?: string;             // Honest critique — what's weak, missing, or overhyped
  bullCase?: string;             // Why this set could appreciate
  bearCase?: string;             // Why this set might not
}

// ─── Chase Cards ────────────────────────────────────────────────────────────

export interface ChaseCard {
  player: string;
  team?: string;
  cardName: string;              // "Superfractor 1/1", "Red /5"
  reason: string;                // Why this is the chase
  estimatedValue?: string;       // "$8K-$15K" — use ranges
}

// ─── Links ──────────────────────────────────────────────────────────────────

export interface Links {
  officialOddsPdf?: string;
  officialProductPage?: string;
  checklistSource?: string;
  buyLinks?: BuyLink[];
  relatedReleases?: RelatedRelease[];
}

export interface BuyLink {
  retailer: string;              // "Topps", "Steel City Collectibles", "Fanatics"
  url: string;
  format?: BoxFormatName;
}

export interface RelatedRelease {
  slug: string;
  title: string;
  relationship: "previous-year" | "companion-set" | "chrome-version" | "related";
}

// ─── Manifest ───────────────────────────────────────────────────────────────

/**
 * The manifest is a lightweight index of all releases. It's what the homepage
 * reads to render the tile grid. Full release data is loaded lazily from
 * individual JSON files.
 */
export interface ReleaseManifestEntry {
  slug: string;
  title: string;
  sport: Sport;
  brand: Brand;
  releaseDate: string;
  status: ReleaseStatus;
  heroImage?: string;
  tagline: string;
  featured?: boolean;            // Show prominently on homepage
}

export interface Manifest {
  releases: ReleaseManifestEntry[];
}
