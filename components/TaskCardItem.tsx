import Link from "next/link";
import { TaskCard } from "@/lib/data/tasks";

const BADGES = {
  live: (
    <span className="shrink-0 rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
      Live
    </span>
  ),
  preview: (
    <span className="shrink-0 rounded-full border border-dashed border-violet-400 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-700">
      Concept Preview
    </span>
  ),
  phase2: (
    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
      Phase 2
    </span>
  ),
};

export default function TaskCardItem({ card }: { card: TaskCard }) {
  const interactive = card.status === "live" || card.status === "preview";

  const cardStyle =
    card.status === "live"
      ? "border-[var(--color-accent)]/40 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5"
      : card.status === "preview"
        ? "border-dashed border-violet-300 bg-white hover:shadow-md hover:-translate-y-0.5"
        : "border-[var(--color-border)] bg-white/60";

  const titleStyle =
    card.status === "live"
      ? "text-[var(--color-navy)]"
      : card.status === "preview"
        ? "text-violet-900"
        : "text-slate-500";

  const blurbStyle = interactive ? "text-slate-600" : "text-slate-400";

  const body = (
    <div className={`h-full rounded-lg border p-4 transition ${cardStyle}`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className={`font-[family-name:var(--font-display)] text-sm font-bold leading-snug ${titleStyle}`}>
          {card.title}
        </h3>
        {BADGES[card.status]}
      </div>
      <p className={`mt-2 text-xs leading-relaxed ${blurbStyle}`}>{card.blurb}</p>
    </div>
  );

  if (interactive && card.href) {
    return (
      <Link href={card.href} className="block h-full">
        {body}
      </Link>
    );
  }
  return body;
}
