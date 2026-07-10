import { CATEGORIES, TASK_CARDS, categorySlug } from "@/lib/data/tasks";
import TaskCardItem from "@/components/TaskCardItem";
import AppBar from "@/components/AppBar";

export default function Home() {
  return (
    <div className="flex-1">
      <AppBar />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <p className="max-w-2xl text-sm text-slate-600">
          One dashboard for the manager&apos;s daily, weekly, monthly, and
          annual work. This augments a factory manager, it does not replace
          one. Agent output is always flagged for review or recommended,
          never auto-resolved.
        </p>

        {CATEGORIES.map((category) => {
          const cards = TASK_CARDS.filter((c) => c.category === category);
          return (
            <section key={category} id={categorySlug(category)} className="mt-10 scroll-mt-6">
              <h2 className="mb-3 font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-widest text-slate-400">
                {category}
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
