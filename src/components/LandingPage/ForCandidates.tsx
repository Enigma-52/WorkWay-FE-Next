"use client";
import { Search, Zap, BarChart3 } from "lucide-react";

const ForCandidates = () => {
  const cards = [
    {
      icon: Search,
      title: "Find jobs without digging",
      description: "Search once. Filters actually work. Chat if you're lazy.",
    },
    {
      icon: Zap,
      title: "Apply without friction",
      description: "External ATS? Fine. In-house roles? Short message. Done.",
    },
    {
      icon: BarChart3,
      title: "Track everything",
      description: "Where you applied. What happened. What's hot. What's dead.",
    },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16">
            <p className="text-primary font-mono text-sm uppercase tracking-wider mb-4">
              For Candidates
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              For people who are{" "}
              <span className="text-muted-foreground">actually applying.</span>
            </h2>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl border border-border bg-card card-gradient hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <card.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* Punchline */}
          <p className="text-center mt-12 text-lg font-mono text-primary">
            No more "did I apply here?"
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForCandidates;
