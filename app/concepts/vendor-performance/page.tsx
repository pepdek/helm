import Link from "next/link";
import ConceptPreviewBanner from "@/components/ConceptPreviewBanner";

export const metadata = { title: "Vendor Performance Review — Concept Preview" };

type Vendor = {
  name: string;
  category: string;
  score: number; // 0-100, synthetic
  note: string;
};

// ponytail: hand-authored static vendor list for a visual mockup, not a
// real scorecard feed.
const VENDORS: Vendor[] = [
  { name: "Arctic Cold Chain Logistics", category: "Cold-chain freight", score: 94, note: "On-time deliveries, zero temp excursions this quarter." },
  { name: "Kodiak Box & Carton", category: "Packaging", score: 88, note: "Consistent lead times, minor label spec mismatches in May." },
  { name: "Pacific Ice & Cooling", category: "Cold-chain freight", score: 81, note: "Reliable, one late delivery flagged in June." },
  { name: "Northline Packaging Supply", category: "Packaging", score: 72, note: "Two short-shipments this quarter, recommends a check-in." },
  { name: "Bering Strait Freight", category: "Vessel/inbound freight", score: 64, note: "Missed ETA window three times in 60 days, recommends review." },
];

function statusFor(score: number) {
  if (score >= 80) return { label: "On track", className: "bg-emerald-100 text-emerald-800" };
  return { label: "Needs review", className: "bg-amber-100 text-amber-800" };
}

export default function VendorPerformancePage() {
  const ranked = [...VENDORS].sort((a, b) => b.score - a.score);

  return (
    <div className="flex-1">
      <header className="bg-[var(--color-navy)]">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <Link href="/" className="text-xs font-medium text-white/60 hover:text-white">
            &larr; Helm
          </Link>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-extrabold text-white">
            Vendor Performance Review
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Design concept: a monthly scorecard across packaging, cold-chain,
            and freight vendors, ranked lowest-first for the manager to
            decide who needs a conversation.
          </p>
        </div>
      </header>

      <ConceptPreviewBanner />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)] bg-white">
          {ranked.map((v, i) => {
            const status = statusFor(v.score);
            return (
              <div key={v.name} className="flex items-center gap-4 p-4">
                <span className="w-6 shrink-0 text-center font-[family-name:var(--font-display)] text-sm font-bold text-slate-300">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[var(--color-navy)]">{v.name}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">{v.category}</p>
                  <p className="mt-1 text-xs text-slate-500">{v.note}</p>
                  <div className="mt-2 h-1.5 w-full max-w-xs rounded-full bg-slate-100">
                    <div
                      className="h-1.5 rounded-full bg-[var(--color-accent)]"
                      style={{ width: `${v.score}%` }}
                    />
                  </div>
                </div>
                <span className="w-10 shrink-0 text-right font-[family-name:var(--font-display)] text-lg font-extrabold text-[var(--color-navy)]">
                  {v.score}
                </span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
