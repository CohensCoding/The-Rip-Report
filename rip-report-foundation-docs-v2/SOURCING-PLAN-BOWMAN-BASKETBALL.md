# Rip Report — Sourcing Plan: 2025-26 Bowman Basketball (v2)

> Your week-by-week execution plan for gathering every data point needed for the flagship Bowman Basketball bible. Updated to match ARCHITECTURE v2 and DATA-MODEL v2 — terminology shifts (`chaseCards` → `holyGrails`), adds an Insights sourcing evening, and reflects the 9-file-per-release structure.

---

## Overview

**Total estimated time:** 18-25 hours across 7-9 evenings.

Work in evening sessions of 2-3 hours. Don't marathon — accuracy degrades after 3 hours of transcription and data errors cascade into broken pages.

Commit JSON files to git as you go. One commit per evening: "Evening 1: base set checklist (200 cards)". Gives you rollback points.

---

## Prerequisites

Before Evening 1:

**1. Claim the domain.** ripreport.co or variant. Don't let this block launch in week 4.

**2. Sign up for sources:**
- **Checklist Insider** (free) — https://checklistinsider.com
- **Beckett** (may need subscription for full access, ~$10/mo)
- **Topps odds page** bookmark — https://www.topps.com/pages/odds (check daily)
- **Sports Reference / ESPN** for verification

**3. Workspace setup:**
- Keep this `SOURCING-PLAN.md` open as your checklist
- Keep `DATA-MODEL.md` open as schema reference
- Scratch spreadsheet for intermediate work (Google Sheets)
- Cursor project open in a second window for JSON editing

**4. Create the folder structure:**
```
/content/releases/2025-26-bowman-basketball/
├── release.json          (partial — we'll polish with synopsis + holyGrails)
├── checklist.json        (empty — Evening 1 target)
├── parallels.json        (empty — Evening 2 target)
├── autographs.json       (empty — Evening 3 target)
├── inserts.json          (empty — Evening 4 target)
├── teams.json            (empty — Evening 5 target)
├── insights.json         (empty — Evening 6 target, NEW in v2)
├── resources.json        (empty — Evening 7 target)
└── imagery.json          (empty — Evening 8 target)
```

**5. Image storage:**
```
/public/images/2025-26-bowman-basketball/
├── box-shots/
├── cards/
├── logos/
└── signers/
```

---

## Evening 1 — Base NBA Checklist (200 cards)

**Target:** Populate `checklist.json` with 200 base NBA cards.

**Time:** 3-4 hours

**Sources:**
1. **Checklist Insider** — https://checklistinsider.com/2025-26-bowman-basketball-checklist
2. **Beckett's** checklist page
3. **Topps product page** (top names)

**Process:**

For each card, transcribe into the schema:

```json
{
  "cardNumber": "1",
  "subset": "Base",
  "player": "Cooper Flagg",
  "playerSlug": "cooper-flagg",
  "team": "Dallas Mavericks",
  "teamSlug": "dallas-mavericks",
  "league": "NBA",
  "isRookie": true,
  "isFirstBowman": true,
  "parallelsAvailable": [],        // Evening 2 fills this
  "autoAvailable": {},             // Evening 3 fills this
  "rarityTier": "holy-grail",      // Derivable after Evening 2 — lowest numbered parallel available
  "imageSlug": "card-flagg-base"   // Evening 8
}
```

**Slug conventions:**
- `playerSlug`: lowercase-hyphenated, no periods ("cj-mccollum" not "c.j.-mccollum")
- `teamSlug`: `dallas-mavericks`, `san-antonio-spurs`, etc.
- `imageSlug`: `card-[playerSlug]-[subset-shorthand]` → `card-flagg-base`

**Acceleration shortcut:**
If Checklist Insider offers CSV, paste to me in a fresh chat: "Claude, turn this CSV into Card[] schema from DATA-MODEL.md" — I'll bulk-transcribe. Same for scraped HTML.

**Quality check before committing:**
- Spot-check 10 random cards against a second source (Beckett, rip video)
- Every `teamSlug` matches the 30 NBA team slugs you'll use in `teams.json`
- Player names spelled identically everywhere ("Kel'el Ware" not "Kelel Ware"; "OG Anunoby" not "O.G. Anunoby")
- JSON validates (VS Code lints automatically)

**End of Evening 1: commit.**

---

## Evening 1.5 — NCAA Paper + Chrome Prospects (200 more cards)

