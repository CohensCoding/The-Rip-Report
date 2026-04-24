# Rip Report — Data Model (v2)

> This document replaces `types/release.ts` as the source of truth for data structures. Updated to match ARCHITECTURE v2 — `chaseCards` renamed to `holyGrails`, `synopsis` added to commentary for the Overview's Module 1, new `InsightsData` type for the Insights sub-page.

---

## Why we restructured from a single file

The v1 schema (266 lines, one file) worked for the prototype because a release was ~250 lines of JSON. At bible completeness, a release is closer to 3,000-5,000 lines:

- 200 base NBA cards × ~40 fields each = 8,000 data points per release for checklist alone
- 100 paper prospects + 100 chrome prospects = another 8,000
- 14 base parallels × per-card availability = parallel matrix data
- 87 signers across 6 auto sets with per-parallel print runs
- 13 insert sets each with their own checklist
- 30 NBA team rosters
- 60+ NCAA program rosters

A single JSON file that large is unwieldy. The revised schema splits by concern into multiple files per release, so you're editing one focused file at a time.

---

## File structure per release

```
/content/releases/2025-26-bowman-basketball/
├── release.json              Overview, verdict, commentary, synopsis, holyGrails
├── checklist.json            Every card's structured data
├── parallels.json            Parallel groups with full odds
├── autographs.json           Auto sets + signer tiers + per-signer parallels
├── inserts.json              Insert sets with their checklists
├── teams.json                Team rosters (NBA + NCAA consolidated)
├── insights.json             Structured insight tiles + data visualizations
├── resources.json            Links, buy options, errata history
└── imagery.json              Image paths and attributions
```

Nine files per release. `insights.json` is new in v2 — it powers both the Overview's Module 7 and the dedicated Insights sub-page.

The `manifest.json` at `/content/releases/` still indexes all releases. Load functions aggregate from the sub-files.

---

## Type definitions

Each section below specifies one file. Copy these into `/types/` as separate files once approved.

---

### `/types/release.ts`

Top-level release metadata and editorial content. This file is smaller than v1 — it delegates depth to the other files.

