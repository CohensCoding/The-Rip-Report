# Rip Report — Design System (v2)

> Visual and interaction bible for Rip Report. Updated to match ARCHITECTURE v2 — adds comic-book Superman wordmark direction, bar chart pattern for Cards-by-Team, insight tile component, parallel rainbow strip, Holy Grails terminology, and component specs for the 7 overview modules.

---

## The visual brief, in one paragraph

Rip Report looks like what you'd get if a card shop owner teamed up with a senior product designer at Figma and they decided to make the hobby's definitive reference. **Authentic to the community** (hobby-native voice, respect for the weird specific things collectors care about), **modern consumer product polish** (StockX cleanliness, Venmo warmth, Figma craft), with an **editorial trust backbone** (ESPN data integrity, Wikipedia completeness, Sleeper's willingness to show density). Dark-mode-first. Colorful where color belongs. The masthead has comic-book Superman energy. Serif headlines, clean sans body. Imagery matters. Micro-interactions reward attention. Nothing corporate. Nothing sterile. Nothing overdesigned.

---

## Design principles (what we reach for; what we avoid)

**Reach for:**
- **Craft over flash.** Small details done well (tabular numbers, consistent spacing, thoughtful empty states) matter more than big visual moments.
- **Hobby-native language.** "Rips," "hits," "chase," "rainbow," "case hit" — use them naturally.
- **Confident density.** Comfortable showing a lot of data when the user wants it. A 200-row table is not a problem if designed well.
- **Color where it means something.** Sport accents, parallel colors (real refractor reds and metallic golds), status indicators.
- **Imagery as hero.** Box shots, pack shots, card images. Photographic, not illustrative.
- **Speed as design.** Fast loads, fast interactions, no layout shift.
- **A masthead with muscle.** The Rip Report wordmark earns its visibility — bold, iconic, serial.

**Avoid:**
- **Marketing polish.** No hero illustrations with swoopy gradients, no "Get started" CTAs on content pages.
- **Trendy micro-interactions for their own sake.** No scroll-jacking, no parallax.
- **Card-component disease.** Not every UI element needs to be inside a bordered card with padding and shadow.
- **Generic SaaS aesthetics.** No Shopify-dashboard vibe.
- **Over-branding.** Wordmark appears in the masthead, the footer, and as a favicon. That's it.

---

## The Rip Report wordmark

This is the one visual moment where Rip Report gets loud. The masthead on the homepage and a smaller variant in global nav and footer.

**Direction:** Comic-book Superman energy. Bold, iconic, serial publication mark. Not a quiet editorial wordmark. Something with presence, something memorable — it should feel like a mark you'd see on a trading card pack, which is exactly the vibe we want.

**Implementation path:** Ship v1 with a refined type-based treatment. Replace with a designed SVG asset in v1.1 once we have the resources. A placeholder that looks intentional is fine; a placeholder that looks like default Fraunces is not.

**Type-based v1 spec:**
```
Font: Fraunces 900 (or the boldest Fraunces variant)
Size: 72px on homepage masthead, 24px in global nav, 28px in footer
Tracking: -0.04em (tight)
Case: Title case — "The Rip Report" (not "The RIP REPORT" or "the rip report")
Color: paper (#F5F5F4) — pure white bg against ink
Treatment:
  - Small serif flourish or underline weight variation (optional, use sparingly)
  - Slight italic lean is acceptable if it reads editorial-iconic, not gimmicky
  - "The" gets visually distinct treatment — smaller, lighter weight, slightly offset
```

A reference for the "The" treatment: think "The New Yorker" masthead — "The" is a grace note above the main wordmark, not competing for attention.

**Do NOT attempt the v1 wordmark:**
- With drop shadows, bevels, or 3D effects
- With gradient fills
- With custom letterforms (we don't have a designer; stay type-based)
- Larger than 72px (it's a publication mark, not a billboard)

**v1.1 direction (when we commission):** A custom SVG wordmark with slightly heavier weight, maybe a custom ligature or a single decorative stroke. Think Sports Illustrated meets a vintage Topps brand mark. Deferred.

**Usage rules:**
- Homepage masthead: 72px, Fraunces 900, followed by subhead line
- Global header (sticky): 24px, simplified (just "Rip Report", drop "The" for clarity at small size)
- Footer: 28px
- Favicon / OG logo: "RR" monogram in a rounded square, paper on ink
- Never reproduce wordmark at angles, on photography, or with effects
- Never use wordmark as a decorative pattern

---

## Color system

Color is a first-class part of the experience. Three color systems operate at once: **brand/UI palette**, **sport accents**, and **parallel colors**.

### Brand / UI palette

```
Ink          #0A0A0B       Primary background (near-black)
Ink-raised   #141416       Elevated surfaces (drawer, modal, sticky nav)
Ink-soft     #1C1C1F       Lowest elevation (hover states, subtle fills)

Paper        #F5F5F4       Primary text (off-white, warmer than pure white)
Paper-soft   #C1C1BC       Secondary text
Paper-mute   #7C7C78       Tertiary text, metadata, timestamps

Border       #26262A       Default border (subtle, on ink)
Border-hover #3A3A3F       Border on interactive hover

Lines        #1E1E22       Divider lines, table row dividers
```

### Sport accents

Confident, saturated — not corporate-muted.

```
Football     #D13340       Vivid crimson
Basketball   #F26A1C       Warm refractor orange
Baseball     #2D5A8F       Navy that reads blue on dark
Hockey       #5DA3CC       Ice blue
Soccer       #1B9B6C       Emerald
Racing       #2A8044       Racing green
UFC          #E84C3D       MMA red
Wrestling    #B8872E       Championship gold
```

Use sport accents for:
- 4px top bar on release hero
- Active tab underlines in sub-nav
- Bar chart colors (Cards-by-Team modules)
- Holy Grail value chips
- Status pills ("JUST DROPPED," "PREORDER")
- Tile left-edge accent stripes

Do NOT use sport accents for:
- Body text
- Large background fills
- Non-primary buttons
- Charts beyond their brand role

### Parallel colors — the signature system

**Where Rip Report differentiates.** When we render a parallel bar or rainbow swatch, the bar's color IS the actual parallel color. A Gold Refractor /50 bar is genuinely gold. A Red /5 is refractor red. A Superfractor /1 has a rainbow gradient.

Canonical palette for standard parallels:

```
# Refractor base
Refractor (unnumbered)    #B8C5D1     Cool silver-blue tint, subtle gradient

# Standard Chrome ladder
Purple                    #6B3AA0
Fuchsia / Pink            #E04B94
Blue                      #3A7BD5
Aqua                      #43C6DB
Green                     #2EA558
Yellow                    #F4C430
Gold                      #D4AF37     With metallic gradient
Orange                    #F26A1C     Refractor orange
Red                       #D13340
Black                     #1A1A1D     Deep black with subtle shine
Superfractor / Platinum   gradient    Rainbow gradient — the chase
```

**Bowman border parallels (unique to the product):**
- Pattern variants get the base color + subtle diagonal overlay
- Border variants applied as 6px border treatment in bar visualizations

Parallel colors override sport accents in parallel visualizations. A Flagg Gold /50 is gold, not basketball-orange, even in a basketball release.

### Semantic colors

```
Success     #2EA558      "Odds confirmed," "Data complete"
Warning     #F4A825      "Odds TBD," "Preorder"
Error       #D13340      Errors, 404s
Info        #5DA3CC      Neutral announcements
```

---

## Typography

```
Serif     Fraunces         Headlines, wordmark, pullquotes, player names
Sans      Inter            Body, UI, tables, data, labels, most chrome
Mono      JetBrains Mono   Card numbers, print runs, odds ratios
```

### Scale

```
display-xl    72px   Fraunces 900    Homepage masthead wordmark
display-lg    60px   Fraunces 700    Release Overview Module 1 title
display-md    48px   Fraunces 600    Team page title, section hero titles
display-sm    36px   Fraunces 600    Sub-page titles (Checklist, Parallels, etc.)

h1            30px   Fraunces 600    Within-page major sections
h2            24px   Fraunces 500    Subsections, Module eyebrows → titles
h3            20px   Fraunces 500    Sub-subsections, drawer titles

body-lg       18px   Inter 400       Overview Module 1 synopsis, editorial prose
body          16px   Inter 400       Default body, most UI
body-sm       14px   Inter 400       Secondary text, metadata
caption       12px   Inter 500       Uppercase eyebrows, labels, chips

numeric-lg    28px   JetBrains 500   Big numbers (rookie counts, /1)
numeric       16px   JetBrains 400   Table data, print runs, stat strip
numeric-sm    13px   JetBrains 500   Small inline stats
```

### Typography rules

- **Headlines are tight.** `tracking-tight` or `tracking-tighter` on Fraunces.
- **Body is relaxed.** `leading-relaxed` on prose (1.625).
- **Mono is for data, not decoration.** Don't use JetBrains Mono as a flex on non-data text.
- **Uppercase eyebrows are tight on tracking.** `tracking-widest text-xs uppercase font-medium text-paper-mute`.
- **Tabular numerics EVERYWHERE numbers appear.** `tabular` utility or `font-variant-numeric: tabular-nums`. Non-negotiable.

---

## Spacing system

```
Section spacing (between major page sections)
  py-16        mobile
  py-20        tablet
  py-24        desktop

Inter-module spacing (between Overview's 7 modules)
  py-12        mobile
  py-16        desktop
  Subtle divider between: border-t border-lines

Card/block padding
  p-4          compact (table rows, chips)
  p-6          default (cards, callouts)
  p-8          spacious (hero blocks)

Content max-widths
  max-w-prose       Editorial commentary (65ch)
  max-w-2xl         Standard content
  max-w-5xl         Dense tables, parallel explorer
  max-w-7xl         Team grid, checklist browser
  max-w-[1440px]    Absolute outer boundary

Gaps in grids
  gap-4             Tight (chip rows)
  gap-6             Default (tile grids, Module 7 insights)
  gap-8             Spacious (team grids)
```

---

## Layout primitives

### Page shell

```
<Header />                         (global, sticky)
<Breadcrumbs />                    (non-homepage pages only)
<SubNav />                         (release pages only, sticky)
<Main>{page content}</Main>
<Footer />
```

### Global header

- Height: 64px desktop, 56px mobile
- Background: `bg-ink/80 backdrop-blur-md`
- Border bottom: `border-b border-lines`
- Left: "Rip Report" wordmark (simplified, 24px)
- Center: Nothing
- Right: Small secondary nav (About, search icon v2)

### Sub-nav (release pages)

Critical component — how users navigate between release sub-pages.

- Height: 52px
- Sticky at `top: 64px`
- Background: `bg-ink-raised border-b border-lines`
- Left: Release name (small, Fraunces, truncates)
- Center: Tab row — **Overview · Checklist · Parallels · Autographs · Inserts · Teams · Insights · Resources**
- Right: Release metadata (date in mono, status pill)
- Active tab: 2px bottom border in sport accent, text-paper color
- Inactive tabs: text-paper-soft, hover → text-paper with subtle underline
- Count badges: small mono numeric in paper-mute, dot separator (e.g., "Parallels · 14")
- Mobile: horizontal-scroll tabs, active snapped to center

### Breadcrumbs

- `text-sm text-paper-mute`
- Separator: `›` (U+203A) in paper-mute
- Format: Rip Report › [Release] › [Current Page]
- Current segment: paper color (readable, not muted)
- Position: below header, above sub-nav, `py-3`

### Footer

- Background: `bg-ink-raised border-t border-lines`
- Padding: `py-12`
- Left: Rip Report wordmark (28px) + tagline
- Right: Nav links (About, Contact, RSS)
- Bottom strip: disclaimer text
- Keep under 120px tall

---

## The 7 Overview modules — component specs

These are the hero components that define the Overview page. Each has a distinct visual language.

### Module 1 — Series Overview

**Anatomy:**
```
┌───────────────────────────────────────────────────┐
│ [4px sport accent top bar, full-width]            │
├───────────────────────────────────────────────────┤
│                                                   │
│ APR 22, 2026 · BOWMAN · BASKETBALL  [DROPPED]     │  <- Kicker row
│                                                   │
│ 2025-26 Bowman Basketball                         │  <- Fraunces 700, display-lg
│                                                   │
│ First NBA Bowman in 17 years. Dual NCAA/NBA...    │  <- Tagline, body-lg italic
│                                                   │
│ ┌─────────────────────────────────┐               │
│ │                                 │               │
│ │  [5 box shots side-by-side]     │  <- Hero imagery block
│ │  Hobby | Jumbo | Mega | ...     │
│ │                                 │
│ └─────────────────────────────────┘
│                                                   │
│ [3-paragraph synopsis in Inter body-lg]           │  <- Editorial voice layer
│ [max-w-prose for readability]                     │
│                                                   │
│ [RATING: 8/10 RIP] [WHO FOR: ...] [CHASE: ...]    │  <- Verdict chip row
│                                                   │
└───────────────────────────────────────────────────┘
```

- Container: max-w-[1440px] centered, py-16 (desktop)
- 4px accent top bar bleeds to viewport edges
- Box shots row: aspect-[4/3] on the grid, equal widths, `object-contain`
- Synopsis: 3 paragraphs max, leading-relaxed, text-paper
- Verdict chips use the chip system (see below)

### Module 2 — Cards by Team

**Visual type:** Horizontal bar chart with interactivity.

**Anatomy:**
```
CARDS BY TEAM

Dallas Mavericks         ████████████████████  5
San Antonio Spurs        ███████████████       4
Washington Wizards       ████████████          3
Utah Jazz                ████████████          3
[... 4-6 more bars ...]

[Expand: See all 30 teams →]                          <- CTA to Teams Landing
```

- Each bar:
  - Left label (team name + small logo)
  - Bar itself: bg-sport-[sport], width scales to max team count
  - Right value (card count, tabular numeric)
  - Hover: bar brightens slightly + tooltip with rookie count + notable player
  - Click: navigate to team page
- Top 8-10 teams shown by default
- Collapsible "Show all" reveals the rest inline
- Bar heights: 36px, gap-2 between bars
- Transition: bars fill left-to-right on scroll-into-view (300ms stagger, total < 1s)

### Module 3 — Full Card Set

**Visual type:** Dense stat strip + table teaser.

**Anatomy:**
```
THE FULL SET

┌──────┬──────────────┬──────────────────┬─────────────┬──────────────┐
│ 200  │ 100          │ 100              │ 87          │ 30+          │
│ Base │ Paper        │ Chrome           │ Auto        │ Parallel     │
│ cards│ Prospects    │ Prospects        │ Signers     │ Variations   │
└──────┴──────────────┴──────────────────┴─────────────┴──────────────┘

[Search input (visual)] [Subset ▾] [Team ▾] [Auto ▾]              <- Filter preview

┌──────────────────────────────────────────────────────┐
│ #1    Cooper Flagg    Mavs   Base   R  A   13 par. │  <- 5-7 teaser rows
│ #2    Dylan Harper    Spurs  Base   R  A   13 par. │
│ #3    VJ Edgecombe    Sixers Base   R  A   13 par. │
│ ...                                                  │
└──────────────────────────────────────────────────────┘

[Open the full checklist →]                                        <- CTA
```

- Stat strip: 5 columns equally spaced, center-aligned, numbers in JetBrains
- Filter preview is visual-only (not functional) — shows what the Checklist page looks like
- Teaser rows: same pattern as Checklist table (see Table system below)
- CTA styled as secondary button

### Module 4 — The Holy Grails

**Visual type:** Visually striking card blocks (not a table).

**Anatomy (desktop, 3-5 blocks in a row):**
```
THE HOLY GRAILS

Three 1/1s anchor this release. Here's what you're dreaming about.

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│             │  │             │  │             │
│ [Card img]  │  │ [Card img]  │  │ [Card img]  │
│             │  │             │  │             │
├─────────────┤  ├─────────────┤  ├─────────────┤
│ Cooper Flagg│  │ Cooper Flagg│  │ AJ Dybantsa │
│ Mavs        │  │ Mavs        │  │ BYU         │
│             │  │             │  │             │
│ Platinum    │  │ Chrome Super│  │ Red Refractor│
│ Border 1/1  │  │ Fractor 1/1 │  │ /5          │
│             │  │             │  │             │
│ $25K-$50K+  │  │ $30K-$75K+  │  │ $3K-$8K     │  <- Value chip, sport-accent
│             │  │             │  │             │
│ Rarest base │  │ Chrome's     │  │ Projected #1│
│ card of #1  │  │ iconic 1/1  │  │ 2026 pick  │
│ pick        │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘

[See every chase card →]                                    <- CTA
```

- Grid: grid-cols-3 desktop, grid-cols-2 tablet, grid-cols-1 mobile
- Each block: border border-lines rounded-xl p-4
- Card image aspect-[5/7]
- Value chip: sport-accent color, prominent
- Hover: subtle lift, slight border brightness on chip
- Click: navigate to Checklist filtered to that player
- "Why this is the grail" prose is 1-2 sentences, italic, paper-soft

### Module 5 — Full Rainbow

**Visual type:** Horizontal colored strip — **the signature visualization**.

**Anatomy:**
```
THE RAINBOW

14 base parallels · 12 chrome prospect parallels · 26 total rainbow pieces for chase players

┌────────────────────────────────────────────────────────────────────┐
│ [rainbow gradient][red][black][orange][gold][yellow][green][blue]..│  <- Color strip
└────────────────────────────────────────────────────────────────────┘
  /1        /5     /10   /25    /50   /75   /99   /125  /150  /199   <- Print run labels
  Super-    Red    Black Orange Gold  Yellow Green Blue  Blue  Fuchsia
  Fractor                                          Pat.

[Explore every parallel →]                                    <- CTA
```

- Strip: 56px tall, full content width
- Each parallel = a colored segment, proportional to what we want to show
- Segment background uses ACTUAL parallel color (hex from parallels.json)
- Superfractor segment: animated rainbow gradient (3s loop, respects reduced-motion)
- Labels beneath: stacked vertically — print run on top (mono bold), parallel name on bottom (caption-size)
- Hover on segment: segment brightens, tooltip shows full parallel detail
- Click segment: goes to Parallel Explorer with that parallel anchored

**Critical:** This is the most visually distinctive component on the whole site. Every parallel color must be correct — this is what people will screenshot and share.

### Module 6 — Box Breakdown

**Visual type:** Format card grid.

**Anatomy (5 format cards in a row):**
```
THE BOX BREAKDOWN

┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
│ [Box img]  │  │ [Box img]  │  │ [Box img]  │  │ [Box img]  │  │ [Box img]  │
│            │  │            │  │            │  │            │  │            │
│ HOBBY      │  │ JUMBO      │  │ MEGA       │  │ VALUE      │  │ BREAKER'S  │
│            │  │            │  │            │  │            │  │ DELIGHT    │
│ 8×20 = 160 │  │ 24×12=288  │  │ 7×6 = 42   │  │ 10×6 = 60  │  │ 10×1 = 10  │
│ $249       │  │ $519       │  │ $149       │  │ $29        │  │ $199       │
│            │  │            │  │            │  │            │  │            │
│ Rainbow    │  │ Auto maxers│  │ Mojo chasers│  │ Insert     │  │ Breaker    │
│ chasers    │  │            │  │            │  │ hunters    │  │ only       │
└────────────┘  └────────────┘  └────────────┘  └────────────┘  └────────────┘

[Full format analysis →]                                        <- CTA
```

- Grid: grid-cols-5 desktop, grid-cols-3 tablet, grid-cols-2 mobile (scrollable)
- Each card: border border-lines rounded-xl p-4
- Box image aspect-[4/5], `object-contain`
- Format name: uppercase, tracked, Inter 600
- Pack math: mono tabular, prominent
- Price: mono, color-coded (paper for MSRP, green-tinted if below MSRP)
- "Best for" caption: italic, paper-soft, 1 line
- Hover: subtle lift, border brightness
- Click: navigate to Resources anchored to that format's deep-dive

### Module 7 — Insights / Data

**Visual type:** 2x2 or 2x3 grid of insight tiles — **the Sleeper/FiveThirtyEight moment**.

**Anatomy:**
```
BY THE NUMBERS

┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│ MOST-CARDED PLAYER │  │ BIGGEST ROOKIE     │  │ LONGEST RAINBOW    │
│                    │  │ CLASS              │  │                    │
│ [small photo]      │  │ [team logo]        │  │ [small photo]      │
│                    │  │                    │  │                    │
│ 12                 │  │ 3                  │  │ 26                 │
│                    │  │                    │  │                    │
│ Cooper Flagg       │  │ San Antonio Spurs  │  │ Cooper Flagg       │
│ appears on 12      │  │ lead the class     │  │ spans 26 parallels │
│ different cards    │  │ with 3 rookies     │  │ across Base + Chrome│
└────────────────────┘  └────────────────────┘  └────────────────────┘
┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│ RAREST CASE HIT    │  │ 1st BOWMAN AUTOS   │  │ WOMEN'S HOOPS      │
│                    │  │                    │  │ SPOTLIGHT          │
│ ~1                 │  │ 76                 │  │ 2                  │
│ per 300 cases      │  │ of 87 signers      │  │ headline names     │
│                    │  │                    │  │                    │
│ Superfractor       │  │ First career       │  │ JuJu Watkins +     │
│ pull odds          │  │ Bowman autos       │  │ Hannah Hidalgo     │
└────────────────────┘  └────────────────────┘  └────────────────────┘

[See all insights →]                                            <- CTA
```

- Grid: grid-cols-3 desktop, grid-cols-2 tablet, grid-cols-1 mobile
- Each tile: border border-lines rounded-xl p-6
- Headline (top): uppercase, tracked, paper-mute, caption-size
- Icon/photo: 32-40px, centered or left-aligned per tile
- Stat: the BIG number — display-md Fraunces 700, tabular, center-aligned
- Caption: body-sm, paper-soft, 1-2 lines, supporting context
- Hover: subtle lift + border brightness
- Click: go to Insights page (all tiles do the same)

**Why this module is important:** Insight tiles are what goes viral. Each tile is designed to be individually screenshot-able. Think screenshot-size crops: a single tile on Twitter reads as a compelling, data-driven hobby observation.

---

## Component library (shared primitives)

### Release tile (homepage, featured grid)

Anatomy:
```
┌─────────────────────────────┐
│                             │  <- Image area, aspect-[4/5]
│   [Box shot or fallback]    │
│                             │
│                             │
├─────────────────────────────┤  <- Subtle border-t
│ [SPORT] · [BRAND] [STATUS]  │  <- Chips row
│                             │
│ 2025-26 Bowman Basketball   │  <- Fraunces display-sm
│                             │
│ Apr 22, 2026                │  <- body-sm paper-mute, mono
│                             │
│ First NBA Bowman in 17      │  <- body-sm italic, line-clamp-3
│ years. Dual NCAA/NBA...     │
└─────────────────────────────┘
```

- 4px-wide left accent bar in sport color
- Default: `border border-lines rounded-xl overflow-hidden`
- Hover: `border-border-hover`, lift `translate-y-[-2px]`, 200ms
- Image area: Next.js `<Image>` with box shot, `object-cover`, subtle bottom gradient
- No imagery fallback: centered Rip Report wordmark at 20% opacity on sport-accent-tinted bg (`bg-sport-basketball/8`)
- **Never** the typographic "BASKET" treatment

### Release tile — compact variant (archive grid)

Same anatomy, smaller:
- Image: aspect-[3/2]
- Title: h2 (24px)
- Tagline: line-clamp-2

### Chip system

Chips are used everywhere.

```
Default chip
  px-2.5 py-1 rounded-full
  text-xs uppercase tracking-wider font-medium
  border border-border bg-ink-raised text-paper-soft

Sport accent chip ("BASKETBALL")
  same structure
  border-sport-[sport]/30 text-sport-[sport] bg-sport-[sport]/10

Status chip — "JUST DROPPED"
  border-success/30 text-success bg-success/10
  subtle pulse animation (opacity 1 → 0.8 → 1, 2.5s loop)

Status chip — "PREORDER"
  border-warning/30 text-warning bg-warning/10

Status chip — "ANNOUNCED"
  border-info/30 text-info bg-info/10

NEW chip (new inserts, new auto sets)
  px-1.5 py-0.5 text-[10px] tracking-widest font-bold
  bg-sport-[sport] text-ink  (full accent bg, ink text — punch)

Parallel chip — renders with parallel's actual color
  dynamic background using Parallel.color.hex
  text-color: parallel.color.textColor (light/dark)

Holy Grail value chip
  px-3 py-1.5 rounded-full
  bg-sport-[sport] text-ink font-semibold
  tabular numerics for the value range
```

### Button system

Sparingly used. Most interactions are row-clicks or tile-hovers.

```
Primary (rare — "Buy Now")
  px-5 py-2.5 rounded-lg
  bg-paper text-ink font-medium text-sm
  hover:bg-paper-soft

Secondary (most CTAs — "Open the full checklist")
  px-5 py-2.5 rounded-lg
  border border-border-hover text-paper
  hover:border-paper-soft hover:bg-ink-raised

Ghost (tertiary — "Reset filters")
  px-3 py-2
  text-paper-soft hover:text-paper
  no border, no bg
```

### Table system

Critical for Checklist Browser, Team rosters, signer directories.

**Default style:**
```
<thead>: border-b border-border
  text-xs uppercase tracking-wider text-paper-mute font-medium
  px-4 py-3 per cell

<tbody>:
  tr: border-b border-lines
  tr:hover: bg-ink-raised cursor-pointer
  td: px-4 py-3
  Numeric columns: text-right font-mono text-paper
  Text columns: text-paper
  Meta columns: text-paper-soft
```

**Density modes:**
- Compact: py-2 rows, text-sm, no card thumbnails
- Default: py-3, text-base, small thumbnails
- Spacious: py-4, larger thumbnails (rare)
- User preference persists in localStorage

**Row actions:**
Entire row is clickable. No "View" button at row end — the row IS the affordance. Hover reveals a small right-arrow in the last column.

**Expansion pattern (Checklist Browser):**
Click a row → row expands inline (accordion) to show card detail. Details include: card image, full parallel rainbow, auto details, editorial note, link to filtered view.

### Filter bar

Used on Checklist, Archive, Teams Landing.

Anatomy:
- Full width within content max
- Horizontal on desktop, wraps on mobile
- Background: `bg-ink-raised` (if sticky) / transparent
- Border: `border border-lines rounded-lg`
- Padding: `p-3`

Contents left to right:
- Search input (flex-grow, max 320px)
- Multi-select dropdowns (Subset, Team, Rarity, etc.)
- Sort dropdown
- View toggle (table / grid icons)
- Density toggle (compact / default)
- Results count (body-sm paper-mute)

**Search input:**
- `bg-ink border border-border rounded-md px-3 py-2`
- Focus: `border-paper-soft` (no glowy ring)
- Leading search icon (lucide-react, 14px, paper-mute)

**Dropdowns:**
- Same base styling
- Chevron indicator
- Menu: `bg-ink-raised border border-border rounded-lg shadow-lg`
- Menu items: `px-3 py-2 hover:bg-ink-soft`
- Selected: check mark left, paper-soft bg

**Rarity preset filter (NEW in v2):**
- Dropdown with named presets:
  - All cards
  - Has parallels (any numbered)
  - Chase (/25 or lower)
  - Grails (/10 or lower)
  - Holy Grails (1/1s only)
- Selecting a preset updates URL: `?rarity=grails`
- Preset name shown inline in the dropdown button

### Parallel bar (Parallel Explorer)

Signature component.

Anatomy:
```
┌─────────────────────────────────────────────────────────────┐
│ Gold Refractor       ████████████████░░░░░░░░░░  /50  ⎯⎯⎯⎯ │
│  └ appliesTo chip    └ colored bar            └ print run  └ odds
└─────────────────────────────────────────────────────────────┘
```

- Row height: 48px
- Bar container: remaining horizontal space
- Bar fill: max 90% width, scales by `1 - log10(printRun) * 0.15`
- **Bar color: uses Parallel.color.hex directly**
- Bar background: `bg-ink-raised`
- Border radius: `rounded-sm`

Text layout:
- Left (flex-1, up to 180px): parallel name (Inter 500), appliesTo chip beneath at caption size
- Middle (flex-grow): the colored bar
- Right (fixed 120px): print run (JetBrains Mono 20px bold, right-aligned); odds beneath (mono 13px paper-mute)

Chips:
- "HOBBY ONLY": sport-accent chip
- "RETAIL": info chip
- "CASE HIT": warning chip

Hover: row bg-ink-raised, bar scales to 92% (200ms ease-out), tooltip with exact pack odds + format availability.

Superfractor: animated rainbow gradient on bar (3s loop, respects reduced-motion), small sparkle icon next to name.

### Insight tile (NEW in v2)

For Overview Module 7 and the Insights sub-page.

```
Container: border border-lines rounded-xl p-6
  h-full flex flex-col

Headline (top):
  caption uppercase tracking-widest text-paper-mute
  "MOST-CARDED PLAYER"

Icon (optional, below headline):
  40px size, paper-soft color

Stat (the big number):
  display-md Fraunces 700 tabular
  text-paper
  center-aligned in its block
  mt-4 mb-2

Caption (below stat):
  body-sm text-paper-soft
  1-2 lines with leading-relaxed

Hover: border-border-hover, subtle lift
Click: navigate to Insights page
```

Tiles are designed to be individually screenshot-able — they're shareable content on Twitter, Reddit, Discord.

### Bar chart (Cards-by-Team, Insights page)

Horizontal bar chart pattern.

```
Container: w-full
  Each row: flex items-center gap-4, h-9

Left (team label, 180px):
  flex items-center gap-2
  Small team logo (20px)
  Team name (body-sm, text-paper)
  Truncate on overflow

Middle (the bar, flex-grow):
  h-8 bg-ink-raised rounded-sm
  Fill: bg-sport-[sport], width as % of max team count
  Transition: width 600ms ease-out on scroll-into-view

Right (value, 60px right-aligned):
  Mono bold tabular
  text-paper

Hover:
  Bar fill brightens (10% luminosity)
  Cursor pointer
  Tooltip appears showing rookie count + notable player

Stagger: 50ms delay per bar on mount, so bars fill sequentially top-to-bottom
```

### Card thumbnail

For checklist rows, team rosters, holy grail blocks, card detail views.

- Aspect: `aspect-[5/7]`
- Border-radius: `rounded` (small, 4px)
- Background: `bg-ink-raised` if no image
- Image: `object-cover`
- Hover: subtle scale `scale-[1.02]`, reveals small "view →" chip in top-right
- Holy Grail indicator: small yellow "GRAIL" chip top-left for flagged cards
- Superfractor / 1/1: subtle rainbow edge glow on hover

### Card detail expansion (inline accordion)

When a Checklist row is clicked, it expands inline.

- Height animates: 0 → auto, 250ms ease-out
- Content padding: p-6
- Background: `bg-ink-raised`
- Layout: two-column on desktop (image left 240px, details right), single-column mobile
- Contents: card image, player name (Fraunces h2), team chip + card number chip row, subset label, full parallel rainbow (compact grid), auto availability, editorial note, "See all [Player]'s cards →" CTA
- Collapse on second click or Esc key

### Team card (Teams Landing grid)

```
┌─────────────────────────┐
│ [Logo large centered]   │  <- 80x80 team logo
│                         │
│ Dallas Mavericks   NBA  │  <- Team name + league chip
│                         │
│ ROOKIE COUNT            │  <- Caption label
│ 1                       │  <- Huge numeric-lg
│                         │
│ Cooper Flagg            │  <- Notable rookie
│ [HEADLINER]             │  <- Chip if team has chase card
└─────────────────────────┘
```

- `border border-lines bg-ink rounded-xl p-6`
- Hover: border-hover, subtle lift
- Click: navigate to team page
- Team accent color as 2px top-stripe

### Signer card (Autograph Index)

```
┌──────────────────────────────────┐
│ [Photo]  Cooper Flagg            │
│          Dallas Mavericks  NBA   │
│                                  │
│          In 3 sets · lowest /1   │
└──────────────────────────────────┘
```

- `flex items-center gap-4 p-4 rounded-lg border border-lines bg-ink`
- Hover: border-hover, bg-ink-raised
- Photo: 48x48 round, initials fallback if missing
- Click: navigate to player-filtered checklist view
- Tier 1 signers: slightly larger, subtle accent glow

### Insert set block

```
┌──────────────────────────────────────────────┐
│ Bowman Spotlights       [NEW]  [CASE HIT]    │
│                                              │
│ Dark background with light-blast treatment.  │
│                                              │
│ ◇ RIP REPORT TAKE:                           │
│   "The sneaky best insert in the product."   │
│                                              │
│ Odds: 1:X packs                              │
│                                              │
│ [ Show full checklist (50 cards) ▾ ]         │
└──────────────────────────────────────────────┘
```

Expanded state shows InsertCard[] as compact table.

### Box format deep-dive card (Resources page)

Larger, denser variant of the Overview Module 6 card. Spec'd in Resources section below.

---

## Page-level layouts

### Homepage

- Max content width: 1280px
- Masthead section: py-32 desktop, py-20 mobile
- Masthead: border-b border-lines at bottom
- Featured grid: 3 cols desktop, 2 tablet, 1 mobile. gap-6
- Between featured and archive: py-20 separator
- Archive grid: 4 cols desktop, 3 tablet, 2 mobile. gap-6 (compact tile variant)

### Release overview page

- Hero (Module 1): min 600px desktop, min 480px mobile
- Module spacing: py-16 desktop, py-12 mobile, separated by subtle `border-t border-lines` dividers
- Content max-widths within modules:
  - Module 1 synopsis: max-w-3xl
  - Module 2 bar chart: max-w-5xl
  - Module 3 stat strip + table: max-w-6xl
  - Module 4 grails grid: max-w-5xl
  - Module 5 rainbow strip: max-w-6xl (content-width)
  - Module 6 box grid: max-w-6xl
  - Module 7 insights: max-w-5xl
- Below 7 modules: expandable commentary blocks, max-w-prose
- Related releases: max-w-5xl
- Resources footer strip: max-w-5xl

### Checklist Browser

Full-width (max-w-7xl):
- Editorial callout: max-w-4xl, py-8
- Filter bar: full width, sticky on scroll at `top: 116px`
- Table: full width, pagination or virtual scrolling for 400+ cards
- Row expansion: inline accordion

### Parallel Explorer

- Editorial callout: max-w-3xl
- Rarity Pyramid: full-width (max-w-6xl)
- By-group tables: max-w-5xl

### Team page

- Hero: max-w-[1440px]
- Stats strip: max-w-5xl
- Editorial take: max-w-prose
- Roster table: max-w-5xl (compact density by default)
- Chase cards: max-w-5xl

### Insights page

- All modules: max-w-6xl
- Tile grids: 3 cols desktop, 2 tablet, 1 mobile
- Visualizations: full-width within container

### Resources page

- Box Format Deep-Dive (leads): max-w-6xl
- Each format: full-width block, border-separated
- Other sections: max-w-5xl

---

## Microcopy voice guidelines

Hobby-native language everywhere.

**Use these:**
- "Rip" instead of "Open" / "Buy" (box CTAs)
- "Hit" for cards in specific contexts ("1 auto hit per box")
- "Chase" instead of "Featured" / "Key" (in individual contexts)
- "Holy Grail" / "Grails" for the rarest tier
- "Rainbow" for parallel ladders
- "Signer" instead of "Autograph"
- "Case hit" always
- "1st Bowman" — canonical shorthand
- "Preorder" not "Pre-order"
- "Just Dropped" for recent releases

**Section headers:**
- "The Take" for extended commentary
- "The Holy Grails" for the chase card section (was "The Chase")
- "By the Numbers" for Insights
- "Who's Signing" for autograph overview
- "The Rainbow" for parallels
- "By Team" for team breakdowns
- "The Drop" for homepage recent releases

**Empty states:**
- "Nothing rips match those filters" (checklist empty filter)
- "We're waiting on Topps" (odds TBD)
- "Dropping [date]" (preorder)
- "No 1/1 cards flagged yet for this release"

**Avoid:**
- "Exciting" — any variant
- "Discover" / "Explore" (SaaS-speak)
- "Hottest" / "Trending" (cheesy)
- Exclamation points (except in punchy editorial moments)
- "Don't miss" anything

---

## Interaction patterns

### Hover states

Every interactive element has a hover. Non-interactive elements don't change.

- Links: text shift paper-soft → paper, subtle underline appears
- Rows: bg-ink-raised, cursor-pointer
- Tiles: lift -2px, border-hover
- Buttons: bg shift per button type
- Chips: slight bg opacity change

All transitions: 200ms ease-out. No longer, no flashier.

### Loading states

- Next.js streaming / Suspense boundaries
- Skeleton placeholders: `bg-ink-raised` with subtle shimmer (5% brightness variation, 1.5s cycle)

### Transitions

- Page-to-page: Next.js default
- Filter updates: content fades to 60% opacity during update (200ms)
- Accordion expand/collapse: height 250ms ease-out
- Bar chart fill-in: 600ms ease-out on scroll-into-view, 50ms stagger

### Scroll behaviors

- Global: `scroll-behavior: smooth`
- Anchored sections: `scroll-margin-top: 120px` (account for sticky sub-nav)

### Keyboard accessibility

Required:
- All interactive elements tab-reachable
- Tab order follows visual order
- Enter/Space activates buttons and rows
- Esc closes expansions and modals
- Arrow keys navigate tables
- Cmd/Ctrl+K focuses search
- Deep-links via URL query params (survive reloads)

---

## Imagery guidelines

### Box shots
- Source: Topps product page (editorial use OK with attribution)
- Transparent PNG preferred
- Consistent height within a release
- Always `object-contain` — don't crop box art

### Card images
- Priority: Topps official → Checklist Insider/Beckett → eBay completed listings
- Always `aspect-[5/7]`
- `object-contain` — don't crop card art

### Team logos
- NBA/NFL/MLB/NHL official (trademarks but fair use editorially)
- SVG where possible
- Sizes: hero 120x120, grid 80x80, inline 20x20
- Neutral background with padding so logos never touch edges

### Brand / product logos
- Bowman, Topps Chrome, Prizm marks — SVG where available
- Used as wordmarks on release page headers, 80-120px wide
- Never decorative

### Fallbacks
- **Box fallback:** ink-raised bg, centered Rip Report wordmark at 20% opacity, sport-accent tint
- **Card fallback:** ink-raised bg, centered card number (mono, 30% opacity), small "Image pending" text
- **Logo fallback:** team initials in a circle with team-color bg
- **Never:** the typographic "BASEBA" treatment from v1

---

## Responsive behavior

### Breakpoints
```
md    768px    Tablet
lg    1024px   Desktop
xl    1280px   Wide
```

### Mobile rules
- All pages usable at 375px width
- Tables → stacks of rows (row = card)
- Sub-nav → horizontal-scroll tabs
- Drawers → full-screen modals (or inline accordion per v2)
- Filter bars → bottom-sheet modal
- Hero sections compress (display-lg → display-md)
- Box imagery stacks below text on hero
- Module 6 box breakdown: 2-col grid with horizontal scroll

### Tablet (md)
- 2-col grids where desktop is 3
- Tables stay as tables
- Sub-nav stays horizontal

### Desktop (lg+)
- Full fidelity

---

## Motion

### Principles
- Motion serves function, not decoration
- Respects `prefers-reduced-motion`
- Fast: 150-250ms most UI
- Ease: `ease-out` entrances, `ease-in` exits, `ease-in-out` state changes

### Specific moments
- Chase card hover: scale 1.02 + border glow
- Parallel bar load: bars fill left-to-right, 300ms stagger, total < 1s
- Bar chart fill: 600ms ease-out on scroll-into-view, 50ms per-bar stagger
- Stat big number: counts up from 0 (500ms, once per page load)
- Superfractor bar: rainbow gradient animation (3s loop, low shift)
- "JUST DROPPED" pill: gentle pulse (1 → 0.85 → 1, 2.5s loop)
- Row accordion: height 250ms ease-out
- Filter change: 200ms fade

### Don't animate
- Content on initial page load (trust, not theater)
- Prose sections
- Tile reveals on homepage
- Table row entrances

---

## Density modes

Power-user feature.

**Comfortable (default):**
- Standard spacing
- Card thumbnails in checklist
- Editorial callouts visible
- Full metadata in rosters

**Compact:**
- py-2 rows (instead of py-3)
- No thumbnails in checklist
- Editorial callouts collapse
- Metadata columns hide
- More rows per viewport

Toggle in filter bars. Persists in localStorage.

---

## What Cursor MUST NOT do

1. **No shadows on card components unless specified.** Shadows on dark mode read cheap. Use borders.
2. **Don't use `rounded-lg` on everything.** Cards: `rounded-xl`. Chips: `rounded-full`. Buttons: `rounded-lg`. Tables: no rounding.
3. **Don't invent colors.** Every color from the palette above.
4. **No "Get started" / "Learn more" / "Explore" CTAs on content pages.** We are a publication.
5. **Don't use gradients decoratively.** Gradients appear only in: Superfractor bar, hero bottom fades, OG images.
6. **Don't generate custom SVG illustrations.** We use real imagery + typographic treatments.
7. **Don't make dense sections "more spacious."** Density is a feature.
8. **No emoji in UI.** Anywhere.
9. **Don't animate content on scroll entrance.** (Except where specified — bar charts, stat numbers.)
10. **No dark mode toggles in v1.** Dark mode only.
11. **Never the typographic "BASKET" fallback.** Gone in v2. Use wordmark fallback instead.
12. **Never refer to "Chase Cards" in copy or component names.** V2 uses "Holy Grails" everywhere. ChaseCard → HolyGrail.
