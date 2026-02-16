"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import OnboardingModal from "./OnboardingModal";

const Hero = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm mb-8 opacity-0 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground font-mono">
              now in beta
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8 opacity-0 animate-fade-up stagger-1">
            Job hunting is <span className="text-gradient">cooked.</span>
            <br />
            So we fixed it.
          </h1>

          {/* Subhead */}
          <div className="max-w-2xl mx-auto mb-12 opacity-0 animate-fade-up stagger-2">
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6">
              WorkWay is where jobs, applications, and hiring
              <br className="hidden sm:block" />
              stop being a mess and start making sense.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-mono text-foreground/80">
              <span className="px-3 py-1 rounded-md bg-card border border-border">
                No spam.
              </span>
              <span className="px-3 py-1 rounded-md bg-card border border-border">
                No déjà vu listings.
              </span>
              <span className="px-3 py-1 rounded-md bg-card border border-border">
                No corporate soul damage.
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3 opacity-0 animate-fade-up stagger-3">
            <Button variant="hero" size="xl" asChild>
              <Link href="/companies">
                Enter WorkWay
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <span className="text-xs text-muted-foreground font-mono">
              yes, it actually works
            </span>
          </div>
        </div>
      </div>

      <OnboardingModal open={showOnboarding} onOpenChange={setShowOnboarding} />
    </section>
  );
};

export default Hero;
