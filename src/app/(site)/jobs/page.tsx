import type { Metadata } from "next";
import { Suspense } from "react";
import { backendGet } from "@/lib/api/server-client";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildJobsPageItemListJsonLd,
} from "@/lib/seo/jsonld";
import { buildJobsBreadcrumb } from "@/lib/seo/breadcrumbs";
import type { JobListResponse } from "@/types/jobs";
import JobsPageClient from "@/components/JobsPage/JobsPageClient";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

const JOB_LIST_REVALIDATE = false;

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
  const posted = getSingleParam(sp.posted, "all");

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
  if (posted && posted !== "all") query.posted = posted;
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
    revalidate: JOB_LIST_REVALIDATE,
    forwardHeaders: false,
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
  if (query.posted) qs.set("posted", String(query.posted));
  const path = qs.toString() ? `/jobs?${qs.toString()}` : "/jobs";

  return buildPageMetadata({
    title,
    description,
    path,
  });
}

async function JobsListSection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = buildListQuery(sp);

  const data = await backendGet<JobListResponse>("/api/job/list", {
    query: query as Record<string, string | number>,
    revalidate: JOB_LIST_REVALIDATE,
    forwardHeaders: false,
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

function JobsListSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-6 animate-pulse">
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <div className="hidden md:block space-y-3">
          <div className="h-4 w-24 rounded bg-secondary" />
          <div className="h-8 rounded bg-secondary" />
          <div className="h-8 rounded bg-secondary" />
          <div className="h-8 rounded bg-secondary" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-secondary" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function JobsPage({ searchParams }: JobsPageProps) {
  const breadcrumbs = buildJobsBreadcrumb();

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="mx-auto w-full max-w-6xl px-6 pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <Suspense fallback={<JobsListSkeleton />}>
        <JobsListSection searchParams={searchParams} />
      </Suspense>
    </>
  );
}
