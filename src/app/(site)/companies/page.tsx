import type { Metadata } from "next";
import CompaniesPageClient from "@/components/CompaniesPage/CompaniesPageClient";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { backendGet } from "@/lib/api/server-client";
import type {
  CompanyListResponse,
  CompanyOverview,
} from "@/lib/api/contracts";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildCompaniesBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";

type CompaniesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(
  value: string | string[] | undefined,
  fallback: string,
): string {
  if (!value) return fallback;
  return Array.isArray(value) ? value[0] || fallback : value;
}

// Plain pagination (?page=N, nothing else) is a real, distinct, crawlable
// listing — each page should canonicalize to itself so Google indexes the
// full sequence rather than folding every page's links into page 1. Any
// other filter (q/letter/hiring) produces near-infinite low-value
// combinations, so those collapse to the bare /companies canonical instead.
export async function generateMetadata({
  searchParams,
}: CompaniesPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const q = getSingleParam(sp.q, "");
  const page = getSingleParam(sp.page, "1");
  const letter = getSingleParam(sp.letter, "ALL");
  const hiring = getSingleParam(sp.hiring, "false");

  const isPlainPagination = !q && letter === "ALL" && hiring === "false";
  const path =
    isPlainPagination && page !== "1" ? `/companies?page=${page}` : "/companies";

  return buildPageMetadata({
    title: "Browse Companies Hiring on WorkWay — Find Top Employers & Open Jobs",
    description:
      "Explore thousands of companies hiring across startups and tech firms. Browse company profiles, open roles, teams, and hiring details on WorkWay.",
    path,
  });
}

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const sp = await searchParams;
  const q = getSingleParam(sp.q, "");
  const page = getSingleParam(sp.page, "1");
  const limit = getSingleParam(sp.limit, "20");
  const letter = getSingleParam(sp.letter, "ALL");
  const hiring = getSingleParam(sp.hiring, "false");

  const [overview, list] = await Promise.all([
    backendGet<CompanyOverview>("/api/company/overview"),
    backendGet<CompanyListResponse>("/api/company", {
      query: { q, page, limit, letter, hiring },
    }),
  ]);

  const breadcrumbs = buildCompaniesBreadcrumb();

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="mx-auto w-full max-w-6xl px-6 pt-10">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <CompaniesPageClient overview={overview} list={list} />
    </>
  );
}
