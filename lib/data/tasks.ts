export type Cadence = "Daily" | "Weekly" | "Monthly" | "Annual";

export type Category =
  | "Production & Yield"
  | "Quality & Traceability"
  | "Safety & Compliance"
  | "Equipment & Maintenance"
  | "Staffing & Labor"
  | "Reporting & Documentation";

export type TaskCard = {
  title: string;
  category: Category;
  cadence: Cadence; // secondary metadata, shown as a small tag on the card
  // Three states internally (drives real behavior: preview cards are
  // clickable, phase2 cards aren't), but the badge a viewer sees collapses
  // "preview" and "phase2" into one "Planned" treatment — see
  // components/TaskCardItem.tsx.
  status: "live" | "preview" | "phase2";
  href?: string;
  blurb: string;
};

// The 25 responsibilities from the JD, grouped by domain the way a plant
// manager actually scans a dashboard, not by how often each task runs.
// Two are wired to working agent screens, four have static Concept Preview
// screens, the rest are roadmapped, not hidden.
export const TASK_CARDS: TaskCard[] = [
  // Production & Yield (4)
  //
  // Two of these map to the live agents. Both pull from the same
  // reconcileYield() output, so the split is by *use case*, not by data
  // source: "reconcile intake vs. throughput" is what a manager opens
  // mid-shift to inspect every run in a sortable table, while "overnight
  // yield vs. target" is what they read once at 6am as a narrative that
  // also folds in downtime, QC, and labor. If a third live agent gets
  // built, decide which of these two experiences it's closer to before
  // picking its card.
  {
    title: "Reconcile raw intake vs. throughput",
    category: "Production & Yield",
    cadence: "Daily",
    status: "live",
    href: "/agents/yield",
    blurb: "Compares intake to processed output by species and line, flags what's outside tolerance for a second look.",
  },
  {
    title: "Overnight yield vs. target by species",
    category: "Production & Yield",
    cadence: "Daily",
    status: "live",
    href: "/agents/shift-digest",
    blurb: "Plain-English digest of the overnight shift's yield, downtime, QC, and labor.",
  },
  {
    title: "Weekly yield / efficiency report",
    category: "Production & Yield",
    cadence: "Weekly",
    status: "preview",
    href: "/concepts/weekly-yield",
    blurb: "Rolls up daily reconciliation into a week-over-week trend, so a drifting species shows up early.",
  },
  {
    title: "Inbound vessel / delivery scheduling",
    category: "Production & Yield",
    cadence: "Weekly",
    status: "phase2",
    blurb: "Matches vessel ETAs against open line capacity, so an early delivery isn't discovered dockside.",
  },

  // Quality & Traceability (4)
  {
    title: "Lot-code / label accuracy",
    category: "Quality & Traceability",
    cadence: "Daily",
    status: "phase2",
    blurb: "Cross-checks the code on the printed label against the traceability record before a pallet leaves the floor.",
  },
  {
    title: "QC hold resolution",
    category: "Quality & Traceability",
    cadence: "Daily",
    status: "phase2",
    blurb: "Open holds aged by hours on the floor, routed to whoever has to release or reject the lot.",
  },
  {
    title: "Packaging / label inventory review",
    category: "Quality & Traceability",
    cadence: "Weekly",
    status: "phase2",
    blurb: "Checks packaging and label stock against next week's run schedule, before a line runs out mid-shift.",
  },
  {
    title: "Outbound shipment cross-check",
    category: "Quality & Traceability",
    cadence: "Weekly",
    status: "phase2",
    blurb: "Matches the outbound order against its lot codes before the truck leaves the dock.",
  },

  // Safety & Compliance (6)
  {
    title: "Pre-shift safety / food-safety walkthrough",
    category: "Safety & Compliance",
    cadence: "Daily",
    status: "phase2",
    blurb: "Photo-documented checklist at line start, routed to the shift lead for sign-off before product runs.",
  },
  {
    title: "Cold storage temp monitoring",
    category: "Safety & Compliance",
    cadence: "Daily",
    status: "preview",
    href: "/concepts/cold-storage",
    blurb: "Sensor feed with excursion alerts routed to the shift lead.",
  },
  {
    title: "Sanitation / pest log audit",
    category: "Safety & Compliance",
    cadence: "Weekly",
    status: "phase2",
    blurb: "Flags a missed sanitation log entry before an inspector finds the gap instead.",
  },
  {
    title: "Safety committee review",
    category: "Safety & Compliance",
    cadence: "Weekly",
    status: "phase2",
    blurb: "Pulls the week's incident log into an agenda before the safety committee sits down.",
  },
  {
    title: "Regulatory compliance status (FDA, ADFG, ADEC)",
    category: "Safety & Compliance",
    cadence: "Monthly",
    status: "phase2",
    blurb: "Rolls up open items across FDA, Alaska Dept of Fish and Game, and ADEC into one status, not three inboxes.",
  },
  {
    title: "HACCP recertification prep",
    category: "Safety & Compliance",
    cadence: "Annual",
    status: "preview",
    href: "/concepts/haccp-recert",
    blurb: "Checklist and document trail toward recertification, so nothing surfaces a week before the audit.",
  },

  // Equipment & Maintenance (4)
  {
    title: "Equipment downtime / maintenance response",
    category: "Equipment & Maintenance",
    cadence: "Daily",
    status: "phase2",
    blurb: "Logs the stoppage reason at the line and flags repeat faults for a maintenance ticket, not just a log entry.",
  },
  {
    title: "Preventive maintenance review",
    category: "Equipment & Maintenance",
    cadence: "Monthly",
    status: "phase2",
    blurb: "Cross-checks the upcoming PM schedule against what actually broke down last month.",
  },
  {
    title: "Energy usage vs. volume",
    category: "Equipment & Maintenance",
    cadence: "Monthly",
    status: "phase2",
    blurb: "Normalizes energy draw against processed volume, so a spike reads as a signal, not just a bigger bill.",
  },
  {
    title: "Capital equipment planning",
    category: "Equipment & Maintenance",
    cadence: "Annual",
    status: "phase2",
    blurb: "Feeds equipment age and downtime history into next year's capex list, ranked by what's actually failing.",
  },

  // Staffing & Labor (4)
  {
    title: "Shift staffing by species run",
    category: "Staffing & Labor",
    cadence: "Daily",
    status: "phase2",
    blurb: "Flags a line that's short-staffed for its scheduled species run before the shift starts, not after.",
  },
  {
    title: "Labor hours / overtime vs. output",
    category: "Staffing & Labor",
    cadence: "Weekly",
    status: "phase2",
    blurb: "Plots overtime hours against output per line, so a costly shift shows up before payroll closes.",
  },
  {
    title: "Labor turnover analysis",
    category: "Staffing & Labor",
    cadence: "Monthly",
    status: "phase2",
    blurb: "Flags a line losing people faster than the rest of the plant, before it becomes a staffing crisis.",
  },
  {
    title: "Peak-season staffing ramp-up",
    category: "Staffing & Labor",
    cadence: "Annual",
    status: "phase2",
    blurb: "Plans seasonal headcount against forecast run volume, months before the season actually ramps up.",
  },

  // Reporting & Documentation (3)
  {
    title: "Production / financial performance vs. budget",
    category: "Reporting & Documentation",
    cadence: "Monthly",
    status: "phase2",
    blurb: "Rolls production cost and output up against the monthly budget line, by plant and by species.",
  },
  {
    title: "Vendor performance review",
    category: "Reporting & Documentation",
    cadence: "Monthly",
    status: "preview",
    href: "/concepts/vendor-performance",
    blurb: "Scorecards for packaging, cold-chain, and freight vendors, ranked by who needs a conversation.",
  },
  {
    title: "Sustainability / traceability reporting",
    category: "Reporting & Documentation",
    cadence: "Annual",
    status: "phase2",
    blurb: "Rolls a year of lot-level traceability data into the report a sustainability certifier actually asks for.",
  },
];

export const CATEGORIES: Category[] = [
  "Production & Yield",
  "Quality & Traceability",
  "Safety & Compliance",
  "Equipment & Maintenance",
  "Staffing & Labor",
  "Reporting & Documentation",
];

// Anchor id for a category's section on the home grid, e.g. for the
// Yield Reconciliation agent's cross-reference link to Lot-Code / Label
// Accuracy (Quality & Traceability). Kept here, next to CATEGORIES, so
// there's one slug rule instead of each caller reimplementing it.
export function categorySlug(category: Category): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
