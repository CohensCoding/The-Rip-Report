# Rip Report — Starter Package

Everything you need to start building, delivered in the fewest files possible.

## What's in here

```
rip-report/
├── README.md                                       ← you are here
├── SPEC.md                                         ← the master project brief — READ FIRST
├── types/
│   └── release.ts                                  ← TypeScript schema for a Release
├── content/
│   └── releases/
│       ├── manifest.json                           ← index of all releases (drives homepage)
│       ├── 2025-26-bowman-basketball.json          ← ✅ fully populated (reference example)
│       ├── 2025-topps-chrome-football.json         ← ⚠️  skeleton — fill from your v2
│       └── 2026-bowman-baseball.json               ← 🟡 partial — update on May 13 release day
└── docs/
    └── CURSOR-PLAYBOOK.md                          ← copy-paste prompts for Cursor
```

## How to use this

1. Read `SPEC.md` top to bottom. It's the north star. Every question about "how should X look/behave" should be answerable by referencing this doc.

2. Skim `types/release.ts`. This is the data shape. Understand it.

3. Open `content/releases/2025-26-bowman-basketball.json`. This is what a complete Release file looks like — populated from our research. Use it as the reference for how deep each field should go.

4. Open `CURSOR-PLAYBOOK.md`. Follow the prompts in order.

## Before you write code

- Buy the domain (you decided standalone brand). Options: `ripreport.co`, `theripreport.com`, `ripreport.cards`. Check availability now — don't let this block you for weeks.
- Pick a hero image for Bowman Basketball. Topps' product photography or a hobby-box rip photo from a licensed source. Drop it in `/public/images/2025-26-bowman-basketball/hero.jpg`.
- Set up a GitHub repo so you have version control before you start generating code.

## Build order (from SPEC.md Phase 1)

1. Schema + homepage shell → **first prompt in Cursor**
2. Release page template → **second prompt in Cursor**
3. Wire Bowman Basketball → **data's already in the JSON**
4. Port Topps Chrome Football v2 → **fill in placeholders**
5. Pre-build Bowman Baseball → **publish on May 13**

## A note on time

Don't try to ship all three pages in one sitting. Realistic split:
- **Evening 1:** Set up the project, run Prompts 1-4 from the playbook. Ship the homepage shell with three empty tiles.
- **Evening 2:** Run Prompts 5-7. Ship the Bowman Basketball page (data is ready).
- **Weekend day:** Port your Topps Chrome Football v2 into JSON. Ship.
- **May 12:** Finalize Bowman Baseball data. Schedule publish for May 13.

## What's deliberately NOT in this starter

- React components themselves (Cursor will generate these faster than I can type them, given the spec)
- Styling details beyond broad principles (let Cursor implement against the spec, then polish)
- A CMS or admin UI (by design — this is a git-tracked publication)
- Analytics, ads, newsletter — save for Phase 3

Keep it simple. Ship fast. The template is the moat.
