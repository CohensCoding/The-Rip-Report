# Rip Report — Architecture (v2)

> This document replaces `SPEC.md` and supersedes v1. The v2 restructure reflects the overview rewrite (7 modules instead of 12 sections), sub-page consolidation (8 instead of 7 + Insights added + Holy Grails folded), and navigation simplifications from the architecture review.

---

## North Star

Rip Report is the **authoritative reference for sports card releases**, wrapped in **opinionated editorial commentary**, delivered as a **polished consumer product with authentic hobby voice**.

Three commitments:

1. **Completeness as trust.** If a collector searches for something reasonable and we 404, we lose them. Every meaningful data point has a dedicated home.
2. **Voice everywhere.** Every page has an editorial layer. Reference without opinion is Beckett; voice without reference is a blog. We are both.
3. **Modern consumer product polish.** Authentic hobby voice, Venice Beach product design, ESPN/Wikipedia data rigor.

---

## Routes

```
ripreport.co/
│
├── /                                              Homepage — masthead + archive
├── /about                                         About (v1 stub)
│
├── /releases/[slug]/                              Release Overview (7 preview modules)
│   ├── /checklist                                 Checklist Browser (Grails via filter preset)
│   ├── /parallels                                 Parallel Explorer (Full Rainbow)
│   ├── /autographs                                Autograph Index
│   ├── /inserts                                   Insert Catalog
│   ├── /teams                                     Teams Landing (bar chart + grid)
│   ├── /teams/[team-slug]                         Individual team page
│   ├── /teams/ncaa                                NCAA Consolidated (Bowman Basketball specific)
│   ├── /insights                                  Insights / Data (NEW in v2)
│   └── /resources                                 Resources (leads with Box Breakdown)
│
└── [v2+ deferred]
    ├── /calendar                                  Release calendar
    ├── /players/[player-slug]                     Cross-release player index
    ├── /brands/[brand-slug]                       Brand family timelines
    └── /search                                    Global search
```

Eight sub-pages per release. Each sub-page competes for its own search queries and serves a distinct collector intent.

---

## Page-by-page specification

### 1. Homepage — `/`

**Purpose.** Front door. Establish what Rip Report is within seconds. Archive of every release.

**Sections, top to bottom:**

1. **Masthead.**
   - Comic-book Superman-style wordmark: "The Rip Report" as a bold, iconic logo. Confident, serial, has presence. Logo design TBD.
   - Subhead: "A visual breakdown of the most hyped sports card releases — for the community."
   - Small kicker above wordmark: "Issue XX · [Month Year]"
   - Thin full-width rule beneath.
2. **Latest Drop callout.** Full-width editorial tile for the most recent release (only if dropped within 14 days). Box image right, headline + editorial take left, CTA "Read the breakdown →". Hides cleanly if criteria not met.
3. **Featured Breakdowns.** 3-column grid of tiles for releases marked `featured: true`. Magazine-cover-sized. The 2-3 top hyped releases above the archive.
4. **The Archive.** Filterable grid of ALL releases. Filter bar (sport, brand, year, status). Search input. Count indicator. Compact tile variant. 4-col desktop, 3 tablet, 2 mobile.
5. **Footer.** Rip Report wordmark (smaller), tagline, nav (About, Contact, RSS), disclaimer.

**Navigation.** No sticky sub-nav on homepage.

**Empty states.**
- Fewer than 3 featured releases: hide if zero, expand tile size if 1-2.
- No Latest Drop: skip cleanly.

---

### 2. Release Overview — `/releases/[slug]/`

**Purpose.** Dashboard of the whole release. Thread-pulls into every sub-page. Seven preview modules, each answering a distinct collector question.

**The 7 modules, top to bottom:**

#### Module 1 — Series Overview

Anchors the page. Masthead + synopsis + editorial voice.

- Sport-accent top bar (4px, full-width)
- Release metadata kicker (date · brand · sport · status pill)
- Massive serif title
- Hero imagery block: all 5 box shots side-by-side with format name labels
- **2-3 paragraphs of synopsis + editorial take** in Rip Report voice. Absorbs the former "What Actually Matters" block. This is the meat: what the release is, why it matters, what to internalize before ripping.
- Verdict chip row: Our Rating · Who This Is For · Key Chase · Release Window

