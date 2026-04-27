import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { backendGet } from "@/lib/api/server-client";

const AllSkillsPageClient = dynamic(() => import("@/components/dynamic/AllSkillsPageClient"));
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildSkillsBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import type { SkillsPageResponse } from "@/lib/api/contracts";

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

  const breadcrumbs = buildSkillsBreadcrumb();

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="mx-auto w-full max-w-6xl px-6 pt-10">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <AllSkillsPageClient data={data} />
    </>
  );
}