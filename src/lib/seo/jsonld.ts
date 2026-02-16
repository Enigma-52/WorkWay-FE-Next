import type { CompanyDetails, JobDetails, JobListing } from "@/types/jobs";

const SITE_URL = "https://www.workway.dev";

export function buildOrganizationJsonLd(company: CompanyDetails) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: `${SITE_URL}/company/${company.slug}`,
    logo: company.logo_url || `${SITE_URL}/logo.png`,
    sameAs: company.website ? [company.website] : undefined,
    description: company.description || undefined,
  };
}

export function buildJobPostingJsonLd(job: JobDetails) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: `${job.title} at ${job.company}`,
    datePosted: job.created_at || undefined,
    employmentType: job.employment_type || undefined,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      sameAs: job.company_url || undefined,
      logo: job.company_logo_url || `${SITE_URL}/logo.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
      },
    },
    url: `${SITE_URL}/job/${job.slug}`,
  };
}

export function buildItemListJsonLd(domainSlug: string, jobs: JobListing[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: jobs.slice(0, 20).map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/job/${job.slug}`,
      name: job.title,
    })),
    url: `${SITE_URL}/domain/${domainSlug}`,
  };
}

