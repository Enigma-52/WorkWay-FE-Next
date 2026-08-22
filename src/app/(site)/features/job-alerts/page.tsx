import type { Metadata } from "next";
import { Bell, Zap, Mail, Filter, Building2 } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import FeaturePage from "@/components/mcp/FeaturePage";

export const metadata: Metadata = buildPageMetadata({
  title: "Job Alerts — Get Notified The Moment A Company Posts",
  description:
    "Follow companies on WorkWay and get an email the instant they post a new role, straight from their Greenhouse, Ashby or Y Combinator board. No daily digest lag, no re-posted listings.",
  path: "/features/job-alerts",
  keywords: [
    "job alerts",
    "new job notifications",
    "company job alerts",
    "instant job alerts",
    "follow companies hiring",
  ],
});

const FAQS = [
  {
    question: "How fast do job alerts arrive?",
    answer:
      "As soon as WorkWay sees the role on the company's ATS board. Alerts are sent per posting rather than batched into a nightly digest, so you hear about a new opening while the applicant pool is still small.",
  },
  {
    question: "Can I follow companies on the free plan?",
    answer:
      "Yes. Following is available to every account, free included, with no cap on how many companies you track. Pro is what turns on the instant email delivery — on the free plan your follows are saved to your dashboard for you to check yourself.",
  },
  {
    question: "What if several roles are posted at once?",
    answer:
      "They arrive as a single clean digest rather than a flood of separate emails. One company posting twelve roles gets you one message listing all twelve.",
  },
  {
    question: "Where do alert emails link to?",
    answer:
      "Straight to the company's original posting on their own ATS. Every alert also links to the role's WorkWay page if you want related openings and company context first.",
  },
  {
    question: "How do I stop getting alerts for a company?",
    answer:
      "Unfollow it from your dashboard and the alerts stop immediately. You can also unsubscribe from alert emails entirely using the link in any message.",
  },
];

export default function JobAlertsPage() {
  return (
    <FeaturePage
      breadcrumbName="Job Alerts"
      eyebrow="Job Alerts"
      icon={Bell}
      title={
        <>
          Hear about a role <span className="text-primary">the day it opens</span>
        </>
      }
      intro="The best openings get filled by people who saw them first. Follow the companies you want to work at and WorkWay emails you the moment one of them posts something new — read directly from their own careers board, not a re-post that surfaced a week later."
      primaryCta={{ href: "/companies", label: "Find companies to follow" }}
      secondaryCta={{ href: "/pricing", label: "See Pro pricing" }}
      points={[
        {
          icon: Zap,
          title: "Sent per posting, not per day",
          body: "No overnight batch. When a followed company publishes a role, the email goes out — which is often hours before it reaches the big aggregators.",
        },
        {
          icon: Building2,
          title: "Follow as many as you like",
          body: "Track a shortlist of dream employers or a hundred companies in your field. Following is free and unlimited on every plan.",
        },
        {
          icon: Mail,
          title: "Batched sensibly",
          body: "A company posting a dozen roles at once produces one tidy digest, not a dozen notifications competing for your attention.",
        },
        {
          icon: Filter,
          title: "Only real, live roles",
          body: "Alerts come from the company's own ATS, so you never get a duplicate listing or a role that closed months ago.",
        },
      ]}
      mcpBlurb="Connect the WorkWay MCP server and you can follow companies straight from a conversation — ask your assistant to follow an employer while you're researching it, then check everything you're tracking without leaving the chat."
      faqs={FAQS}
      relatedLinks={[
        { href: "/features/saved-jobs", label: "Saved jobs" },
        { href: "/companies", label: "Browse companies" },
        { href: "/pricing", label: "Pricing" },
        { href: "/mcp", label: "WorkWay MCP" },
      ]}
    />
  );
}
