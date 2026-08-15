import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JobPageClient from "@/components/dynamic/JobPageClient";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { backendGet } from "@/lib/api/server-client";
import { buildJobPostingJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildJobDetailBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { JobDetails, JobInsights, SalaryInsightRow } from "@/types/jobs";
import type { CompanyListResponse } from "@/lib/api/contracts";

// Stopgap until real job-closure tracking exists (no cron currently marks a
// job inactive when its source ATS listing closes) — age is used as a proxy
// for "likely closed" to stop feeding Google's index a growing backlog of
// probably-dead postings. See docs/FEATURES.md's SEO section.
const NOINDEX_AFTER_DAYS = 60;

function isOlderThanNoindexThreshold(createdAt: string | undefined): boolean {
  if (!createdAt) return false;
  const ageMs = Date.now() - new Date(createdAt).getTime();
  return ageMs > NOINDEX_AFTER_DAYS * 24 * 60 * 60 * 1000;
}

type SalaryInsightsResponse = {
  by_domain: { domain: string; avg_salary: number; count: number }[];
  by_experience_level: { level: string; avg_salary: number; count: number }[];
};

async function fetchJobInsights(job: JobDetails): Promise<JobInsights> {
  const [companyRes, salaryRes] = await Promise.all([
    backendGet<CompanyListResponse>("/api/company", {
      query: { q: job.company, limit: 1 },
      forwardHeaders: false,
      revalidate: 3600,
    }).catch(() => null),
    backendGet<SalaryInsightsResponse>("/api/job/salary-insights", {
      forwardHeaders: false,
      revalidate: 3600,
    }).catch(() => null),
  ]);

  const companyOpenJobs = companyRes?.companies?.[0]?.jobs_open_count;
  const domainSalary: SalaryInsightRow | undefined = salaryRes?.by_domain.find(
    (r) => r.domain === job.domain
  );
  const levelSalary: SalaryInsightRow | undefined =
    salaryRes?.by_experience_level.find((r) => r.level === job.experience_level);

  return { companyOpenJobs, domainSalary, levelSalary };
}

// Job pages have enormous, ever-growing cardinality (one per job posting,
// most viewed only a handful of times ever). Statically caching each one
// via revalidate/dynamicParams writes a permanent __PAGE__.segment.rsc file
// per slug that Next never evicts on self-hosted deployments — this grew
// to 2.85M files / 56.7GiB on disk. Render fully dynamic instead.
export const dynamic = "force-dynamic";

type JobPageProps = {
  params: Promise<{ jobSlug: string }>;
};

export async function generateMetadata({
  params,
}: JobPageProps): Promise<Metadata> {
  const { jobSlug } = await params;
  const job = await backendGet<JobDetails>("/api/job/details", {
    query: { slug: jobSlug },
    forwardHeaders: false,
    revalidate: false,
  }).catch(() => null);

  if (!job) {
    return {
      title: "Job Not Found — WorkWay",
      description: "Requested job does not exist.",
    };
  }

  const topSkills = job.skills?.slice(0, 3).map((s) => s.name) ?? [];

  const ycTag = job.platform === "ycombinator" ? " (YC)" : "";

  // Kept short (~60 chars title, ~155 chars description) so Google doesn't
  // truncate these in search results — role + company first, since those are
  // the highest-value keywords for job search intent.
  return buildPageMetadata({
    title: `${job.title} at ${job.company}${ycTag} | WorkWay`,
    description: `${job.title} at ${job.company}${ycTag} in ${job.location}. ${job.employment_type} · ${job.experience_level}. Apply on WorkWay.`,
    path: `/job/${jobSlug}`,
    image: job.company_logo_url || "/logo.png",
    // Stopgap until real job-closure tracking exists: postings past this age
    // are increasingly likely closed, and there's no signal yet that marks a
    // job inactive when it actually closes. `follow: true` keeps links on the
    // page (similar jobs, company page) crawlable — only this page itself
    // drops out of the index.
    robots: isOlderThanNoindexThreshold(job.created_at)
      ? { index: false, follow: true }
      : undefined,
    keywords: [
      job.title,
      `${job.title} jobs`,
      `${job.title} at ${job.company}`,
      `${job.title} in ${job.location}`,
      `${job.company} careers`,
      `${job.company} jobs`,
      `${job.company} hiring`,
      job.domain,
      ...topSkills.map((s) => `${s} jobs`),
    ],
  });
}

export default async function JobPage({ params }: JobPageProps) {
  const { jobSlug } = await params;
  const job = await backendGet<JobDetails>("/api/job/details", {
    query: { slug: jobSlug },
    forwardHeaders: false,
    revalidate: false,
  }).catch(() => null);

  if (!job || !job.slug) {
    notFound();
  }

  const breadcrumbs = buildJobDetailBreadcrumb(job.title);
  const insights = await fetchJobInsights(job);

  // Only the first description section ships in the initial HTML/RSC
  // payload — JobPageClient fetches the rest client-side on "View full
  // description" so the full verbatim ATS text isn't part of what
  // Googlebot's default render sees. JSON-LD above still uses the full
  // `job` object (buildJobPostingJsonLd already caps at 2000 chars on its
  // own, unrelated to this).
  const hasMoreDescription =
    Array.isArray(job.description) && job.description.length > 1;
  const previewJob =
    Array.isArray(job.description) && job.description.length > 1
      ? { ...job, description: job.description.slice(0, 1) }
      : job;

  return (
    <>
      <JsonLd data={buildJobPostingJsonLd(job)} />
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="flex justify-center bg-background">
        <div className="w-full max-w-7xl px-4 pt-4 md:px-6 md:pt-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>
      <JobPageClient
        job={previewJob}
        insights={insights}
        hasMoreDescription={hasMoreDescription}
      />
    </>
  );
}
