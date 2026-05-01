import type { CompanyDetails, JobDetails, JobListing } from "@/types/jobs";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumbs";
import { getSiteUrl } from "@/lib/seo/metadata";

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

function extractJobDescriptionText(
  description: JobDetails["description"],
): string {
  if (!description) return "";
  if (typeof description === "string") return description.slice(0, 2000);
  return description
    .map((s) => `${s.heading}\n${s.content.join(" ")}`)
    .join("\n\n")
    .slice(0, 2000);
}

function parseBaseSalary(compensation?: string) {
  if (!compensation) return undefined;
  const match = compensation.match(/\$?([\d,]+)[kK]?\s*[-–]\s*\$?([\d,]+)[kK]?/);
  if (!match) return undefined;
  const parse = (v: string) => {
    const n = parseFloat(v.replace(/,/g, ""));
    return compensation.toLowerCase().includes("k") ? n * 1000 : n;
  };
  return {
    "@type": "MonetaryAmount",
    currency: "USD",
    value: {
      "@type": "QuantitativeValue",
      minValue: parse(match[1]),
      maxValue: parse(match[2]),
      unitText: "YEAR",
    },
  };
}

export function buildJobPostingJsonLd(job: JobDetails) {
  const isRemote = /remote/i.test(job.location);
  const descriptionText = extractJobDescriptionText(job.description);
  const baseSalary = parseBaseSalary(job.metadata?.compensation);

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: descriptionText || `${job.title} position at ${job.company} in ${job.location}.`,
    datePosted: job.created_at || undefined,
    employmentType: job.employment_type || undefined,
    ...(isRemote ? { jobLocationType: "TELECOMMUTE" } : {}),
    ...(baseSalary ? { baseSalary } : {}),
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

export function buildJobsPageItemListJsonLd(jobs: JobListing[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: jobs.slice(0, 20).map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/job/${job.slug}`,
      name: job.title,
    })),
    url: `${getSiteUrl()}/jobs`,
  };
}

export function buildFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const isLast = index === items.length - 1;
      const hasHref = !!item.href;

      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        // For the last item we allow omitting "item" so Google uses the page URL.
        ...(hasHref && !isLast
          ? { item: `${siteUrl}${item.href}` }
          : undefined),
      };
    }),
  };
}

