# Helm — Factory Ops Command Center (concept demo)

Unofficial concept demo built by Pep Dekker for a job application (Trident
Seafoods, Senior Systems Specialist | AI Agent Builder, req IT1950). **Not
affiliated with, endorsed by, or built using data from Trident Seafoods. All
data shown is synthetic.** `robots.txt` disallows indexing on any deployed
instance.

Helm is a single operational dashboard for a seafood processing plant
manager: one home screen, 25 task cards spanning Daily/Weekly/Monthly/Annual
responsibilities, two of which are working AI-assisted agents and four of
which are interactive design previews. The rest are roadmapped openly rather
than hidden, so the full scope of the role is visible even where the build
stops.

**Design thesis, enforced everywhere in the copy:** this augments a factory
manager, it does not replace one. Every agent output reads "flagged for your
review" or "recommends" — never "resolved" or "auto-fixed." The manager is
always the one who decides.

## Architecture overview

Helm is a single Next.js (App Router) application — no separate backend
service, no database. Three request patterns cover everything in the app:

1. **Static/server-rendered pages** — the home dashboard, the Yield
   Reconciliation agent, and the four Concept Preview screens are React
   Server Components. They read synthetic data in-process
   (`lib/data/generate.ts`) and render HTML server-side; there's no client-side
   data fetching to reason about.
2. **A Server Action for the one agent that calls an LLM** — the Daily Shift
   Digest agent's "Generate digest" button invokes a Next.js Server Action
   (`app/agents/shift-digest/actions.ts`, `"use server"`). The browser never
   imports the Anthropic SDK and never sees `ANTHROPIC_API_KEY`; it POSTs to
   Helm's own server, which calls the Anthropic API and returns just the
   result:

   ```
   Browser  →  POST /agents/shift-digest (Next.js RPC, same origin)
            →  Server Action runs on the server
            →  Anthropic API (key from server env only)
            ←  { digest, summary }  — no key, no prompt, no SDK internals
   ```

   This was verified, not assumed: a production build was made with a canary
   key value and grepped across the entire `.next` output (not found
   anywhere, client or server — Next.js reads `process.env` at request time
   rather than inlining it), the client-servable chunks were grepped for the
   system prompt and model ID (not present), and the actual network request
   fired by the "Generate digest" button was inspected in a running instance
   to confirm it hits the same-origin route, never `api.anthropic.com`
   directly.
3. **A deterministic fallback** — if `ANTHROPIC_API_KEY` isn't set, the
   Server Action returns a template digest built from the same aggregated
   shift data instead of calling out. The screen still works with zero
   configuration; the model-generated version is additive, not required.

## Data model

There's no database — `lib/data/generate.ts` seeds an in-memory synthetic
dataset once at server start, using a seeded PRNG (`mulberry32`) so the
numbers are stable across reloads instead of re-randomizing on every request.
The generator is driven entirely by `lib/data/species-specs.ts`:

- **`species_specs`** (`lib/data/species-specs.ts`) — the one hand-authored
  table. Per species (salmon, crab, whitefish, pollock): which production
  lines run it, target yield %, an acceptable variance band, grading tiers,
  and cut/product specs. This is species-*first*: adding a fifth species is
  a new row here, not a new `if` branch anywhere else in the app.
- **Production runs** — generated per date × shift × species × line, with
  intake/output weights. About 1 in 6 runs is deliberately generated outside
  its species' yield tolerance, so the Yield Reconciliation agent has real
  anomalies to flag rather than a suspiciously clean dataset.
- **Lots** — one traceability code per run (`LOT-{species}-{MMDD}-{line}{shift}`),
  the kind of code that would appear on a physical label.
- **Staffing, downtime, QC holds** — generated alongside each run and
  consumed by the Daily Shift Digest agent's aggregation step.

Everything downstream — both live agents, the weekly-yield concept preview —
reads from this same generated dataset. There's one source of truth for
"what happened on the floor," and the agents differ only in how they
summarize it (a sortable table vs. a narrative digest).

## What's live vs. previewed vs. roadmapped

All 25 cards on the home dashboard map to responsibilities from the job
description. Three states, visually distinct (solid blue "Live" badge,
dashed violet "Concept Preview" badge, muted gray "Phase 2" badge):

| State | Count | What it means |
|---|---|---|
| **Live** | 2 | Real logic runs against the synthetic dataset — deterministic comparisons, and one LLM call — and the result is genuinely computed, not scripted. |
| **Concept Preview** | 4 | A real screen, matching the visual system, showing static synthetic data. Demonstrates the design direction for that task without claiming working functionality. One per cadence (Daily/Weekly/Monthly/Annual), each clearly banner-marked inside the screen, not just on the card. |
| **Phase 2** | 19 | Title and description only, shown in the same grid rather than omitted, so the full scope of the role is visible. |

**Live:**
- *Yield Reconciliation Agent* (`/agents/yield`) — deterministic comparison
  of intake vs. output by species/line against `species_specs`, sorted by
  worst variance first, flags runs outside tolerance for review.
- *Daily Shift Digest Agent* (`/agents/shift-digest`) — aggregates yield,
  downtime, QC holds, and labor for one shift and drafts a plain-English
  summary via Claude (deterministic template fallback if no API key).

**Concept Preview:** Cold Storage Temp Monitoring (Daily), Weekly Yield /
Efficiency Report (Weekly), Vendor Performance Review (Monthly), HACCP
Recertification Prep (Annual).

**Phase 2:** the remaining 19 — pre-shift safety walkthrough, QC hold
resolution, lot-code accuracy, labor/overtime reporting, vessel scheduling,
regulatory compliance rollups, and more. See `lib/data/tasks.ts` for the full
list; each entry there is the source of truth for a card.

## Stack

- **Next.js 16 (App Router, Turbopack)** + **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling; brand colors/type extracted from
  tridentseafoods.com's live computed styles (navy `#193a65`, accent blue
  `#0a93d1`) — see Brand below.
- **`@anthropic-ai/sdk`**, used only inside one Server Action, server-side
  only (see Architecture above).
- **No database, no ORM, no auth** — synthetic data lives in memory; there's
  nothing to provision to run this locally.

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

Without a key, that screen still works — it shows a clearly-labeled
template draft instead of the model-generated one.

## Brand

Colors and fonts extracted directly from tridentseafoods.com's rendered
computed styles (navy `#193a65`, accent blue `#0a93d1`), not guessed. Fonts
are free Google Fonts (Archivo/Inter) chosen to match the character of
Trident's licensed `sweet-sans-pro`/`mundial` without reproducing licensed
assets. No Trident logo artwork is reproduced; the header mark is an
original three-prong glyph.

## Synthetic data & disclosure

Every number in this app — production runs, yield percentages, staffing,
downtime, QC holds, vendor scores, cold storage readings — is synthetic,
generated by a seeded random function or hand-authored for a mockup. None of
it is sourced from, or implies knowledge of, Trident Seafoods' actual
operations. A disclosure to that effect appears in the footer of every page,
and `robots.txt` disallows indexing so this doesn't surface in search results.
