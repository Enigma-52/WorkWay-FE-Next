export default function SkillsLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="container mx-auto px-4 py-12">
        {/* breadcrumb */}
        <div className="h-4 w-40 rounded bg-white/[0.05] mb-8" />

        {/* page heading + 3 stat chips */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="h-10 w-72 rounded-lg bg-white/[0.07]" />
          <div className="h-5 w-60 rounded bg-white/[0.05]" />
          <div className="flex gap-4 mt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border/50 bg-white/[0.04] px-4 py-2 flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-white/[0.07]" />
                <div className="h-4 w-20 rounded bg-white/[0.06]" />
              </div>
            ))}
          </div>
        </div>

        {/* search input */}
        <div className="h-11 w-full max-w-md rounded-xl bg-white/[0.06] mb-6" />

        {/* category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-full bg-white/[0.05]" />
          ))}
          <div className="h-8 w-24 rounded-full bg-white/[0.05]" />
        </div>

        {/* skill card grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-white/[0.03] p-4 flex flex-col gap-2">
              <div className="h-4 w-28 rounded bg-white/[0.07]" />
              <div className="h-3 w-20 rounded bg-white/[0.05]" />
              <div className="h-5 w-16 rounded-full bg-primary/10 mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
