import { ImpactStat } from "@/lib/impact";

// Reuses the exact card/label classes already established by the yield
// summary card and DigestPanel's details block, no new visual pattern
// introduced for this.
export default function ImpactStrip({
  stats,
  methodology,
}: {
  stats: ImpactStat[];
  methodology: string;
}) {
  return (
    <div className="mb-6 rounded-lg border border-[var(--color-border)] bg-white p-4">
      <div className="flex items-center gap-1.5">
        <p className="text-xs uppercase tracking-wide text-slate-400">Estimated impact</p>
        {/* Native title attribute, not a JS-driven tooltip, one hover target
            instead of a full disclosure sentence repeated on every screen
            that renders this. */}
        <span
          title="Illustrative estimate, not a measured result. The manual-work comparison is a stated assumption, not a benchmark."
          aria-label="Illustrative estimate, not a measured result. The manual-work comparison is a stated assumption, not a benchmark."
          className="cursor-help text-slate-300 hover:text-slate-400"
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm.75 12h-1.5V7h1.5v5Zm0-6.5h-1.5V4h1.5v1.5Z" />
          </svg>
        </span>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-xs uppercase tracking-wide text-slate-400">{s.label}</p>
            <p className="mt-1 text-sm text-[var(--color-navy)]">{s.value}</p>
          </div>
        ))}
      </div>
      <details className="mt-3 text-[11px] text-slate-400">
        <summary className="cursor-pointer font-medium text-slate-500">How this is estimated</summary>
        <p className="mt-1">{methodology}</p>
      </details>
    </div>
  );
}
