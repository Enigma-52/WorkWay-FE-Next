import { Check } from "lucide-react";

const HireMeProfiles = () => {
  return (
    <section className="relative py-32 noise">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
            Hire Me Profiles
          </p>
          <h2 className="font-display text-5xl sm:text-6xl text-gradient leading-[1.05]">
            Your resume, but online{" "}
            <span className="italic text-brand-gradient">and not ugly.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
            Every user gets a public Hire Me page. Recruiter opens it,
            understands you in 30 seconds. AI helps polish it — you stay in
            control.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Public, shareable URL",
              "AI-polished, human-edited",
              "Recruiter-friendly layout",
              "Always up to date",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-brand/15 grid place-items-center">
                  <Check className="w-3 h-3 text-brand" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Profile card */}
        <div className="relative">
          <div className="absolute -inset-8 bg-brand/10 blur-3xl rounded-full pointer-events-none" />
          <div className="relative rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-elevated p-8 shadow-elevated">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand to-brand-glow grid place-items-center font-display text-2xl text-brand-foreground">
                  A
                </div>
                <div>
                  <div className="font-display text-2xl">Alex Chen</div>
                  <div className="text-sm text-muted-foreground">
                    Full-Stack Engineer
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full bg-success/15 text-success border border-success/20">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Open
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"].map(
                (s) => (
                  <span
                    key={s}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-secondary border border-border/60 text-foreground/80"
                  >
                    {s}
                  </span>
                )
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { n: "5+", l: "Years" },
                { n: "12", l: "Projects" },
                { n: "★ 4.9", l: "Rating" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl border border-border bg-surface/60 p-3 text-center"
                >
                  <div className="font-display text-2xl text-gradient">
                    {s.n}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mt-0.5">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 border-t border-border pt-4 text-xs text-muted-foreground font-mono">
              <span className="text-foreground">Skills</span>
              <span>·</span>
              <span>Projects</span>
              <span>·</span>
              <span>Experience</span>
              <span>·</span>
              <span>Preferences</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HireMeProfiles;
