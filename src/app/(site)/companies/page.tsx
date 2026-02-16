import type { Metadata } from "next";
import CompaniesPageClient from "@/components/CompaniesPage/CompaniesPageClient";
import { backendGet } from "@/lib/api/server-client";
import type {
  CompanyListResponse,
  CompanyOverview,
} from "@/lib/api/contracts";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Browse Companies Hiring on WorkWay — Find Top Employers & Open Jobs",
  description:
    "Explore thousands of companies hiring across startups and tech firms. Browse company profiles, open roles, teams, and hiring details on WorkWay.",
  path: "/companies",
});

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

  return (
    <CompaniesPageClient
      overview={overview}
      list={list}
    />
  );
}
