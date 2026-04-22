# Cursor Build Playbook — Rip Report

This file contains the exact prompts to paste into Cursor, in order. Each prompt is designed to produce a working, committable result. Don't skip steps.

---

## Setup (5 min)

### 1. Create the project folder

```bash
npx create-next-app@latest rip-report --typescript --tailwind --app --src-dir=false --import-alias="@/*"
cd rip-report
```

Answer the prompts:
- TypeScript: **Yes**
- ESLint: **Yes**
- Tailwind CSS: **Yes**
- `src/` directory: **No**
- App Router: **Yes**
- Import alias: **`@/*`**

### 2. Copy the starter files into your new project

From this starter package, copy these into your fresh Next.js project:

```
rip-report/
├── SPEC.md                                    ← root of project
├── types/release.ts                           ← /types/release.ts
└── content/releases/                          ← /content/releases/
    ├── manifest.json
    ├── 2025-topps-chrome-football.json
    ├── 2025-26-bowman-basketball.json
    └── 2026-bowman-baseball.json
```

### 3. Open in Cursor

```bash
cursor .
```

### 4. Install a few extra dependencies we'll need

```bash
npm install clsx tailwind-merge lucide-react
npm install -D @types/node
```

---

## Prompt 1 — Orient Cursor with the spec

Open Cursor's chat (Cmd+L). Attach `SPEC.md` and `types/release.ts` to the chat context. Then paste:

```
I'm building Rip Report, a sports card release breakdown publication. Read SPEC.md in full — it defines the vision, brand, visual direction, architecture, and page structure. Read types/release.ts — it defines the Release data model.

Confirm you understand:
1. The brand voice (editorial, opinionated, hobby-literate — NOT marketing-speak)
2. The visual direction (ESPN+ / The Ringer / The Athletic — premium sports publication)
3. The data model (each release renders from a JSON file; homepage renders from a manifest)
4. The section order on a release page (hero → verdict → box formats → base set & parallels → inserts → autos → teams → commentary → chase cards → links)

Once you've confirmed, wait for my next instruction. Don't generate any code yet.
```

---

## Prompt 2 — Set up fonts and global styles

```
Set up the typography system per SPEC.md. Use next/font to load:
- Fraunces (variable, for headlines — use weights 400-900)
- Inter (variable, for body and UI)

Update app/layout.tsx to apply these via CSS variables (--font-serif, --font-sans).

Update tailwind.config.ts to:
- Add the fonts as Tailwind font families (font-serif, font-sans)
- Add a sport accent color palette:
  - football: deep crimson (#9A1B2F)
  - basketball: warm orange (#E06A17)
  - baseball: navy (#0C2340)
  - hockey: ice blue (#4A90B8)
  - soccer: emerald (#046A38)
  - racing: racing green (#004225)
- Set dark mode as the default (class strategy). Background: #0A0A0B. Foreground: #F5F5F4.
- Configure tabular-nums as a utility for numbers (print runs, odds, prices)

Update app/globals.css:
- Use the near-black bg by default
- Set base font to sans
- Ensure headlines default to serif via element selectors (h1, h2, h3)
- Add smooth scroll behavior
```

---

## Prompt 3 — Build the library for loading releases

```
Create lib/releases.ts with these functions:

- getManifest(): returns the parsed manifest from content/releases/manifest.json
- getAllReleases(): returns all Release objects
- getReleaseBySlug(slug: string): returns a single Release or null
- getFeaturedReleases(): returns releases marked featured: true
- getReleasesBySport(sport: Sport): filter helper
- getReleasesByBrand(brand: Brand): filter helper

Use Node's fs module (this runs at build time in Next.js App Router server components — no need for client-side loading). Import the Release and Manifest types from @/types/release.

Also add a small utility in lib/utils.ts with a cn() function that combines clsx + tailwind-merge, per shadcn convention.
```

---

## Prompt 4 — Build the homepage

