import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CompanyPageClient from "@/components/dynamic/CompanyPageClient";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { backendGet } from "@/lib/api/server-client";
import {
  buildOrganizationJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seo/jsonld";
import { buildCompanyDetailBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { CompanyDetails } from "@/types/jobs";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

type CompanyPageProps = {
  params: Promise<{ companySlug: string }>;
};

export async function generateMetadata({
  params,
}: CompanyPageProps): Promise<Metadata> {
  const { companySlug } = await params;
  const company = await backendGet<CompanyDetails>("/api/company/details", {
    query: { slug: companySlug },
    forwardHeaders: false,
  }).catch(() => null);

  if (!company) {
    return buildPageMetadata({
      title: "Company Not Found — WorkWay",
      description: "Requested company does not exist.",
      path: `/company/${companySlug}`,
    });
  }

  const count = company.totalJobs || 0;
  const ycTag =
    company.platform === "ycombinator" && company.metadata?.ycBatch
      ? ` (YC ${company.metadata.ycBatch})`
      : "";
  const roleWord = count === 1 ? "Role" : "Roles";
  const title =
    count > 0
      ? `${company.name}${ycTag} Jobs & Careers - ${count} Open ${roleWord} | WorkWay`
      : `${company.name}${ycTag} Careers & Company Profile | WorkWay`;
  const description =
    count > 0
      ? `Apply to ${count} open role${count === 1 ? "" : "s"} at ${company.name}${ycTag}. View open jobs, teams, and hiring details on WorkWay.`
      : `Explore ${company.name}${ycTag}'s company profile, teams, and hiring information on WorkWay.`;

  return buildPageMetadata({
    title,
    description,
    path: `/company/${companySlug}`,
    image: company.logo_url || "/logo.png",
    keywords: [
      company.name,
      `${company.name} careers`,
      `${company.name} jobs`,
      `${company.name} hiring`,
      `${company.name} job openings`,
      `${company.name} recruitment`,
      `${company.name} company profile`,
      `${company.name} work culture`,
      `${company.name} open positions`,
    ],
  });
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { companySlug } = await params;
  const company = await backendGet<CompanyDetails>("/api/company/details", {
    query: { slug: companySlug },
    forwardHeaders: false,
  }).catch(() => null);

  if (!company || !company.name) {
    notFound();
  }

  const breadcrumbs = buildCompanyDetailBreadcrumb(company.name);

  return (
    <>
      <JsonLd data={buildOrganizationJsonLd(company)} />
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="mx-auto w-full max-w-6xl px-6 pt-10">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <CompanyPageClient company={company} />
    </>
  );
}
