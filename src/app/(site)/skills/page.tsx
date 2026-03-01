import type { Metadata } from "next";
import { backendGet } from "@/lib/api/server-client";
import AllSkillsPageClient from "@/components/dynamic/AllSkillsPageClient";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { type  SkillsPageResponse} from "@/lib/api/contracts"

export const metadata: Metadata = buildPageMetadata({
  title: "Browse Jobs by Skills | WorkWay",
  description:
    "Explore jobs across all major skills including software engineering, design, data science, finance, marketing, operations and more. Find your next role on WorkWay.",
  path: "/skills",
});

export default async function SkillsPage() {
  const data = await backendGet<SkillsPageResponse>(
    "/api/filter/skills/all"
  );

  return <AllSkillsPageClient data={data} />;
}