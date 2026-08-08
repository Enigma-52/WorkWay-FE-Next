import type { Metadata } from "next";
import { Suspense } from "react";
import { backendGet } from "@/lib/api/server-client";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildTalentsBreadcrumb } from "@/lib/seo/breadcrumbs";
import type { TalentSearchResponse } from "@/types/talent";
import TalentsPageClient from "@/components/TalentsPage/TalentsPageClient";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

const TALENT_LIST_REVALIDATE = false;

type TalentsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(
  value: string | string[] | undefined,
  fallback: string
): string {
  if (!value) return fallback;
  return Array.isArray(value) ? value[0] || fallback : value;
}

function buildSearchQuery(
  sp: Record<string, string | string[] | undefined>
): Record<string, string | number> {
  const q = getSingleParam(sp.q, "");
  const page = getSingleParam(sp.page, "1");
  const limit = getSingleParam(sp.limit, "20");
  const category = getSingleParam(sp.category, "all");
  const experience_level = getSingleParam(sp.experience_level, "all");
  const availability_status = getSingleParam(sp.availability_status, "all");
  const country = getSingleParam(sp.country, "");
  const skills = getSingleParam(sp.skills, "");
  const languages = getSingleParam(sp.languages, "");
  const sort = getSingleParam(sp.sort, "newest");

  const query: Record<string, string | number> = {
    page: Number(page) || 1,
    limit: Math.min(50, Math.max(1, Number(limit) || 20)),
    sort,
  };
  if (q) query.q = q;
  if (category && category !== "all") query.category = category;
  if (experience_level && experience_level !== "all") query.experience_level = experience_level;
  if (availability_status && availability_status !== "all") query.availability_status = availability_status;
  if (country) query.country = country;
  if (skills) query.skills = skills;
  if (languages) query.languages = languages;
  return query;
}

const EMPTY_SEARCH_RESPONSE: TalentSearchResponse = {
  profiles: [],
  total: 0,
  page: 1,
  totalPages: 0,
};

export async function generateMetadata({
  searchParams,
}: TalentsPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const query = buildSearchQuery(sp);
  const data = await backendGet<TalentSearchResponse>("/api/talent-profiles/search", {
    query,
    revalidate: TALENT_LIST_REVALIDATE,
    forwardHeaders: false,
  }).catch(() => null);

  const total = data?.total ?? 0;
  const title = "Find Talent — Browse Engineer Profiles | WorkWay";
  const description =
    total > 0
      ? `Browse ${total.toLocaleString()} talent profiles across engineering, design, and product. Filter by category, skills, and availability on WorkWay.`
      : "Browse talent profiles across engineering, design, and product. Find your next hire on WorkWay.";

  const qs = new URLSearchParams();
  if (query.q) qs.set("q", String(query.q));
  if (Number(query.page) > 1) qs.set("page", String(query.page));
  if (query.category) qs.set("category", String(query.category));
  if (query.experience_level) qs.set("experience_level", String(query.experience_level));
  const path = qs.toString() ? `/talents?${qs.toString()}` : "/talents";

  return buildPageMetadata({ title, description, path });
}

async function TalentsListSection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = buildSearchQuery(sp);

  const data = await backendGet<TalentSearchResponse>("/api/talent-profiles/search", {
    query,
    revalidate: TALENT_LIST_REVALIDATE,
    forwardHeaders: false,
  }).catch(() => EMPTY_SEARCH_RESPONSE);

  const payload: TalentSearchResponse =
    data?.profiles && Array.isArray(data.profiles) ? data : EMPTY_SEARCH_RESPONSE;

  return <TalentsPageClient data={payload} />;
}

function TalentsListSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-12 rounded-xl bg-secondary" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 rounded-xl bg-secondary" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TalentsPage({ searchParams }: TalentsPageProps) {
  const breadcrumbs = buildTalentsBreadcrumb();

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="mx-auto w-full max-w-6xl px-6 pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <Suspense fallback={<TalentsListSkeleton />}>
        <TalentsListSection searchParams={searchParams} />
      </Suspense>
    </>
  );
}
