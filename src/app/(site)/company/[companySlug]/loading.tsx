export default function CompanyLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* CompanyHeader — logo + name + description left, 3 stat cards right */}
      <header className="border-b border-border/50">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* left — logo + name + url + description */}
            <div className="flex-1 max-w-2xl flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-xl bg-white/[0.07] shrink-0" />
                <div className="flex flex-col gap-2">
                  <div className="h-7 w-48 rounded-lg bg-white/[0.08]" />
                  <div className="h-4 w-32 rounded bg-white/[0.05]" />
                </div>
              </div>
              <div className="h-4 w-full rounded bg-white/[0.04]" />
              <div className="h-4 w-5/6 rounded bg-white/[0.04]" />
              <div className="h-4 w-3/4 rounded bg-white/[0.04]" />
            </div>
            {/* right — stat cards */}
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border/50 bg-white/[0.03] px-6 py-4 min-w-[110px] flex flex-col gap-2">
                  <div className="h-3 w-16 rounded bg-white/[0.05]" />
                  <div className="h-7 w-12 rounded bg-white/[0.08]" />
                  <div className="h-3 w-14 rounded bg-white/[0.04]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* breadcrumb */}
      <div className="mx-auto w-full max-w-6xl px-6 pt-6">
        <div className="h-4 w-48 rounded bg-white/[0.05]" />
      </div>

      {/* main content — 2/3 + 1/3 grid */}
      <main className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* left 2/3 — recently posted + job listings */}
          <div className="lg:col-span-2 space-y-8">
            {/* recently posted */}
            <div className="flex flex-col gap-3">
              <div className="h-5 w-40 rounded bg-white/[0.06]" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border/50 bg-white/[0.03] p-4 flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/[0.06] shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 w-2/3 rounded bg-white/[0.07]" />
                    <div className="flex gap-2">
                      <div className="h-3 w-20 rounded bg-white/[0.05]" />
                      <div className="h-3 w-16 rounded bg-white/[0.04]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* all jobs */}
            <div className="flex flex-col gap-3">
              <div className="h-5 w-32 rounded bg-white/[0.06]" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border/50 bg-white/[0.03] p-4 flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/[0.06] shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 w-3/5 rounded bg-white/[0.07]" />
                    <div className="flex gap-2">
                      <div className="h-3 w-24 rounded bg-white/[0.05]" />
                      <div className="h-3 w-16 rounded bg-white/[0.04]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* right 1/3 — team breakdown */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 rounded-xl border border-border/50 bg-white/[0.03] p-5 flex flex-col gap-4">
              <div className="h-5 w-36 rounded bg-white/[0.06]" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-3 w-24 rounded bg-white/[0.05]" />
                  <div className="h-5 w-8 rounded-full bg-white/[0.06]" />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
