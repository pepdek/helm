import Link from "next/link";
import ConceptPreviewBanner from "@/components/ConceptPreviewBanner";

export const metadata = { title: "Cold Storage Temp Monitoring — Concept Preview" };

type Unit = {
  name: string;
  targetF: number;
  maxF: number;
  readings: number[]; // 24 hourly readings, synthetic
  flaggedHour: number | null;
};

// ponytail: hand-authored static readings for a visual mockup, not a real
// sensor feed or charting library — one <svg> polyline per unit.
const UNITS: Unit[] = [
  {
    name: "Blast Freezer 1",
    targetF: -10,
    maxF: -5,
    readings: [-11, -12, -11, -10, -10, -11, -12, -11, -10, -9, -10, -11, -10, -3, -2, -6, -9, -11, -12, -11, -10, -10, -11, -12],
    flaggedHour: 14,
  },
  {
    name: "Cold Storage A",
    targetF: 34,
    maxF: 38,
    readings: [33, 33, 34, 34, 35, 34, 33, 34, 35, 34, 33, 34, 35, 34, 34, 33, 34, 35, 34, 33, 34, 35, 34, 33],
    flaggedHour: null,
  },
  {
    name: "Cold Storage B",
    targetF: 28,
    maxF: 32,
    readings: [27, 28, 28, 29, 28, 27, 28, 29, 30, 29, 28, 27, 28, 29, 28, 27, 28, 29, 28, 27, 28, 29, 28, 27],
    flaggedHour: null,
  },
];

function TempChart({ unit }: { unit: Unit }) {
  const w = 640;
  const h = 110;
  const pad = 8;
  const lo = Math.min(...unit.readings, unit.targetF) - 2;
  const hi = Math.max(...unit.readings, unit.maxF) + 2;
  const x = (i: number) => pad + (i / (unit.readings.length - 1)) * (w - pad * 2);
  const y = (v: number) => h - pad - ((v - lo) / (hi - lo)) * (h - pad * 2);
  const points = unit.readings.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const maxY = y(unit.maxF);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <line x1={pad} y1={maxY} x2={w - pad} y2={maxY} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1} />
      <polyline points={points} fill="none" stroke="var(--color-accent)" strokeWidth={2} />
      {unit.flaggedHour !== null && (
        <circle cx={x(unit.flaggedHour)} cy={y(unit.readings[unit.flaggedHour])} r={5} fill="#b45309" />
      )}
    </svg>
  );
}

export default function ColdStoragePage() {
  return (
    <div className="flex-1">
      <header className="bg-[var(--color-navy)]">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <Link href="/" className="text-xs font-medium text-white/60 hover:text-white">
            &larr; Helm
          </Link>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-extrabold text-white">
            Cold Storage Temp Monitoring
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Design concept: a sensor feed per cold storage unit, dashed
            threshold line, excursions called out for the shift lead to
            check in person.
          </p>
        </div>
      </header>

      <ConceptPreviewBanner />

      <main className="mx-auto max-w-5xl px-6 py-8 space-y-5">
        {UNITS.map((unit) => (
          <div key={unit.name} className="rounded-lg border border-[var(--color-border)] bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-navy)]">
                  {unit.name}
                </h2>
                <p className="text-xs text-slate-400">
                  Target {unit.targetF}&deg;F &middot; threshold {unit.maxF}&deg;F &middot; dashed line marks threshold
                </p>
              </div>
              {unit.flaggedHour !== null ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                  Excursion flagged &middot; hour {unit.flaggedHour}:00
                </span>
              ) : (
                <span className="text-xs text-slate-400">Within range</span>
              )}
            </div>
            <TempChart unit={unit} />
          </div>
        ))}
      </main>
    </div>
  );
}
