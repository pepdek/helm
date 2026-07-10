import Link from "next/link";
import { DATES, LATEST_DATE, runsForDate } from "@/lib/data/generate";
import { reconcileYield } from "@/lib/agents/yield-reconciliation";
import { pluralize } from "@/lib/format";

export const metadata = { title: "Yield Reconciliation Agent" };

export default async function YieldAgentPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  // Whitelist against the known generated dates rather than trusting the
  // query param directly — a stale bookmark or hand-edited URL for a date
  // outside the synthetic window falls back to the latest date instead of
  // rendering an empty/broken page.
  const date = DATES.includes(dateParam ?? "") ? (dateParam as string) : LATEST_DATE;

  const reviews = reconcileYield(runsForDate(date));
  const flagged = reviews.filter((r) => !r.withinTolerance);

  return (
    <div className="flex-1">
      <header className="bg-[var(--color-navy)]">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <Link href="/" className="text-xs font-medium text-white/60 hover:text-white">
            &larr; Helm
          </Link>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-extrabold text-white">
            Yield Reconciliation Agent
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Compares raw intake to processed output by species and line
            against each species&apos; target yield. Anomalies outside
            tolerance are flagged for your review &mdash; nothing here is
            auto-resolved.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {DATES.map((d) => (
            <Link
              key={d}
              href={`/agents/yield?date=${d}`}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                d === date
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                  : "border-[var(--color-border)] bg-white text-slate-500 hover:border-[var(--color-accent)]"
              }`}
            >
              {d}
            </Link>
          ))}
        </div>

        <div className="mb-6 rounded-lg border border-[var(--color-border)] bg-white p-4">
          <p className="text-sm text-slate-600">
            {flagged.length === 0
              ? `All ${pluralize(reviews.length, "run")} on ${date} are within tolerance. No review needed.`
              : `Recommends reviewing ${flagged.length} of ${pluralize(reviews.length, "run")} on ${date} — outside their species' yield tolerance.`}
          </p>
        </div>

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
                <tr
                  key={r.run.id}
                  className={`border-b border-[var(--color-border)] last:border-0 ${
                    !r.withinTolerance ? "bg-amber-50" : ""
                  }`}
                >
                  <td className="px-4 py-3">{r.run.shift}</td>
                  <td className="px-4 py-3">{r.run.line}</td>
                  <td className="px-4 py-3 capitalize">{r.run.species}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.run.intakeLbs.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.run.outputLbs.toLocaleString()}</td>
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
                    {r.withinTolerance ? (
                      <span className="text-xs text-slate-400">OK</span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                        Flagged for review
                      </span>
                    )}
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
