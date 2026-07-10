// Thin app-shell bar, not a hero. No explanatory copy, just identity.
// Same treatment as the parallel Radio Check pass (trident-radio-check's
// components/AppBar.tsx) so the two demos read as one product family.
export default function AppBar() {
  return (
    <div className="bg-[var(--color-navy)] px-6 py-3">
      <div className="mx-auto flex max-w-5xl items-center gap-2">
        {/* original three-prong mark, not a reproduction of Trident's logo artwork */}
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3v13M7 3v5a5 5 0 0 0 5 5 5 5 0 0 0 5-5V3M9 21l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-[family-name:var(--font-display)] text-sm font-extrabold tracking-tight text-white">
          Helm
        </span>
        <span className="text-xs text-white/50">&middot; Internal &middot; Trident Seafoods</span>
      </div>
    </div>
  );
}
