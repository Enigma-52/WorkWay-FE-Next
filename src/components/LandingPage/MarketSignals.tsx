"use client";
import { TrendingUp, Building, Briefcase } from "lucide-react";

const MarketSignals = () => {
  const signals = [
    { icon: TrendingUp, label: "recently funded companies" },
    { icon: Building, label: "active hiring signals" },
    { icon: Briefcase, label: "open roles tied to real growth" },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Heading */}
          <p className="text-primary font-mono text-sm uppercase tracking-wider mb-4">
            Market Signals
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Know who's{" "}
            <span className="text-gradient">actually hiring.</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            We track what matters so you're not applying into the void.
          </p>

          {/* Signals */}
          <div className="grid sm:grid-cols-3 gap-6">
            {signals.map((signal, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <signal.icon className="w-7 h-7 text-primary" />
                </div>
                <p className="font-mono text-sm text-foreground">{signal.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketSignals;