**Target:** Add 100 paper prospects and 100 chrome prospects to `checklist.json`.

**Time:** 2-3 hours (faster — pattern established)

**Process:**

Each prospect gets:
- `subset: "Paper Prospects"` or `"Chrome Prospects"`
- `cardNumber`: `BP-1` paper / `BCP-1` chrome (verify with Checklist Insider)
- `league`: `"NCAA-M"` (men's) or `"NCAA-W"` (women's)
- `team`: NCAA program ("Duke", "BYU", "USC")
- `teamSlug`: `ncaa-duke`, `ncaa-byu`, `ncaa-usc`
- `isFirstBowman: true` for 1st Bowman prospects — critical hobby flag

**Verify marquee names are present:** Dybantsa (BYU), Darryn Peterson (Kansas), JuJu Watkins (USC), Hannah Hidalgo (Notre Dame), Boogie Fland (Florida), Karter Knox. If these are missing, checklist is wrong.

**End of Evening 1.5: commit.**

---

## Evening 2 — Parallels + Odds (the big one)

**Target:** Populate `parallels.json` AND update `checklist.json` to add `parallelsAvailable` per card AND set `rarityTier` on every card.

**Time:** 3-4 hours

**CRITICAL PREREQUISITE:** Official Topps odds PDF. If not yet published (may be — drops within 7 days):

- **Option A:** Wait for PDF. Parallels page without odds is half a page.
- **Option B:** Ship with print runs (public) + `odds: null` + TBD banner. Update when PDF lands.

**Recommendation: Option B.** Ship with TBD banners, update live. The banner itself ("We'll update the moment Topps posts") is a trust signal.

**Sources:**
1. **Official Topps odds PDF** (check daily) — https://www.topps.com/pages/odds
2. **Sell sheet** (preorder time) — provisional odds
3. **Beckett news article** announcing product
4. **Recent Bowman Baseball or Topps Chrome Basketball** for structural reference (last Bowman Basketball was 2008-09, not a good comp)

**Process:**

Build `parallels.json` per ParallelData structure in DATA-MODEL.md:

```json
{
  "editorial": {
    "overview": "30+ parallel variations. Here's what's worth chasing and what's noise."
  },
  "rainbowSummary": {
    "baseParallelCount": 14,
    "chromeProspectParallelCount": 12,
    "totalRainbowPieces": 26,
    "headlineStat": "26 total rainbow pieces for chase players across Base + Chrome Prospects"
  },
  "groups": [
    {
      "name": "Base",
      "appliesTo": "200-card NBA base set",
      "parallels": [
        {
          "name": "Purple Pattern Border",
          "slug": "purple-pattern-border",
          "printRun": 199,
          "odds": {
            "ratioDisplay": "1:X packs",
            "ratio": { "onePerN": null },
            "source": {
              "type": "official-topps-pdf",
              "url": "https://www.topps.com/media/pdf/odds/...",
              "asOf": "2026-04-25"
            }
          },
          "color": {
            "hex": "#6B3AA0",
            "gradient": { "from": "#6B3AA0", "to": "#4A2672" }
          },
          "editorialTier": "notable"
        }
      ]
    },
    {
      "name": "Chrome Prospects",
      "appliesTo": "100 NCAA prospect Chrome variants",
      "parallels": [ /* ... */ ]
    }
  ],
  "exclusivityMatrix": {
    "hobbyOnly": ["Orange Border", "Black Border", "Black Pattern Border"],
    "retailOnly": ["Green Border", "Green Pattern Border"],
    "breakerOnly": []
  }
}
```

**Then update `checklist.json`:**

1. For every card, fill `parallelsAvailable` array with applicable parallel slugs (base cards get Base parallels, Chrome Prospects get Chrome Prospects parallels).
2. Set `rarityTier` on every card:
   - `holy-grail` — card has a 1/1 parallel (Platinum Border for base, SuperFractor for chrome)
   - `grail` — lowest numbered parallel is /10 or lower
   - `chase` — lowest numbered parallel is /25 or lower
   - `common` — base only, or lowest is higher than /25

**Editorial tier assignments in `parallels.json`:**
- `chase`: 1/1s (Platinum Border, SuperFractor), Red /5
- `notable`: Low-numbered parallels (/10, /25, /50), hobby-only parallels
- `common`: High-numbered (/99, /150, /199)
- `filler`: Unnumbered refractors

