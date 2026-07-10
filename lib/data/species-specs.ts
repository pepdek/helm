// ponytail: hand-authored synthetic specs, not real Trident production data.
// Species-first so salmon/crab/whitefish/pollock each carry their own rules
// without branching code — new species just add a row here.

export type SpeciesKey = "salmon" | "crab" | "whitefish" | "pollock";

export type GradingTier = {
  tier: string;
  minWeightOz: number;
  maxWeightOz: number | null; // null = no upper bound
};

export type CutSpec = {
  product: string;
  targetWeightOz: number;
  toleranceOz: number;
};

export type SpeciesSpec = {
  key: SpeciesKey;
  label: string;
  lines: string[]; // production lines that run this species
  expectedYieldPct: number; // output / intake, target
  yieldTolerancePct: number; // +/- band around target before flagging
  gradingTiers: GradingTier[];
  cutSpecs: CutSpec[];
};

export const SPECIES_SPECS: SpeciesSpec[] = [
  {
    key: "salmon",
    label: "Salmon",
    lines: ["Line 1", "Line 2"],
    expectedYieldPct: 0.58,
    yieldTolerancePct: 0.03,
    gradingTiers: [
      { tier: "Superior", minWeightOz: 96, maxWeightOz: null },
      { tier: "Standard", minWeightOz: 64, maxWeightOz: 96 },
      { tier: "Utility", minWeightOz: 0, maxWeightOz: 64 },
    ],
    cutSpecs: [
      { product: "Fillet, skin-on", targetWeightOz: 28, toleranceOz: 2 },
      { product: "Portion, 6oz", targetWeightOz: 6, toleranceOz: 0.4 },
    ],
  },
  {
    key: "crab",
    label: "Crab",
    lines: ["Line 3"],
    expectedYieldPct: 0.32,
    yieldTolerancePct: 0.04,
    gradingTiers: [
      { tier: "Jumbo", minWeightOz: 40, maxWeightOz: null },
      { tier: "Select", minWeightOz: 24, maxWeightOz: 40 },
      { tier: "Split", minWeightOz: 0, maxWeightOz: 24 },
    ],
    cutSpecs: [
      { product: "Whole cooked", targetWeightOz: 32, toleranceOz: 3 },
      { product: "Clusters", targetWeightOz: 12, toleranceOz: 1.5 },
    ],
  },
  {
    key: "whitefish",
    label: "Whitefish",
    lines: ["Line 2", "Line 4"],
    expectedYieldPct: 0.42,
    yieldTolerancePct: 0.035,
    gradingTiers: [
      { tier: "Grade A", minWeightOz: 32, maxWeightOz: null },
      { tier: "Grade B", minWeightOz: 16, maxWeightOz: 32 },
      { tier: "Grade C", minWeightOz: 0, maxWeightOz: 16 },
    ],
    cutSpecs: [
      { product: "Fillet, boneless", targetWeightOz: 8, toleranceOz: 0.75 },
      { product: "Loin", targetWeightOz: 5, toleranceOz: 0.5 },
    ],
  },
  {
    key: "pollock",
    label: "Pollock",
    lines: ["Line 4", "Line 5"],
    expectedYieldPct: 0.36,
    yieldTolerancePct: 0.03,
    gradingTiers: [
      { tier: "Grade A", minWeightOz: 20, maxWeightOz: null },
      { tier: "Grade B", minWeightOz: 10, maxWeightOz: 20 },
      { tier: "Grade C", minWeightOz: 0, maxWeightOz: 10 },
    ],
    cutSpecs: [
      { product: "Block, 16.5oz", targetWeightOz: 16.5, toleranceOz: 0.5 },
      { product: "Surimi", targetWeightOz: 25, toleranceOz: 2 },
    ],
  },
];

export function getSpeciesSpec(key: SpeciesKey): SpeciesSpec {
  const spec = SPECIES_SPECS.find((s) => s.key === key);
  if (!spec) throw new Error(`Unknown species: ${key}`);
  return spec;
}