```typescript
import type { Checklist } from './checklist';
import type { ParallelData } from './parallels';
import type { AutographData } from './autographs';
import type { InsertData } from './inserts';
import type { TeamsData } from './teams';
import type { InsightsData } from './insights';
import type { ResourcesData } from './resources';
import type { ImageryData } from './imagery';

export interface Release {
  // Identity
  slug: string;
  title: string;
  shortTitle?: string;
  year: string;
  sport: Sport;
  brand: Brand;
  manufacturer: Manufacturer;
  releaseDate: string;           // ISO: "2026-04-22"
  preorderDate?: string;
  status: ReleaseStatus;

  // Hero metadata
  tagline: string;
  heroImagery?: {
    boxShotsSlug?: string;       // Key into imagery.json for the box-shots hero
  };

  // Editorial — the Module 1 voice layer
  synopsis: string;              // REQUIRED — 2-3 paragraph opening for Overview Module 1
                                 // This is the opinionated take that anchors the whole page

  // Verdict (chip row beneath synopsis)
  verdict: Verdict;

  // Box formats — summary for Overview Module 6; deep specs live in resources.json
  boxFormats: BoxFormat[];

  // Base set structure summary for Overview Module 3
  baseSet: BaseSetSummary;

  // Extended commentary — feeds the expandable blocks below the 7 modules
  commentary: Commentary;

  // Holy Grails — the rarest cards, shown on Overview Module 4 and as Checklist filter preset
  holyGrails?: HolyGrail[];

  // Meta
  lastUpdated: string;
  author: string;

  // Aggregate references populated by the loader from sub-files
  // Not edited directly — loaded from their respective JSON files
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

// Enums
export type Sport = "football" | "baseball" | "basketball" | "hockey" | "soccer" | "racing" | "ufc" | "wrestling" | "multi-sport" | "non-sport";

export type Brand =
  | "topps" | "topps-chrome" | "topps-heritage" | "topps-finest" | "topps-stadium-club"
  | "bowman" | "bowman-chrome" | "bowman-draft" | "bowman-university"
  | "panini-prizm" | "panini-select" | "panini-donruss" | "panini-national-treasures"
  | "upper-deck" | "upper-deck-artifacts" | "upper-deck-mvp"
  | "other";

export type Manufacturer = "Topps" | "Panini" | "Upper Deck" | "Leaf" | "Other";
export type ReleaseStatus = "released" | "preorder" | "announced" | "dropped";
// "dropped" = released within 14 days; triggers the Homepage Latest Drop callout

export interface Verdict {
  oneLineTake: string;           // REQUIRED — the TL;DR pullquote
  whoThisIsFor: string;          // REQUIRED
  keyChaseCard: string;          // REQUIRED
  releaseWindow?: string;        // "Live now", "Releases in 3 weeks"
  rating?: Rating;
}

export interface Rating {
  score: number;                 // 1-10
  label: "Must Own" | "Rip" | "Hold" | "Pass" | "Watch";
}

export interface BoxFormat {
  name: "Hobby" | "Jumbo" | "Mega" | "Value" | "Breaker's Delight" | "Retail Blaster" | "Retail Hanger";
  cardsPerPack: number;
  packsPerBox: number;
  boxesPerCase?: number;
  msrp?: number;
  currentPrice?: {
    amount: number;
    source: string;              // "Steel City Collectibles, 2026-04-22"
    asOf: string;                // ISO date
  };
  bestFor: string;               // Editorial one-liner for Overview Module 6
  guarantees: string[];
  exclusives?: string[];
  imageSlug?: string;            // Key into imagery.json
  notes?: string;
}

export interface BaseSetSummary {
  totalCards: number;            // All cards across all subsets
  subsets: SubsetSummary[];
  rookieCount?: number;
  variations?: VariationSummary[];
  notes?: string;
}

export interface SubsetSummary {
  name: string;                  // "Base", "Paper Prospects", "Chrome Prospects", "NCAA Prospects"
  size: number;
  description?: string;
}

export interface VariationSummary {
  name: string;
  description?: string;
  odds?: string;
  printRun?: string;
}

// Commentary — Module 1 uses synopsis (above); the below fields power the
// expandable blocks BELOW the 7 modules on the Overview page
export interface Commentary {
  whatsNew?: string;             // "What's New vs. last year"
  formatAdvice?: string;         // May also appear in Resources Box Breakdown
  compToLastYear?: string;       // "How It Compares"
  redFlags?: string;             // Honest critique
  bullCase?: string;
  bearCase?: string;
  notableAbsences?: string;      // Used in Autograph Index's Notable Absences section
}

// The Holy Grails — Module 4 content and Checklist Browser filter preset target
export interface HolyGrail {
  player: string;
  team?: string;
  teamSlug?: string;
  cardName: string;              // "Chrome SuperFractor 1/1"
  cardNumber?: string;           // "BCP-1" — links to specific card in checklist
  parallelSlug?: string;         // Links to parallel in Parallel Explorer
  reason: string;                // Why this is the grail
  estimatedValue?: string;       // "$25K-$50K" — use ranges
  imageSlug?: string;
  rarityRank: number;            // 1 = rarest, used for ordering
}
```

---

### `/types/checklist.ts`

The big one. Structured card data.

