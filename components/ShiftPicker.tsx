"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

// Native date input + a shift/line dropdown, replacing a wall of 60+ pill
// buttons. availableShifts is the same "date|shift|line" key format as
// shiftKey() in lib/data/generate.ts.
export default function ShiftPicker({
  availableShifts,
  selectedKey,
}: {
  availableShifts: string[];
  selectedKey: string;
}) {
  const router = useRouter();
  const [selectedDate] = selectedKey.split("|");

  const dates = useMemo(
    () => Array.from(new Set(availableShifts.map((k) => k.split("|")[0]))).sort(),
    [availableShifts]
  );

  // AM before PM, then line number ascending, so the dropdown for a given
  // date reads chronologically. (The date-descending order of
  // availableShifts itself, used elsewhere, is a different UX need.)
  const optionsForDate = useMemo(() => {
    return availableShifts
      .filter((k) => k.startsWith(`${selectedDate}|`))
      .sort((a, b) => {
        const [, aShift, aLine] = a.split("|");
        const [, bShift, bLine] = b.split("|");
        if (aShift !== bShift) return aShift === "AM" ? -1 : 1;
        return aLine.localeCompare(bLine, undefined, { numeric: true });
      });
  }, [availableShifts, selectedDate]);

  function go(key: string) {
    router.push(`/agents/shift-digest?shift=${encodeURIComponent(key)}`);
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nextDate = e.target.value;
    const firstMatch = availableShifts.find((k) => k.startsWith(`${nextDate}|`));
    if (firstMatch) go(firstMatch);
  }

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <label className="block">
        <span className="block text-[10px] font-medium uppercase tracking-wide text-slate-400">Date</span>
        <input
          type="date"
          value={selectedDate}
          min={dates[0]}
          max={dates[dates.length - 1]}
          onChange={handleDateChange}
          className="mt-1 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-navy)]"
        />
      </label>
      <label className="block">
        <span className="block text-[10px] font-medium uppercase tracking-wide text-slate-400">Shift &middot; Line</span>
        <select
          value={selectedKey}
          onChange={(e) => go(e.target.value)}
          className="mt-1 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-navy)]"
        >
          {optionsForDate.map((k) => {
            const [, shift, line] = k.split("|");
            return (
              <option key={k} value={k}>
                {shift} &middot; {line}
              </option>
            );
          })}
        </select>
      </label>
    </div>
  );
}
