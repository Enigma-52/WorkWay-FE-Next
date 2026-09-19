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
import { cache } from "react";

type SalaryInsightsResponse = {
  by_domain: { domain: string; avg_salary: number; count: number }[];
  by_experience_level: { level: string; avg_salary: number; count: number }[];
};

// generateMetadata and JobPage both need the same job; revalidate: false
// opts out of Next's fetch dedupe, so without React.cache every pageview
// hit /api/job/details twice.
const fetchJobDetails = cache((jobSlug: string) =>
  backendGet<JobDetails>("/api/job/details", {
    query: { slug: jobSlug },
    forwardHeaders: false,
    revalidate: false,
  })
);

async function fetchJobInsights(job: JobDetails): Promise<JobInsights> {
  // The company's open-role count comes back on the details payload itself
  // (company_open_jobs) — previously this ran a full /api/company name search
  // per pageview just to read one number.
  const salaryRes = await backendGet<SalaryInsightsResponse>("/api/job/salary-insights", {
    forwardHeaders: false,
    revalidate: 3600,
  }).catch(() => null);

  const companyOpenJobs =
    typeof job.company_open_jobs === "number" ? job.company_open_jobs : undefined;
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
  const job = await fetchJobDetails(jobSlug).catch(() => null);

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
  const job = await fetchJobDetails(jobSlug).catch(() => null);

  if (!job || !job.slug) {
    notFound();
  }

  const breadcrumbs = buildJobDetailBreadcrumb(job.title);
  const insights = await fetchJobInsights(job);

  return (
    <>
      <JsonLd data={buildJobPostingJsonLd(job)} />
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="flex justify-center bg-background">
        <div className="w-full max-w-7xl px-4 pt-4 md:px-6 md:pt-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>
      <JobPageClient job={job} insights={insights} />
    </>
  );
}
