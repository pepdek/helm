import { getSpeciesSpec } from "@/lib/data/species-specs";
import { ProductionRun } from "@/lib/data/generate";

export type YieldReview = {
  run: ProductionRun;
  expectedYieldPct: number;
  actualYieldPct: number;
  variancePct: number; // actual - expected, signed
  withinTolerance: boolean;
};

// Deterministic comparison only — no model call. Flags anomalies for a
// manager to review; never resolves or discards them itself.
export function reconcileYield(runs: ProductionRun[]): YieldReview[] {
  return runs
    .map((run) => {
      const spec = getSpeciesSpec(run.species);
      const actualYieldPct = run.outputLbs / run.intakeLbs;
      const variancePct = actualYieldPct - spec.expectedYieldPct;
      return {
        run,
        expectedYieldPct: spec.expectedYieldPct,
        actualYieldPct,
        variancePct,
        withinTolerance: Math.abs(variancePct) <= spec.yieldTolerancePct,
      };
    })
    // Sorted by |variance|, not variance — a run 5pts under target and one
    // 5pts over are equally worth a manager's attention, so both float to
    // the top regardless of which direction they missed.
    .sort((a, b) => Math.abs(b.variancePct) - Math.abs(a.variancePct));
}

export function flaggedFor(reviews: YieldReview[]): YieldReview[] {
  return reviews.filter((r) => !r.withinTolerance);
}
