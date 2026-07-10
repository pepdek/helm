// Illustrative "what this replaces" estimates for the two live agents.
//
// Only the *actual* side of each comparison is a real measurement (compute
// time for the reconciliation, wall-clock time for the digest call). The
// manual-baseline side is a stated assumption, not observed data — the
// constants below are the whole of that assumption, deliberately kept in
// one place so they're easy to see and to change.
//
// This is a pitch aid, not a productivity study. Every string this module
// produces should read as an estimate, and the UI that renders them says so
// explicitly — see components/ImpactStrip.tsx.

const YIELD_MANUAL_MINUTES_PER_RUN = 3; // pull scale ticket, look up target, calculate %, log it — per run, by hand
const YIELD_MANUAL_STEPS_PER_RUN = 4;
const YIELD_ROLLUP_DELAY_DAYS = 6; // days until the next scheduled (weekly) yield report would have surfaced the same anomaly

const DIGEST_MANUAL_MINUTES = 15; // pull the yield report, downtime log, QC hold list, and labor sheet, then write it up
const DIGEST_MANUAL_SOURCES = 4;
const DIGEST_DELAY_HOURS = 12; // typical gap between shift-end and the next stand-up where a hand-compiled digest would otherwise surface

export type ImpactStat = { label: string; value: string };

// Sub-second results are the common case for both agents (the fallback
// digest template resolves in well under a second, same as the
// reconciliation compute). Formatting those as "0.0s" reads as a broken
// measurement rather than a fast one, so anything under a second is shown
// in milliseconds instead.
function formatDuration(ms: number): string {
  return ms < 1000 ? `${Math.max(1, Math.round(ms))}ms` : `${(ms / 1000).toFixed(1)}s`;
}

export function yieldImpact(runCount: number, flaggedCount: number, actualMs: number): ImpactStat[] {
  const manualMinutes = runCount * YIELD_MANUAL_MINUTES_PER_RUN;
  return [
    {
      label: "Time saved",
      value: `${manualMinutes} min of manual spot-checking → ${formatDuration(actualMs)} here`,
    },
    {
      label: "Steps reduced",
      value: `${YIELD_MANUAL_STEPS_PER_RUN} manual steps per run → 1 page view`,
    },
    {
      label: "Delay avoided",
      value:
        flaggedCount > 0
          ? `${flaggedCount} flagged same-shift, not at next week's rollup — up to ${YIELD_ROLLUP_DELAY_DAYS} days sooner`
          : `Same-shift visibility either way — nothing waits for next week's rollup`,
    },
  ];
}

export function digestImpact(actualMs: number): ImpactStat[] {
  return [
    {
      label: "Time saved",
      value: `${formatDuration(actualMs)} here vs. an estimated ${DIGEST_MANUAL_MINUTES} min of manual compilation`,
    },
    {
      label: "Steps reduced",
      value: `${DIGEST_MANUAL_SOURCES} sources cross-referenced by hand → 1 click`,
    },
    {
      label: "Delay avoided",
      value: `Ready at shift-end instead of next check-in — avoids up to ${DIGEST_DELAY_HOURS}h of delay`,
    },
  ];
}
