import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SkillPageClient from "@/components/dynamic/SkillPageClient";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { backendGet } from "@/lib/api/server-client";
import { buildItemListJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildSkillDetailBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { SkillJobsPayload } from "@/types/jobs";

type SkillPageProps = {
  params: Promise<{ skillSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(
  value: string | string[] | undefined,
  fallback: string,
): string {
  if (!value) return fallback;
  return Array.isArray(value) ? value[0] || fallback : value;
}

export async function generateMetadata({
  params,
  searchParams,
}: SkillPageProps): Promise<Metadata> {
  const { skillSlug } = await params;
  const sp = await searchParams;

  const page = getSingleParam(sp.page, "1");
  const employmentType = getSingleParam(sp.employment_type, "all");
  const employmentLevel = getSingleParam(sp.employment_level, "all");
  const location = getSingleParam(sp.location, "all");

  const data = await backendGet<SkillJobsPayload>("/api/filter/skill", {
    query: {
      slug: skillSlug,
      page: Number(page),
      employment_type: employmentType,
      employment_level: employmentLevel,
      location,
    },
  }).catch(() => null);

  if (!data) {
    return buildPageMetadata({
      title: "Jobs — WorkWay",
      description: "Browse jobs on WorkWay.",
      path: `/skill/${skillSlug}`,
    });
  }

  const skillName = data.skill?.name || "Jobs";
  const total = data.meta?.total || 0;
  let title = `${skillName} Jobs (${total.toLocaleString()} Open Roles) | WorkWay`;
  let description = `Browse ${total.toLocaleString()} open ${skillName.toLowerCase()} jobs across top companies. Find the latest roles, apply directly, and explore opportunities on WorkWay.`;

  const parts: string[] = [];
  if (employmentLevel !== "all") parts.push(employmentLevel);
  if (employmentType !== "all") parts.push(employmentType);
  if (location !== "all") parts.push(`in ${location}`);
  if (parts.length > 0) {
    const suffix = parts.join(" ");
    title = `${skillName} Jobs ${suffix} | WorkWay`;
    description = `Browse ${skillName.toLowerCase()} jobs ${suffix}. Find open roles across top companies and apply on WorkWay.`;
  }
  if (page !== "1") title = `${title} — Page ${page}`;

  const qp = new URLSearchParams({
    ...(page !== "1" ? { page } : {}),
    ...(employmentType !== "all" ? { employment_type: employmentType } : {}),
    ...(employmentLevel !== "all" ? { employment_level: employmentLevel } : {}),
    ...(location !== "all" ? { location } : {}),
  }).toString();

  const filteredView = parts.length > 0 || page !== "1";
  return buildPageMetadata({
    title,
    description,
    path: filteredView ? `/skill/${skillName}` : qp ? `/skill/${skillName}?${qp}` : `/skill/${skillName}`,
    robots: filteredView ? { index: false, follow: true } : { index: true, follow: true },
    keywords: [
        skillName,
        `${skillName} jobs`,
        `${skillName} job openings`,
        `${skillName} developer jobs`,
        `${skillName} engineer jobs`,
        `${skillName} hiring`,
        `${skillName} careers`,
        `${skillName} remote jobs`,
        `${skillName} jobs India`,
        `${skillName} jobs Bangalore`,
        `${skillName} fresher jobs`,
        `${skillName} internship`,
        `${skillName} senior ${skillName} jobs`,
        `${skillName} salary`,
        `${skillName} demand`,
        `companies hiring ${skillName}`,
        `${skillName} tech stack`,
        `${skillName} projects`,
        `${skillName} interview questions`,
      ]
  });
}

export default async function SkillPage({
  params,
  searchParams,
}: SkillPageProps) {
  const { skillSlug } = await params;
  const sp = await searchParams;
  const page = Number(getSingleParam(sp.page, "1"));
  const employmentType = getSingleParam(sp.employment_type, "all");
  const employmentLevel = getSingleParam(sp.employment_level, "all");
  const location = getSingleParam(sp.location, "all");

  const data = await backendGet<SkillJobsPayload>("/api/filter/skill", {
    query: {
      slug: skillSlug,
      page,
      employment_type: employmentType,
      employment_level: employmentLevel,
      location,
    },
  }).catch(() => null);

  if (!data || !data.skill) {
    notFound();
  }

  const breadcrumbs = buildSkillDetailBreadcrumb(data.skill.name);

  return (
    <>
      <JsonLd data={buildItemListJsonLd(skillSlug, data.jobs)} />
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="mx-auto w-full max-w-6xl px-6 pt-10">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <SkillPageClient data={data} />
    </>
  );
}
