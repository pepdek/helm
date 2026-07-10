export type Cadence = "Daily" | "Weekly" | "Monthly" | "Annual";

export type TaskCard = {
  title: string;
  cadence: Cadence;
  status: "live" | "preview" | "phase2";
  href?: string;
  blurb: string;
};

// The 25 responsibilities from the JD, grouped by cadence. Two are wired to
// working agent screens, four have static Concept Preview screens (one per
// cadence), the rest are roadmapped, not hidden.
export const TASK_CARDS: TaskCard[] = [
  // Daily (8)
  {
    title: "Overnight yield vs. target by species",
    cadence: "Daily",
    status: "live",
    href: "/agents/shift-digest",
    blurb: "Plain-English digest of the overnight shift's yield, downtime, QC, and labor.",
  },
  {
    title: "Pre-shift safety / food-safety walkthrough",
    cadence: "Daily",
    status: "phase2",
    blurb: "Checklist-driven walkthrough with photo capture and sign-off.",
  },
  {
    title: "Reconcile raw intake vs. throughput",
    cadence: "Daily",
    status: "live",
    href: "/agents/yield",
    blurb: "Compares intake to processed output by species/line, flags anomalies.",
  },
  {
    title: "Cold storage temp monitoring",
    cadence: "Daily",
    status: "preview",
    href: "/concepts/cold-storage",
    blurb: "Sensor feed with excursion alerts routed to the shift lead.",
  },
  {
    title: "Shift staffing by species run",
    cadence: "Daily",
    status: "phase2",
    blurb: "Matches scheduled headcount to the species/lines running that shift.",
  },
  {
    title: "QC hold resolution",
    cadence: "Daily",
    status: "phase2",
    blurb: "Queue of open holds with aging, routed for manager sign-off.",
  },
  {
    title: "Lot-code / label accuracy",
    cadence: "Daily",
    status: "phase2",
    blurb: "Cross-checks printed lot codes against the traceability record.",
  },
  {
    title: "Equipment downtime / maintenance response",
    cadence: "Daily",
    status: "phase2",
    blurb: "Logs downtime events and suggested maintenance follow-up.",
  },

  // Weekly (7)
  {
    title: "Weekly yield / efficiency report",
    cadence: "Weekly",
    status: "preview",
    href: "/concepts/weekly-yield",
    blurb: "Rolls up daily reconciliation into a week-over-week trend view.",
  },
  {
    title: "Labor hours / overtime vs. output",
    cadence: "Weekly",
    status: "phase2",
    blurb: "Overtime spend plotted against output to flag inefficient runs.",
  },
  {
    title: "Inbound vessel / delivery scheduling",
    cadence: "Weekly",
    status: "phase2",
    blurb: "Vessel ETAs matched against line capacity for the coming week.",
  },
  {
    title: "Safety committee review",
    cadence: "Weekly",
    status: "phase2",
    blurb: "Agenda and incident log prep for the weekly safety meeting.",
  },
  {
    title: "Sanitation / pest log audit",
    cadence: "Weekly",
    status: "phase2",
    blurb: "Reviews sanitation logs for gaps ahead of inspection.",
  },
  {
    title: "Packaging / label inventory review",
    cadence: "Weekly",
    status: "phase2",
    blurb: "Tracks packaging stock against the upcoming run schedule.",
  },
  {
    title: "Outbound shipment cross-check",
    cadence: "Weekly",
    status: "phase2",
    blurb: "Matches outbound orders against lot codes before dispatch.",
  },

  // Monthly (6)
  {
    title: "Production / financial performance vs. budget",
    cadence: "Monthly",
    status: "phase2",
    blurb: "Output and cost rolled up against the monthly budget line.",
  },
  {
    title: "Preventive maintenance review",
    cadence: "Monthly",
    status: "phase2",
    blurb: "Upcoming PM schedule cross-checked against downtime history.",
  },
  {
    title: "Regulatory compliance status (FDA, ADFG, ADEC)",
    cadence: "Monthly",
    status: "phase2",
    blurb: "Rolls up open items across FDA, Alaska Dept of Fish and Game, ADEC.",
  },
  {
    title: "Labor turnover analysis",
    cadence: "Monthly",
    status: "phase2",
    blurb: "Turnover by line and shift, flagged for retention follow-up.",
  },
  {
    title: "Energy usage vs. volume",
    cadence: "Monthly",
    status: "phase2",
    blurb: "Energy draw normalized against processed volume.",
  },
  {
    title: "Vendor performance review",
    cadence: "Monthly",
    status: "preview",
    href: "/concepts/vendor-performance",
    blurb: "Scorecards for packaging, cold-chain, and supply vendors.",
  },

  // Annual (4)
  {
    title: "Peak-season staffing ramp-up",
    cadence: "Annual",
    status: "phase2",
    blurb: "Seasonal headcount plan against forecast run volume.",
  },
  {
    title: "HACCP recertification prep",
    cadence: "Annual",
    status: "preview",
    href: "/concepts/haccp-recert",
    blurb: "Document and training checklist ahead of recertification.",
  },
  {
    title: "Capital equipment planning",
    cadence: "Annual",
    status: "phase2",
    blurb: "Equipment age and downtime history feeding next year's capex list.",
  },
  {
    title: "Sustainability / traceability reporting",
    cadence: "Annual",
    status: "phase2",
    blurb: "Annual traceability rollup for sustainability certification.",
  },
];

export const CADENCES: Cadence[] = ["Daily", "Weekly", "Monthly", "Annual"];
