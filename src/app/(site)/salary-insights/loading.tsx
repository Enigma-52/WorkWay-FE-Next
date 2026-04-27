export default function SalaryInsightsLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-6 pb-20 animate-pulse">
      {/* breadcrumb */}
      <div className="h-4 w-52 rounded bg-white/[0.05] mb-8" />

      {/* page heading */}
      <div className="h-9 w-72 rounded-lg bg-white/[0.07] mb-2" />
      <div className="h-4 w-96 rounded bg-white/[0.04] mb-8" />

      {/* stat cards row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-white/[0.03] p-5 flex flex-col gap-2">
            <div className="h-3 w-24 rounded bg-white/[0.05]" />
            <div className="h-8 w-28 rounded bg-white/[0.08]" />
            <div className="h-3 w-16 rounded bg-white/[0.04]" />
          </div>
        ))}
      </div>

      {/* two charts side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border border-border/50 bg-white/[0.03] p-5 h-52" />
        <div className="rounded-xl border border-border/50 bg-white/[0.03] p-5 h-52" />
      </div>

      {/* filter row */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="h-9 w-36 rounded-lg bg-white/[0.06]" />
        <div className="h-9 w-32 rounded-lg bg-white/[0.06]" />
        <div className="h-9 w-28 rounded-lg bg-white/[0.06]" />
        <div className="h-9 w-28 rounded-lg bg-white/[0.06]" />
      </div>

      {/* results count */}
      <div className="h-3 w-40 rounded bg-white/[0.04] mb-4" />

      {/* job rows */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-white/[0.03] p-4 flex gap-4 items-center">
            <div className="h-10 w-10 rounded-lg bg-white/[0.06] shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-4 w-1/2 rounded bg-white/[0.07]" />
              <div className="flex gap-2">
                <div className="h-3 w-24 rounded bg-white/[0.05]" />
                <div className="h-3 w-20 rounded bg-white/[0.04]" />
              </div>
            </div>
            <div className="h-6 w-24 rounded-full bg-primary/10 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