No click-through — this IS the overview entry.

#### Module 2 — Cards by Team

- Eyebrow: "CARDS BY TEAM"
- Horizontal bar chart: one bar per team, length = total card count, sorted descending
- Sport-accent bar color
- Top 8-10 teams inline, rest collapsed
- Bar hover: team name, card count, rookie count, notable player
- Click bar → team page
- CTA: "See all team breakdowns →" → Teams Landing

#### Module 3 — Full Card Set

- Eyebrow: "THE FULL SET"
- Headline stat strip (tabular numerics):
  - "200 base cards"
  - "100 paper prospects"
  - "100 chrome prospects"
  - "87 autograph signers"
  - "30+ parallel variations"
- Quick-filter preview row: search input (visual only) + 3-4 filter pills
- 5-7 teaser rows from the real checklist table
- CTA: "Open the full checklist →" → Checklist Browser

#### Module 4 — The Holy Grails

- Eyebrow: "THE HOLY GRAILS"
- Short editorial lead (1-2 sentences)
- 3-5 rarest cards as striking blocks:
  - Card image (or fallback)
  - Player name (Fraunces)
  - Card name ("Cooper Flagg Platinum Border 1/1")
  - Estimated value chip
  - 1-sentence "why this is the grail"
- Organized rarest-to-most-common
- Click card → Checklist filtered to that player
- CTA: "See every chase card →" → Checklist Browser with `?rarity=grails` preset

#### Module 5 — Full Rainbow

- Eyebrow: "THE RAINBOW"
- Horizontal rainbow strip: ~12-14 parallel colors left-to-right, 1/1 to unnumbered
- **ACTUAL parallel colors** (refractor red, metallic gold, etc.) — signature visual move
- Labels beneath: print run in tabular mono
- Stat line above: "14 base parallels · 12 chrome prospect parallels · 26 total rainbow pieces for chase players"
- CTA: "Explore every parallel →" → Parallel Explorer

#### Module 6 — Box Breakdown

- Eyebrow: "THE BOX BREAKDOWN"
- Grid of 5 box format cards:
  - Box image thumbnail
  - Format name (Fraunces)
  - Pack math ("24 × 12 = 288 cards")
  - MSRP or current price (mono)
  - "Best for" one-liner
- Click card → Resources anchored to that format
- CTA: "Full format analysis →" → Resources

#### Module 7 — Insights / Data

- Eyebrow: "BY THE NUMBERS"
- 2x2 or 2x3 grid of insight tiles:
  - "Most-carded player" — Flagg on 12 cards
  - "Biggest rookie count" — Spurs (3)
  - "Longest rainbow" — Flagg (26 parallels)
  - "Rarest case hit odds" — 1 Superfractor per ~300 cases
  - "First Bowman auto class size" — 76 of 87
  - "Women's hoops spotlight" — Watkins + Hidalgo anchor NCAA-W
- Each tile: stat + hobby-voice caption + small icon/visual
- CTA: "See all insights →" → Insights page

**Below the 7 modules:**

8. **Expandable editorial blocks** (collapsed by default):
   - "What's New"
   - "How It Compares"
   - "Red Flags"
   - "Bull Case"
   - "Bear Case"
   These are the remainder of commentary. Available for the deep reader, not forced.

9. **Related Releases.** 2-3 tiles (previous year, companion set, Chrome version).

10. **Resources footer strip.** Thin footer with official PDF link, product page link, last-updated.

**Sticky sub-navigation.** Appears after user scrolls past Module 1. Tabs: **Overview · Checklist · Parallels · Autographs · Inserts · Teams · Insights · Resources**. Active tab underlined in sport accent. Persists across all sub-pages.

**Empty states.**
- No hero imagery: wordmark fallbacks (NOT typographic "BASEBA" treatment).
- No chase cards: Holy Grails module hides.
- Thin insights: tiles show what exists + "More insights coming" tile.
- Missing commentary field: that expandable block doesn't render. No empty accordions.

---

### 3. Checklist Browser — `/releases/[slug]/checklist`

