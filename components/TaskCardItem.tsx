import Link from "next/link";
import { TaskCard } from "@/lib/data/tasks";

export default function TaskCardItem({ card }: { card: TaskCard }) {
  const body = (
    <div
      className={`h-full rounded-lg border p-4 transition ${
        card.status === "live"
          ? "border-[var(--color-accent)]/40 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5"
          : "border-[var(--color-border)] bg-white/60"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`font-[family-name:var(--font-display)] text-sm font-bold leading-snug ${
            card.status === "live" ? "text-[var(--color-navy)]" : "text-slate-500"
          }`}
        >
          {card.title}
        </h3>
        {card.status === "live" ? (
          <span className="shrink-0 rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Live
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Phase 2
          </span>
        )}
      </div>
      <p
        className={`mt-2 text-xs leading-relaxed ${
          card.status === "live" ? "text-slate-600" : "text-slate-400"
        }`}
      >
        {card.blurb}
      </p>
    </div>
  );

  if (card.status === "live" && card.href) {
    return (
      <Link href={card.href} className="block h-full">
        {body}
      </Link>
    );
  }
  return body;
}
