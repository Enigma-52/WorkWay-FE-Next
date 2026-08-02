import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/components/LandingPage/Hero";
import CompanyLogoScroll from "@/components/LandingPage/CompanyLogoScroll";
import { buildPageMetadata } from "@/lib/seo/metadata";

const ProblemSection = dynamic(
  () => import("@/components/LandingPage/ProblemSection")
);
const SourcesSection = dynamic(
  () => import("@/components/LandingPage/SourcesSection")
);
const Features = dynamic(() => import("@/components/LandingPage/Features"));
const HireMeProfiles = dynamic(
  () => import("@/components/LandingPage/HireMeProfiles")
);
const LandingFaq = dynamic(() => import("@/components/LandingPage/LandingFaq"));
const FinalCTA = dynamic(() => import("@/components/LandingPage/FinalCTA"));

export const metadata: Metadata = buildPageMetadata({
  title: "WorkWay — Jobs Simplified. Find Your Next Opportunity",
  description:
    "WorkWay aggregates 450k+ jobs from Greenhouse, Lever, Ashby, and Y Combinator boards into one feed. Search roles, explore companies, and publish a public Talent Profile.",
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
      <SourcesSection />
      <Features />
      <HireMeProfiles />
      <LandingFaq />
      <FinalCTA />
    </main>
  );
}
