import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/components/LandingPage/Hero";
import CompanyLogoScroll from "@/components/LandingPage/CompanyLogoScroll";
import { buildPageMetadata } from "@/lib/seo/metadata";

const ProblemSection = dynamic(
  () => import("@/components/LandingPage/ProblemSection")
);
const Features = dynamic(() => import("@/components/LandingPage/Features"));
const HireMeProfiles = dynamic(
  () => import("@/components/LandingPage/HireMeProfiles")
);
const FinalCTA = dynamic(() => import("@/components/LandingPage/FinalCTA"));

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