Your editorial judgment here shapes the pyramid visualization.

**End of Evening 2: commit.**

---

## Evening 3 — Autographs (signer tier ranking)

**Target:** Populate `autographs.json` with all auto sets, full signer list, 4-tier editorial ranking.

**Time:** 3-4 hours

**Sources:**
1. **Official Topps announcement** — lists signers
2. **Beckett Bowman Basketball article** — quotes signer counts per tier
3. **Sports Reference** — verify current teams (NBA rookies drafted)
4. **eBay listings** — signer names visible in sample images

**Process:**

Build auto sets:

```json
{
  "sets": [
    {
      "name": "Chrome Autographs",
      "slug": "chrome-autographs",
      "totalSigners": 87,
      "boxGuarantee": "1 per Hobby box (NBA)",
      "isHardSigned": true,
      "hasRedemptions": false,
      "description": "The brand's staple auto program...",
      "signers": ["Cooper Flagg", "Dylan Harper", ...],
      "editorial": "Core auto program. Where rainbow chases live."
    }
  ]
}
```

**Build signerIndex** (flat list of every unique signer):

```json
"signerIndex": [
  {
    "player": "Cooper Flagg",
    "playerSlug": "cooper-flagg",
    "team": "Dallas Mavericks",
    "teamSlug": "dallas-mavericks",
    "league": "NBA",
    "inSets": ["chrome-autographs", "opening-statement-signatures", "timeless-touch-signatures"],
    "lowestParallelNumbered": 1,
    "tier": 1,
    "isFirstBowmanAuto": true,
    "isRookie": true
  }
]
```

**Tier assignment (editorial work):**
- **Tier 1 (The Faces):** 3-5 players — Flagg, Harper, Dybantsa, Peterson, maybe Edgecombe
- **Tier 2 (Strong Co-Stars):** 10-15 — next-tier NBA rookies (Bailey, Knueppel, Fears) + top NCAA prospects (Fland, Knox, Pettiford, Watkins, Hidalgo)
- **Tier 3 (Sleepers):** 10-20 — YOUR contrarian upside bets. Role-player NBA rookies with upside, transfer-portal prospects
- **Tier 4 (The Rest):** Everyone else — veterans, established pros not driving hobby heat

Document your tier reasoning in `tierExplanations` — this IS the editorial.

**`notableAbsences`:**
Who's NOT in the auto checklist that you'd expect? Note them with reason if known. Collectors care about this.

**Then update `checklist.json`** — for every player in signerIndex, find their cards and update `autoAvailable`:
```json
"autoAvailable": {
  "sets": ["chrome-autographs", "opening-statement-signatures"],
  "lowestPrintRun": 1
}
```

**End of Evening 3: commit.**

---

## Evening 4 — Inserts (13 sets with checklists)

**Target:** Populate `inserts.json` with all insert sets and checklists.

**Time:** 2-3 hours

**Sources:**
1. **Checklist Insider** — insert checklists on same page as base
2. **Beckett** — insert odds
3. **Topps product page** — insert image samples

**Process:**

For each insert set:
- Full checklist (every card)
- Odds (from odds PDF if available)
- Case hit flag
- NEW flag (first year in Bowman)
- 1-2 sentence editorial note
- Editorial tier (chase/notable/common/filler)

```json
{
  "editorial": {
    "overview": "13 insert sets this year. 6 are case hits. Here's what's worth framing."
  },
  "sets": [
    {
      "name": "Bowman Spotlights",
      "slug": "bowman-spotlights",
      "size": 50,
      "odds": { "ratioDisplay": "1:X packs", "ratio": { "onePerN": null } },
      "isCaseHit": true,
      "isNew": false,
      "description": "Dark background with light-blast subject treatment.",
      "editorialNote": "The sneaky best insert in the product. Flagg Spotlight will chase.",
      "editorialTier": "chase",
      "checklist": [
        { "cardNumber": "BS-1", "player": "Cooper Flagg", "playerSlug": "cooper-flagg", "team": "Dallas Mavericks", "teamSlug": "dallas-mavericks", "isRookie": true }
      ]
    }
  ],
  "crossInsertChasers": [
    {
      "player": "Cooper Flagg",
      "playerSlug": "cooper-flagg",
      "insertCount": 7,
      "inserts": ["bowman-spotlights", "roy-favorites", "talent-tracker"]
    }
  ]
}
```

**End of Evening 4: commit.**

---

