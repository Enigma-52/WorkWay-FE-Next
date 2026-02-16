import type { Metadata } from "next";
import AISection from "@/components/LandingPage/AISection";
import FinalCTA from "@/components/LandingPage/FinalCTA";
import ForCandidates from "@/components/LandingPage/ForCandidates";
import ForEmployers from "@/components/LandingPage/ForEmployers";
import Hero from "@/components/LandingPage/Hero";
import HireMeProfiles from "@/components/LandingPage/HireMeProfiles";
import MarketSignals from "@/components/LandingPage/MarketSignals";
import ProblemSection from "@/components/LandingPage/ProblemSection";
import SocialProof from "@/components/LandingPage/SocialProof";
import SolutionSection from "@/components/LandingPage/SolutionSection";
import WhatWeAreNot from "@/components/LandingPage/WhatWeAreNot";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "WorkWay — Jobs Simplified. Find Your Next Opportunity",
  description:
    "WorkWay helps you discover the right jobs faster. Browse thousands of opportunities, explore companies, and apply with confidence.",
  path: "/",
  keywords:
    "jobs, careers, hiring, job search, workway, tech jobs, startup jobs, remote jobs, fresher jobs, internships",
});

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <Hero />
        <div className="mx-auto max-w-6xl space-y-32 px-6">
          <SocialProof />
          <ProblemSection />
          <SolutionSection />
          <section id="candidates">
            <ForCandidates />
          </section>
          <HireMeProfiles />
          <section id="employers">
            <ForEmployers />
          </section>
          <AISection />
          <MarketSignals />
          <WhatWeAreNot />
          <FinalCTA />
        </div>
      </main>
    </div>
  );
}
