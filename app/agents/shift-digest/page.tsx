import Link from "next/link";
import { AVAILABLE_SHIFTS } from "@/lib/data/generate";
import DigestPanel from "@/components/DigestPanel";
import ShiftPicker from "@/components/ShiftPicker";
import AppBar from "@/components/AppBar";

export const metadata = { title: "Daily Shift Digest Agent" };

export default async function ShiftDigestPage({
  searchParams,
}: {
  searchParams: Promise<{ shift?: string }>;
}) {
  const { shift: shiftParam } = await searchParams;
  // Same whitelist-against-known-values pattern as the yield agent's date
  // param: an invalid/tampered key falls back to the most recent shift
  // (index 0, since AVAILABLE_SHIFTS is sorted newest-first) rather than
  // erroring. The split() here is the decode half of shiftKey()'s encode
  // in lib/data/generate.ts, field order (date, shift, line) must match.
  const key = AVAILABLE_SHIFTS.includes(shiftParam ?? "") ? (shiftParam as string) : AVAILABLE_SHIFTS[0];
  const [date, shift, line] = key.split("|") as [string, "AM" | "PM", string];

  return (
    <div className="flex-1">
      <AppBar />

      <main className="mx-auto max-w-3xl px-6 py-8">
        <Link href="/" className="text-xs font-medium text-slate-400 hover:text-[var(--color-navy)]">
          &larr; Helm
        </Link>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-extrabold text-[var(--color-navy)]">
          Daily Shift Digest Agent
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Reads yield, downtime, QC holds, and labor from a single shift
          and drafts a plain-English summary. It recommends what to look
          at, you decide what to do about it.
        </p>

        <div className="mt-6">
          <ShiftPicker availableShifts={AVAILABLE_SHIFTS} selectedKey={key} />
        </div>

        <DigestPanel date={date} shift={shift} line={line} />
      </main>
    </div>
  );
}
