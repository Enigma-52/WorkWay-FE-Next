import type { Metadata } from "next";
import { Suspense } from "react";
import { backendGet } from "@/lib/api/server-client";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildJobsPageItemListJsonLd,
} from "@/lib/seo/jsonld";
import { buildInternshipsBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildJobListQuery } from "@/lib/jobs/listQuery";
import type { JobListResponse } from "@/types/jobs";
import JobsPageClient from "@/components/JobsPage/JobsPageClient";
import CategoryFaq from "@/components/seo/CategoryFaq";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

const JOB_LIST_REVALIDATE = false;

type InternshipsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const EMPTY_LIST_RESPONSE: JobListResponse = {
  jobs: [],
  meta: { page: 1, limit: 20, total: 0, total_pages: 0, has_next: false, has_prev: false },
  applied_filters: {},
  facets: { domains: [], employment_types: [], experience_levels: [] },
};

export async function generateMetadata({
  searchParams,
}: InternshipsPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const query = buildJobListQuery(sp, { experience_level: "Intern" });
  const data = await backendGet<JobListResponse>("/api/job/list", {
    query,
    revalidate: JOB_LIST_REVALIDATE,
    forwardHeaders: false,
  }).catch(() => null);

  const total = data?.meta?.total ?? 0;
  const title =
    total > 0
      ? `Internship Jobs (${total.toLocaleString()} Open Roles) | WorkWay`
      : "Internship Jobs — Tech Internships | WorkWay";
  const description =
    total > 0
      ? `Browse ${total.toLocaleString()} open internships across top companies, pulled straight from their own career pages. Filter by domain and location, and apply directly — no re-posted listings.`
      : "Browse internships across top companies, pulled straight from their own career pages. Apply directly, no re-posted listings.";

  const isBaseView = query.page === 1 && query.domain === "all" && query.employment_type === "all" && !query.location;
  return buildPageMetadata({
    title,
    description,
    path: "/internships",
    robots: isBaseView ? { index: true, follow: true } : { index: false, follow: true },
    keywords: [
      "internship jobs",
      "tech internships",
      "software engineering internship",
      "internships for students",
      "summer internship",
      "internship hiring now",
      "paid internships tech",
      "remote internships",
    ],
  });
}

async function InternshipsListSection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = buildJobListQuery(sp, { experience_level: "Intern" });

  const data = await backendGet<JobListResponse>("/api/job/list", {
    query,
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
      {payload.meta.total > 0 && (
        <div className="mx-auto w-full max-w-6xl px-6 pb-16">
          <CategoryFaq topic="internships" total={payload.meta.total} jobs={payload.jobs} />
        </div>
      )}
    </>
  );
}

function InternshipsListSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-6 animate-pulse">
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <div className="hidden md:block space-y-3">
          <div className="h-4 w-24 rounded bg-secondary" />
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

export default function InternshipsPage({ searchParams }: InternshipsPageProps) {
  const breadcrumbs = buildInternshipsBreadcrumb();

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="mx-auto w-full max-w-6xl px-6 pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Internship Jobs
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-3xl">
          Most internship listings are buried on individual company career
          pages, posted for a few weeks around campus recruiting season and
          then taken down the moment the cohort fills up, which means the
          window to actually find one is short and easy to miss if you are
          relying on a general job board that only re-indexes postings once
          every few days. WorkWay pulls internship-tagged roles directly from
          the same Greenhouse, Lever, and Ashby feeds that companies use to
          publish full-time openings, updates them daily, and links straight
          through to the original application, so what you see here is the
          same live internship pipeline the company itself is running, not a
          stale copy scraped from somewhere else. That matters most for
          internships specifically, because the difference between applying
          on day one of a posting and applying on day twenty is often the
          difference between getting a response and getting nothing at all —
          internship classes tend to be small, they fill in rolling batches,
          and the roles most worth having close first. Use the filters below
          to narrow this list down to a specific domain, like backend
          engineering or data science, or a specific location if you need
          something on-site or in a particular time zone, and apply directly
          on the company&apos;s own page with one click.
        </p>
      </div>

      <Suspense fallback={<InternshipsListSkeleton />}>
        <InternshipsListSection searchParams={searchParams} />
      </Suspense>
    </>
  );
}
