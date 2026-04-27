export default function SkillLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* hero section — badge + left-aligned heading + stats */}
      <section className="border-b border-border/50">
        <div className="container mx-auto py-16 md:py-24">
          <div className="max-w-3xl flex flex-col gap-5">
            {/* skill badge pill */}
            <div className="h-8 w-32 rounded-full bg-primary/10" />
            {/* heading */}
            <div className="h-12 w-80 rounded-lg bg-white/[0.08]" />
            <div className="h-12 w-48 rounded-lg bg-primary/10" />
            {/* subtitle */}
            <div className="h-5 w-96 rounded bg-white/[0.05]" />
            {/* stat chips */}
            <div className="flex gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-primary/20" />
                <div className="h-4 w-28 rounded bg-white/[0.05]" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-primary/20" />
                <div className="h-4 w-20 rounded bg-white/[0.05]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* breadcrumb + filter row + job cards */}
      <main className="container mx-auto py-8 md:py-12">
        {/* breadcrumb */}
        <div className="mx-auto w-full max-w-6xl px-6 mb-6">
          <div className="h-4 w-44 rounded bg-white/[0.05]" />
        </div>

        <div className="px-6 max-w-6xl mx-auto">
          {/* filter bar */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="h-9 w-36 rounded-lg bg-white/[0.06]" />
            <div className="h-9 w-32 rounded-lg bg-white/[0.06]" />
            <div className="h-9 w-28 rounded-lg bg-white/[0.06]" />
          </div>

          {/* results count */}
          <div className="h-3 w-36 rounded bg-white/[0.04] mb-4" />

          {/* job cards */}
          <div className="grid gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border/50 bg-white/[0.03] p-5 flex gap-4">
                <div className="h-11 w-11 rounded-xl bg-white/[0.07] shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-4 w-2/3 rounded bg-white/[0.07]" />
                  <div className="h-3 w-1/3 rounded bg-white/[0.05]" />
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <div className="h-5 w-20 rounded-full bg-white/[0.05]" />
                    <div className="h-5 w-24 rounded-full bg-white/[0.05]" />
                    <div className="h-5 w-16 rounded-full bg-white/[0.04]" />
                  </div>
                </div>
                <div className="h-4 w-14 rounded bg-white/[0.04] self-start shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
