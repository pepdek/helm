import { ImpactStat } from "@/lib/impact";

// Reuses the exact card/label/disclosure classes already established by the
// yield summary card and DigestPanel's details block — no new visual
// pattern introduced for this.
export default function ImpactStrip({
  stats,
  methodology,
}: {
  stats: ImpactStat[];
  methodology: string;
}) {
  return (
    <div className="mb-6 rounded-lg border border-[var(--color-border)] bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">Estimated impact</p>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-xs uppercase tracking-wide text-slate-400">{s.label}</p>
            <p className="mt-1 text-sm text-[var(--color-navy)]">{s.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-slate-400">
        Illustrative estimate, not a measured result — the time shown above is real, the
        manual-work comparison is a stated assumption.
      </p>
      <details className="mt-2 text-[11px] text-slate-400">
        <summary className="cursor-pointer font-medium text-slate-500">How this is estimated</summary>
        <p className="mt-1">{methodology}</p>
      </details>
    </div>
  );
}
