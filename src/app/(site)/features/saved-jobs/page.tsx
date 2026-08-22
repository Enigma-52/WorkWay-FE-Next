import type { Metadata } from "next";
import { Bookmark, Link2, LayoutList, Clock } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import FeaturePage from "@/components/mcp/FeaturePage";

export const metadata: Metadata = buildPageMetadata({
  title: "Saved Jobs — Keep Every Role You're Considering In One Place",
  description:
    "Save openings to your WorkWay dashboard as you search. Every saved role keeps its original apply link, so you can come back and apply directly on the company's careers page whenever you're ready.",
  path: "/features/saved-jobs",
  keywords: ["saved jobs", "job shortlist", "track job applications", "bookmark jobs"],
});

const FAQS = [
  {
    question: "Do I need an account to save jobs?",
    answer:
      "Yes, saving requires a free WorkWay account so your list follows you between devices. Signing up takes a moment with Google or a magic link — no password to remember.",
  },
  {
    question: "Does saving a job apply to it?",
    answer:
      "No. Saving is purely a bookmark. When you're ready to apply, the saved role links out to the company's own posting, which is where the actual application happens.",
  },
  {
    question: "What happens if a saved role gets filled?",
    answer:
      "The listing stays in your dashboard for reference, but WorkWay flags postings that have aged past the point where they are likely still open, so you are not left guessing.",
  },
  {
    question: "Is there a limit on saved jobs?",
    answer:
      "No. Save as many roles as you want on any plan, including free.",
  },
];

export default function SavedJobsPage() {
  return (
    <FeaturePage
      breadcrumbName="Saved Jobs"
      eyebrow="Saved Jobs"
      icon={Bookmark}
      title={
        <>
          Build a shortlist <span className="text-primary">while you search</span>
        </>
      }
      intro="Job hunting falls apart when promising roles end up scattered across twenty browser tabs. Save anything worth a second look to your WorkWay dashboard and come back to a clean list, each one still pointing at the company's real posting."
      primaryCta={{ href: "/jobs", label: "Start searching" }}
      secondaryCta={{ href: "/features/job-alerts", label: "Set up alerts" }}
      points={[
        {
          icon: LayoutList,
          title: "One list, not twenty tabs",
          body: "Everything you're considering in a single dashboard view, with company, location and role type at a glance.",
        },
        {
          icon: Link2,
          title: "The apply link never changes",
          body: "Each saved role keeps the original ATS link. When you're ready, you apply on the company's own page — WorkWay stays out of the way.",
        },
        {
          icon: Clock,
          title: "Stale roles get flagged",
          body: "Postings that have been open a long time are marked, so you can tell a fresh opening from one that has probably been filled.",
        },
        {
          icon: Bookmark,
          title: "Free and unlimited",
          body: "No cap and no paid tier required. Saving jobs works the same on every WorkWay plan.",
        },
      ]}
      mcpBlurb="With the WorkWay MCP server connected, you can save roles mid-conversation. Ask your assistant to find senior backend jobs, then tell it to save the interesting ones — they show up in your dashboard immediately."
      faqs={FAQS}
      relatedLinks={[
        { href: "/features/job-alerts", label: "Job alerts" },
        { href: "/features/talent-profile", label: "Talent profile" },
        { href: "/jobs", label: "Browse jobs" },
        { href: "/mcp", label: "WorkWay MCP" },
      ]}
    />
  );
}
