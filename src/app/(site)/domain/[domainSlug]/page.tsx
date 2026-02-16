import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DomainPageClient from "@/components/dynamic/DomainPageClient";
import JsonLd from "@/components/seo/JsonLd";
import { backendGet } from "@/lib/api/server-client";
import { buildItemListJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { DomainJobsPayload } from "@/types/jobs";

type DomainPageProps = {
  params: Promise<{ domainSlug: string }>;
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
}: DomainPageProps): Promise<Metadata> {
  const { domainSlug } = await params;
  const sp = await searchParams;

  const page = getSingleParam(sp.page, "1");
  const employmentType = getSingleParam(sp.employment_type, "all");
  const employmentLevel = getSingleParam(sp.employment_level, "all");
  const location = getSingleParam(sp.location, "all");

  const data = await backendGet<DomainJobsPayload>("/api/filter/domain", {
    query: {
      slug: domainSlug,
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
      path: `/domain/${domainSlug}`,
    });
  }

  const domainName = data.domain?.name || "Jobs";
  const total = data.meta?.total || 0;
  let title = `${domainName} Jobs (${total.toLocaleString()} Open Roles) | WorkWay`;
  let description = `Browse ${total.toLocaleString()} open ${domainName.toLowerCase()} jobs across top companies. Find the latest roles, apply directly, and explore opportunities on WorkWay.`;

  const parts: string[] = [];
  if (employmentLevel !== "all") parts.push(employmentLevel);
  if (employmentType !== "all") parts.push(employmentType);
  if (location !== "all") parts.push(`in ${location}`);
  if (parts.length > 0) {
    const suffix = parts.join(" ");
    title = `${domainName} Jobs ${suffix} | WorkWay`;
    description = `Browse ${domainName.toLowerCase()} jobs ${suffix}. Find open roles across top companies and apply on WorkWay.`;
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
    path: filteredView ? `/domain/${domainSlug}` : qp ? `/domain/${domainSlug}?${qp}` : `/domain/${domainSlug}`,
    robots: filteredView ? { index: false, follow: true } : { index: true, follow: true },
  });
}

export default async function DomainPage({
  params,
  searchParams,
}: DomainPageProps) {
  const { domainSlug } = await params;
  const sp = await searchParams;
  const page = Number(getSingleParam(sp.page, "1"));
  const employmentType = getSingleParam(sp.employment_type, "all");
  const employmentLevel = getSingleParam(sp.employment_level, "all");
  const location = getSingleParam(sp.location, "all");

  const data = await backendGet<DomainJobsPayload>("/api/filter/domain", {
    query: {
      slug: domainSlug,
      page,
      employment_type: employmentType,
      employment_level: employmentLevel,
      location,
    },
  }).catch(() => null);

  if (!data || !data.domain) {
    notFound();
  }

  return (
    <>
      <JsonLd data={buildItemListJsonLd(domainSlug, data.jobs)} />
      <DomainPageClient data={data} />
    </>
  );
}