```typescript
export interface Checklist {
  cards: Card[];
  metadata: {
    totalCards: number;
    byTeam: Record<string, number>;          // teamSlug -> card count
    byLeague: Record<string, number>;        // league -> card count
    rookieCount: number;
    autoSignerCount: number;
    subsetCounts: Record<string, number>;
    // Used for Overview Module 3 headline stats strip
  };
}

export interface Card {
  // Identity
  cardNumber: string;                        // "BCP-1", "1", "CPA-CF"
  subset: string;                            // "Base", "Paper Prospects", "Chrome Prospects", "NCAA Prospects"

  // Player
  player: string;
  playerSlug: string;                        // "cooper-flagg" — for links
  team: string;
  teamSlug: string;
  league: "NBA" | "NCAA-M" | "NCAA-W" | "MLB" | "NFL" | "NHL" | "MLS" | "OTHER";

  // Flags
  isRookie: boolean;
  isFirstBowman?: boolean;                   // Bowman-specific
  isSP?: boolean;
  isSSP?: boolean;

  // Availability
  parallelsAvailable: string[];              // Parallel slugs available for this card
  autoAvailable?: {
    sets: string[];                          // Auto set slugs
    lowestPrintRun?: number;                 // Lowest numbered auto parallel
  };
  relicAvailable?: boolean;
  variations?: CardVariation[];

  // Display
  imageSlug?: string;
  imageBackSlug?: string;

  // Editorial flags
  isHolyGrail?: boolean;                     // Surfaces in Overview Module 4 and Checklist Grails filter
  rarityTier?: "common" | "chase" | "grail" | "holy-grail";  // For Rarity filter presets
  editorialNote?: string;
}

export interface CardVariation {
  name: string;                              // "Rookie Red RC Variation", "Photo Variation"
  description?: string;
  odds?: string;
  imageSlug?: string;
}
```

**Note on rarityTier:** Used by the Checklist Browser's Rarity filter presets.
- `common`: base + unnumbered parallels
- `chase`: numbered parallels higher than /25
- `grail`: /10 or lower numbered
- `holy-grail`: 1/1 exclusive

Populated during data sourcing (Evening 2 in SOURCING-PLAN) based on the lowest numbered parallel available for that card.

---

### `/types/parallels.ts`

Parallel hierarchies with structured odds — not strings, so EV math is possible.

```typescript
export interface ParallelData {
  groups: ParallelGroup[];
  editorial: {
    overview: string;                        // Module 5 rainbow lead + Parallel Explorer callout
    perGroupNotes?: Record<string, string>;  // Keyed by group name
  };
  exclusivityMatrix: ExclusivityMatrix;

  // For Overview Module 5 (the Full Rainbow strip teaser)
  rainbowSummary: {
    baseParallelCount: number;
    chromeProspectParallelCount: number;
    totalRainbowPieces: number;              // For chase players across groups
    headlineStat: string;                    // "26 total rainbow pieces for chase players"
  };
}

export interface ParallelGroup {
  name: string;                              // "Base", "Chrome Prospects", "Insert — Bowman Spotlights"
  appliesTo: string;                         // Human-readable description
  parallels: Parallel[];
}

export interface Parallel {
  name: string;                              // "Gold Refractor"
  slug: string;                              // "gold-refractor" — stable ID for deep links

  // Rarity
  printRun?: number;                         // Numbered: the number
  printRunLabel?: string;                    // Non-numbered: "SP", "SSP", "Unnumbered"

  // Odds — structured for EV math
  odds?: PackOdds;

  // Exclusivity
  exclusiveTo?: BoxFormatName[];
  isCaseHit?: boolean;

  // Visual — the ACTUAL color for bar visualization
  color: {
    hex: string;                             // Primary color
    gradient?: {                             // Optional gradient for metallic/refractor
      from: string;
      to: string;
    };
    textColor?: "light" | "dark";            // Text contrast on this color
  };

  // Editorial
  editorialTier?: "chase" | "notable" | "common" | "filler";
  note?: string;
}

export interface PackOdds {
  ratioDisplay: string;                      // "1:24 packs" — for display
  ratio: {                                   // Structured for calculations
    onePerN: number;                         // 24
  };
  source?: {
    type: "official-topps-pdf" | "sell-sheet" | "reconstructed";
    url?: string;
    asOf: string;                            // ISO date
  };
}

export type BoxFormatName = "Hobby" | "Jumbo" | "Mega" | "Value" | "Retail" | "Breaker's Delight";

export interface ExclusivityMatrix {
  hobbyOnly: string[];                       // Parallel names
  retailOnly: string[];
  breakerOnly: string[];
  jumboOnly?: string[];
}
```