## Evening 5 — Teams (rosters + Cards-by-Team data)

**Target:** Populate `teams.json` with all 30 NBA team rosters + NCAA consolidated data + Cards-by-Team chart data for Overview Module 2.

**Time:** 2-3 hours

**Sources:**
1. **Your `checklist.json`** — main source, re-organized by team
2. **ESPN team pages** — team metadata (conference, division, colors)
3. **NBA.com** — primary team colors

**Process:**

Iterate through `checklist.json`, grouping by team:

```json
{
  "leagues": [
    {
      "league": "NBA",
      "teams": [
        {
          "name": "Dallas Mavericks",
          "slug": "dallas-mavericks",
          "league": "NBA",
          "conference": "Western",
          "division": "Southwest",
          "accentColor": { "hex": "#00538C" },
          "logoSlug": "logo-mavericks",
          "roster": [
            {
              "cardNumber": "1",
              "player": "Cooper Flagg",
              "playerSlug": "cooper-flagg",
              "subset": "Base",
              "isRookie": true,
              "autoAvailable": true,
              "lowestParallelNumbered": 1,
              "parallelRainbowSlugs": [/* ... all 13 parallels ... */],
              "isHolyGrail": true
            }
          ],
          "editorialNote": "The Mavericks got Cooper Flagg and nothing else. But that nothing else doesn't matter because Flagg is the entire card.",
          "relatedTeamSlugs": ["san-antonio-spurs", "oklahoma-city-thunder"]
        }
      ]
    },
    {
      "league": "NCAA-M",
      "teams": [ /* NCAA programs — consolidated on one page */ ]
    },
    {
      "league": "NCAA-W",
      "teams": [ /* Women's NCAA programs */ ]
    }
  ],
  "cardsByTeamChart": [
    {
      "teamSlug": "brooklyn-nets",
      "teamName": "Brooklyn Nets",
      "league": "NBA",
      "cardCount": 4,
      "rookieCount": 4,
      "notablePlayer": "Egor Dëmin",
      "hasAutoSigner": true,
      "hasHolyGrail": false
    }
  ],
  "editorialTeamsToWatch": [
    {
      "teamSlug": "dallas-mavericks",
      "headline": "Flagg or nothing",
      "reasoning": "One card, but it's the card of the set."
    },
    {
      "teamSlug": "san-antonio-spurs",
      "headline": "Wemby gets his running mate",
      "reasoning": "Harper + Bryant rookies alongside the Wembanyama era is the franchise story of the year."
    }
  ],
  "ncaaEditorial": {
    "overview": "The NCAA side is where long-term upside lives if you believe in the 2026 draft class.",
    "projectedDraftClass": "Dybantsa, Peterson, Watkins headline a class already projected as the deepest in years...",
    "womensSection": "JuJu Watkins and Hannah Hidalgo get proper Bowman treatment for the first time...",
    "conferenceGroupings": [
      { "conference": "Big 12", "schoolSlugs": ["ncaa-byu", "ncaa-kansas", ...], "expandedByDefault": true },
      { "conference": "SEC", "schoolSlugs": [...], "expandedByDefault": false }
    ]
  }
}
```

**`cardsByTeamChart` is critical** — this powers Overview Module 2 bar chart AND Teams Landing expanded chart. Pre-sort descending by cardCount.

**Write editorial notes for EVERY NBA team** (30 total). Each is 1-3 sentences in Rip Report voice. This is where the bible feel is built. 30 sentences = 45-minute task, not 3 hours.

**Update `release.json`:** Populate `holyGrails` array (top 3-5 rarest cards with `rarityRank`). Pull from cards you flagged as `isHolyGrail: true` in checklist.

**End of Evening 5: commit.**

---

## Evening 6 — Insights (NEW in v2)

**Target:** Populate `insights.json` with stat tiles, player rainbows, data visualizations, fun takeaways.

**Time:** 2-3 hours

**Sources:**
- **Your `checklist.json`** + `parallels.json` + `autographs.json` — most data is already there; this evening synthesizes and writes captions

**Process:**

Most of this is derived data. You're deciding which stats to surface and writing the hobby-voice captions.