```
Build app/page.tsx — the Rip Report homepage. Reference SPEC.md "Homepage Layout" and "Release Tile Anatomy" sections.

Structure:
1. Hero section: Big Fraunces headline "Rip Report" with a tagline "Sports card release breakdowns, without the noise." Small kicker above it ("Issue #01" or similar — just hardcoded for now).
2. Featured releases section: 2-3 oversized tiles for featured releases (use getFeaturedReleases()).
3. FilterBar component: Sport and Brand dropdowns, a year selector, a search input. For v1, make them visually present but functionality can be placeholder.
4. All releases grid: Uniform grid of release tiles (3 columns desktop, 2 tablet, 1 mobile).
5. Footer: About link, Contact link, RSS icon.

Create these components:
- components/homepage/Hero.tsx
- components/homepage/FeaturedReleases.tsx
- components/homepage/FilterBar.tsx
- components/homepage/ReleaseGrid.tsx
- components/homepage/ReleaseTile.tsx
- components/homepage/Footer.tsx

ReleaseTile requirements:
- Hero image with subtle gradient overlay (or a solid colored placeholder if no image yet — use the sport accent color)
- A 4px-wide vertical accent bar on the left edge, colored by sport
- Title in Fraunces, max 2 lines with line-clamp
- Small chips for brand and sport
- Release date in tabular-nums, small and dim
- One-line take (from tagline) in italic, muted color
- Status chip (only shown if status !== "released"): "Preorder" in amber, "Announced" in violet
- Whole tile is a Link to /releases/[slug]
- Hover state: subtle lift (translate-y-[-2px]) and brighter border

Make tiles feel like magazine covers — editorial, not product-card-y. Generous padding, strong hierarchy.
```

---

## Prompt 5 — Build the release page template

This is the big one. Split into multiple prompts if needed.

```
Build app/releases/[slug]/page.tsx using Next.js 14 dynamic routes. Reference SPEC.md "Release Page Section Order" — there are 10 sections in a fixed order.

First, the page shell:
- generateStaticParams() should return all release slugs from the manifest for static generation
- generateMetadata() should pull title, tagline, and heroImage for OG tags
- The page loads the Release via getReleaseBySlug() and passes sections to component children

Create these components in components/release/:
1. ReleaseHero.tsx — Full-bleed hero image, sport accent bar, title (massive Fraunces), release date, sport/brand chips, status pill, tagline
2. Verdict.tsx — A 4-up or 2-up grid of verdict chips (oneLineTake as the hero chip, then whoThisIsFor, keyChaseCard, rating)
3. BoxFormats.tsx — Horizontal-scroll or grid of format cards. Each card shows: name, cards/pack × packs/box, pack math (e.g., 160 total cards), guarantees list, exclusives list. Use tabular-nums. Highlight the "recommended" format if format advice is present in commentary.
4. ParallelLadder.tsx — THE KEY VISUALIZATION. Render each ParallelGroup as a vertical rarity pyramid: top = 1/1 SuperFractor, widening as print runs increase. Each parallel is a horizontal bar where the width represents log(printRun) inverted. Numbered parallels should show their print run number prominently on the right. Hobby/Retail exclusives should have a small chip.
5. InsertArchitecture.tsx — Grouped list of inserts. Split visually into "Standard Inserts" and "Case Hits" (boxed separately). Each insert: name (bold serif), odds chip, description. "New" inserts get a tiny "NEW" tag.
6. AutographSection.tsx — Each auto set as its own card. Name, box guarantee as a prominent stat, signer count, notable signers as small chips, description.
7. TeamBreakdown.tsx — Grid of team cards. Each card: team name, small league badge, rookie count (big number), notable rookies listed, headliner card if flagged.
8. Commentary.tsx — Long-form editorial. Render each commentary section (whatsNew, whatMatters, formatAdvice, etc.) as its own block with a serif H2 heading and prose-style body text. Use `prose prose-invert` from @tailwindcss/typography if installed, or build custom prose styles. This section should feel like reading The Ringer.
9. ChaseCardsCallout.tsx — 2-4 flagged cards in a punchy, visual format. Each: player name (big), team, card name, short "why it's the chase" reason, estimated value range chip.
10. Links.tsx — Footer of the page. Official odds PDF link (icon + label), product page, checklist source, buy links grouped by retailer.

Design principles to enforce across all sections:
- Generous vertical spacing between sections (my-24 or more)
- Section headers: serif, large, with a subtle colored underline in the sport accent color
- Numbers use tabular-nums
- Never use default Tailwind gray for dim text — use zinc-400 / zinc-500 on dark
- Rarity parallels: visually treat lower print runs as more prestigious. A /5 should look heavier/more expensive than a /199.
```

