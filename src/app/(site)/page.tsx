import type { Metadata } from "next";
import Hero from "@/components/LandingPage/Hero";
import CompanyLogoScroll from "@/components/LandingPage/CompanyLogoScroll";
import ProblemSection from "@/components/LandingPage/ProblemSection";
import Features from "@/components/LandingPage/Features";
import HireMeProfiles from "@/components/LandingPage/HireMeProfiles";
import ForEmployers from "@/components/LandingPage/ForEmployers";
import FinalCTA from "@/components/LandingPage/FinalCTA";
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
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Hero />
      <CompanyLogoScroll />
      <ProblemSection />
      <Features />
      <HireMeProfiles />
      <FinalCTA />
    </main>
  );
}
