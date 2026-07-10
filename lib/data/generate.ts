// ponytail: seeded PRNG (mulberry32) instead of a random-data library —
// deterministic output means the demo looks the same on every reload.
import { SPECIES_SPECS, SpeciesKey } from "./species-specs";

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260709);
const between = (min: number, max: number) => min + rand() * (max - min);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

export type ProductionRun = {
  id: string;
  date: string; // YYYY-MM-DD
  shift: "AM" | "PM";
  line: string;
  species: SpeciesKey;
  intakeLbs: number;
  outputLbs: number;
};

export type Lot = {
  code: string;
  runId: string;
  product: string;
  weightLbs: number;
};

export type StaffingEntry = {
  date: string;
  shift: "AM" | "PM";
  line: string;
  scheduled: number;
  actual: number;
  overtimeHours: number;
};

export type DowntimeEvent = {
  date: string;
  shift: "AM" | "PM";
  line: string;
  minutes: number;
  reason: string;
};

export type QcHold = {
  date: string;
  shift: "AM" | "PM";
  line: string;
  species: SpeciesKey;
  reason: string;
  resolved: boolean;
};

const DAYS = 7;
const today = new Date("2026-07-09");
export const DATES = Array.from({ length: DAYS }, (_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (DAYS - 1 - i));
  return d.toISOString().slice(0, 10);
});
export const LATEST_DATE = DATES[DATES.length - 1];

const DOWNTIME_REASONS = [
  "Filler jam, Line mechanic dispatched",
  "Scheduled sanitation break",
  "Blast freezer temp alarm, reset",
  "Conveyor belt tracking adjustment",
  "Metal detector calibration check",
];

const QC_REASONS = [
  "Weight check below spec, resampling",
  "Foreign material report from packaging",
  "Cold chain temp excursion during transfer",
  "Label lot code mismatch",
];

function buildForRun(run: Omit<ProductionRun, "id" | "outputLbs">, spec: (typeof SPECIES_SPECS)[number]): ProductionRun {
  // Most runs land near target yield; ~1 in 6 drifts outside tolerance to
  // give the reconciliation agent something real to flag.
  const drift = rand() < 0.17
    ? pick([-1, 1]) * between(spec.yieldTolerancePct * 1.4, spec.yieldTolerancePct * 2.5)
    : between(-spec.yieldTolerancePct * 0.7, spec.yieldTolerancePct * 0.7);
  const actualYieldPct = Math.max(0.05, spec.expectedYieldPct + drift);
  return {
    ...run,
    id: `${run.date}-${run.shift}-${run.line}-${run.species}`.replace(/\s+/g, ""),
    outputLbs: Math.round(run.intakeLbs * actualYieldPct),
  };
}

function generateAll() {
  const runs: ProductionRun[] = [];
  const lots: Lot[] = [];
  const staffing: StaffingEntry[] = [];
  const downtime: DowntimeEvent[] = [];
  const qcHolds: QcHold[] = [];

  for (const date of DATES) {
    for (const shift of ["AM", "PM"] as const) {
      for (const spec of SPECIES_SPECS) {
        for (const line of spec.lines) {
          // not every species runs every line every shift
          if (rand() < 0.25) continue;

          const intakeLbs = Math.round(between(4000, 9000));
          const run = buildForRun({ date, shift, line, species: spec.key, intakeLbs }, spec);
          runs.push(run);

          const cut = pick(spec.cutSpecs);
          // e.g. salmon / 2026-07-09 / "Line 2" / PM -> "LOT-SAL-0709-2PM":
          // 3-letter species prefix, MMDD, then the line's digit(s) and shift.
          const lotCode = `LOT-${spec.key.slice(0, 3).toUpperCase()}-${date.slice(5).replace("-", "")}-${line.replace(/\D/g, "")}${shift}`;
          lots.push({
            code: lotCode,
            runId: run.id,
            product: cut.product,
            weightLbs: Math.round(run.outputLbs * between(0.85, 0.98)),
          });

          const scheduled = Math.round(between(8, 16));
          const staffingDrift = rand() < 0.2 ? -Math.round(between(1, 3)) : 0;
          staffing.push({
            date,
            shift,
            line,
            scheduled,
            actual: Math.max(4, scheduled + staffingDrift),
            overtimeHours: rand() < 0.3 ? Math.round(between(1, 6)) : 0,
          });

          if (rand() < 0.22) {
            downtime.push({
              date,
              shift,
              line,
              minutes: Math.round(between(10, 90)),
              reason: pick(DOWNTIME_REASONS),
            });
          }

          if (rand() < 0.15) {
            qcHolds.push({
              date,
              shift,
              line,
              species: spec.key,
              reason: pick(QC_REASONS),
              resolved: rand() < 0.6,
            });
          }
        }
      }
    }
  }

  return { runs, lots, staffing, downtime, qcHolds };
}

const data = generateAll();
export const PRODUCTION_RUNS = data.runs;
export const LOTS = data.lots;
export const STAFFING = data.staffing;
export const DOWNTIME_EVENTS = data.downtime;
export const QC_HOLDS = data.qcHolds;

export function runsForDate(date: string) {
  return PRODUCTION_RUNS.filter((r) => r.date === date);
}

// Pipe-delimited so it round-trips through a URL query param and back via
// a plain .split("|") — see app/agents/shift-digest/page.tsx, which is the
// other half of this contract. Field order (date, shift, line) matters:
// changing it here without updating that split() will silently scramble
// the shift picker.
export function shiftKey(date: string, shift: "AM" | "PM", line: string) {
  return `${date}|${shift}|${line}`;
}

// Plain string sort works because dates are ISO (YYYY-MM-DD) and sort
// lexicographically same as chronologically. .reverse() then does two
// things at once: newest date first, and — because "PM" > "AM"
// alphabetically — PM ends up listed before AM within the same date,
// which happens to match how a manager would actually scan a shift list.
export const AVAILABLE_SHIFTS = Array.from(
  new Set(PRODUCTION_RUNS.map((r) => shiftKey(r.date, r.shift, r.line)))
)
  .sort()
  .reverse();