---

### `/types/autographs.ts`

Auto sets with per-signer parallel breakdowns and the 4-tier ladder.

```typescript
export interface AutographData {
  sets: AutoSet[];
  signerIndex: SignerEntry[];                // Flat list of all signers
  tierRanking: SignerTiers;                  // 4-tier editorial ranking
  notableAbsences: NotableAbsence[];
  redemptionWatch?: RedemptionEntry[];
  editorial: {
    overview: string;                        // "87 signers across 6 auto sets..."
    tierExplanations: {
      tier1: string;                         // "The Faces — top 3-5 players"
      tier2: string;                         // "Strong Co-Stars"
      tier3: string;                         // "Sleepers — upside bets"
      tier4: string;                         // "The Rest"
    };
  };
}

export interface AutoSet {
  name: string;                              // "Chrome Autographs"
  slug: string;
  totalSigners: number;
  boxGuarantee?: string;                     // "1 per Hobby box"
  odds?: PackOdds;
  isHardSigned: boolean;
  hasRedemptions: boolean;
  description: string;
  signers: string[];                         // Player names/slugs in this set
  parallels?: Parallel[];
  imageSlug?: string;
  editorial?: string;
}

export interface SignerEntry {
  player: string;
  playerSlug: string;
  team?: string;
  teamSlug?: string;
  league?: string;
  photoSlug?: string;
  inSets: string[];                          // Auto set slugs they appear in
  lowestParallelNumbered?: number;
  tier: 1 | 2 | 3 | 4;
  isFirstBowmanAuto?: boolean;
  isRookie?: boolean;
}

export interface SignerTiers {
  tier1: string[];                           // Player slugs
  tier2: string[];
  tier3: string[];
  tier4: string[];
}

export interface NotableAbsence {
  player: string;
  reason: string;                            // "Did not sign for this product"
  expectedIn?: string;                       // Next product they'll sign
}

export interface RedemptionEntry {
  player: string;
  autoSet: string;
  estimatedLandingWindow: string;            // "Q4 2026" or "Awaiting Topps confirmation"
  notes?: string;
}
```

---

### `/types/inserts.ts`

Insert sets with their checklists.

```typescript
export interface InsertData {
  sets: InsertSet[];
  editorial: {
    overview: string;                        // "13 insert sets this year..."
  };
  crossInsertChasers: CrossInsertChaser[];   // Players in multiple inserts
}

export interface InsertSet {
  name: string;
  slug: string;
  size: number;                              // Cards in this insert set
  odds?: PackOdds;
  isCaseHit: boolean;
  isNew: boolean;                            // First year in this brand
  description: string;
  editorialNote?: string;                    // Rip Report take
  editorialTier: "chase" | "notable" | "common" | "filler";
  checklist: InsertCard[];
  parallels?: Parallel[];
  imageSlug?: string;
}

export interface InsertCard {
  cardNumber: string;
  player: string;
  playerSlug: string;
  team?: string;
  teamSlug?: string;
  isRookie?: boolean;
}

export interface CrossInsertChaser {
  player: string;
  playerSlug: string;
  insertCount: number;
  inserts: string[];                         // Insert set slugs
}
```

---

### `/types/teams.ts`

Team rosters and league structure.

