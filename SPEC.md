# Rip Report — Project Spec

> **Read this file first before writing any code.** Every decision in this project should trace back to a principle stated here. When in doubt, reference this document.

---

## Vision

Rip Report is a publication — not a tool — that turns dense trading card release information (odds PDFs, checklists, parallel ladders) into clean, editorial, shareable breakdowns.

Each release gets its own deep-dive page. The homepage is a browsable archive of every release we've covered. Readers come for specific releases, stay to explore the archive, share links to individual pages on X, Reddit, and in Discord servers.

**Think of us as:** The Ringer or Bloomberg, if they covered sports cards. Not a database. Not a price aggregator. A publication with opinions.

## Target Audience

Card collectors, breakers, and investors trying to make informed decisions about what to rip, hold, or chase. They are already hobby-literate — do not over-explain basics. They want: clarity on format differences, honest takes on value, and a clean reference they can return to.

## Brand Voice

Confident, data-native, opinionated. We don't hedge. We make calls. We use hobby vocabulary naturally (rips, hits, case hits, 1st Bowman, color rainbow, Superfractor). We are enthusiastic but never breathless.

**Do say:** "The chase here is [card X]. Everything else is noise." "Skip Jumbo — the math doesn't work."
**Don't say:** "This exciting new release brings collectors..." "With a variety of parallels and inserts..."

## Visual Direction

Premium sports product aesthetic. Reference points: **ESPN+, The Ringer, The Athletic, Bloomberg.** NOT: a Shopify template, not a generic SaaS landing page, not a Beckett-style data dump.

### Design principles

