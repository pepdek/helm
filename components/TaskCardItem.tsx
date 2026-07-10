import Link from "next/link";
import { TaskCard } from "@/lib/data/tasks";

// Live/Planned is still the primary status a viewer scans for. But four
// Planned cards link to a real Concept Preview screen and nineteen don't,
// and with zero visual cue for that, the four preview screens become
// undiscoverable, nobody would think to click a card that looks identical
// to eighteen inert ones. So: one badge for status, one small secondary
// tag only on cards that actually go somewhere.
const BADGES = {
  live: (
    <span className="shrink-0 rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
      Live
    </span>
  ),
  planned: (
    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
      Planned
    </span>
  ),
};

const PREVIEW_TAG = (
  <span className="shrink-0 rounded-full border border-violet-300 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-500">
    Preview
  </span>
);

export default function TaskCardItem({ card }: { card: TaskCard }) {
  const isLive = card.status === "live";
  const isPreview = card.status === "preview" && Boolean(card.href);
  const interactive = isLive || Boolean(card.href);

  const body = (
    <div
      className={`flex h-full flex-col rounded-lg border p-4 transition ${
        isLive
          ? "border-[var(--color-accent)]/40 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5"
          : isPreview
            ? "border-violet-200 bg-white hover:shadow-md hover:-translate-y-0.5"
            : interactive
              ? "border-[var(--color-border)] bg-white hover:shadow-md hover:-translate-y-0.5"
              : "border-[var(--color-border)] bg-white/60"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`font-[family-name:var(--font-display)] text-sm font-bold leading-snug ${
            isLive ? "text-[var(--color-navy)]" : "text-slate-500"
          }`}
        >
          {card.title}
        </h3>
        <div className="flex shrink-0 items-center gap-1">
          {BADGES[isLive ? "live" : "planned"]}
          {isPreview && PREVIEW_TAG}
        </div>
      </div>
      {/* flex-1 pushes the cadence tag to the same bottom edge across every
          card in a row, regardless of how much the title/blurb above wrap. */}
      <p className={`mt-2 flex-1 text-xs leading-relaxed ${isLive ? "text-slate-600" : "text-slate-400"}`}>
        {card.blurb}
      </p>
      <p className="mt-3 text-[10px] font-medium uppercase tracking-wide text-slate-300">{card.cadence}</p>
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