```typescript
export interface TeamsData {
  leagues: LeagueData[];
  editorialTeamsToWatch: EditorialTeamPick[];
  ncaaEditorial?: {                          // Bowman Basketball specifically
    overview: string;
    projectedDraftClass: string;
    womensSection: string;
    conferenceGroupings: ConferenceGrouping[];
  };

  // For Overview Module 2 and Teams Landing bar chart
  cardsByTeamChart: CardsByTeamEntry[];      // Pre-sorted descending
}

export interface LeagueData {
  league: "NBA" | "NCAA-M" | "NCAA-W" | "MLB" | "NFL" | "NHL";
  teams: Team[];
}

export interface Team {
  name: string;
  slug: string;                              // "dallas-mavericks" or "ncaa-byu"
  league: string;
  conference?: string;
  division?: string;
  accentColor?: {                            // Team color for page hero
    hex: string;
  };
  logoSlug?: string;
  roster: TeamRosterEntry[];
  editorialNote?: string;                    // Team-specific Rip Report take
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
  isHolyGrail?: boolean;                     // Updated from isChaseCard
}

export interface EditorialTeamPick {
  teamSlug: string;
  headline: string;                          // "The Mavs got Flagg and nothing else"
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
  conference: string;                        // "Big 12", "SEC", "Big Ten"
  schoolSlugs: string[];                     // NCAA team slugs in this conference
  expandedByDefault: boolean;
}
```

---

### `/types/insights.ts` (NEW in v2)

Powers Overview Module 7 and the dedicated Insights sub-page.

```typescript
export interface InsightsData {
  // Overview Module 7 grid — top 6 tiles shown on Overview page
  featuredTiles: InsightTile[];

  // Full Insights sub-page — all tiles + extended visualizations
  allTiles: InsightTile[];

  // Player-specific rainbows (Insights sub-page section)
  playerRainbows: PlayerRainbow[];

  // Team-level data visualizations
  teamDataViz: {
    autographDensityByTeam: TeamAutoDensity[];
    rookieDistributionByConference?: ConferenceRookieStats[];  // NCAA-only
  };

  // Product-level data visualizations
  productDataViz: {
    parallelCountDistribution: ParallelCountBucket[];
    caseHitProbability?: CaseHitProbability;
    autoTierDistribution: { tier: 1 | 2 | 3 | 4; count: number }[];
  };

  // Fun takeaways — conversational observations
  funTakeaways: FunTakeaway[];
}

export interface InsightTile {
  slug: string;                              // "most-carded-player"
  headline: string;                          // "Most-carded player"
  stat: string;                              // "Flagg on 12 cards" — the number moment
  caption: string;                           // Hobby-voice supporting line
  iconType?: "player" | "team" | "parallel" | "number" | "chart";
  iconSlug?: string;                         // Reference to imagery or icon identifier
  tier: "featured" | "secondary";            // featured = Overview Module 7, both show on Insights page
}

export interface PlayerRainbow {
  playerSlug: string;
  playerName: string;
  teamSlug?: string;
  totalParallels: number;
  breakdown: {
    groupName: string;                       // "Base", "Chrome Prospects"
    parallelSlugs: string[];
  }[];
  rarestParallelSlug?: string;               // The lowest numbered / grail of the rainbow
}

export interface TeamAutoDensity {
  teamSlug: string;
  teamName: string;
  autoSignerCount: number;
  totalCards: number;
  densityRatio: number;                      // signers / totalCards
}

export interface ConferenceRookieStats {
  conference: string;                        // "Big 12"
  rookieCount: number;
  schoolCount: number;
  notableRookies: string[];                  // Player names
}

export interface ParallelCountBucket {
  label: string;                             // "/1 (1-of-ones)"
  printRunRange: [number, number] | "unnumbered";
  parallelCount: number;                     // How many parallels fall in this bucket
}

export interface CaseHitProbability {
  description: string;                       // "Rough odds of pulling ANY case hit per Hobby case"
  pullRate: string;                          // "~1 per case average"
  notes?: string;
  source?: string;
}

export interface FunTakeaway {
  headline: string;                          // "The player with the most parallels isn't who you think"
  body: string;                              // 2-3 sentences, conversational
  relatedSlugs?: string[];                   // Links to relevant players, cards, parallels
}
```

**Sourcing note for Insights:** Most of this data is derived from checklist/parallels/autographs data you'll already be sourcing. The Insights sourcing task (in SOURCING-PLAN Evening 6) is primarily about deciding which stats to highlight, writing the captions, and crafting the fun takeaways — not about additional data gathering.

