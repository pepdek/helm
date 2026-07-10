import Link from "next/link";
import { AVAILABLE_SHIFTS } from "@/lib/data/generate";
import DigestPanel from "@/components/DigestPanel";

export const metadata = { title: "Daily Shift Digest Agent" };

export default async function ShiftDigestPage({
  searchParams,
}: {
  searchParams: Promise<{ shift?: string }>;
}) {
  const { shift: shiftParam } = await searchParams;
  const key = AVAILABLE_SHIFTS.includes(shiftParam ?? "") ? (shiftParam as string) : AVAILABLE_SHIFTS[0];
  const [date, shift, line] = key.split("|") as [string, "AM" | "PM", string];

  return (
    <div className="flex-1">
      <header className="bg-[var(--color-navy)]">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <Link href="/" className="text-xs font-medium text-white/60 hover:text-white">
            &larr; Helm
          </Link>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-extrabold text-white">
            Daily Shift Digest Agent
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Reads yield, downtime, QC holds, and labor from a single shift
            and drafts a plain-English summary. It recommends what to look
            at &mdash; you decide what to do about it.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {AVAILABLE_SHIFTS.slice(0, 14).map((k) => {
            const [d, s, l] = k.split("|");
            return (
              <Link
                key={k}
                href={`/agents/shift-digest?shift=${encodeURIComponent(k)}`}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  k === key
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                    : "border-[var(--color-border)] bg-white text-slate-500 hover:border-[var(--color-accent)]"
                }`}
              >
                {d} {s} &middot; {l}
              </Link>
            );
          })}
        </div>

        <DigestPanel date={date} shift={shift} line={line} />
      </main>
    </div>
  );
}
