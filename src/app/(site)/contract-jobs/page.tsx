import type { Metadata } from "next";
import { Suspense } from "react";
import { backendGet } from "@/lib/api/server-client";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildJobsPageItemListJsonLd,
} from "@/lib/seo/jsonld";
import { buildContractJobsBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildJobListQuery } from "@/lib/jobs/listQuery";
import type { JobListResponse } from "@/types/jobs";
import JobsPageClient from "@/components/JobsPage/JobsPageClient";
import CategoryFaq from "@/components/seo/CategoryFaq";
import ExploreMoreLinks from "@/components/seo/ExploreMoreLinks";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

const JOB_LIST_REVALIDATE = false;

type ContractJobsPageProps = {
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
}: ContractJobsPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const query = buildJobListQuery(sp, { employment_type: "Contract" });
  const data = await backendGet<JobListResponse>("/api/job/list", {
    query,
    revalidate: JOB_LIST_REVALIDATE,
    forwardHeaders: false,
  }).catch(() => null);

  const total = data?.meta?.total ?? 0;
  const title =
    total > 0
      ? `Contract Jobs (${total.toLocaleString()} Open Roles) | WorkWay`
      : "Contract Jobs — Contract & Freelance Roles | WorkWay";
  const description =
    total > 0
      ? `Browse ${total.toLocaleString()} open contract roles across top companies, pulled straight from their own career pages. Filter by domain and location, and apply directly.`
      : "Browse contract and freelance roles across top companies, pulled straight from their own career pages.";

  const isBaseView = query.page === 1 && query.domain === "all" && query.experience_level === "all" && !query.location;
  return buildPageMetadata({
    title,
    description,
    path: "/contract-jobs",
    robots: isBaseView ? { index: true, follow: true } : { index: false, follow: true },
    keywords: [
      "contract jobs",
      "contract engineering roles",
      "freelance developer jobs",
      "contract to hire jobs",
      "short term contract jobs tech",
      "remote contract jobs",
    ],
  });
}

async function ContractJobsListSection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = buildJobListQuery(sp, { employment_type: "Contract" });

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
        <div className="mx-auto w-full max-w-6xl px-6 pb-16 space-y-10">
          <CategoryFaq topic="contract jobs" total={payload.meta.total} jobs={payload.jobs} />
          <ExploreMoreLinks exclude="/contract-jobs" />
        </div>
      )}
    </>
  );
}

function ContractJobsListSkeleton() {
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

export default function ContractJobsPage({ searchParams }: ContractJobsPageProps) {
  const breadcrumbs = buildContractJobsBreadcrumb();

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="mx-auto w-full max-w-6xl px-6 pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Contract Jobs
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-3xl">
          Contract roles get filtered out of most job searches by accident,
          not on purpose — a lot of general job boards default their search
          to full-time roles and require you to know in advance that a
          separate contract filter exists, and a company's own career page
          often lists a contract opening in the exact same undifferentiated
          feed as every full-time role, with nothing to signal it's actually
          fixed-term or freelance work until you open the posting itself.
          WorkWay tags employment type directly from what each company
          marked the role as on Greenhouse, Lever, or Ashby, so this page
          only shows postings a company itself labeled as contract work,
          updated daily from their live career pages with the original
          apply link intact. That distinction matters if you're
          specifically looking for fixed-term or freelance engagements
          rather than a permanent seat — whether because you're
          between full-time roles, prefer project-based work, or are
          evaluating a company before a longer-term commitment. Use the
          filters below to narrow by domain or location, and apply
          directly on the company's own page.
        </p>
      </div>

      <Suspense fallback={<ContractJobsListSkeleton />}>
        <ContractJobsListSection searchParams={searchParams} />
      </Suspense>
    </>
  );
}
