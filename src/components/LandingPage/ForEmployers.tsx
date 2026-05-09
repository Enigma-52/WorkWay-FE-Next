import { Check, X } from "lucide-react";

const goods = [
  "Post in under 5 minutes",
  "Get candidates who actually fit",
  "Clean pipeline, no spreadsheet chaos",
  "Real signal from public Hire Me profiles",
];
const bads = [
  "ATS bloat",
  "Enterprise pricing jumpscare",
  "Engagement-farming feeds",
  "Fake urgency banners",
];

const ForEmployers = () => {
  return (
    <section className="relative py-32 bg-surface/30 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
            For Employers
          </p>
          <h2 className="font-display text-5xl sm:text-6xl text-gradient">
            Hiring without{" "}
            <span className="italic text-brand-gradient">the circus.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="rounded-3xl border border-success/20 bg-gradient-to-br from-success/5 to-transparent p-8">
            <div className="text-xs font-mono uppercase tracking-widest text-success mb-5">
              What you get
            </div>
            <ul className="space-y-4">
              {goods.map((g) => (
                <li key={g} className="flex items-start gap-3 text-base">
                  <Check className="w-5 h-5 text-success mt-0.5 shrink-0" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-surface/60 p-8">
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">
              What you don&apos;t
            </div>
            <ul className="space-y-4">
              {bads.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-base text-muted-foreground line-through decoration-destructive/40"
                >
                  <X className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForEmployers;