---

### `/types/resources.ts`

Links, format deep-dive, errata.

```typescript
export interface ResourcesData {
  // Box format deep-dive LEADS the Resources page (per ARCHITECTURE v2)
  boxFormatDeepDive: BoxFormatDeepDive[];

  officialResources: OfficialLink[];
  buyLinks: BuyLinksByFormat[];
  breakProviders?: BreakProvider[];
  gradingConsiderations?: string;
  errata: ErratumEntry[];                    // Versioned change log
  relatedReading?: RelatedReading[];
}

export interface BoxFormatDeepDive {
  formatName: string;                        // "Hobby"
  imageSlug?: string;
  spec: {
    cardsPerPack: number;
    packsPerBox: number;
    boxesPerCase?: number;
    totalCards: number;                      // computed
  };
  pricing: {
    msrp?: number;
    currentPrice?: number;
    asOf?: string;
    source?: string;
  };
  guarantees: string[];
  exclusives: string[];                      // Format-exclusive parallels
  expectedValueNote?: string;                // If we have pricing data
  bestForVerdict: {
    audience: string;                        // "Rainbow chasers"
    reasoning: string;                       // Full explanation
  };
}

export interface OfficialLink {
  type: "odds-pdf" | "product-page" | "sell-sheet" | "press-release";
  url: string;
  label: string;
  postedAt: string;
  size?: string;                             // "PDF, 1.2 MB"
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
  date: string;                              // ISO
  summary: string;                           // "Updated Orange Refractor odds per official PDF"
  sectionsAffected: string[];
}

export interface RelatedReading {
  slug: string;
  relationship: "previous-year" | "companion-set" | "chrome-version" | "related";
  editorialBlurb?: string;
}
```

---

### `/types/imagery.ts`

Image asset registry. Components reference slugs, not paths.

```typescript
export interface ImageryData {
  images: Record<string, ImageAsset>;
}

export interface ImageAsset {
  slug: string;                              // "box-hobby", "card-flagg-base", "logo-mavericks"
  type: "box" | "pack" | "card" | "team-logo" | "brand-logo" | "player-photo" | "insight-icon" | "other";
  path: string;                              // "/images/2025-26-bowman-basketball/box-hobby.jpg"
  alt: string;
  width: number;
  height: number;
  credit?: string;                           // "Topps" or "Collector submission"
  license?: "official" | "editorial-use" | "public" | "ugc-permission-granted";
}
```

---

## Worked example: `release.json` for Bowman Basketball

Here's what the top-level release.json looks like under the v2 schema — fully populated using research data:

