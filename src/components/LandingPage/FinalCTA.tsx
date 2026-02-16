"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import OnboardingModal from "./OnboardingModal";

const FinalCTA = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <section className="py-32 md:py-40 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Stop fighting
            <br />
            <span className="text-gradient">job platforms.</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Use one that's on your side.
          </p>

          <div className="flex flex-col items-center gap-4">
            <Button
              variant="hero"
              size="xl"
              className="group animate-pulse-glow"
              onClick={() => setShowOnboarding(true)}
            >
              Start using WorkWay
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <span className="text-sm text-muted-foreground font-mono">
              takes less time than opening LinkedIn
            </span>
          </div>
        </div>
      </div>

      <OnboardingModal open={showOnboarding} onOpenChange={setShowOnboarding} />
    </section>
  );
};

export default FinalCTA;
