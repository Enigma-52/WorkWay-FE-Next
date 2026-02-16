"use client";
import { Clock, UserCheck, LayoutGrid, ListChecks, BarChart3, Sparkles } from "lucide-react";

const ForEmployers = () => {
  const features = [
    { icon: Clock, text: "Post jobs in minutes", stat: "< 5 min" },
    { icon: UserCheck, text: "Get candidates who actually fit", stat: "90% match" },
    { icon: LayoutGrid, text: "Manage applicants in a clean pipeline", stat: "No chaos" },
    { icon: ListChecks, text: "Shortlist without spreadsheets", stat: "1-click" },
    { icon: BarChart3, text: "See what's working (and what isn't)", stat: "Real data" },
  ];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-1/2 h-96 bg-gradient-to-r from-primary/5 to-transparent blur-3xl" />
        <div className="absolute top-1/2 right-0 w-1/2 h-96 bg-gradient-to-l from-primary/5 to-transparent blur-3xl" />
      </div>

      <div className="container px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16">
            <p className="text-primary font-mono text-sm uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              For Employers
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
              Hiring without
            </h2>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-2">
              <span className="relative inline-block">
                <span className="relative z-10">the circus.</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 2 150 2 198 10" stroke="hsl(82 100% 55%)" strokeWidth="3" strokeLinecap="round" className="opacity-60"/>
                </svg>
              </span>
            </h2>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 ${
                  index === features.length - 1 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {feature.stat}
                  </span>
                </div>
                
                <p className="text-lg font-medium text-foreground/90 group-hover:text-foreground transition-colors">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          {/* Punchline */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-destructive/30 bg-destructive/5">
              <span className="text-2xl">🚫</span>
              <span className="text-lg text-foreground/80">No ATS bloat.</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-destructive/30 bg-destructive/5">
              <span className="text-2xl">💸</span>
              <span className="text-lg text-foreground/80">No enterprise pricing jumpscare.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForEmployers;
