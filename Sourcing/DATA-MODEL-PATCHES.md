# DATA-MODEL.md Patch Notes — from parallels.json build

**Context:** While sourcing 2025-26 Bowman Basketball parallels.json, we found four structural gaps between the existing `/types/parallels.ts` schema and what the data actually contains. These patches are required BEFORE schema migration.

**Priority:** Must land before any component rebuild that reads parallels.json.

---

## Patch 1 — Add `family` field to `Parallel` interface

**Why:** The 4–6 visual parallel families (Border, Chrome, Reptilian, Geometric, Sapphire, Mojo) cut ACROSS top-level groups. Top-level groups are by parent card type (Base / Paper Prospects / Chrome Prospects) — so we need a `family` discriminator on each parallel to drive sub-grouping in the Parallel Explorer and the Module 5 rainbow strip.

```typescript
// In /types/parallels.ts
export interface Parallel {
  name: string;
  slug: string;

  // NEW — parallel family discriminator for visual sub-grouping
  family: ParallelFamily;

  printRun?: number;
  printRunLabel?: string;
  odds?: PackOdds;
  exclusiveTo?: BoxFormatName[];
  isCaseHit?: boolean;
  color: { /* unchanged */ };
  editorialTier?: "chase" | "notable" | "common" | "filler";
  note?: string;
}

// NEW type
export type ParallelFamily =
  | "Border"
  | "Chrome"
  | "Reptilian"
  | "Geometric"
  | "Sapphire"
  | "Mojo";
```

Note: Family values are release-specific. Future releases (e.g., Topps Chrome Football) will add their own. Consider whether `ParallelFamily` should be `string` (flexible) or a union (strict). Recommendation: start as union, extend per release.

---

## Patch 2 — Add `"Sapphire"` to `BoxFormatName` union

**Why:** The Sapphire box is a real SKU for this release. Its parallels (7 for Base, 7 for Chrome Prospects) are Sapphire-box-exclusive. The current `BoxFormatName` union omits it.

```typescript
// Current:
export type BoxFormatName = "Hobby" | "Jumbo" | "Mega" | "Value" | "Retail" | "Breaker's Delight";

// Patched:
export type BoxFormatName =
  | "Hobby"
  | "Jumbo"
  | "Mega"
  | "Value"
  | "Retail"
  | "Breaker's Delight"
  | "Sapphire"
  | "Bulk";        // ALSO add — Topps odds PDFs publish "Bulk" as a distinct SKU (retail bulk packs, distinct from Value)
```

Also noticed: `"Bulk"` isn't in the current union but IS a column in the Topps odds PDF. Odds rows for Base Red Refractor, etc., include a Bulk column with specific pack odds. Bulk is separate from Value.

---

## Patch 3 — Extend `ExclusivityMatrix` with `megaOnly`, `sapphireOnly`, `hobbyAndJumboOnly`

**Why:** The current matrix covers `hobbyOnly`, `retailOnly`, `breakerOnly`, `jumboOnly`. Missing:
- `megaOnly` — all 15 Mojo parallels in Base group + all 15 in Chrome Prospects group are Mega-exclusive.
- `sapphireOnly` — all 7 Sapphire parallels in Base + all 7 in Chrome Prospects are Sapphire-box-exclusive.
- `hobbyAndJumboOnly` — six chrome parallels (SuperFractor, Yellow X-Fractor, Yellow Wave, Aqua X-Fractor, Chrome Prospect Yellow X-Fractor, Chrome Prospect SuperFractor) appear only in Hobby + Jumbo — not a single-SKU exclusive but not universal either.

```typescript
export interface ExclusivityMatrix {
  hobbyOnly: string[];
  retailOnly: string[];           // Value + Bulk
  breakerOnly: string[];
  jumboOnly?: string[];
  megaOnly?: string[];            // NEW
  sapphireOnly?: string[];        // NEW
  hobbyAndJumboOnly?: string[];   // NEW
}
```

---

## Patch 4 — Add `perFormat` to `PackOdds` for multi-SKU odds

> **SUPERSEDED BY PATCH 7.** This patch's inline shape is preserved here for historical context, but the canonical `PackOdds` definition now uses the named `PerFormatOdds` and `OddsSource` types defined in Patch 7. If you're implementing types, use Patch 7's definition — not the inline shape below. Do not apply both patches.

**Why:** The current `PackOdds.ratio` is a single `onePerN` value. But real Topps odds publish a DIFFERENT ratio per SKU format — e.g., Chrome Refractor /499 is 1:75 in Hobby but 1:275 in Value and 1:878 in Bulk. We need to preserve all of them to (a) display accurate per-format odds on the Parallel Explorer and (b) power the Resources page's per-format EV math.

```typescript
export interface PackOdds {
  // PRIMARY display (usually Hobby, or first-available format)
  ratioDisplay: string;
  ratio: { onePerN: number };

  // NEW — per-format map
  perFormat?: Partial<Record<BoxFormatName, {
    onePerN: number;
    ratioDisplay: string;     // e.g. "1:275 packs"
  }>>;

  source?: {
    type: "official-topps-pdf" | "sell-sheet" | "reconstructed";
    url?: string;
    asOf: string;
  };
}
```