**Purpose.** Every card searchable.

**Sections:**

1. Header + sub-nav + breadcrumb
2. Editorial callout strip (2-3 sentences in Rip Report voice)
3. **Filter / control bar:**
   - Search (player, team, card number)
   - Multi-select filters: Subset, Team, League, Auto, Rookie
   - **Rarity preset filter:** All / Has parallels / Chase (/25 or lower) / Grails (/10 or lower) / Holy Grails (1/1s only)
   - Sort: Card # default / Player A-Z / Team / Rookie first
   - View toggle: Table (default) / Grid
   - Results count
4. **Table (default) — best practice patterns.**
   - Columns: Card #, Player (with small team logo), Team, Subset, Rookie, Auto, Parallels count, Actions
   - Rows clickable
   - **Inline accordion expansion on click** — row expands to show card detail: image if available, full parallel rainbow, auto details, editorial note, CTA "See all [Player]'s cards"
   - Deep-linkable via query params
5. **Grid view** (alternate). Card thumbnails, player + number overlay. Click opens same expansion.

**Navigation.** Filters update URL (shareable). Keyboard: arrows between rows, Enter expands, Esc closes.

**Empty states.**
- No results: "No cards match these filters. [Reset]"
- Grails preset empty: "No 1/1 cards flagged yet for this release"

**Mobile.** Table → stack of compact rows. Filters → bottom-sheet modal. Expanded detail fills viewport.

---

### 4. Parallel Explorer — `/releases/[slug]/parallels`

**Purpose.** Complete parallel hierarchy with odds, print runs, exclusivity.

**Organized visually — designer judgment applies — core elements:**

- Header + sub-nav + editorial callout
- **Rarity Pyramid visualization (hero).** Full-width. All parallels across all groups ordered by print run, 1/1 at top. Bars use **actual parallel colors**. Print run right, exclusivity chips, pack odds when available.
- **By-group detail tables.** Each ParallelGroup (Base, Chrome Prospects, etc.) with full metadata.
- **Exclusivity Matrix.** Small callout: Hobby-Exclusive / Retail-Exclusive / Breaker-Exclusive in columns.

Player-specific rainbows live on the Insights page, not here. This page stays focused on structural ladder.

**Empty states.**
- Odds PDF not yet published: "TBD" with banner "Official odds land [date]. Updating live."
- No parallels (rare): explanatory note.

---

### 5. Autograph Index — `/releases/[slug]/autographs`

**Purpose.** Every signer, every auto set, every tier.

**Sections:**

1. Header + sub-nav + editorial callout
2. **Signer Tier Ladder (four tiers):**
   - **Tier 1 — The Faces** (3-5 top names)
   - **Tier 2 — Strong Co-Stars** (10-15 players)
   - **Tier 3 — Sleepers** (10-20 upside bets)
   - **Tier 4 — The Rest** (everyone else)
   - Each tier has editorial explanation
   - Signer cards: photo (or initials fallback), name, team chip, auto sets, lowest numbered parallel
3. **Auto Sets Directory.** Each of the 6 sets with full signer list, parallel ladder, editorial note, box guarantee.
4. **Notable Absences.** Players NOT signing, with reason where known. Distinctive and collector-critical.
5. **Redemption Watch.** Delayed hard-signed autos: players, estimated windows, notes.

---

### 6. Insert Catalog — `/releases/[slug]/inserts`

**Purpose.** Every insert set, full checklist per set. Bible-completeness page.

**Sections:**

1. Header + sub-nav + editorial callout
2. **Standard Inserts vs. Case Hits split.** Case hits get larger tiles, bolder chips.
3. **Per-insert expandable blocks:**
   - Name + odds chip + NEW tag + Case Hit chip
   - Description
   - Rip Report editorial take
   - Full checklist (collapsed, expandable)
   - Parallel ladder if applicable
4. **Cross-Insert Chase Players.** Players in 3+ inserts with their insert rainbow.

---

### 7. Teams Landing — `/releases/[slug]/teams`

**Purpose.** Gateway to team pages.

**Sections:**

