import type { Metadata } from "next";
import CompanyLogoScroll from "@/components/LandingPage/CompanyLogoScroll";
import Features from "@/components/LandingPage/Features";
import FinalCTA from "@/components/LandingPage/FinalCTA";
import ForEmployers from "@/components/LandingPage/ForEmployers";
import Hero from "@/components/LandingPage/Hero";
import HireMeProfiles from "@/components/LandingPage/HireMeProfiles";
import ProblemSection from "@/components/LandingPage/ProblemSection";
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
        <CompanyLogoScroll />
        <div className="mx-auto max-w-6xl px-6">
          <ProblemSection />
          <Features />
          <HireMeProfiles />
          <section id="employers">
            <ForEmployers />
          </section>
          <FinalCTA />
        </div>
      </main>
    </div>
  );
}
