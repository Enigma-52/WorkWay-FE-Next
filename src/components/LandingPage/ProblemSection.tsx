import { X } from "lucide-react";

const tabs = [
  "LinkedIn",
  "Naukri",
  "YC Jobs",
  "Greenhouse",
  "Lever",
  "Ashby",
  "final_v7.xlsx",
];
const pains = [
  "apply to the same job twice",
  "forget where you applied",
  "rewrite the same intro",
  "question your life choices",
];

const ProblemSection = () => {
  return (
    <section className="relative py-32 noise">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
            The problem
          </p>
          <h2 className="font-display text-5xl sm:text-6xl text-gradient">
            Be honest.{" "}
            <span className="italic text-brand-gradient">
              This is your setup.
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Browser mock */}
          <div className="rounded-3xl border border-border bg-surface/60 backdrop-blur shadow-elevated overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-elevated/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-success/70" />
              </div>
              <div className="ml-3 text-xs text-muted-foreground font-mono">
                every morning, you
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b border-border">
              {tabs.map((t, i) => (
                <div
                  key={t}
                  className={`text-xs px-3 py-1.5 rounded-md border border-border/60 font-mono whitespace-nowrap ${i === 0 ? "bg-secondary text-foreground" : "text-muted-foreground bg-surface/40"}`}
                >
                  {t}
                </div>
              ))}
            </div>
            <div className="p-8 min-h-[280px] grid place-items-center">
              <div className="text-center space-y-3">
                <div className="text-7xl">🥲</div>
                <p className="text-sm text-muted-foreground font-mono">
                  12 tabs. 0 applications sent.
                </p>
              </div>
            </div>
          </div>

          {/* Pains list */}
          <div className="rounded-3xl border border-border bg-gradient-to-br from-surface/80 to-surface-elevated/60 p-8 sm:p-10 shadow-elevated flex flex-col justify-center">
            <p className="text-sm text-muted-foreground mb-6 font-mono">
              and then you
            </p>
            <ul className="space-y-4">
              {pains.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3 text-xl sm:text-2xl font-display"
                >
                  <span className="mt-2 w-6 h-6 rounded-full bg-destructive/15 grid place-items-center shrink-0">
                    <X className="w-3.5 h-3.5 text-destructive" />
                  </span>
                  <span className="text-foreground/90">{p}</span>
                </li>
              ))}
            </ul>
            <p className="mt-10 pt-6 border-t border-border text-muted-foreground">
              This isn&apos;t{" "}
              <span className="line-through">&ldquo;the grind.&rdquo;</span>
              <br />
              <span className="text-foreground font-medium">
                It&apos;s bad software.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
