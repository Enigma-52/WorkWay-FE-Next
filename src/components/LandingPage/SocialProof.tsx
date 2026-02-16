"use client";
import { Briefcase, Users, Zap } from "lucide-react";

const SocialProof = () => {
  const badges = [
    { icon: Briefcase, text: "applying every day" },
    { icon: Users, text: "hiring seriously" },
    { icon: Zap, text: "extremely tired of other job platforms" },
  ];

  return (
    <section className="py-20 border-y border-border bg-card/30">
      <div className="container px-4">
        <p className="text-center text-muted-foreground mb-8 font-mono text-sm">
          Used by people who are:
        </p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-5 py-3 rounded-full border border-border bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors duration-300"
            >
              <badge.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
