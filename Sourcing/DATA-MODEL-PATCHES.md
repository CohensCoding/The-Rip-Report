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
  perFormat?: Partial<Record<BoxFormatName, {    // NEW
    onePerN: number;
    ratioDisplay: string;
  }>>;
  source?: {
    type: "official-topps-pdf" | "sell-sheet" | "reconstructed";
    url?: string;
    asOf: string;
  };
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

## Sourcing plan revision note

The SOURCING-PLAN-BOWMAN-BASKETBALL.md "Evening 2" target of "14 base parallels + 12 chrome prospect parallels = 26 rainbow pieces" was based on a simplified read of the education sheet. Actual count is 147 parallels across 3 groups:

- Base: 77 parallels (12 Border + 30 Chrome + 7 Reptilian + 6 Geometric + 7 Sapphire + 15 Mojo)
- Paper Prospects: 12 parallels (Border only)
- Chrome Prospects: 58 parallels (24 Chrome + 6 Reptilian + 6 Geometric + 7 Sapphire + 15 Mojo)

The Module 5 rainbow strip should show a curated subset (the "chase rainbow" — one representative per print-run tier), not all 147.