```json
{
  "featuredTiles": [
    {
      "slug": "most-carded-player",
      "headline": "Most-carded player",
      "stat": "12",
      "caption": "Cooper Flagg appears on 12 different cards across the set.",
      "iconType": "player",
      "iconSlug": "player-flagg",
      "tier": "featured"
    },
    {
      "slug": "biggest-rookie-class",
      "headline": "Biggest rookie class",
      "stat": "3",
      "caption": "San Antonio Spurs lead the set with 3 rookies — Harper, Bryant, plus Wemby connection.",
      "iconType": "team",
      "iconSlug": "logo-spurs",
      "tier": "featured"
    }
  ],
  "allTiles": [ /* includes featured + 10-15 more secondary tiles */ ],
  "playerRainbows": [
    {
      "playerSlug": "cooper-flagg",
      "playerName": "Cooper Flagg",
      "teamSlug": "dallas-mavericks",
      "totalParallels": 26,
      "breakdown": [
        { "groupName": "Base", "parallelSlugs": [/* 14 slugs */] },
        { "groupName": "Chrome Prospects", "parallelSlugs": [/* 12 slugs */] }
      ],
      "rarestParallelSlug": "platinum-border-rainbow-foil"
    }
  ],
  "teamDataViz": {
    "autographDensityByTeam": [
      { "teamSlug": "san-antonio-spurs", "teamName": "San Antonio Spurs", "autoSignerCount": 2, "totalCards": 4, "densityRatio": 0.5 }
    ],
    "rookieDistributionByConference": [
      { "conference": "Big 12", "rookieCount": 12, "schoolCount": 8, "notableRookies": ["AJ Dybantsa"] }
    ]
  },
  "productDataViz": {
    "parallelCountDistribution": [
      { "label": "/1 (1-of-ones)", "printRunRange": [1, 1], "parallelCount": 2 },
      { "label": "/5", "printRunRange": [5, 5], "parallelCount": 2 },
      { "label": "/10-/25", "printRunRange": [10, 25], "parallelCount": 4 }
    ],
    "caseHitProbability": {
      "description": "Rough odds of pulling ANY case hit per Hobby case (12 boxes)",
      "pullRate": "~1 per case average",
      "source": "Extrapolated from pack odds when published"
    },
    "autoTierDistribution": [
      { "tier": 1, "count": 4 },
      { "tier": 2, "count": 12 },
      { "tier": 3, "count": 18 },
      { "tier": 4, "count": 53 }
    ]
  },
  "funTakeaways": [
    {
      "headline": "The player with the most parallels isn't who you think",
      "body": "It's not Flagg. The dual-format setup means NCAA prospects with Chrome treatment technically have more total rainbow variants than any NBA rookie, since the Paper-plus-Chrome split doubles their appearances.",
      "relatedSlugs": ["cooper-flagg", "aj-dybantsa"]
    }
  ]
}
```

**Write 6 featured tiles** (these show on Overview Module 7) and **aim for 15-20 total tiles** for the Insights sub-page.

**Captions are where voice lives.** Don't write "Cooper Flagg has the most cards." Write "Cooper Flagg appears on 12 different cards across the set — more than any other player by a wide margin."

**Fun takeaways are the viral moments.** 3-5 of them. Think screenshot-worthy. "Here's a weird thing about this set that nobody's talking about."

**End of Evening 6: commit.**

---

## Evening 7 — Resources

**Target:** Populate `resources.json` leading with Box Format Deep-Dive.

**Time:** 1-2 hours

**Sources:**
1. Topps product page
2. Steel City Collectibles, Dave & Adam's, Blowout Cards for buy links
3. Your notes on known issues / grading

**Process:**

Resources leads with box formats (per ARCHITECTURE v2):

