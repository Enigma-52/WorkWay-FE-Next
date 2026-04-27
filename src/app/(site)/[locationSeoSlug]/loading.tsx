export default function LocationSeoLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* hero section — mirrors the centered heading + stat chips */}
      <section className="border-b border-border/50">
        <div className="container mx-auto py-12 md:py-16">
          <div className="mx-auto max-w-3xl flex flex-col items-center gap-4">
            <div className="h-10 w-96 rounded-lg bg-white/[0.07]" />
            <div className="h-10 w-64 rounded-lg bg-primary/10" />
            <div className="h-5 w-80 rounded bg-white/[0.05]" />
            <div className="flex gap-6 mt-2">
              <div className="h-4 w-28 rounded bg-white/[0.05]" />
              <div className="h-4 w-24 rounded bg-white/[0.05]" />
            </div>
          </div>
        </div>
      </section>

      {/* same 3-col grid as jobs page */}
      <main className="container mx-auto py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)_360px]">
          {/* left filter sidebar */}
          <aside className="hidden lg:flex flex-col gap-3">
            <div className="h-4 w-20 rounded bg-white/[0.05] mb-1" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 w-full rounded-lg bg-white/[0.06]" />
            ))}
          </aside>

          {/* center — filter chips + job cards */}
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="h-8 w-36 rounded-lg bg-white/[0.06]" />
              <div className="h-8 w-32 rounded-lg bg-white/[0.06]" />
              <div className="h-8 w-28 rounded-lg bg-white/[0.06]" />
            </div>
            <div className="h-3 w-36 rounded bg-white/[0.04]" />
            <div className="grid gap-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/50 bg-white/[0.03] p-5 flex gap-4"
                >
                  <div className="h-11 w-11 rounded-xl bg-white/[0.07] shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="h-4 w-3/4 rounded bg-white/[0.07]" />
                    <div className="h-3 w-1/3 rounded bg-white/[0.05]" />
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <div className="h-5 w-20 rounded-full bg-white/[0.05]" />
                      <div className="h-5 w-24 rounded-full bg-white/[0.05]" />
                      <div className="h-5 w-16 rounded-full bg-white/[0.04]" />
                    </div>
                  </div>
                  <div className="h-4 w-16 rounded bg-white/[0.04] self-start shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* right panel */}
          <aside className="hidden lg:flex flex-col gap-4">
            <div className="h-4 w-32 rounded bg-white/[0.05]" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border/50 bg-white/[0.03] p-4 flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/[0.06] shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="h-3 w-3/4 rounded bg-white/[0.06]" />
                  <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
                </div>
              </div>
            ))}
          </aside>
        </div>
      </main>
    </div>
  );
}