1. Header + sub-nav + editorial callout
2. **Expanded Cards-by-Team bar chart** (full all 30 teams, not just top 8-10 like the overview teaser). Each bar clickable → team page.
3. **League toggle.** NBA (default) / NCAA (→ consolidated page).
4. **Team grid.** All 30 NBA teams:
   - Team logo (large)
   - Name
   - Rookie count (big number)
   - Notable rookie
   - Chips: auto signer present, headliner here
   - Team color as subtle top-stripe
5. **Sorting controls.** Rookie Count default / Alphabetical / Notable Signers / Editorial Rank.
6. **"Teams to Watch"** editorial callout (3-4 teams flagged).

---

### 8. Individual Team Page — `/releases/[slug]/teams/[team-slug]`

**Purpose.** Every card of every player on one team.

**Sections:**

1. Header + sub-nav + breadcrumb
2. **Team hero.** Logo (large), name, league/conference/division chips, team accent color backdrop.
3. **At-a-glance stats strip** (4-column): total cards, rookies, auto signers, chase cards.
4. **Editorial take.** 3-5 sentences in Rip Report voice.
5. **Roster table.** Every player: name + photo, card numbers, subsets, rookie flag, auto availability, parallel rainbow swatches, click-through to filtered checklist.
6. **Chase cards from this team** (filtered from parent).
7. **Team Insights closer.** 1-2 quick hobby-voice takes ("Mavericks have 1 card. It's Flagg. Full stop.")
8. **Related team pages.** 3-4 others (division rivals, comparable rosters).

**Edge cases:**
- 1 card: full page with that card prominent + "Only one card from this franchise."
- 0 cards: page doesn't generate.

---

### 9. NCAA Consolidated Page — `/releases/[slug]/teams/ncaa`

**Purpose** (Bowman Basketball specific). Full NCAA side consolidated by conference.

**Sections:**

1. Header + sub-nav + breadcrumb
2. **Editorial overview** (4-6 sentences)
3. **Conference groupings** (each collapsible):
   - Big 12 (expanded by default)
   - SEC, Big Ten, ACC, Big East
   - Other conferences (combined)
4. **Within each conference:** Schools with rosters. School name, logo or text treatment, roster table (same pattern as individual team pages).
5. **Women's NCAA spotlight.** Separate callout. Watkins, Hidalgo, etc. Dedicated editorial attention.

---

### 10. Insights / Data — `/releases/[slug]/insights`

**Purpose.** Quirky, data-driven, shareable takeaways. The Sleeper/FiveThirtyEight page.

**Sections:**

1. Header + sub-nav + editorial callout
2. **Key stat tiles grid.** Larger versions of overview's Insights tiles. Each: headline stat (tabular big number), context sentence, mini chart/icon, hobby-voice caption.
3. **Player-specific rainbows.** Chase players' complete parallel rainbows visualized. Flagg's 26-parallel rainbow as a full horizontal strip (Base + Chrome Prospects combined).
4. **Team-level data viz:**
   - Cards per team (full bar chart)
   - Autograph density by team
   - Rookie distribution by conference (NCAA)
5. **Product-level data viz:**
   - Parallel count distribution
   - Case hit probability calculator (rough math on hobby case)
   - Auto tier distribution
6. **Fun takeaways.** Unexpected observations, conversational voice.

**Empty states.**
- Thin insights: show what exists + "More insights coming as data finalizes."
- Viz degrade gracefully on missing data.

---

### 11. Resources Page — `/releases/[slug]/resources`

**Purpose.** Format deep-dive, buy options, official links, errata.

**Sections (leads with Box Breakdown):**

1. Header + sub-nav
2. **Box Format Deep-Dive (leads the page).** For each format:
   - Box image (larger than overview thumbnail)
   - Full spec: cards/pack × packs/box × boxes/case
   - MSRP vs. current secondary price (with `asOf`)
   - Full guarantee list
   - Exclusivity list
   - EV note if pricing available
   - "Best for" verdict with reasoning
