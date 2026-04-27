export default function JobLoading() {
  return (
    <div className="flex min-h-screen justify-center bg-background animate-pulse">
      <div className="w-full max-w-7xl">
        {/* hero section */}
        <section className="border-b border-border/50">
          <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-24">
            {/* back link */}
            <div className="h-4 w-24 rounded bg-white/[0.05] mb-8" />

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
              {/* left — logo + company + title + badges */}
              <div className="max-w-3xl flex flex-col gap-5">
                {/* logo + company row */}
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl bg-white/[0.07] shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <div className="h-4 w-32 rounded bg-white/[0.07]" />
                    <div className="h-3 w-24 rounded bg-white/[0.05]" />
                  </div>
                </div>
                {/* job title */}
                <div className="h-10 w-4/5 rounded-lg bg-white/[0.08]" />
                <div className="h-8 w-2/3 rounded-lg bg-white/[0.06]" />
                {/* badge chips */}
                <div className="flex flex-wrap gap-3">
                  <div className="h-7 w-28 rounded-full bg-primary/10" />
                  <div className="h-7 w-24 rounded-full bg-white/[0.06]" />
                  <div className="h-7 w-24 rounded-full bg-white/[0.06]" />
                  <div className="h-7 w-20 rounded-full bg-white/[0.06]" />
                </div>
              </div>

              {/* right — apply button area */}
              <div className="flex flex-col gap-3 shrink-0">
                <div className="h-11 w-40 rounded-lg bg-primary/20" />
                <div className="h-4 w-32 rounded bg-white/[0.04]" />
              </div>
            </div>
          </div>
        </section>

        {/* content area */}
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* main description */}
            <div className="flex-1 flex flex-col gap-3">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="h-3 rounded bg-white/[0.04]"
                  style={{ width: `${60 + ((i * 37 + 13) % 38)}%` }}
                />
              ))}
              <div className="h-5 w-40 rounded bg-white/[0.06] mt-4" />
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-3 rounded bg-white/[0.04]"
                  style={{ width: `${55 + ((i * 29 + 7) % 35)}%` }}
                />
              ))}
            </div>

            {/* sidebar */}
            <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
              <div className="rounded-xl border border-border/50 bg-white/[0.02] p-5 flex flex-col gap-3">
                <div className="h-4 w-24 rounded bg-white/[0.06]" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-3 w-20 rounded bg-white/[0.04]" />
                    <div className="h-3 w-24 rounded bg-white/[0.05]" />
                  </div>
                ))}
              </div>
              {/* skills */}
              <div className="rounded-xl border border-border/50 bg-white/[0.02] p-5 flex flex-col gap-3">
                <div className="h-4 w-16 rounded bg-white/[0.06]" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-6 w-16 rounded-full bg-white/[0.05]" />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
