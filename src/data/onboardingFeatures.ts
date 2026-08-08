import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Users,
  Bookmark,
  Bell,
  UserCircle,
  BarChart3,
  Mail,
} from "lucide-react";

export type OnboardingFeature = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  highlights: string[];
  pro?: boolean;
};

export const ONBOARDING_FEATURES: OnboardingFeature[] = [
  {
    id: "jobs",
    title: "Jobs",
    tagline: "One feed for every ATS",
    description:
      "We pull listings straight from company career pages — Greenhouse, Ashby, Workable, YC — so you see roles other boards miss, filterable by domain, experience, location, and country.",
    icon: Briefcase,
    highlights: [
      "Jobs from every major ATS in one feed",
      "Filter by domain, experience, location, country",
      "Updated continuously, not once a week",
    ],
  },
  {
    id: "talents",
    title: "Talents",
    tagline: "A directory that finds you",
    description:
      "Browse engineer, design, and product profiles — or build your own so recruiters browsing WorkWay can discover you before you even apply.",
    icon: Users,
    highlights: [
      "Searchable by category, skill, and availability",
      "Your own shareable /p/username page",
      "No applications needed to be found",
    ],
  },
  {
    id: "saved-applications",
    title: "Save & Track",
    tagline: "Never lose a role again",
    description:
      "Bookmark jobs you're considering and log every application in one dashboard, instead of losing track across a dozen browser tabs.",
    icon: Bookmark,
    highlights: [
      "One-click save from any job card",
      "Track application status over time",
      "Everything in one dashboard",
    ],
  },
  {
    id: "follow",
    title: "Follow Companies",
    tagline: "Know the moment they post",
    description:
      "Follow any company and see their recent postings surface right in your dashboard — no more manually refreshing career pages.",
    icon: Bell,
    highlights: [
      "Follow companies with one click",
      "Recent postings surfaced automatically",
      "No more bookmark folders",
    ],
  },
  {
    id: "profile",
    title: "Talent Profile",
    tagline: "Your professional home base",
    description:
      "Headline, experience, skills, portfolio links, resume — build it once and share a single link instead of re-typing your story everywhere.",
    icon: UserCircle,
    highlights: [
      "Experience, education, and certifications",
      "Resume upload built in",
      "One link for everywhere you apply",
    ],
  },
  {
    id: "salary",
    title: "Salary Insights",
    tagline: "Know before you apply",
    description:
      "See real compensation data for the roles and levels you're targeting, sourced from the postings themselves.",
    icon: BarChart3,
    highlights: [
      "Real compensation data, not surveys",
      "Filter by role and experience level",
      "Negotiate from a position of knowledge",
    ],
  },
  {
    id: "pro-alerts",
    title: "Pro: Email Alerts",
    tagline: "Be first, not fastest",
    description:
      "Pro sends you an instant email the moment a company you follow posts a new role — so you're applying in minutes, not days.",
    icon: Mail,
    highlights: [
      "Instant email when followed companies post",
      "Priority support",
      "Early access to new features",
    ],
    pro: true,
  },
];
