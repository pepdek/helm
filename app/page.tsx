import { CADENCES, TASK_CARDS } from "@/lib/data/tasks";
import TaskCardItem from "@/components/TaskCardItem";

export default function Home() {
  const liveCount = TASK_CARDS.filter((c) => c.status === "live").length;

  return (
    <div className="flex-1">
      <header className="bg-[var(--color-navy)]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center gap-3">
            {/* original three-prong mark, not a reproduction of Trident's logo artwork */}
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 3v13M7 3v5a5 5 0 0 0 5 5 5 5 0 0 0 5-5V3M9 21l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-[family-name:var(--font-display)] text-lg font-extrabold tracking-tight text-white">
              Helm
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-white/70">
            One dashboard for the manager&apos;s daily, weekly, monthly, and
            annual responsibilities. This augments a factory manager &mdash;
            it does not replace one. Agent output is always flagged for
            review or recommended, never auto-resolved.
          </p>
          <p className="mt-2 text-xs font-medium text-[var(--color-accent)]">
            {`${liveCount} of ${TASK_CARDS.length} cards are live agents · the rest are roadmapped, not missing`}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {CADENCES.map((cadence) => {
          const cards = TASK_CARDS.filter((c) => c.cadence === cadence);
          return (
            <section key={cadence} className="mb-10">
              <h2 className="mb-3 font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-widest text-slate-400">
                {cadence}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                  <TaskCardItem key={card.title} card={card} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
