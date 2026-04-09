// ⚠️ CATCH-ALL NOTE: This dynamic segment sits at the root of (site)/.
// Existing named routes always take precedence in Next.js App Router.
// Any future top-level route added to (site)/ will also take precedence automatically.
// The notFound() guard below ensures unrecognised slugs return 404.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { backendGet } from "@/lib/api/server-client";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildJobsPageItemListJsonLd,
} from "@/lib/seo/jsonld";
import {
  buildLocationSeoDetailBreadcrumb,
  buildLocationOnlyDetailBreadcrumb,
} from "@/lib/seo/breadcrumbs";
import {
  parseLocationSeoSlug,
  composeLocationSeoSlug,
  parseLocationOnlySlug,
  composeLocationOnlySlug,
  ALL_ROLES,
  ALL_LOCATIONS,
} from "@/data/locationSeoData";
import type { JobListResponse } from "@/types/jobs";
import LocationSeoPageClient from "@/components/LocationSeoPage/LocationSeoPageClient";
import LocationOnlyPageClient from "@/components/LocationSeoPage/LocationOnlyPageClient";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

type Props = {
  params: Promise<{ locationSeoSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(
  value: string | string[] | undefined,
  fallback: string
): string {
  if (!value) return fallback;
  return Array.isArray(value) ? value[0] || fallback : value;
}

const EMPTY_LIST_RESPONSE: JobListResponse = {
  jobs: [],
  meta: { page: 1, limit: 20, total: 0, total_pages: 0, has_next: false, has_prev: false },
  applied_filters: {},
  facets: { domains: [], employment_types: [], experience_levels: [] },
};

function buildRoleLocationQuery(
  sp: Record<string, string | string[] | undefined>,
  roleName: string,
  locationName: string
): Record<string, string | number> {
  const page = Number(getSingleParam(sp.page, "1")) || 1;
  const domain = getSingleParam(sp.domain, "all");
  const employment_type = getSingleParam(sp.employment_type, "all");
  const experience_level = getSingleParam(sp.experience_level, "all");

  return { page, limit: 20, sort: "recent", domain, employment_type, experience_level, q: roleName, location: locationName };
}

function buildLocationOnlyQuery(
  sp: Record<string, string | string[] | undefined>,
  locationName: string
): Record<string, string | number> {
  const page = Number(getSingleParam(sp.page, "1")) || 1;
  const domain = getSingleParam(sp.domain, "all");
  const employment_type = getSingleParam(sp.employment_type, "all");
  const experience_level = getSingleParam(sp.experience_level, "all");

  return { page, limit: 20, sort: "recent", domain, employment_type, experience_level, location: locationName };
}

export async function generateStaticParams() {
  const top10Roles = ALL_ROLES.slice(0, 10);
  const top10Locations = ALL_LOCATIONS.slice(0, 10);

  const roleLocationParams = top10Roles.flatMap((r) =>
    top10Locations.map((l) => ({
      locationSeoSlug: composeLocationSeoSlug(r.slug, l.slug),
    }))
  );

  const locationOnlyParams = top10Locations.map((l) => ({
    locationSeoSlug: composeLocationOnlySlug(l.slug),
  }));

  return [...roleLocationParams, ...locationOnlyParams];
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locationSeoSlug } = await params;
  const sp = await searchParams;

  // Try role+location first
  const parsed = parseLocationSeoSlug(locationSeoSlug);
  if (parsed) {
    const { role, location } = parsed;
    const query = buildRoleLocationQuery(sp, role.name, location.name);

    const data = await backendGet<JobListResponse>("/api/job/list", {
      query: query as Record<string, string | number>,
    }).catch(() => null);

    const total = data?.meta?.total ?? 0;
    const page = Number(query.page);
    const hasActiveFilters =
      (query.domain && query.domain !== "all") ||
      (query.employment_type && query.employment_type !== "all") ||
      (query.experience_level && query.experience_level !== "all");

    const shouldNoIndex = page > 1 || !!hasActiveFilters || total === 0;

    const title = `${role.name} Jobs in ${location.name} (${total.toLocaleString()} Open Roles) | WorkWay`;
    const description = `Browse ${total.toLocaleString()} open ${role.name.toLowerCase()} jobs in ${location.name}. Filter by experience, domain, and employment type. Apply directly on WorkWay.`;

    const keywords = [
      `${role.name} jobs in ${location.name}`,
      `${role.name} jobs ${location.name}`,
      `${role.name} openings in ${location.name}`,
      `${role.name} hiring ${location.name}`,
      `${role.name} careers ${location.name}`,
      `${role.name} job openings ${location.name}`,
      `${role.name} recruitment ${location.name}`,
      `${role.name} vacancies ${location.name}`,
      `${role.name} roles ${location.name}`,
      `${role.name} opportunities ${location.name}`,
      `apply ${role.name} jobs ${location.name}`,
      `${role.name.toLowerCase()} jobs near ${location.name.toLowerCase()}`,
      `${role.name} remote jobs ${location.name}`,
      `${role.name} full time jobs ${location.name}`,
      `${role.name} internships ${location.name}`,
      `${role.name} fresher jobs ${location.name}`,
      `${role.name} experienced jobs ${location.name}`,
      `${role.name} jobs WorkWay`,
      `${location.name} jobs WorkWay`,
    ];

    return buildPageMetadata({
      title,
      description,
      path: `/${locationSeoSlug}`,
      robots: shouldNoIndex ? { index: false, follow: true } : { index: true, follow: true },
      keywords,
    });
  }

  // Try location-only
  const location = parseLocationOnlySlug(locationSeoSlug);
  if (location) {
    const query = buildLocationOnlyQuery(sp, location.name);

    const data = await backendGet<JobListResponse>("/api/job/list", {
      query: query as Record<string, string | number>,
    }).catch(() => null);

    const total = data?.meta?.total ?? 0;
    const page = Number(query.page);
    const hasActiveFilters =
      (query.domain && query.domain !== "all") ||
      (query.employment_type && query.employment_type !== "all") ||
      (query.experience_level && query.experience_level !== "all");

    const shouldNoIndex = page > 1 || !!hasActiveFilters || total === 0;

    const title = `Jobs in ${location.name} (${total.toLocaleString()} Open Roles) | WorkWay`;
    const description = `Browse ${total.toLocaleString()} open jobs in ${location.name}. Filter by role, experience, domain, and employment type. Apply directly on WorkWay.`;

    const keywords = [
      `jobs in ${location.name}`,
      `${location.name} jobs`,
      `${location.name} job openings`,
      `${location.name} hiring`,
      `${location.name} careers`,
      `${location.name} vacancies`,
      `${location.name} work opportunities`,
      `find jobs in ${location.name}`,
      `remote jobs ${location.name}`,
      `full time jobs ${location.name}`,
      `internships in ${location.name}`,
      `fresher jobs ${location.name}`,
      `tech jobs in ${location.name}`,
      `software jobs ${location.name}`,
      `${location.name} jobs WorkWay`,
      `job search ${location.name}`,
      `apply jobs ${location.name}`,
    ];

    return buildPageMetadata({
      title,
      description,
      path: `/${locationSeoSlug}`,
      robots: shouldNoIndex ? { index: false, follow: true } : { index: true, follow: true },
      keywords,
    });
  }

  notFound();
}

export default async function LocationSeoPage({ params, searchParams }: Props) {
  const { locationSeoSlug } = await params;
  const sp = await searchParams;

  // Try role+location first
  const parsed = parseLocationSeoSlug(locationSeoSlug);
  if (parsed) {
    const { role, location } = parsed;
    const query = buildRoleLocationQuery(sp, role.name, location.name);

    const data = await backendGet<JobListResponse>("/api/job/list", {
      query: query as Record<string, string | number>,
      revalidate: 3600,
    }).catch(() => EMPTY_LIST_RESPONSE);

    const payload: JobListResponse =
      data?.jobs && Array.isArray(data.jobs)
        ? { jobs: data.jobs, meta: data.meta ?? EMPTY_LIST_RESPONSE.meta, applied_filters: data.applied_filters ?? {}, facets: data.facets ?? EMPTY_LIST_RESPONSE.facets }
        : EMPTY_LIST_RESPONSE;

    const breadcrumbs = buildLocationSeoDetailBreadcrumb(role.name, location.name);

    return (
      <>
        <JsonLd data={buildJobsPageItemListJsonLd(payload.jobs)} />
        <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <div className="mx-auto w-full max-w-6xl px-6 pt-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>
        <LocationSeoPageClient data={payload} role={role} location={location} />
      </>
    );
  }

  // Try location-only
  const location = parseLocationOnlySlug(locationSeoSlug);
  if (location) {
    const query = buildLocationOnlyQuery(sp, location.name);

    const data = await backendGet<JobListResponse>("/api/job/list", {
      query: query as Record<string, string | number>,
      revalidate: 3600,
    }).catch(() => EMPTY_LIST_RESPONSE);

    const payload: JobListResponse =
      data?.jobs && Array.isArray(data.jobs)
        ? { jobs: data.jobs, meta: data.meta ?? EMPTY_LIST_RESPONSE.meta, applied_filters: data.applied_filters ?? {}, facets: data.facets ?? EMPTY_LIST_RESPONSE.facets }
        : EMPTY_LIST_RESPONSE;

    const breadcrumbs = buildLocationOnlyDetailBreadcrumb(location.name);

    return (
      <>
        <JsonLd data={buildJobsPageItemListJsonLd(payload.jobs)} />
        <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <div className="mx-auto w-full max-w-6xl px-6 pt-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>
        <LocationOnlyPageClient data={payload} location={location} />
      </>
    );
  }

  notFound();
}
