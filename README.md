# Helm, Factory Ops Command Center (concept demo)

Unofficial concept demo built by Pep Dekker for a job application (Trident
Seafoods, Senior Systems Specialist | AI Agent Builder, req IT1950). **Not
affiliated with, endorsed by, or built using data from Trident Seafoods. All
data shown is synthetic.** `robots.txt` disallows indexing on any deployed
instance.

Helm is a single operational dashboard for a seafood processing plant
manager: one home screen, 25 task cards grouped by domain (Production &
Yield, Quality & Traceability, Safety & Compliance, Equipment & Maintenance,
Staffing & Labor, Reporting & Documentation), the way a plant manager
actually scans a dashboard, not by how often each task runs. Two cards are
working AI-assisted agents and four are interactive design previews. The
rest are roadmapped openly rather than hidden, so the full scope of the role
is visible even where the build stops.

**Design thesis, enforced everywhere in the copy:** this augments a factory
manager, it does not replace one. Every agent output reads "flagged for your
review" or "recommends," never "resolved" or "auto-fixed." The manager is
always the one who decides.

## Architecture overview

Helm is a single Next.js (App Router) application, no separate backend
service, no database. Three request patterns cover everything in the app:

1. **Static/server-rendered pages.** The home dashboard, the Yield
   Reconciliation agent, and the four Concept Preview screens are React
   Server Components. They read synthetic data in-process
   (`lib/data/generate.ts`) and render HTML server-side; there's no client-side
   data fetching to reason about.
2. **A Server Action for the one agent that calls an LLM.** The Daily Shift
   Digest agent's "Generate digest" button invokes a Next.js Server Action
   (`app/agents/shift-digest/actions.ts`, `"use server"`). The browser never
   imports the Anthropic SDK and never sees `ANTHROPIC_API_KEY`. It POSTs to
   Helm's own server, which calls the Anthropic API and returns just the
   result:

   ```
   Browser  ->  POST /agents/shift-digest (Next.js RPC, same origin)
            ->  Server Action runs on the server
            ->  Anthropic API (key from server env only)
            <-  { digest, summary }  (no key, no prompt, no SDK internals)
   ```

   This was verified, not assumed: a production build was made with a canary
   key value and grepped across the entire `.next` output (not found
   anywhere, client or server, since Next.js reads `process.env` at request
   time rather than inlining it), the client-servable chunks were grepped
   for the system prompt and model ID (not present), and the actual network
   request fired by the "Generate digest" button was inspected in a running
   instance to confirm it hits the same-origin route, never
   `api.anthropic.com` directly.
3. **A deterministic fallback.** If `ANTHROPIC_API_KEY` isn't set, the
   Server Action returns a template digest built from the same aggregated
   shift data instead of calling out. The screen still works with zero
   configuration; the model-generated version is additive, not required.

Shared shell across every page: a thin `AppBar` (identity only, no per-page
hero copy) plus, on interior pages, a normal in-flow heading and one-line
description. No page explains the app's own build status to the viewer,
that's what the Live/Planned badges are for.

## Data model

There's no database. `lib/data/generate.ts` seeds an in-memory synthetic
dataset once at server start, using a seeded PRNG (`mulberry32`) so the
numbers are stable across reloads instead of re-randomizing on every request.
The generator is driven entirely by `lib/data/species-specs.ts`:

- **`species_specs`** (`lib/data/species-specs.ts`), the one hand-authored
  table. Per species (salmon, crab, whitefish, pollock): which production
  lines run it, target yield %, an acceptable variance band, grading tiers,
  and cut/product specs. This is species-*first*: adding a fifth species is
  a new row here, not a new `if` branch anywhere else in the app.
- **Production runs**, generated per date, shift, species, and line, with
  intake/output weights. About 1 in 6 runs is deliberately generated outside
  its species' yield tolerance, so the Yield Reconciliation agent has real
  anomalies to flag rather than a suspiciously clean dataset.
- **Lots**, one traceability code per run (`LOT-{species}-{MMDD}-{line}{shift}`),
  the kind of code that would appear on a physical label.
- **Staffing, downtime, QC holds**, generated alongside each run and
  consumed by the Daily Shift Digest agent's aggregation step.

Everything downstream (both live agents, the weekly-yield concept preview)
reads from this same generated dataset. There's one source of truth for
what happened on the floor, and the agents differ only in how they
summarize it: a sortable table vs. a narrative digest.

