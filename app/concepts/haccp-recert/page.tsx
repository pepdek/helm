import Link from "next/link";
import ConceptPreviewBanner from "@/components/ConceptPreviewBanner";
import { LATEST_DATE } from "@/lib/data/generate";

export const metadata = { title: "HACCP Recertification Prep — Concept Preview" };

type ChecklistItem = {
  label: string;
  status: "done" | "in-progress" | "not-started";
};

// ponytail: hand-authored static checklist for a visual mockup, not a real
// compliance tracker.
const RECERT_DATE = "2026-11-15";
const CHECKLIST: ChecklistItem[] = [
  { label: "Hazard analysis review", status: "done" },
  { label: "Critical control points re-validated", status: "done" },
  { label: "Monitoring procedures updated", status: "done" },
  { label: "Staff HACCP refresher training", status: "in-progress" },
  { label: "Recordkeeping audit", status: "not-started" },
  { label: "Third-party mock audit scheduled", status: "not-started" },
];

const STATUS_META = {
  done: { label: "Done", dot: "bg-emerald-500", text: "text-emerald-700" },
  "in-progress": { label: "In progress", dot: "bg-amber-500", text: "text-amber-700" },
  "not-started": { label: "Not started", dot: "bg-slate-300", text: "text-slate-400" },
};

function daysBetween(from: string, to: string) {
  const ms = new Date(to).getTime() - new Date(from).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export default function HaccpRecertPage() {
  const doneCount = CHECKLIST.filter((i) => i.status === "done").length;
  const progressPct = Math.round((doneCount / CHECKLIST.length) * 100);
  const daysLeft = daysBetween(LATEST_DATE, RECERT_DATE);

  return (
    <div className="flex-1">
      <header className="bg-[var(--color-navy)]">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <Link href="/" className="text-xs font-medium text-white/60 hover:text-white">
            &larr; Helm
          </Link>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-extrabold text-white">
            HACCP Recertification Prep
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Design concept: a running checklist toward the next
            recertification date, so nothing gets discovered a week before
            the audit.
          </p>
        </div>
      </header>

      <ConceptPreviewBanner />

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6 rounded-lg border border-[var(--color-border)] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Recertification target</p>
              <p className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-navy)]">
                {RECERT_DATE} &middot; {daysLeft} days out
              </p>
            </div>
            <p className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-[var(--color-accent)]">
              {progressPct}%
            </p>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-[var(--color-accent)]" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <div className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)] bg-white">
          {CHECKLIST.map((item) => {
            const meta = STATUS_META[item.status];
            return (
              <div key={item.label} className="flex items-center gap-3 p-4">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${meta.dot}`} />
                <span className="flex-1 text-sm text-[var(--color-navy)]">{item.label}</span>
                <span className={`text-xs font-medium ${meta.text}`}>{meta.label}</span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
