# Factory Ops Command Center — concept demo

Unofficial concept demo built by Pep Dekker for a job application (Trident
Seafoods, Senior Systems Specialist | AI Agent Builder, req IT1950). Not
affiliated with, endorsed by, or built using data from Trident Seafoods. All
data shown is synthetic. `robots.txt` disallows indexing.

One dashboard — the Factory Ops Command Center — with 25 task cards across
Daily/Weekly/Monthly/Annual cadences. Two are **live agents**, the other 23
are **Phase 2** roadmap cards in the same visual shell.

## Live agents

- **Yield Reconciliation Agent** (`/agents/yield`) — deterministic comparison
  of raw intake vs. processed output by species/line against
  `lib/data/species-specs.ts`, flags anomalies outside tolerance for review.
- **Daily Shift Digest Agent** (`/agents/shift-digest`) — aggregates yield,
  downtime, QC holds, and labor for one shift, then calls the Claude API to
  draft a plain-English digest. Falls back to a deterministic template if no
  API key is set, so the demo still works out of the box.

All data is synthetic, generated deterministically (seeded RNG) in
`lib/data/generate.ts` — same numbers on every reload.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To enable the live Claude narrative on the Shift Digest agent, add an API
key:

```bash
cp .env.local.example .env.local
# then set ANTHROPIC_API_KEY in .env.local
```

Without a key, that screen still works — it shows a clearly-labeled
template draft instead of the model-generated one.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4 + `@anthropic-ai/sdk`.
No database — all data is local/synthetic (see Data model below), so there's
nothing to provision to run this.

## Data model

`lib/data/species-specs.ts` holds per-species grading tiers, target yield,
and cut specs for salmon, crab, whitefish, and pollock — species-first, so
new species are a new row, not new branching logic. `lib/data/generate.ts`
seeds synthetic production runs, lots, staffing, downtime, and QC holds from
those specs.

## Brand

Colors and fonts extracted from tridentseafoods.com's computed styles
(navy `#193a65`, accent blue `#0a93d1`). Fonts are free Google Fonts
(Archivo/Inter) chosen to match the character of Trident's licensed
`sweet-sans-pro`/`mundial` without reproducing licensed assets.
