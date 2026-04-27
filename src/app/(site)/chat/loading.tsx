export default function ChatLoading() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="py-6 mx-auto w-full max-w-3xl flex-1 min-h-0 px-4 flex flex-col justify-between gap-4 animate-pulse">
        {/* message history area */}
        <div className="flex-1 flex flex-col gap-5 pt-4">
          {/* AI message */}
          <div className="flex gap-3 items-end max-w-[85%]">
            <div className="h-7 w-7 rounded-full bg-primary/20 shrink-0" />
            <div className="flex flex-col gap-1.5">
              <div className="h-4 w-64 rounded-2xl rounded-bl-none bg-white/[0.06] px-4 py-2" />
              <div className="h-4 w-48 rounded-xl bg-white/[0.05] px-4 py-2" />
            </div>
          </div>

          {/* user message */}
          <div className="flex gap-3 items-end justify-end max-w-[85%] self-end">
            <div className="h-9 w-52 rounded-2xl rounded-br-none bg-primary/10" />
          </div>

          {/* AI message with job cards */}
          <div className="flex gap-3 items-start max-w-[90%]">
            <div className="h-7 w-7 rounded-full bg-primary/20 shrink-0 mt-1" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 w-56 rounded bg-white/[0.06]" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-border/40 bg-white/[0.03] p-3 flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.06] shrink-0" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="h-3 w-40 rounded bg-white/[0.06]" />
                    <div className="h-3 w-28 rounded bg-white/[0.04]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* input bar */}
        <div className="h-12 w-full rounded-xl border border-border/40 bg-white/[0.04]" />
      </div>
    </div>
  );
}
