import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JobPageClient from "@/components/dynamic/JobPageClient";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { backendGet } from "@/lib/api/server-client";
import { buildJobPostingJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildJobDetailBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { JobDetails } from "@/types/jobs";

type JobPageProps = {
  params: Promise<{ jobSlug: string }>;
};

export async function generateMetadata({
  params,
}: JobPageProps): Promise<Metadata> {
  const { jobSlug } = await params;
  const job = await backendGet<JobDetails>("/api/job/details", {
    query: { slug: jobSlug },
  }).catch(() => null);

  if (!job) {
    return {
      title: "Job Not Found — WorkWay",
      description: "Requested job does not exist.",
    };
  }

  return buildPageMetadata({
    title: `${job.title} at ${job.company} (${job.location}) | WorkWay`,
    description: `Apply for the ${job.title} role at ${job.company} in ${job.location}. ${job.experience_level} · ${job.employment_type}. View full job details and apply.`,
    path: `/job/${jobSlug}`,
    image: job.company_logo_url || "/logo.png",
    keywords: [
        job.title,
        `${job.title} jobs`,
        `${job.title} in ${job.location}`,
        `${job.company} careers`,
        `${job.company} jobs`,
        `${job.company} hiring`,
    ]
  });
}

export default async function JobPage({ params }: JobPageProps) {
  const { jobSlug } = await params;
  const job = await backendGet<JobDetails>("/api/job/details", {
    query: { slug: jobSlug },
  }).catch(() => null);

  if (!job || !job.slug) {
    notFound();
  }

  const breadcrumbs = buildJobDetailBreadcrumb(job.title);

  return (
    <>
      <JsonLd data={buildJobPostingJsonLd(job)} />
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="flex justify-center bg-background">
        <div className="w-full max-w-7xl px-4 pt-4 md:px-6 md:pt-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>
      <JobPageClient job={job} />
    </>
  );
}
