import type { Metadata } from "next";
import { backendGet } from "@/lib/api/server-client";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildJobsPageItemListJsonLd } from "@/lib/seo/jsonld";
import type { JobListResponse } from "@/types/jobs";
import JobsPageClient from "@/components/JobsPage/JobsPageClient";
import JsonLd from "@/components/seo/JsonLd";

type JobsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(
  value: string | string[] | undefined,
  fallback: string
): string {
  if (!value) return fallback;
  return Array.isArray(value) ? value[0] || fallback : value;
}

function buildListQuery(
  sp: Record<string, string | string[] | undefined>
): Record<string, string | number> {
  const q = getSingleParam(sp.q, "");
  const page = getSingleParam(sp.page, "1");
  const limit = getSingleParam(sp.limit, "20");
  const domain = getSingleParam(sp.domain, "all");
  const employment_type = getSingleParam(sp.employment_type, "all");
  const experience_level = getSingleParam(sp.experience_level, "all");
  const location = getSingleParam(sp.location, "");
  const company_slug = getSingleParam(sp.company_slug, "");
  const sort = getSingleParam(sp.sort, "recent");

  const query: Record<string, string | number> = {
    page: Number(page) || 1,
    limit: Math.min(50, Math.max(1, Number(limit) || 20)),
    sort,
    domain,
    employment_type,
    experience_level,
  };
  if (q) query.q = q;
  if (location) query.location = location;
  if (company_slug) query.company_slug = company_slug;
  return query;
}

const EMPTY_LIST_RESPONSE: JobListResponse = {
  jobs: [],
  meta: {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  },
  applied_filters: {},
  facets: {
    domains: [],
    employment_types: [],
    experience_levels: [],
  },
};

export async function generateMetadata({
  searchParams,
}: JobsPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const query = buildListQuery(sp);
  const data = await backendGet<JobListResponse>("/api/job/list", {
    query: query as Record<string, string | number>,
  }).catch(() => null);

  const total = data?.meta?.total ?? 0;
  const title = "Find Jobs — Search Open Roles | WorkWay";
  const description =
    total > 0
      ? `Search ${total.toLocaleString()} open positions across top companies. Filter by domain, experience, and location. Apply directly on WorkWay.`
      : "Search and filter thousands of jobs across top companies. Find your next role on WorkWay.";

  const qs = new URLSearchParams();
  if (query.q) qs.set("q", String(query.q));
  if (Number(query.page) > 1) qs.set("page", String(query.page));
  if (query.domain && query.domain !== "all") qs.set("domain", String(query.domain));
  if (query.employment_type && query.employment_type !== "all")
    qs.set("employment_type", String(query.employment_type));
  if (query.experience_level && query.experience_level !== "all")
    qs.set("experience_level", String(query.experience_level));
  if (query.location) qs.set("location", String(query.location));
  const path = qs.toString() ? `/jobs?${qs.toString()}` : "/jobs";

  return buildPageMetadata({
    title,
    description,
    path,
  });
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const sp = await searchParams;
  const query = buildListQuery(sp);

  const data = await backendGet<JobListResponse>("/api/job/list", {
    query: query as Record<string, string | number>,
  }).catch(() => EMPTY_LIST_RESPONSE);

  const payload: JobListResponse =
    data?.jobs && Array.isArray(data.jobs)
      ? {
          jobs: data.jobs,
          meta: data.meta ?? EMPTY_LIST_RESPONSE.meta,
          applied_filters: data.applied_filters ?? {},
          facets: data.facets ?? EMPTY_LIST_RESPONSE.facets,
        }
      : EMPTY_LIST_RESPONSE;

  return (
    <>
      <JsonLd data={buildJobsPageItemListJsonLd(payload.jobs)} />
      <JobsPageClient data={payload} />
    </>
  );
}
