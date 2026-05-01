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

  const topSkills = job.skills?.slice(0, 3).map((s) => s.name) ?? [];
  const skillsText = topSkills.length > 0 ? ` Skills: ${topSkills.join(", ")}.` : "";

  return buildPageMetadata({
    title: `${job.title} at ${job.company} — ${job.employment_type} Job in ${job.location} | WorkWay`,
    description: `Apply for the ${job.title} role at ${job.company} in ${job.location}.${skillsText} ${job.experience_level} · ${job.employment_type}. View full details and apply on WorkWay.`,
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
      <h1 className="sr-only">
        {job.title} at {job.company} — {job.employment_type},{" "}
        {job.experience_level} Position in {job.location}
      </h1>
      <div className="flex justify-center bg-background">
        <div className="w-full max-w-7xl px-4 pt-4 md:px-6 md:pt-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>
      <JobPageClient job={job} />
    </>
  );
}
