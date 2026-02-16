"use client";
import { Check, X, Sparkles } from "lucide-react";

const AISection = () => {
  const doItems = [
    "match candidates better",
    "improve job descriptions",
    "power semantic search",
    "help recruiters find talent faster",
  ];

  const dontItems = [
    "hallucinate jobs",
    "write motivational quotes",
    "replace humans",
  ];

  return (
    <section className="py-24 md:py-32 bg-card/30 border-y border-border">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-primary">AI Inside</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Yes, there's AI.{" "}
              <span className="text-muted-foreground">No, it's not cringe.</span>
            </h2>
          </div>

          {/* Do / Don't Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* We use AI to */}
            <div className="p-8 rounded-2xl border border-primary/30 bg-primary/5">
              <h3 className="font-mono text-sm uppercase tracking-wider text-primary mb-6">
                We use AI to:
              </h3>
              <div className="space-y-4">
                {doItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* We don't use AI to */}
            <div className="p-8 rounded-2xl border border-destructive/30 bg-destructive/5">
              <h3 className="font-mono text-sm uppercase tracking-wider text-destructive mb-6">
                We don't use AI to:
              </h3>
              <div className="space-y-4">
                {dontItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
                      <X className="w-3.5 h-3.5 text-destructive" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-center mt-12 text-xl font-semibold">
            Assist {">"} automate.{" "}
            <span className="text-primary">Always.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AISection;
