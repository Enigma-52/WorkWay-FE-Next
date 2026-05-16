import {
  Layers,
  SearchCode,
  LineChart,
  Building2,
  Zap,
  Brain,
} from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "One feed, every source",
    desc: "Greenhouse, Ashby, Lever, YC, in-house ATS — aggregated. No more 12 tabs.",
  },
  {
    icon: SearchCode,
    title: "Search that actually works",
    desc: "Semantic + filters + chat. Find the role, not 400 irrelevant listings.",
  },
  {
    icon: LineChart,
    title: "Track everything",
    desc: "Applied, ghosted, interviewing — one dashboard. No spreadsheet needed.",
  },
  {
    icon: Building2,
    title: "Company context",
    desc: "Funded? Actually hiring? Growing or dying? We show you before you apply.",
  },
  {
    icon: Zap,
    title: "Apply without friction",
    desc: "External ATS or in-house — one click, short message, done.",
  },
  {
    icon: Brain,
    title: "AI that assists, not replaces",
    desc: "Better matches, smarter search, polished profiles. No hallucinated jobs.",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative py-32">
      <div className="absolute inset-0 bg-radial-gradient opacity-40 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
            How it works
          </p>
          <h2 className="font-display text-5xl sm:text-6xl text-gradient">
            A job platform{" "}
            <span className="italic text-brand-gradient">with a brain.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-3xl overflow-hidden border border-border">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative bg-surface/60 backdrop-blur p-8 hover:bg-surface-elevated/80 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/20 grid place-items-center mb-5 group-hover:shadow-glow transition-all">
                <f.icon className="w-5 h-5 text-brand" />
              </div>
              <h3 className="font-display text-2xl mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