---

## Prompt 6 — Wire the homepage tile accent colors

```
Update components/homepage/ReleaseTile.tsx and any place where sport accent colors are used to pull from a single source of truth.

Create lib/sport-config.ts with:
- sportAccentColors: Record<Sport, { hex, tailwindBg, tailwindText, tailwindBorder, label }>
- brandLabels: Record<Brand, string> (human-readable brand names)
- sportLabels: Record<Sport, string>

Reference this throughout instead of inlining strings.
```

---

## Prompt 7 — Visual polish pass

```
Polish pass. Audit the homepage and a single release page (2025-26-bowman-basketball) against SPEC.md's visual direction ("ESPN+ / The Ringer / The Athletic").

Specifically check and improve:
1. Typography hierarchy — are Fraunces headlines distinct enough from Inter body? Is there enough size contrast?
2. Whitespace — do sections breathe? Are margins consistent?
3. Dark mode depth — am I using enough subtle elevation (border-zinc-800/50, bg-zinc-900/40) to create layered feel?
4. Sport accent usage — is it used sparingly and consistently, not plastered everywhere?
5. Numbers — are all print runs, odds, and prices tabular-nums? Do they visually stand out from prose?
6. Mobile responsiveness — does the release page read well on a 375px viewport?

Fix anything that doesn't feel like it belongs on a premium sports publication.
```

---

## Prompt 8 — Deploy

```
I'm ready to deploy to Vercel. Walk me through:
1. Pushing the repo to GitHub
2. Connecting to Vercel
3. Configuring a custom domain (I'll use ripreport.co or similar — I'll provide the actual domain)
4. Setting up OG image generation for social sharing
```

---

## Ongoing — Adding a new release

Once the system is live, adding a new release is:

1. Create `/content/releases/{slug}.json` (copy the Bowman Basketball file and modify)
2. Add an entry to `/content/releases/manifest.json`
3. Drop a hero image into `/public/images/{slug}/hero.jpg`
4. Commit and push. Vercel redeploys. Done.

No code changes. No CMS dashboard. That's the point.

---

## Troubleshooting notes

- If fonts aren't loading, check that next/font is correctly configured in layout.tsx
- If JSON files aren't loading at build time, verify the path resolution in lib/releases.ts uses `process.cwd()`
- If dark mode isn't sticking, confirm `darkMode: ['class']` is set in tailwind.config.ts and the html element has `className="dark"`
- Tailwind Typography (@tailwindcss/typography) is worth installing for the Commentary section prose styles: `npm install -D @tailwindcss/typography`

---

## A note on the three starter releases

**2025-26 Bowman Basketball** — Fully populated. This is your flagship example. When Cursor needs to understand what a complete Release looks like, point it here.

**2025 Topps Chrome Football** — Skeleton. You'll need to fill in the `[FILL IN FROM V2]` placeholders from your existing v2 Excel workbook. Do this BEFORE shipping the page publicly.

**2026 Bowman Baseball** — Partial. Status is "preorder." You can publish this now with the partial data, then update the `parallels` array and add the official odds PDF link on release day (May 13). Good test of your update workflow.