3. **Buy links by format.** Each format with 2-3 reputable sellers and current pricing.
4. **Official resources.** Topps odds PDF, product page, sell sheet, press releases — with timestamps.
5. **Break providers.** 2-3 recommended services.
6. **Grading considerations.** Editorial on centering, defects, known issues.
7. **Errata & updates log.** Versioned change list: "Updated Orange Refractor odds on May 2 per official PDF."
8. **Related reading.** Links to adjacent releases we've covered.

---

## Cross-page navigation

### Sub-nav

- Present on every `/releases/[slug]/*` page
- Tabs: **Overview · Checklist · Parallels · Autographs · Inserts · Teams · Insights · Resources**
- Active tab underlined in sport accent
- Count badges where relevant ("Parallels · 14")
- Sticky at `top: 64px` below global header
- Mobile: horizontal-scroll tabs, active snapped to center

### Breadcrumbs

- Every page except homepage
- Format: Rip Report → [Release] → [Page]
- Team pages: Rip Report → [Release] → Teams → [Team]
- All segments except current are links

### Internal linking (the bible-ification)

- Every player name in commentary → filtered checklist view
- Every team mentioned → team page
- Every parallel mentioned → Parallel Explorer anchored to that parallel
- Every insert mentioned → Insert Catalog
- Previous-year references → that release's overview

### Footer

- Consistent across pages
- Rip Report wordmark + tagline
- Nav: Homepage · About · Contact · RSS
- Disclaimer: "Independent publication. Not affiliated with Topps, Panini, Upper Deck, or Fanatics."

---

## Edge case inventory

| Missing data | Where it appears | Handling |
|---|---|---|
| Pack odds PDF not yet released | Parallel Explorer, Box Breakdown | "TBD" + banner: "Official odds land [date]. Updating live." |
| Checklist not yet published | Checklist, Full Card Set module | Partial list + banner with expected date |
| No box imagery | Homepage tiles, Overview hero, Resources | Clean wordmark fallback on sport-tinted bg. Not typographic "BASEBA". |
| No chase cards flagged | Overview Holy Grails | Section hides. Commentary still references chases. |
| No editorial rating | Overview Verdict chips | Rating chip hides; others compensate |
| Redemption windows unknown | Autograph Redemption Watch | "Estimated: awaiting Topps confirmation" |
| Team 0 cards | Team page | Page doesn't generate |
| Team 1 card | Team page | Full page with minimal roster |
| Preorder status | Everywhere | "Releases [date]" pill. Pricing sections: "Available at release." |
| Insights data thin | Insights + Overview Module 7 | Tiles show what exists + "More coming" |
| Grails filter no results | Checklist Browser | "No 1/1 cards flagged yet for this release" |

---

## Release relationships

Connected via `relatedReleases`:

- **Previous year**
- **Companion set** (Bowman Chrome from Bowman paper)
- **Chrome version**
- **Related** (catch-all)

Appear on: Overview footer, Resources "related reading", contextual commentary links.

---

## SEO

Separate routes per sub-page means each competes for distinct queries. Every page has:

- Unique title (release + page type)
- Unique meta description
- OG image from hero
- Schema.org (Article for commentary, Product for releases)
- Clean canonicals

---

## Not in v1 (deferred)

- User accounts, favorites, following
- Comments / discussions
- Live pricing integration
- Population reports
- Historical price charts
- Format Calculator
- Cross-release player index
- Release calendar
- Brand family pages
- Global search
- Newsletter
- Paid tier

Scope creep goes here.

---

## Build order

1. **Data sourcing week**
2. **Schema migration** (per `DATA-MODEL.md`)
3. **Shared components:**
   - Header / sub-nav / breadcrumb
   - Release hero
   - Filter bar (with Rarity preset)
   - Roster table
   - Parallel bar viz (actual parallel colors)
   - Chip system
   - Insight tile (NEW)
   - Box format card
4. **Overview rebuild** (tests every shared component)
5. **Checklist Browser**
6. **Parallel Explorer**
7. **Insights** (reuses Checklist + Parallels data, fast build here)
8. **Autograph Index**
9. **Insert Catalog**
10. **Teams landing + individual team pages + NCAA consolidated**
11. **Resources page**

Then port 2025 Topps Chrome Football. Then Bowman Baseball May 13. Three releases, bible-complete, architecture-consistent. That's v1.
