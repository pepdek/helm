import { getSpeciesSpec } from "@/lib/data/species-specs";
import {
  PRODUCTION_RUNS,
  STAFFING,
  DOWNTIME_EVENTS,
  QC_HOLDS,
} from "@/lib/data/generate";
import { reconcileYield, flaggedFor } from "./yield-reconciliation";

export type ShiftSummary = {
  date: string;
  shift: "AM" | "PM";
  line: string;
  runs: ReturnType<typeof reconcileYield>;
  flags: ReturnType<typeof flaggedFor>;
  staffing: { scheduled: number; actual: number; overtimeHours: number } | null;
  downtimeMinutes: number;
  downtimeReasons: string[];
  qcHolds: { reason: string; resolved: boolean; species: string }[];
};

// Pure aggregation, no model call — this is the data the digest is grounded
// in. Caller passes the same (date, shift, line) triple that shiftKey()
// joins into the picker's URL param — see app/agents/shift-digest/page.tsx,
// which is the one place that decodes it back into these three arguments.
export function aggregateShift(date: string, shift: "AM" | "PM", line: string): ShiftSummary {
  const runs = PRODUCTION_RUNS.filter(
    (r) => r.date === date && r.shift === shift && r.line === line
  );
  const reviewed = reconcileYield(runs);
  // ponytail: .find() assumes one staffing row per (date, shift, line). True
  // for single-species lines, but a shared line (e.g. Line 4 runs both
  // whitefish and pollock) can generate two staffing rows for the same
  // shift — one per species — and this silently keeps only the first. Fine
  // for a demo; if lines start carrying real multi-species staffing, this
  // needs to aggregate like downtime/QC below instead of picking one.
  const staffingEntry = STAFFING.find(
    (s) => s.date === date && s.shift === shift && s.line === line
  );
  const downtime = DOWNTIME_EVENTS.filter(
    (d) => d.date === date && d.shift === shift && d.line === line
  );
  const holds = QC_HOLDS.filter(
    (q) => q.date === date && q.shift === shift && q.line === line
  );

  return {
    date,
    shift,
    line,
    runs: reviewed,
    flags: flaggedFor(reviewed),
    staffing: staffingEntry
      ? {
          scheduled: staffingEntry.scheduled,
          actual: staffingEntry.actual,
          overtimeHours: staffingEntry.overtimeHours,
        }
      : null,
    downtimeMinutes: downtime.reduce((sum, d) => sum + d.minutes, 0),
    downtimeReasons: downtime.map((d) => d.reason),
    qcHolds: holds.map((h) => ({
      reason: h.reason,
      resolved: h.resolved,
      species: getSpeciesSpec(h.species).label,
    })),
  };
}
