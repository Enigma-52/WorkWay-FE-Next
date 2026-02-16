"use client";
import { Database, Target, Building, TrendingUp, Filter, Zap } from "lucide-react";

const SolutionSection = () => {
  const features = [
    { icon: Database, text: "Aggregates jobs from Greenhouse, Lever, YC Jobs", color: "from-emerald-500 to-teal-500" },
    { icon: Target, text: "Lets you apply + track everything in one place", color: "from-blue-500 to-cyan-500" },
    { icon: Building, text: "Handles in-house startup jobs directly", color: "from-violet-500 to-purple-500" },
    { icon: TrendingUp, text: "Shows company context (funded? hiring? relevant?)", color: "from-orange-500 to-amber-500" },
    { icon: Filter, text: "Gives recruiters actual signal, not resume spam", color: "from-rose-500 to-pink-500" },
  ];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-card/30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-primary">The Solution</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              So we built a platform
            </h2>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gradient">
              that isn't dumb.
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid gap-4 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-6 rounded-2xl border border-border bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover:-translate-x-1 overflow-hidden"
              >
                {/* Gradient line on left */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Glow effect */}
                <div className={`absolute -left-20 top-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />
                
                <div className="flex items-center gap-5 relative z-10">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-[1px] flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-foreground" />
                    </div>
                  </div>
                  <span className="text-lg md:text-xl font-medium text-foreground/90 group-hover:text-foreground transition-colors">
                    {feature.text}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <div className="text-center">
            <div className="inline-block p-8 rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
              <p className="text-2xl md:text-3xl text-muted-foreground">
                It's a job platform.
              </p>
              <p className="text-2xl md:text-3xl font-bold mt-2">
                But with a <span className="text-gradient">brain.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