1. **Editorial over app.** Big typography. Generous whitespace. Hero images matter. Headlines carry weight.
2. **Data is visualized, not listed.** Parallel ladders become rarity pyramids. Team breakdowns become grids. Odds become spark bars. If something is a table in our source data, it should be a visualization in our UI.
3. **One strong accent color per sport.** Football → a deep red. Basketball → a warm orange. Baseball → navy. Hockey → ice blue. Soccer → emerald. The accent is used sparingly — on the hero, on key CTAs, on the current-page indicator.
4. **Serif for headlines, sans for body.** Suggested pairing: a modern serif like **Tiempos Headline** or the free **Fraunces** for H1/H2, and **Inter** for body and UI.
5. **Dark mode is the primary mode.** Rich near-black background (not pure black — think #0A0A0B). Bright white-yellow accents for serial numbers and rare parallels. Light mode is a v2.
6. **Numbers deserve respect.** Print runs, odds, and prices should use tabular figures and be visually distinguishable from prose. Treat them like data chips.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript (strict mode)
- **Content:** JSON files in `/content/releases/` — no database, no CMS
- **Deployment:** Vercel
- **Fonts:** Google Fonts or `next/font` (Fraunces + Inter to start)

## Architecture

```
/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Homepage
│   ├── releases/
│   │   └── [slug]/
│   │       └── page.tsx        # Dynamic release page
│   └── globals.css
├── components/
│   ├── homepage/
│   │   ├── Hero.tsx
│   │   ├── ReleaseGrid.tsx
│   │   ├── ReleaseTile.tsx
│   │   └── FilterBar.tsx
│   └── release/
│       ├── ReleaseHero.tsx
│       ├── Verdict.tsx
│       ├── BoxFormats.tsx
│       ├── ParallelLadder.tsx
│       ├── InsertArchitecture.tsx
│       ├── AutographSection.tsx
│       ├── TeamBreakdown.tsx
│       ├── Commentary.tsx
│       └── Links.tsx
├── content/
│   └── releases/
│       ├── manifest.json                       # Index of all releases
│       ├── 2025-topps-chrome-football.json     # One file per release
│       └── 2025-26-bowman-basketball.json
├── types/
│   └── release.ts              # TypeScript types for Release
├── lib/
│   └── releases.ts             # Load and parse JSON files
└── SPEC.md                     # This file
```

## Data Model

See `/types/release.ts` for the full TypeScript definition. Key concept: **every release page is rendered from a single JSON file.** The homepage is rendered from the manifest plus individual release files.

When adding a new release:
1. Create a new JSON file at `/content/releases/{slug}.json`
2. Add an entry to `/content/releases/manifest.json`
3. Deploy. That's it. No code changes.

## Page Inventory (v1)

| Page | Route | Purpose |
|------|-------|---------|
| Homepage | `/` | Browsable archive grid of all releases with filters |
| Release page | `/releases/[slug]` | Full breakdown of one release |
| About | `/about` | What Rip Report is, who runs it (stub only for v1) |

## Release Page Section Order

Every release page follows the same vertical flow. This consistency is the product.

1. **Hero** — Set name, release date, sport/brand badges, hero image, short tagline, status chip (Released / Preorder / Announced)
2. **Verdict** — 3-4 chips: one-line take, who this is for, key chase card, rating (optional)
3. **Box Formats** — Side-by-side card grid comparing Hobby / Jumbo / Mega / Value (pack config, hits, MSRP, secondary price)
4. **Base Set & Parallel Ladder** — Rarity pyramid visualization with print runs and odds
5. **Insert Architecture** — Grouped inserts with odds and notable chase cards flagged
6. **Autograph Program** — Signer list, box guarantees, parallel tiers
7. **Team Breakdown** — (Where relevant) Grid of teams showing rookie counts, notable names
8. **Commentary** — Long-form editorial: "What's new this year," "What actually matters," "How it compares to last year's product"
9. **Chase Cards Callout** — Flagged cards to watch, with reasoning
10. **Links & Resources** — Official odds PDF, product page, checklist source, where to buy

## Homepage Layout

1. **Hero** — Big type headline. Short tagline. Current month's release count.
2. **Filter bar** — Sport, brand, year dropdowns. Search input.
3. **Release grid** — Masonry or uniform grid of release tiles. Each tile: hero image, title, sport badge, brand badge, release date, one-line verdict, status chip.
4. **Footer** — About, contact, RSS.

## Release Tile Anatomy

- Hero image (with subtle gradient overlay)
- Sport accent bar (left edge, uses sport's accent color)
- Title (serif, 2 lines max)
- Brand + sport chips
- Release date
- One-line take (italic, 1-2 lines)
- Status chip if Preorder or Announced

Tiles should feel like magazine covers, not product cards.

## Content Voice Guidelines (for JSON `commentary` fields)

The commentary fields are where this product becomes a publication vs. a database. Write them like The Ringer, not like a press release.

**Good commentary examples:**

> "First NBA Bowman product in 17 years, and Topps didn't play it safe — this is a dual NCAA/NBA format that fundamentally rewrites what 'Bowman Basketball' means. For prospectors, this is Bowman Baseball for the hardwood. For NBA collectors, it's a weird one: Cooper Flagg's 1st Bowman lives here, but so does AJ Dybantsa's."

> "The math on Jumbo is brutal this year. You're paying a 115% premium over Hobby for 3 autos instead of 1, but you give up access to hobby-exclusive Orange /25 and Black /10 parallels. Unless you're specifically chasing autos and autos only, Hobby wins."

**Bad commentary examples (avoid):**

> "This exciting release offers collectors a wide variety of parallels and inserts..."
> "Don't miss out on this year's hottest rookies!"

## Build Phases

**Phase 1 (now):** Schema + homepage + release template + three pages (Topps Chrome Football, Bowman Basketball, Bowman Baseball).

**Phase 2:** Backfill 5-10 historical Topps releases from the last 2 years. SEO optimization, sitemap, OG images.

**Phase 3:** Release calendar page (upcoming drops). Newsletter signup. Maybe an RSS feed.

**Phase 4:** Price integration (eBay sold comps per release). Historical value tracking.

## Non-Goals (v1)

- User accounts
- User-generated breakdowns
- Real-time price tracking
- Comments or forums
- Ads

Keep it simple. Stay a publication.

---

## Legal / Content Notes

- Hero images: use our own or properly sourced. Do not hotlink Topps product images without attribution.
- Odds PDFs: link out to Topps' hosted versions, don't re-host.
- Checklist data: can be referenced from third-party sources (Beckett, Checklist Insider, ChasingMajors) with attribution.
- This site is editorial commentary, not an officially licensed product.
