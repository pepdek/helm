export default function ConceptPreviewBanner() {
  return (
    <div className="border-y-2 border-dashed border-violet-300 bg-violet-50">
      <div className="mx-auto max-w-5xl px-6 py-3 text-xs font-medium text-violet-800">
        <span className="mr-2 rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          Concept Preview
        </span>
        Static mockup, not a working agent. No live sensors, reports, or
        actions behind this screen &mdash; synthetic data only.
      </div>
    </div>
  );
}
