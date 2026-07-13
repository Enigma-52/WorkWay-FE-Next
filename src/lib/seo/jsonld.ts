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

function extractCountryFromLocation(location: string): string {
  const loc = location.toLowerCase();
  const countryMap: Record<string, string> = {
    "usa": "USA", "us": "USA", "united states": "USA",
    "uk": "United Kingdom", "united kingdom": "United Kingdom",
    "canada": "Canada", "india": "India", "germany": "Germany",
    "france": "France", "australia": "Australia", "singapore": "Singapore",
    "japan": "Japan", "brazil": "Brazil", "netherlands": "Netherlands",
    "spain": "Spain", "italy": "Italy", "sweden": "Sweden",
    "ireland": "Ireland", "israel": "Israel", "south korea": "South Korea",
  };
  for (const [key, name] of Object.entries(countryMap)) {
    if (loc.includes(key)) return name;
  }
  // Check common US state/city patterns
  if (/\b(ca|ny|tx|sf|nyc|san francisco|new york|seattle|austin|boston|chicago|denver|miami|la|los angeles)\b/i.test(loc)) {
    return "USA";
  }
  return "";
}

// Source data has no real job-closing date. Google actively penalizes job
// aggregators that omit validThrough — it treats undated postings as
// suspicious "always open" listings and can reduce the domain's trust score
// in Google for Jobs over repeated instances. 30 days from datePosted is the
// standard heuristic for aggregators without a real expiry signal.
const VALID_THROUGH_DAYS = 60;

function computeValidThrough(datePosted?: string): string | undefined {
  if (!datePosted) return undefined;
  const posted = new Date(datePosted);
  if (Number.isNaN(posted.getTime())) return undefined;
  const validThrough = new Date(posted);
  validThrough.setDate(validThrough.getDate() + VALID_THROUGH_DAYS);
  return validThrough.toISOString();
}

export function buildJobPostingJsonLd(job: JobDetails) {
  const isRemote = /remote/i.test(job.location);
  const descriptionText = extractJobDescriptionText(job.description);
  const baseSalary = parseBaseSalary(job.metadata?.compensation);
  const country = extractCountryFromLocation(job.location);

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: descriptionText || `${job.title} position at ${job.company} in ${job.location}.`,
    datePosted: job.created_at || undefined,
    validThrough: computeValidThrough(job.created_at),
    employmentType: job.employment_type || undefined,
    ...(isRemote
      ? {
          jobLocationType: "TELECOMMUTE",
          applicantLocationRequirements: {
            "@type": "Country",
            name: country || "Worldwide",
          },
        }
      : {}),
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