```json
{
  "boxFormatDeepDive": [
    {
      "formatName": "Hobby",
      "imageSlug": "box-hobby",
      "spec": {
        "cardsPerPack": 8,
        "packsPerBox": 20,
        "boxesPerCase": 12,
        "totalCards": 160
      },
      "pricing": {
        "msrp": 239.99,
        "currentPrice": 249.99,
        "asOf": "2026-04-22",
        "source": "Steel City Collectibles"
      },
      "guarantees": [
        "2 Autographs (1 NBA + 1 NIL)",
        "12 Inserts (unless replaced by Case Hit)",
        "1 Chrome Mini-Diamond Refractor",
        "6 Base Parallels"
      ],
      "exclusives": [
        "Orange Border /25",
        "Black Border /10",
        "Black Pattern Border /10"
      ],
      "expectedValueNote": "EV math pending odds PDF release",
      "bestForVerdict": {
        "audience": "Rainbow chasers and parallel hunters",
        "reasoning": "Hobby is the only format with access to Orange /25, Black /10, and Black Pattern /10 on the base set. If you're chasing a complete rainbow or a low-numbered Flagg/Harper, you need Hobby."
      }
    }
  ],
  "officialResources": [
    {
      "type": "odds-pdf",
      "url": "https://www.topps.com/media/pdf/odds/...",
      "label": "Official Pack Odds",
      "postedAt": "2026-04-25",
      "size": "PDF, 1.2 MB"
    }
  ],
  "buyLinks": [
    {
      "format": "Hobby",
      "retailers": [
        {
          "name": "Steel City Collectibles",
          "url": "https://www.steelcitycollectibles.com/...",
          "price": 249.99,
          "asOf": "2026-04-22",
          "trustLevel": "vetted-secondary"
        }
      ]
    }
  ],
  "breakProviders": [
    { "name": "Firehand Cards", "url": "https://firehandcards.com", "note": "Active Bowman Basketball case breaker" }
  ],
  "gradingConsiderations": "Early rip reports suggest centering is strong on 2025-26 Bowman Basketball compared to last year's Bowman University. Chrome Prospect autographs appear on-card for most NBA rookies.",
  "errata": [],
  "relatedReading": [
    { "slug": "2024-25-bowman-university-basketball", "relationship": "previous-year" },
    { "slug": "2024-25-topps-chrome-basketball", "relationship": "related" }
  ]
}
```

**End of Evening 7: commit.**

---

## Evening 8 — Imagery

**Target:** Populate `imagery.json` and actually download/place image files.

**Time:** 2-3 hours

**Sources:**
1. **Topps product page** — box shots, hero cards
2. **Checklist Insider / Beckett** — card images
3. **eBay completed listings** — rare parallel variants (attribute, use sparingly)
4. **NBA team official pages** — team logos (SVG where possible)
5. **Wikimedia Commons** — clean logo SVGs with free licenses

**Process:**

1. Create folder structure (Prerequisites section)
2. Save with consistent naming:
   - `/images/2025-26-bowman-basketball/box-shots/hobby.png`
   - `/images/2025-26-bowman-basketball/cards/flagg-base.jpg`
   - `/images/2025-26-bowman-basketball/logos/mavericks.svg`
3. Build `imagery.json`:

```json
{
  "images": {
    "box-hobby": {
      "slug": "box-hobby",
      "type": "box",
      "path": "/images/2025-26-bowman-basketball/box-shots/hobby.png",
      "alt": "2025-26 Bowman Basketball Hobby Box",
      "width": 1200,
      "height": 900,
      "credit": "Topps",
      "license": "editorial-use"
    },
    "card-flagg-base": {
      "slug": "card-flagg-base",
      "type": "card",
      "path": "/images/2025-26-bowman-basketball/cards/flagg-base.jpg",
      "alt": "Cooper Flagg 2025-26 Bowman Basketball base card",
      "width": 400,
      "height": 560,
      "credit": "Checklist Insider",
      "license": "editorial-use"
    }
  }
}
```

