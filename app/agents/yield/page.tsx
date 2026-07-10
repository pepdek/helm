import Link from "next/link";
import { DATES, LATEST_DATE, runsForDate } from "@/lib/data/generate";
import { reconcileYield } from "@/lib/agents/yield-reconciliation";
import { pluralize } from "@/lib/format";
import { yieldImpact } from "@/lib/impact";
import { categorySlug } from "@/lib/data/tasks";
import ImpactStrip from "@/components/ImpactStrip";
import AppBar from "@/components/AppBar";

export const metadata = { title: "Yield Reconciliation Agent" };

function CalendarStrip({ selected }: { selected: string }) {
  return (
    <div className="mb-6 flex gap-2">
      {DATES.map((d) => {
        // Parsed as local midnight, not UTC, so the day-of-week label can't
        // drift a day off from what's in the date string.
        const dt = new Date(`${d}T00:00:00`);
        const active = d === selected;
        return (
          <Link
            key={d}
            href={`/agents/yield?date=${d}`}
            className={`flex w-16 flex-col items-center rounded-lg border py-2 transition ${
              active
                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                : "border-[var(--color-border)] bg-white text-slate-500 hover:border-[var(--color-accent)]"
            }`}
          >
            <span className={`text-[10px] font-medium uppercase tracking-wide ${active ? "text-white/80" : "text-slate-400"}`}>
              {dt.toLocaleDateString("en-US", { weekday: "short" })}
            </span>
            <span className="font-[family-name:var(--font-display)] text-lg font-bold leading-tight">
              {dt.getDate()}
            </span>
            <span className={`text-[10px] ${active ? "text-white/80" : "text-slate-400"}`}>
              {dt.toLocaleDateString("en-US", { month: "short" })}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default async function YieldAgentPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  // Whitelist against the known generated dates rather than trusting the
  // query param directly. A stale bookmark or hand-edited URL for a date
  // outside the synthetic window falls back to the latest date instead of
  // rendering an empty/broken page.
  const date = DATES.includes(dateParam ?? "") ? (dateParam as string) : LATEST_DATE;

  const reviews = reconcileYield(runsForDate(date));
  const flagged = reviews.filter((r) => !r.withinTolerance);

  return (
    <div className="flex-1">
      <AppBar />

      <main className="mx-auto max-w-5xl px-6 py-8">
        <Link href="/" className="text-xs font-medium text-slate-400 hover:text-[var(--color-navy)]">
          &larr; Helm
        </Link>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-extrabold text-[var(--color-navy)]">
          Yield Reconciliation Agent
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Compares raw intake to processed output by species and line
          against each species&apos; target yield. Anomalies outside
          tolerance are flagged for your review, nothing here is
          auto-resolved.
        </p>
        <p className="mt-2 max-w-2xl text-xs text-slate-400">
          Related: a flagged run and a mislabeled pallet often trace back to
          the same lot, see{" "}
          <Link href={`/#${categorySlug("Quality & Traceability")}`} className="underline hover:text-[var(--color-navy)]">
            Lot-Code / Label Accuracy
          </Link>
          .
        </p>

        <div className="mt-6">
          <CalendarStrip selected={date} />
        </div>

        <div className="mb-6 rounded-lg border border-[var(--color-border)] bg-white p-4">
          <p className="text-sm text-slate-600">
            {flagged.length === 0
              ? `All ${pluralize(reviews.length, "run")} on ${date} are within tolerance. No review needed.`
              : `Recommends reviewing ${flagged.length} of ${pluralize(reviews.length, "run")} on ${date}, outside their species' yield tolerance.`}
          </p>
        </div>

        <ImpactStrip
          stats={yieldImpact(reviews.length, flagged.length)}
          methodology={`${reviews.length} runs x an assumed 3 minutes of manual spot-checking each (pull the scale ticket, look up the species target, calculate the yield %, log the result).`}
        />

        <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">Shift</th>
                <th className="px-4 py-3">Line</th>
                <th className="px-4 py-3">Species</th>
                <th className="px-4 py-3 text-right">Intake (lb)</th>
                <th className="px-4 py-3 text-right">Output (lb)</th>
                <th className="px-4 py-3 text-right">Actual yield</th>
                <th className="px-4 py-3 text-right">Target</th>
                <th className="px-4 py-3 text-right">Variance</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.run.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-3">{r.run.shift}</td>
                  <td className="px-4 py-3">{r.run.line}</td>
                  <td className="px-4 py-3 capitalize">{r.run.species}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.run.intakeLbs.toLocaleString()} lb</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.run.outputLbs.toLocaleString()} lb</td>
                  <td className="px-4 py-3 text-right tabular-nums">{(r.actualYieldPct * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-400">{(r.expectedYieldPct * 100).toFixed(1)}%</td>
                  <td
                    className={`px-4 py-3 text-right tabular-nums font-medium ${
                      r.withinTolerance ? "text-slate-500" : "text-amber-700"
                    }`}
                  >
                    {r.variancePct > 0 ? "+" : ""}
                    {(r.variancePct * 100).toFixed(1)}pt
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${r.withinTolerance ? "bg-slate-300" : "bg-amber-500"}`}
                      />
                      <span className={r.withinTolerance ? "text-slate-400" : "font-semibold text-amber-700"}>
                        {r.withinTolerance ? "OK" : "Flagged for review"}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-sm text-slate-400">
                    No production runs logged for {date}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