```json
{
  "slug": "2025-26-bowman-basketball",
  "title": "2025-26 Bowman Basketball",
  "shortTitle": "Bowman Basketball",
  "year": "2025-26",
  "sport": "basketball",
  "brand": "bowman",
  "manufacturer": "Topps",
  "releaseDate": "2026-04-22",
  "preorderDate": "2026-04-13",
  "status": "dropped",

  "tagline": "First NBA Bowman in 17 years. Dual NCAA/NBA format. Here's what actually matters.",

  "heroImagery": {
    "boxShotsSlug": "hero-box-shots-grid"
  },

  "synopsis": "2025-26 Bowman Basketball is Topps' first fully-licensed NBA Bowman product since 2009-10, and it arrives under the new Topps/Fanatics NBA exclusive. For the first time, NBA rookies like Cooper Flagg and Dylan Harper share a checklist with NCAA prospects like AJ Dybantsa, Darryn Peterson, and JuJu Watkins. The format is unprecedented; the rookie class is loaded; the format math deserves attention.\n\nTwo things to internalize before ripping. First: the parallel exclusives matter more than the autograph counts. Hobby is the only format with access to Orange /25, Black /10, and Black Pattern /10 on the base set. Second: this is a prospect-heavy product. The NCAA side of the checklist is where long-term upside lives if you believe in the 2026 draft class — which is already being called one of the strongest in years.\n\nRip Hobby for Flagg and Harper rainbow chases. Hold Value for insert hunting. Consider NCAA prospect autos as the real long hold.",

  "verdict": {
    "oneLineTake": "A historic set with a stacked checklist, but the format strategy rewards Hobby buyers who want hobby-exclusive rarities and punishes anyone chasing autos alone.",
    "whoThisIsFor": "NBA prospectors betting on the 2025 class, NCAA NIL investors on Dybantsa, and collectors who want Flagg's 1st Bowman",
    "keyChaseCard": "Cooper Flagg Platinum Border 1/1",
    "releaseWindow": "Live now",
    "rating": {
      "score": 8,
      "label": "Rip"
    }
  },

  "boxFormats": [
    {
      "name": "Hobby",
      "cardsPerPack": 8,
      "packsPerBox": 20,
      "boxesPerCase": 12,
      "msrp": 239.99,
      "bestFor": "Rainbow chasers and parallel hunters",
      "guarantees": ["2 Autographs (1 NBA + 1 NIL)", "12 Inserts", "1 Chrome Mini-Diamond Refractor", "6 Base Parallels"],
      "exclusives": ["Orange Border /25", "Black Border /10", "Black Pattern Border /10"],
      "imageSlug": "box-hobby"
    }
  ],

  "baseSet": {
    "totalCards": 400,
    "rookieCount": 120,
    "subsets": [
      { "name": "Base", "size": 200, "description": "Core NBA base set with Chrome variants" },
      { "name": "Paper Prospects", "size": 100, "description": "NCAA paper prospects" },
      { "name": "Chrome Prospects", "size": 100, "description": "NCAA prospects with Chrome treatment" }
    ],
    "variations": [
      { "name": "Rookie Red RC Variation", "printRun": "SP", "odds": "~1.5 per Hobby box average" }
    ]
  },

  "commentary": {
    "whatsNew": "First officially licensed NBA Bowman product in 17 years. First-ever dual NCAA/NBA Bowman format — Cooper Flagg's 1st Bowman coexists on the same checklist as AJ Dybantsa's.",
    "compToLastYear": "No directly comparable product from last year — this is the brand's return after a 17-year gap. The closest comps are 2024-25 Bowman University Basketball (NCAA-only) and 2024-25 Topps Chrome Basketball (NBA-only).",
    "redFlags": "The NIL auto guarantee is compelling, but NIL values are volatile. A prospect who doesn't declare for the 2026 draft could see card values crater. The dual-format approach also splits parallel exposure across twice as many cards, diluting the rarity story for any single player.",
    "bullCase": "Top-heavy 2025 NBA rookie class plus the deepest projected 2026 NCAA-to-NBA class in years. If even half the top-10 NCAA prospects hit, this becomes the foundational 1st Bowman product for a generation.",
    "bearCase": "NBA rookies appear in many other Topps products (Chrome, flagship) with more coming. Bowman's prospect edge in baseball comes from structural exclusivity that doesn't exist in basketball — which may cap appreciation for Bowman-specific versions."
  },

  "holyGrails": [
    {
      "player": "Cooper Flagg",
      "team": "Dallas Mavericks",
      "teamSlug": "dallas-mavericks",
      "cardName": "Platinum Border (Rainbow Foil) 1/1",
      "cardNumber": "1",
      "parallelSlug": "platinum-border-rainbow-foil",
      "reason": "The rarest base-set card of the consensus #1 pick in a loaded draft class. Historical significance compounds the value.",
      "estimatedValue": "$25K-$50K+",
      "imageSlug": "card-flagg-platinum-1of1",
      "rarityRank": 1
    },
    {
      "player": "Cooper Flagg",
      "team": "Dallas Mavericks",
      "teamSlug": "dallas-mavericks",
      "cardName": "Chrome SuperFractor 1/1",
      "cardNumber": "BCP-1",
      "parallelSlug": "superfractor",
      "reason": "The Chrome 1/1 counterpart. Arguably more iconic than the base given Chrome's collecting pedigree.",
      "estimatedValue": "$30K-$75K+",
      "imageSlug": "card-flagg-superfractor",
      "rarityRank": 2
    }
  ],

  "lastUpdated": "2026-04-22",
  "author": "Jake Cohen"
}
```

