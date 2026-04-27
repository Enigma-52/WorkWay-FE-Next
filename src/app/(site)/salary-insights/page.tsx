import type { Metadata } from "next";
import { backendGet } from "@/lib/api/server-client";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildSalaryInsightsBreadcrumb } from "@/lib/seo/breadcrumbs";
import dynamic from "next/dynamic";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

const SalaryInsightsClient = dynamic(() => import("./SalaryInsightsClient"));

export type SalaryJob = {
  id: number;
  title: string;
  company: string;
  slug: string;
  domain: string;
  location: string;
  experience_level: string;
  employment_type: string;
  compensation: string;
  company_logo_url?: string;
  company_slug?: string;
  platform?: string;
  url?: string;
  updated_at?: string;
  skills?: { name: string; slug: string }[];
  metadata?: Record<string, any>;
  salary_min: number | null;
  salary_max: number | null;
  salary_mid: number | null;
  offers_equity: boolean;
  offers_bonus: boolean;
  created_at: string;
};

export type SalaryInsightsData = {
  stats: {
    total_jobs: number;
    jobs_with_salary: number;
    equity_count: number;
    bonus_count: number;
    avg_salary: number;
    median_salary: number;
  };
  salary_buckets: Record<string, number>;
  by_domain: { domain: string; avg_salary: number; count: number }[];
  by_experience_level: { level: string; avg_salary: number; count: number }[];
  jobs: SalaryJob[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(
  value: string | string[] | undefined,
  fallback: string
): string {
  if (!value) return fallback;
  return Array.isArray(value) ? value[0] || fallback : value;
}

function formatK(n: number) {
  return n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const domain = getSingleParam(sp.domain, "");
  const level = getSingleParam(sp.experience_level, "");
  const page = Number(getSingleParam(sp.page, "1")) || 1;

  const hasFilters = domain || level;
  const noIndex = hasFilters || page > 1;

  const domainLabel = domain && domain !== "all" ? ` in ${domain}` : "";
  const levelLabel = level && level !== "all" ? ` for ${level}` : "";

  const title = `Salary Insights${domainLabel}${levelLabel} — Tech Compensation Data | WorkWay`;
  const description = `Explore salary ranges, equity, and bonus data across tech roles${domainLabel}${levelLabel}. Compare average and median salaries by domain and experience level.`;

  const qs = new URLSearchParams();
  if (domain && domain !== "all") qs.set("domain", domain);
  if (level && level !== "all") qs.set("experience_level", level);
  if (page > 1) qs.set("page", String(page));
  const path = qs.toString() ? `/salary-insights?${qs}` : "/salary-insights";

  return buildPageMetadata({
    title,
    description,
    path,
    robots: noIndex ? { index: false, follow: true } : undefined,
    keywords: [
      "salary insights",
      "tech compensation",
      "salary data",
      "equity",
      "bonus",
      "salary ranges",
      ...(domain && domain !== "all" ? [`${domain} salary`, `${domain} compensation`] : []),
      ...(level && level !== "all" ? [`${level} salary`] : []),
    ],
  });
}

function buildSalaryInsightsJsonLd(data: SalaryInsightsData) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Tech Salary Insights — WorkWay",
    description: `Salary data from ${data.stats.total_jobs} tech jobs with published compensation. Average salary: ${formatK(data.stats.avg_salary)}, Median: ${formatK(data.stats.median_salary)}. ${data.stats.equity_count} offer equity, ${data.stats.bonus_count} offer bonus.`,
    url: "https://www.workway.dev/salary-insights",
    keywords: [
      "salary",
      "compensation",
      "tech jobs",
      "equity",
      "bonus",
      ...data.by_domain.slice(0, 5).map((d) => `${d.domain} salary`),
    ],
    creator: {
      "@type": "Organization",
      name: "WorkWay",
      url: "https://www.workway.dev",
    },
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "Average Salary",
        value: data.stats.avg_salary,
        unitCode: "USD",
      },
      {
        "@type": "PropertyValue",
        name: "Median Salary",
        value: data.stats.median_salary,
        unitCode: "USD",
      },
      {
        "@type": "PropertyValue",
        name: "Jobs with Salary Data",
        value: data.stats.total_jobs,
      },
    ],
  };
}

export default async function SalaryInsightsPage({
  searchParams,
}: PageProps) {
  const sp = await searchParams;

  const query: Record<string, string | number> = {
    page: Number(getSingleParam(sp.page, "1")) || 1,
    limit: 20,
    sort: getSingleParam(sp.sort, "recent"),
    domain: getSingleParam(sp.domain, "all"),
    experience_level: getSingleParam(sp.experience_level, "all"),
    employment_type: getSingleParam(sp.employment_type, "all"),
    equity: getSingleParam(sp.equity, "all"),
    bonus: getSingleParam(sp.bonus, "all"),
  };
  const loc = getSingleParam(sp.location, "");
  if (loc) query.location = loc;

  const data = await backendGet<SalaryInsightsData>(
    "/api/job/salary-insights",
    { query, revalidate: false }
  ).catch(() => null);

  if (!data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">
          Unable to load salary insights right now.
        </p>
      </div>
    );
  }

  const breadcrumbs = buildSalaryInsightsBreadcrumb();

  return (
    <>
      <JsonLd data={buildSalaryInsightsJsonLd(data)} />
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="mx-auto w-full max-w-6xl px-6 pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <SalaryInsightsClient data={data} />
    </>
  );
}