## What's live vs. previewed vs. roadmapped

All 25 cards on the home dashboard map to responsibilities from the job
description, grouped into six domain categories with a small cadence tag
(Daily/Weekly/Monthly/Annual) on each card as secondary metadata. Two badge
states, not three: a viewer doesn't need to know which Planned cards happen
to have a mockup screen behind them.

| Badge | Count | What it means |
|---|---|---|
| **Live** | 2 | Real logic runs against the synthetic dataset, deterministic comparisons and one LLM call, and the result is genuinely computed, not scripted. |
| **Planned** | 23 | Everything else. Four of these open a real Concept Preview screen (static synthetic data, clearly banner-marked inside the screen, one per cadence); the other 19 are title and description only. The distinction isn't shown on the badge, it isn't meaningful to someone scanning the grid. |

**Live:**
- *Yield Reconciliation Agent* (`/agents/yield`), deterministic comparison
  of intake vs. output by species and line against `species_specs`, sorted
  by worst variance first, flags runs outside tolerance for review. Date
  picker is a calendar strip (day-of-week labels), not a plain button list.
- *Daily Shift Digest Agent* (`/agents/shift-digest`), aggregates yield,
  downtime, QC holds, and labor for one shift and drafts a plain-English
  summary via Claude (deterministic template fallback if no API key). Shift
  picker is a native date input plus a shift/line dropdown, replacing what
  was originally a wall of 60+ pill buttons.

The Yield Reconciliation screen also carries a small cross-reference note
pointing at the Lot-Code / Label Accuracy card (Quality & Traceability):
a flagged run and a mislabeled pallet often trace back to the same lot in
real plant operations, and the note links straight to that section of the
home grid.

**Concept Preview (4 of the 23 Planned cards):** Cold Storage Temp
Monitoring (Daily), Weekly Yield / Efficiency Report (Weekly), Vendor
Performance Review (Monthly), HACCP Recertification Prep (Annual).

See `lib/data/tasks.ts` for the full list of 25 cards; each entry there is
the source of truth for a card, including which domain category and cadence
it belongs to.

## Stack

- **Next.js 16 (App Router, Turbopack)** + **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling; brand colors/type extracted from
  tridentseafoods.com's live computed styles (navy `#193a65`, accent blue
  `#0a93d1`), see Brand below.
- **`@anthropic-ai/sdk`**, used only inside one Server Action, server-side
  only (see Architecture above).
- **No database, no ORM, no auth.** Synthetic data lives in memory; there's
  nothing to provision to run this locally.

## Estimated impact

Both live agents show a small "Estimated Impact" panel after they run: time
saved, steps reduced, delay avoided. These are illustrative comparisons
against a stated manual-work assumption (see `lib/impact.ts` for the exact
numbers and reasoning), not a benchmark of the agent's own processing speed,
comparing human minutes to machine milliseconds would read as a speed flex,
not an operational metric, so the panel never mentions how fast the agent
itself ran. An info icon next to the panel's label carries the "illustrative,
not measured" disclosure as a tooltip instead of repeating a full sentence
under every block.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To enable the live Claude narrative on the Shift Digest agent:

```bash
cp .env.local.example .env.local
# then set ANTHROPIC_API_KEY in .env.local
```

Without a key, that screen still works, it shows a clearly-labeled
template draft instead of the model-generated one.

## Brand

Colors and fonts extracted directly from tridentseafoods.com's rendered
computed styles (navy `#193a65`, accent blue `#0a93d1`), not guessed. Fonts
are free Google Fonts (Archivo/Inter) chosen to match the character of
Trident's licensed `sweet-sans-pro`/`mundial` without reproducing licensed
assets. No Trident logo artwork is reproduced; the header mark is an
original three-prong glyph, used at small scale in the thin `AppBar` shared
across every page.

## Synthetic data & disclosure

Every number in this app (production runs, yield percentages, staffing,
downtime, QC holds, vendor scores, cold storage readings) is synthetic,
generated by a seeded random function or hand-authored for a mockup. None of
it is sourced from, or implies knowledge of, Trident Seafoods' actual
operations. A disclosure to that effect appears in the footer of every page,
and `robots.txt` disallows indexing so this doesn't surface in search results.
