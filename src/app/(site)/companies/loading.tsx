export default function CompaniesLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* hero section — centered title + search */}
      <section className="border-b border-border/50">
        <div className="container mx-auto px-4 py-10">
          <div className="mx-auto max-w-3xl flex flex-col items-center gap-4">
            <div className="h-10 w-80 rounded-lg bg-white/[0.07]" />
            <div className="h-5 w-60 rounded bg-white/[0.05]" />
            <div className="h-11 w-full max-w-md rounded-xl bg-white/[0.06] mt-2" />
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* stats row */}
        <div className="flex gap-6 mb-8">
          <div className="h-4 w-32 rounded bg-white/[0.05]" />
          <div className="h-4 w-28 rounded bg-white/[0.05]" />
        </div>

        {/* alpha filter bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="h-8 w-9 rounded-lg bg-white/[0.06]" />
          ))}
        </div>

        {/* company card grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-white/[0.03] p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/[0.07] shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="h-4 w-32 rounded bg-white/[0.07]" />
                  <div className="h-3 w-20 rounded bg-white/[0.05]" />
                </div>
              </div>
              <div className="h-3 w-full rounded bg-white/[0.04]" />
              <div className="h-3 w-4/5 rounded bg-white/[0.04]" />
              <div className="flex gap-2 mt-1">
                <div className="h-5 w-16 rounded-full bg-white/[0.05]" />
                <div className="h-5 w-20 rounded-full bg-white/[0.05]" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
