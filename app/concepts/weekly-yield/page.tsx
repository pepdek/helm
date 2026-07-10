import Link from "next/link";
import ConceptPreviewBanner from "@/components/ConceptPreviewBanner";
import { SPECIES_SPECS } from "@/lib/data/species-specs";

export const metadata = { title: "Weekly Yield / Efficiency Report — Concept Preview" };

const WEEKS = ["Wk of 6/15", "Wk of 6/22", "Wk of 6/29", "Wk of 7/6"];

// ponytail: hand-authored static weekly averages for a visual mockup — the
// live Yield Reconciliation agent computes real per-run numbers; this is
// what the rolled-up week-over-week view would look like.
const WEEKLY_YIELD: Record<string, number[]> = {
  salmon: [57.1, 58.4, 55.9, 58.6],
  crab: [31.0, 33.1, 32.4, 30.8],
  whitefish: [41.8, 40.5, 42.6, 43.0],
  pollock: [35.2, 36.9, 34.8, 36.1],
};

const SPECIES_COLOR: Record<string, string> = {
  salmon: "var(--color-navy)",
  crab: "var(--color-accent)",
  whitefish: "#7c8ba1",
  pollock: "#0e2340",
};

const MAX_SCALE = 65; // chart ceiling, %

export default function WeeklyYieldPage() {
  return (
    <div className="flex-1">
      <header className="bg-[var(--color-navy)]">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <Link href="/" className="text-xs font-medium text-white/60 hover:text-white">
            &larr; Helm
          </Link>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-extrabold text-white">
            Weekly Yield / Efficiency Report
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Design concept: the Yield Reconciliation agent&apos;s daily flags
            rolled up into a week-over-week trend, so a drifting species
            shows up before it&apos;s a monthly problem.
          </p>
        </div>
      </header>

      <ConceptPreviewBanner />

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-lg border border-[var(--color-border)] bg-white p-5">
          <div className="mb-5 flex flex-wrap gap-4">
            {SPECIES_SPECS.map((s) => (
              <div key={s.key} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: SPECIES_COLOR[s.key] }} />
                {s.label}
              </div>
            ))}
          </div>

          <div className="flex items-end justify-around gap-4" style={{ height: 200 }}>
            {WEEKS.map((week, wi) => (
              <div key={week} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-[160px] items-end gap-1.5">
                  {SPECIES_SPECS.map((s) => {
                    const value = WEEKLY_YIELD[s.key][wi];
                    return (
                      <div
                        key={s.key}
                        title={`${s.label}: ${value}%`}
                        className="w-5 rounded-t-sm"
                        style={{
                          height: `${(value / MAX_SCALE) * 160}px`,
                          background: SPECIES_COLOR[s.key],
                        }}
                      />
                    );
                  })}
                </div>
                <span className="text-[11px] text-slate-400">{week}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg border border-[var(--color-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">Species</th>
                {WEEKS.map((w) => (
                  <th key={w} className="px-4 py-3 text-right">{w}</th>
                ))}
                <th className="px-4 py-3 text-right">Target</th>
              </tr>
            </thead>
            <tbody>
              {SPECIES_SPECS.map((s) => (
                <tr key={s.key} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-3 capitalize">{s.label}</td>
                  {WEEKLY_YIELD[s.key].map((v, i) => (
                    <td key={i} className="px-4 py-3 text-right tabular-nums">{v.toFixed(1)}%</td>
                  ))}
                  <td className="px-4 py-3 text-right tabular-nums text-slate-400">
                    {(s.expectedYieldPct * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
