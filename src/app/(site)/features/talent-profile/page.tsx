import type { Metadata } from "next";
import { UserRound, Globe, Search, Sparkles } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import FeaturePage from "@/components/mcp/FeaturePage";

export const metadata: Metadata = buildPageMetadata({
  title: "Talent Profile — Get Found By Companies Hiring",
  description:
    "Publish a WorkWay talent profile with your headline, skills, experience and availability. Appear in the searchable talent directory companies browse when they're hiring.",
  path: "/features/talent-profile",
  keywords: [
    "talent profile",
    "developer profile",
    "get found by recruiters",
    "talent directory",
    "hire engineers",
  ],
});

const FAQS = [
  {
    question: "Who can see my talent profile?",
    answer:
      "Published profiles are public and appear in the WorkWay talent directory at a URL you choose. If you would rather not be listed yet, leave the profile unpublished and only you can see it.",
  },
  {
    question: "What should I put on it?",
    answer:
      "A clear headline, your category and experience level, the skills you actually want to be hired for, and your availability. Profiles that state what someone is looking for do noticeably better than ones that read like a full CV.",
  },
  {
    question: "Can companies contact me directly?",
    answer:
      "Yes. Your profile carries the links you choose to share, so anyone browsing the directory can reach you the way you prefer.",
  },
  {
    question: "Does it cost anything?",
    answer:
      "No. Creating and publishing a talent profile is free, as is appearing in the directory.",
  },
  {
    question: "Can I edit it later?",
    answer:
      "Any time, from your dashboard or through the MCP server. Updates are partial, so changing your headline leaves everything else untouched.",
  },
];

export default function TalentProfilePage() {
  return (
    <FeaturePage
      breadcrumbName="Talent Profile"
      eyebrow="Talent Profile"
      icon={UserRound}
      title={
        <>
          Let the right companies <span className="text-primary">find you</span>
        </>
      }
      intro="Applying is only half of a job search. A WorkWay talent profile puts your headline, skills and availability in a directory companies browse when they are hiring — so opportunities can arrive without you chasing every one of them."
      primaryCta={{ href: "/dashboard/seeker/talent-profile", label: "Create your profile" }}
      secondaryCta={{ href: "/talents", label: "Browse the directory" }}
      points={[
        {
          icon: Globe,
          title: "Your own public page",
          body: "Pick a username and get a shareable profile URL you can drop into applications, your GitHub bio, or a cold email.",
        },
        {
          icon: Search,
          title: "Filterable by what matters",
          body: "Companies narrow the directory by category, skills, languages, experience level and availability — so the people who find you are the ones actually looking for your profile.",
        },
        {
          icon: Sparkles,
          title: "Say what you're open to",
          body: "Signal availability, notice period and the kinds of contracts you'll consider, so conversations start from the right place.",
        },
        {
          icon: UserRound,
          title: "Free to publish",
          body: "No paid tier, no listing fee. Creating a profile and appearing in the directory costs nothing.",
        },
      ]}
      mcpBlurb="The WorkWay MCP server can build and edit your profile conversationally. Tell your assistant to set your headline, add skills, or mark yourself open to work, and it updates only the fields you mentioned."
      faqs={FAQS}
      relatedLinks={[
        { href: "/talents", label: "Talent directory" },
        { href: "/features/saved-jobs", label: "Saved jobs" },
        { href: "/jobs", label: "Browse jobs" },
        { href: "/mcp", label: "WorkWay MCP" },
      ]}
    />
  );
}