---

## Patch 5 — Extend `rainbowSummary` with `paperProspectParallelCount`

**Why:** The 3-group structure adds Paper Prospects as a distinct parallel pool (12 Border parallels). The current rainbowSummary assumes 2 groups (Base + Chrome Prospects).

```typescript
rainbowSummary: {
  baseParallelCount: number;
  chromeProspectParallelCount: number;
  paperProspectParallelCount?: number;   // NEW — optional; for releases with a separate paper pool
  totalRainbowPieces: number;
  headlineStat: string;
}
```

---

## Summary of required TS changes (drop-in)

```typescript
// /types/parallels.ts — replace existing interfaces with these

export type ParallelFamily =
  | "Border" | "Chrome" | "Reptilian" | "Geometric" | "Sapphire" | "Mojo";

export type BoxFormatName =
  | "Hobby" | "Jumbo" | "Mega" | "Value" | "Retail"
  | "Breaker's Delight" | "Sapphire" | "Bulk";

export interface Parallel {
  name: string;
  slug: string;
  family: ParallelFamily;                    // NEW — required
  printRun?: number;
  printRunLabel?: string;
  odds?: PackOdds;
  exclusiveTo?: BoxFormatName[];
  isCaseHit?: boolean;
  color: { hex: string; gradient?: { from: string; to: string }; textColor?: "light" | "dark" };
  editorialTier?: "chase" | "notable" | "common" | "filler";
  note?: string;
}

export interface PackOdds {
  ratioDisplay: string;
  ratio: { onePerN: number };
  perFormat?: Partial<Record<BoxFormatName, PerFormatOdds>>;   // see Patch 7
  source?: OddsSource;                                         // see Patch 7
}

// Named helper types from Patch 7 — import alongside PackOdds
export interface PerFormatOdds {
  onePerN: number;
  ratioDisplay: string;
}

export interface OddsSource {
  type: "official-topps-pdf" | "sell-sheet" | "reconstructed";
  url?: string;
  asOf: string;
}

export interface ExclusivityMatrix {
  hobbyOnly: string[];
  retailOnly: string[];
  breakerOnly: string[];
  jumboOnly?: string[];
  megaOnly?: string[];                       // NEW
  sapphireOnly?: string[];                   // NEW
  hobbyAndJumboOnly?: string[];              // NEW
}

export interface ParallelData {
  groups: ParallelGroup[];
  editorial: {
    overview: string;
    perGroupNotes?: Record<string, string>;
  };
  exclusivityMatrix: ExclusivityMatrix;
  rainbowSummary: {
    baseParallelCount: number;
    chromeProspectParallelCount: number;
    paperProspectParallelCount?: number;     // NEW
    totalRainbowPieces: number;
    headlineStat: string;
  };
}
```

---

## Patch 6 — Add `featuredVisualizations` to `InsightsData` (NEW — from insights.json build)

**Why:** The existing `InsightsData` schema (`playerRainbows`, `parallelCountDistribution`, `autoTierDistribution`, `teamDataViz`, tiles, `funTakeaways`) covers generic analytics but doesn't have a structured home for *named, editorially-specific visualizations* — the hero charts that carry the Insights sub-page's identity. We built five such visualizations for 2025-26 Bowman Basketball:

1. **The Panini Shadow** — 2025 NBA Draft picks 1-30 × Bowman auto exposure
2. **Young Kings Timeline** — 25-card insert plotted by career-peak year, split by era (current vs legend)
3. **Identical Insert Quartet** — structural callout of TT/GN/VIP/BV redundancy
4. **Mega-Only Mojo Ladder** — 8-rung parallel ladder locked to one format
5. **Case-Hit Bubbles** — 11 case hits by accessibility + IP category

Rather than creating one top-level field per viz (fragile, one-off for each release), we're adding a **discriminated array** of `FeaturedViz` that Cursor can dispatch on by `type`:

```typescript
// In /types/insights.ts

export interface InsightsData {
  featuredTiles: InsightTile[];
  allTiles: InsightTile[];
  playerRainbows: PlayerRainbow[];
  teamDataViz: { /* unchanged */ };
  productDataViz: { /* unchanged */ };

  // NEW — structured, editorially-named visualizations for the Insights sub-page.
  // Optional for backward compatibility: older releases without backfill can omit this field,
  // and loaders should default to [] when absent.
  featuredVisualizations?: FeaturedViz[];

  funTakeaways: FunTakeaway[];
}

// Discriminated union — Cursor dispatches on `type` to pick the renderer
export type FeaturedViz =
  | PaniniShadowViz
  | YoungKingsTimelineViz
  | IdenticalInsertQuartetViz
  | MojoLadderViz
  | CaseHitBubblesViz;

// Shared metadata (title/subtitle/caption render above every viz)
interface FeaturedVizBase {
  slug: string;                                // "panini-shadow"
  title: string;                               // "The Panini Shadow"
  subtitle: string;
  caption: string;                             // 1-2 sentence editorial take
}

export interface PaniniShadowViz extends FeaturedVizBase {
  type: "panini-shadow";
  draftPicks: Array<{
    draftPick: number;                         // 1-30
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
    iconicTeamSlug: string | null;             // null for defunct franchises (e.g. Supersonics)
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
  sharedPlayerPool: string[];                  // player names in all 4 sets
  editorialStatement: string;                  // The punchline — "Same. Same. Same. Same."
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
  ipCategory: string;                          // "Anime", "GPK", "Crystalized", etc.
  hobbyOdds: number;                           // onePerN value
  hobbyOddsDisplay: string;                    // "1:1,733"
  bubbleSize: number;                          // Inverse metric for viz scaling
  size: number;                                // Card count in the insert
  editorialTier: "chase" | "notable" | "common" | "filler";
}

export interface CaseHitBubblesViz extends FeaturedVizBase {
  type: "case-hit-bubbles";
  caseHits: CaseHitBubblePoint[];
  easiest: CaseHitBubblePoint | null;          // First entry in caseHits (easiest to pull)
  hardest: CaseHitBubblePoint | null;          // Last entry (hardest to pull)
}
```

**Migration impact:** Additive and non-breaking. Existing InsightsData fields unchanged. `featuredVisualizations` is optional, so older releases without backfill will load fine — loaders should default to `[]` when absent. Cursor can add renderers incrementally — start with Panini Shadow (bar chart, straightforward) and add the others as render infrastructure grows.

**Why discriminated union vs separate fields:** Future releases will have different hero visualizations. Bowman Baseball won't need a Panini Shadow (no Panini-exclusive baseball drama), but might need a "Prospect-to-MLB Signing Timeline" chart. One extensible field > one top-level field per one-off viz.

---

## Patch 7 — Extend `PackOdds` with `perFormat` map and `source` attribution

> **Supersedes Patch 4.** Patch 4 proposed an inline anonymous shape for `perFormat`; this patch redefines with named `PerFormatOdds` and `OddsSource` types for better composability and adds `source` as a first-class named type. Treat this as canonical.

**Why:** Throughout the sourced data (parallels.json, inserts.json), `odds` objects carry richer information than the current `PackOdds` interface supports — specifically, per-format odds (Hobby vs Jumbo vs Value vs Bulk vs Mega vs Breaker's Delight) and source attribution to the Topps odds PDF. Cursor's audit confirmed this as "schema drift (non-blocking)" — the data is consistent, but the types are behind. Either extend the schema here or normalize at load time. Extending is cleaner because the per-format breakdown is genuinely useful product information (format selection is the core format-strategy decision in Rip Report's voice).

```typescript
// In /types/common.ts (or wherever PackOdds lives today)

export interface PackOdds {
  // Primary display — the most commonly-referenced ratio (usually Hobby)
  ratioDisplay: string;                          // "1:58 packs (Hobby)"
  ratio: { onePerN: number };

  // NEW — per-format breakdown. Keyed by BoxFormatName.
  // Optional because not every odds figure is available in every format
  // (e.g. retail-exclusive parallels have no Hobby odds).
  perFormat?: Partial<Record<BoxFormatName, PerFormatOdds>>;

  // NEW — source attribution for the odds (usually the Topps odds PDF)
  source?: OddsSource;
}

export interface PerFormatOdds {
  onePerN: number;                               // 58
  ratioDisplay: string;                          // "1:58 packs"
}

export interface OddsSource {
  type: "official-topps-pdf" | "sell-sheet" | "reconstructed";
  url?: string;
  asOf: string;                                  // ISO date
}
```

**Migration impact:** Additive and non-breaking. Existing components reading `ratioDisplay` and `ratio.onePerN` continue to work. New components can opt into `perFormat` for multi-format displays (e.g., the Parallel Explorer's format-comparison table, or the Insert Explorer's "odds by format" breakdown). `source` enables an "as of" indicator next to odds figures.

**Why not normalize at load time:** Load-time normalization would collapse the per-format map back into a single ratio, losing information the UI can meaningfully use. The whole point of Rip Report's format-strategy narrative (which format gets Mojo, which gets SuperFractor, etc.) is that odds differ by format — the data model should preserve that.

---

## Sourcing plan revision note

The SOURCING-PLAN-BOWMAN-BASKETBALL.md "Evening 2" target of "14 base parallels + 12 chrome prospect parallels = 26 rainbow pieces" was based on a simplified read of the education sheet. Actual count is 147 parallels across 3 groups:

- Base: 77 parallels (12 Border + 30 Chrome + 7 Reptilian + 6 Geometric + 7 Sapphire + 15 Mojo)
- Paper Prospects: 12 parallels (Border only)
- Chrome Prospects: 58 parallels (24 Chrome + 6 Reptilian + 6 Geometric + 7 Sapphire + 15 Mojo)

The Module 5 rainbow strip should show a curated subset (the "chase rainbow" — one representative per print-run tier), not all 147.