**Priority imagery for v1:**
- All 5 box shots (Hobby, Jumbo, Mega, Value, Breaker's Delight) + a combined "hero-box-shots-grid" image for Module 1
- ~20 chase card images (top NBA rookies, top NCAA prospects, key parallels, all Holy Grails)
- All 30 NBA team logos
- 5-10 NCAA school logos (top programs)
- Bowman brand logo
- Sample of each auto set design (6 images)
- Sample of each case-hit insert (6 images)

**Optional (skip initially):**
- Every base card image (200+ — huge time sink, fallbacks work fine)
- Every signer photo (87 — initials fallback works)

**Image optimization:**
- `.webp` where possible
- Max 1600px box shots, 800px cards
- Compress via TinyPNG / Squoosh before committing

**End of Evening 8: commit. Data complete.**

---

## Post-sourcing: finalize `release.json`

With sub-files complete, polish `release.json`:

- **`synopsis` field** — write the 2-3 paragraph opening for Overview Module 1. This absorbs what was originally "What Actually Matters" into the top-level voice. Write in Rip Report voice, 200-400 words. This is the single most important editorial block on the site.
- Update `boxFormats` with real MSRPs and current prices from resources
- Verify `holyGrails` array has 3-5 entries with `rarityRank` assigned (1 = rarest), `cardNumber` linking to real cards, `imageSlug` populated
- Polish `commentary` fields — you've learned things during sourcing that should update the take
- Update `verdict.keyChaseCard` to reference a real Holy Grail
- Update `lastUpdated` timestamp

---

## Quality gate before handing to Cursor

Before you say "data is ready, let's build," run these checks:

**Structural:**
- [ ] All 9 JSON files exist and parse (no syntax errors)
- [ ] All 400 cards in `checklist.json` have required fields including `rarityTier`
- [ ] Every `playerSlug` uses consistent format (lowercase-hyphenated)
- [ ] Every `teamSlug` in `checklist.json` appears in `teams.json`
- [ ] Every `inSets` in `autographs.json` references existing set slugs
- [ ] Every `imageSlug` referenced across files exists in `imagery.json`
- [ ] Every parallel name in `checklist.json.parallelsAvailable` exists in `parallels.json`
- [ ] `cardsByTeamChart` is sorted descending by cardCount

**Editorial:**
- [ ] `release.json.synopsis` reads like an opinionated 2-3 paragraph article opening
- [ ] `release.json.holyGrails` has 3-5 entries with rarityRank 1-5 assigned
- [ ] At least 25 NBA teams have non-empty `editorialNote` fields
- [ ] Tier 1 signers: 3-5 names (not 1, not 10)
- [ ] `insights.json` has 6 featured tiles + 10+ total tiles
- [ ] 3-5 fun takeaways written

**Completeness:**
- [ ] 200 base cards, 100 paper prospects, 100 chrome prospects populated
- [ ] All 6 auto sets with signer lists
- [ ] All 13 insert sets with full checklists
- [ ] 30 NBA team rosters complete
- [ ] NCAA consolidated with conference groupings + women's section

---

## Realistic schedule

| Day | Session | What | Hours |
|-----|---------|------|-------|
| Mon eve | Evening 1 | Base NBA checklist (200) | 3-4 |
| Tue eve | Evening 1.5 | NCAA prospects (200) | 2-3 |
| Wed eve | Evening 2 | Parallels + odds (gate on PDF) | 3-4 |
| Thu eve | Evening 3 | Autographs + tiers | 3-4 |
| Fri eve | Evening 4 | Inserts | 2-3 |
| Sat aft | Evening 5 | Teams + Cards-by-Team chart | 2-3 |
| Sat eve | Evening 6 | Insights (NEW) | 2-3 |
| Sun aft | Evening 7 | Resources | 1-2 |
| Sun eve | Evening 8 | Imagery | 2-3 |
| Mon | QA | Quality gate checks | 1 |

**Total: ~23 hours across a week.**

If life intervenes, extend to 10-12 days. Don't start building pages until ALL data is complete — schema inconsistencies caught mid-build are 10x more painful than caught during sourcing.

---

## If you get stuck

**"I can't find the odds PDF."**
Ship Parallels page with TBD banners. Update when it lands. Don't delay everything else.

**"Checklist Insider doesn't have the full prospect list yet."**
The complete checklist sometimes takes a week. Beckett may have it. Or use a rip video from launch day.

**"Signer tier assignments feel subjective."**
They ARE. That's the point — it's YOUR take. Commit. Revise post-launch based on community reaction.

**"Editorial notes for 30 NBA teams feels like a lot."**
Most get 1 sentence. A few get 3-5. Don't write paragraphs for role players. 30 sentences ≠ 3 hours.

**"I'm not sure about a data point."**
Leave the field out. Flag in a `TODO.md` in the release directory. Don't guess.

**"Writing the Insights captions feels hard."**
Start with the stat. The caption is 1-2 sentences that give context. "Cooper Flagg appears on 12 different cards" → "More than any other player in the set by a wide margin." That's the whole pattern.

**"JSON is getting hard to edit by hand."**
This is what the split-file architecture is for. If `checklist.json` is unwieldy, break further into `checklist-base.json`, `checklist-paper-prospects.json`, etc.

---

## When data is complete: handoff to Cursor

Once quality gate passes, next session is **architecture execution**:

1. Confirm all 4 foundation docs reflect current state
2. Update `.cursorrules` to reference new docs as source of truth (mark v1 SPEC.md as deprecated)
3. Begin rebuild — schema migration, then shared components, then each page type

That rebuild is probably 2 focused weekends of Cursor work. Moves fast because every decision is pre-made.

Your job between now and then: **gather the data.** Nothing else matters more.
