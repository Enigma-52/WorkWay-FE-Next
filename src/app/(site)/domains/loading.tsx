export default function DomainsLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <main className="container mx-auto px-4 pb-20 pt-32">
        {/* breadcrumb */}
        <div className="h-4 w-40 rounded bg-white/[0.05] mb-6" />

        {/* centered heading */}
        <div className="mx-auto mb-16 max-w-3xl flex flex-col items-center gap-4">
          <div className="h-12 w-96 rounded-lg bg-white/[0.07]" />
          <div className="h-12 w-64 rounded-lg bg-primary/10" />
          <div className="h-5 w-80 rounded bg-white/[0.05]" />
        </div>

        {/* domain card grid */}
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border/50 bg-white/[0.03] p-6 flex flex-col gap-3">
                {/* icon + domain name */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-white/[0.07]" />
                  <div className="h-4 w-28 rounded bg-white/[0.07]" />
                </div>
                <div className="h-3 w-20 rounded bg-white/[0.05]" />
              </div>
            ))}
          </div>
        </div>

        {/* bottom text section */}
        <section className="mx-auto mt-24 max-w-4xl">
          <div className="rounded-xl border border-border/50 bg-white/[0.02] p-8 md:p-12 flex flex-col gap-4">
            <div className="h-6 w-64 rounded bg-white/[0.06]" />
            <div className="h-4 w-full rounded bg-white/[0.04]" />
            <div className="h-4 w-5/6 rounded bg-white/[0.04]" />
            <div className="h-4 w-4/5 rounded bg-white/[0.04]" />
            <div className="flex gap-3 mt-4 flex-wrap">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-7 w-28 rounded-full bg-white/[0.05]" />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