---

## How the loader aggregates

`lib/releases.ts` loads the release.json + all sub-files:

```typescript
export function getReleaseBySlug(slug: string): Release | null {
  const releaseDir = path.join(process.cwd(), 'content/releases', slug);

  const release = readJson<Release>(path.join(releaseDir, 'release.json'));
  if (!release) return null;

  release._loaded = {
    checklist: readJson<Checklist>(path.join(releaseDir, 'checklist.json')),
    parallels: readJson<ParallelData>(path.join(releaseDir, 'parallels.json')),
    autographs: readJson<AutographData>(path.join(releaseDir, 'autographs.json')),
    inserts: readJson<InsertData>(path.join(releaseDir, 'inserts.json')),
    teams: readJson<TeamsData>(path.join(releaseDir, 'teams.json')),
    insights: readJson<InsightsData>(path.join(releaseDir, 'insights.json')),
    resources: readJson<ResourcesData>(path.join(releaseDir, 'resources.json')),
    imagery: readJson<ImageryData>(path.join(releaseDir, 'imagery.json')),
  };

  return release;
}
```

Each sub-page only loads the data it needs. Checklist Browser loads release.json + checklist.json + imagery.json; Insights loads release.json + insights.json + imagery.json (plus a shallow reference to checklist/parallels/autographs for derived data). Keeps build-time performance reasonable.

---

## Migration from current schema

The existing `2025-26-bowman-basketball.json` breaks apart:

| Current field | Goes to |
|---|---|
| slug, title, year, sport, brand, manufacturer, releaseDate, status | `release.json` |
| tagline, summary | `release.json` (summary becomes `synopsis` with expansion to 2-3 paragraphs) |
| verdict | `release.json` |
| boxFormats (summary) | `release.json` → `boxFormats`; deep specs go to `resources.json` → `boxFormatDeepDive` |
| baseSet (restructured) | `release.json` → `baseSet`; detailed card data moves to `checklist.json` |
| parallels | `parallels.json`, restructured with structured odds + `rainbowSummary` |
| inserts | `inserts.json`, expanded with full checklists |
| autographs | `autographs.json`, expanded with signer index + tier ranking |
| teamBreakdown | `teams.json`, expanded with full rosters + `cardsByTeamChart` |
| commentary | `release.json` (with `synopsis` extracted for Module 1) |
| chaseCards | `release.json` → `holyGrails` (renamed + adds `rarityRank`) |
| links | `resources.json`, restructured into `boxFormatDeepDive` + `officialResources` + `buyLinks` |
| (new — derived) | `insights.json` — data synthesized from other files + editorial captions |
| (new — centralized) | `imagery.json` — all images with slugs |

The migration is mostly mechanical. I can help script this in Cursor when we get there.

---

## Principles for data entry

When sourcing this week, keep these in mind:

1. **Never invent data.** If you don't have odds, leave the field out. Missing data is handled. Fake data poisons the bible.
2. **Always cite.** Every odds source and pricing source gets a `source` field. Trust comes from showing work.
3. **Use canonical names.** "Cooper Flagg" not "cooper flagg" or "C. Flagg". Consistency enables cross-release features later.
4. **Slugs are stable.** Once a player has `playerSlug: "cooper-flagg"` in one release, every other release uses that same slug. This is how cross-release indexing becomes possible in v2.
5. **Timestamps on everything.** Prices, odds when first published, buy links — all get `asOf` dates so we know how fresh the data is.
6. **`holyGrails` has a `rarityRank`.** Manually assign 1 = rarest. Used for ordering on Overview Module 4.
7. **Populate `rarityTier` on every card.** Required for Checklist's Rarity filter presets. Derivable from the card's lowest numbered parallel.
