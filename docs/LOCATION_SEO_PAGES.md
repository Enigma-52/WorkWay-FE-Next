# Location Programmatic SEO Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build flat-URL programmatic SEO pages (e.g., `/software-engineer-jobs-in-bangalore`) that render filtered job listings using existing components, with role+location dropdowns for navigation, plus a backend sitemap entry.

**Architecture:** A single catch-all route `(site)/[locationSeoSlug]/page.tsx` validates slugs against a hardcoded data module, fetches from the existing `/api/job/list` endpoint, and passes data to a new `LocationSeoPageClient` component that mirrors `JobsPageClient` with role/location dropdowns replacing the text inputs. An internal hub at `/location-jobs` links all combos for crawlability.

**Tech Stack:** Next.js 14 App Router (TypeScript), Tailwind CSS, shadcn/ui (`Select`, `Button`, `Badge`), Lucide icons, Framer Motion, Express.js (backend sitemap only)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `workway-next/src/data/locationSeoData.ts` | Create | Roles list, locations list, slug helpers, VALID_SEO_SLUGS set |
| `workway-next/src/lib/seo/breadcrumbs.ts` | Modify | Add 2 breadcrumb builder helpers |
| `workway-next/src/components/LocationSeoPage/LocationSeoPageClient.tsx` | Create | Client component: role/location dropdowns + job list + filters |
| `workway-next/src/app/(site)/[locationSeoSlug]/page.tsx` | Create | Server component: validate slug, fetch data, metadata, JSON-LD |
| `workway-next/src/app/(site)/location-jobs/page.tsx` | Create | Static hub page with links to all combos |
| `WorkWay--BE/src/services/sitemapService.js` | Modify | Add `generateLocationSeoSitemap()`, add `/location-jobs` to static sitemap |
| `WorkWay--BE/src/routes/sitemap.js` | Modify | Register `GET /sitemaps/location-seo.xml` route |

---

## Task 1: Data Layer

**Files:**
- Create: `workway-next/src/data/locationSeoData.ts`

- [ ] **Step 1: Create the data file**

```typescript
// workway-next/src/data/locationSeoData.ts

export type SeoRole = { name: string; slug: string };
export type SeoLocation = { name: string; slug: string };

// Top-traffic roles first (first 10 = pre-built at build time)
export const ALL_ROLES: SeoRole[] = [
  { name: "Software Engineer", slug: "software-engineer" },
  { name: "Frontend Engineer", slug: "frontend-engineer" },
  { name: "Backend Engineer", slug: "backend-engineer" },
  { name: "Full Stack Engineer", slug: "full-stack-engineer" },
  { name: "Product Manager", slug: "product-manager" },
  { name: "Data Scientist", slug: "data-scientist" },
  { name: "DevOps Engineer", slug: "devops-engineer" },
  { name: "Machine Learning Engineer", slug: "machine-learning-engineer" },
  { name: "UI/UX Designer", slug: "ui-ux-designer" },
  { name: "Data Analyst", slug: "data-analyst" },
  // On-demand (not pre-built at build time)
  { name: "iOS Engineer", slug: "ios-engineer" },
  { name: "Android Engineer", slug: "android-engineer" },
  { name: "QA Engineer", slug: "qa-engineer" },
  { name: "Site Reliability Engineer", slug: "site-reliability-engineer" },
  { name: "Engineering Manager", slug: "engineering-manager" },
  { name: "Product Designer", slug: "product-designer" },
  { name: "Business Analyst", slug: "business-analyst" },
  { name: "Marketing Manager", slug: "marketing-manager" },
  { name: "Customer Success Manager", slug: "customer-success-manager" },
  { name: "Technical Writer", slug: "technical-writer" },
  { name: "HR Manager", slug: "hr-manager" },
  { name: "Finance Analyst", slug: "finance-analyst" },
  { name: "Operations Manager", slug: "operations-manager" },
  { name: "Legal Counsel", slug: "legal-counsel" },
  { name: "Sales Engineer", slug: "sales-engineer" },
];

// Top-traffic locations first (first 10 = pre-built at build time)
export const ALL_LOCATIONS: SeoLocation[] = [
  { name: "Bangalore", slug: "bangalore" },
  { name: "Remote", slug: "remote" },
  { name: "San Francisco", slug: "san-francisco" },
  { name: "New York", slug: "new-york" },
  { name: "London", slug: "london" },
  { name: "Hyderabad", slug: "hyderabad" },
  { name: "Mumbai", slug: "mumbai" },
  { name: "Delhi", slug: "delhi" },
  { name: "Seattle", slug: "seattle" },
  { name: "Austin", slug: "austin" },
  // On-demand
  { name: "Singapore", slug: "singapore" },
  { name: "Berlin", slug: "berlin" },
  { name: "Toronto", slug: "toronto" },
  { name: "Dubai", slug: "dubai" },
  { name: "Pune", slug: "pune" },
  { name: "Chennai", slug: "chennai" },
  { name: "Boston", slug: "boston" },
  { name: "Los Angeles", slug: "los-angeles" },
  { name: "Chicago", slug: "chicago" },
  { name: "Amsterdam", slug: "amsterdam" },
  { name: "Paris", slug: "paris" },
  { name: "Sydney", slug: "sydney" },
  { name: "Tokyo", slug: "tokyo" },
  { name: "Dublin", slug: "dublin" },
  { name: "Bengaluru", slug: "bengaluru" },
];

// Pre-compute all valid slug combinations — O(1) lookup at request time
export const VALID_SEO_SLUGS: Set<string> = new Set(
  ALL_ROLES.flatMap((r) => ALL_LOCATIONS.map((l) => `${r.slug}-jobs-in-${l.slug}`))
);

export function composeLocationSeoSlug(roleSlug: string, locationSlug: string): string {
  return `${roleSlug}-jobs-in-${locationSlug}`;
}

/**
 * Parses a URL slug like "software-engineer-jobs-in-bangalore" into
 * the matching role and location objects from the curated lists.
 * Returns null if either part is not found — validates against lists, not just format.
 * NOTE: Role and location slugs must not contain "-jobs-in-" (delimiter).
 */
export function parseLocationSeoSlug(
  slug: string
): { role: SeoRole; location: SeoLocation } | null {
  const delimiter = "-jobs-in-";
  const idx = slug.indexOf(delimiter);
  if (idx === -1) return null;

  const roleSlug = slug.slice(0, idx);
  const locationSlug = slug.slice(idx + delimiter.length);

  const role = ALL_ROLES.find((r) => r.slug === roleSlug) ?? null;
  const location = ALL_LOCATIONS.find((l) => l.slug === locationSlug) ?? null;

  if (!role || !location) return null;
  return { role, location };
}
```

- [ ] **Step 2: Manually verify the helpers**

Open a Node REPL or add a temporary `console.log` to any page to verify:
```ts
import { parseLocationSeoSlug, composeLocationSeoSlug, VALID_SEO_SLUGS } from "@/data/locationSeoData";

composeLocationSeoSlug("software-engineer", "bangalore")
// → "software-engineer-jobs-in-bangalore"

parseLocationSeoSlug("software-engineer-jobs-in-bangalore")
// → { role: { name: "Software Engineer", slug: "software-engineer" }, location: { name: "Bangalore", slug: "bangalore" } }

parseLocationSeoSlug("not-a-real-slug")
// → null

VALID_SEO_SLUGS.has("software-engineer-jobs-in-bangalore")
// → true
VALID_SEO_SLUGS.has("software-engineer-jobs-in-mars")
// → false
```

- [ ] **Step 3: Commit**

```bash
git add workway-next/src/data/locationSeoData.ts
git commit -m "feat: add location SEO data layer (roles, locations, slug helpers)"
```

---

## Task 2: Breadcrumb Helpers

**Files:**
- Modify: `workway-next/src/lib/seo/breadcrumbs.ts`

- [ ] **Step 1: Append two helpers to the end of `breadcrumbs.ts`**

Open `workway-next/src/lib/seo/breadcrumbs.ts` and append after the last function:

```typescript
export function buildLocationJobsBreadcrumb(): BreadcrumbItem[] {
  return [
    ...buildHomeBreadcrumb(),
    {
      name: "Location Jobs",
      href: "/location-jobs",
    },
  ];
}

export function buildLocationSeoDetailBreadcrumb(
  roleName: string,
  locationName: string,
): BreadcrumbItem[] {
  return [
    ...buildLocationJobsBreadcrumb(),
    {
      name: `${roleName} Jobs in ${locationName}`,
    },
  ];
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd workway-next && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add workway-next/src/lib/seo/breadcrumbs.ts
git commit -m "feat: add location SEO breadcrumb helpers"
```

---

## Task 3: LocationSeoPageClient Component

**Files:**
- Create: `workway-next/src/components/LocationSeoPage/LocationSeoPageClient.tsx`

This mirrors `JobsPageClient` (`src/components/JobsPage/JobsPageClient.tsx`) with:
- Role `<Select>` replacing the text search input
- Location `<Select>` (from `ALL_LOCATIONS`) replacing the `MapPin` text input
- Role/location changes call `router.push(composeLocationSeoSlug(...))` — no search params carried over
- Domain / experience / employment type filters stay as search params on the current path

- [ ] **Step 1: Create the component file**

```typescript
// workway-next/src/components/LocationSeoPage/LocationSeoPageClient.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Briefcase, TrendingUp, MapPin, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { JobCard } from "@/components/DomainPage/JobCard";
import { JobPagination } from "@/components/DomainPage/JobPagination";
import { JobsFacetsSidebar } from "@/components/JobsPage/JobsFacetsSidebar";
import JobViewFeed from "@/components/JobViewFeed/JobViewFeed";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, SlidersHorizontal } from "lucide-react";
import {
  ALL_ROLES,
  ALL_LOCATIONS,
  composeLocationSeoSlug,
  type SeoRole,
  type SeoLocation,
} from "@/data/locationSeoData";
import type { JobListResponse } from "@/types/jobs";

const EXPERIENCE_LEVELS = [
  "Intern", "Junior", "Mid-level", "Senior", "Staff", "Lead", "Manager", "Director",
];
const EMPLOYMENT_TYPES = ["Full-Time", "Part-Time", "Contract"];

type Props = {
  data: JobListResponse;
  role: SeoRole;
  location: SeoLocation;
};

function getParam(searchParams: URLSearchParams, key: string, fallback: string): string {
  return searchParams.get(key) ?? fallback;
}

export default function LocationSeoPageClient({ data, role, location }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const domain = getParam(searchParams, "domain", "all");
  const employmentType = getParam(searchParams, "employment_type", "all");
  const experienceLevel = getParam(searchParams, "experience_level", "all");
  const page = getParam(searchParams, "page", "1");

  const updateParams = useCallback(
    (next: Record<string, string | null>) => {
      const sp = new URLSearchParams(searchParams.toString());
      Object.entries(next).forEach(([k, v]) => {
        if (v === null || v === "" || v === "all") sp.delete(k);
        else sp.set(k, v);
      });
      const query = sp.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams]
  );

  const handleFilterChange = (key: string) => (value: string) => {
    updateParams({ [key]: value, page: "1" });
  };

  const clearFilters = () => {
    updateParams({ domain: null, employment_type: null, experience_level: null, page: "1" });
  };

  const handleRoleChange = (newRoleSlug: string) => {
    router.push(`/${composeLocationSeoSlug(newRoleSlug, location.slug)}`);
  };

  const handleLocationChange = (newLocationSlug: string) => {
    router.push(`/${composeLocationSeoSlug(role.slug, newLocationSlug)}`);
  };

  const activeFiltersCount = [
    domain !== "all",
    employmentType !== "all",
    experienceLevel !== "all",
  ].filter(Boolean).length;

  const { jobs, meta, applied_filters, facets } = data;
  const total = meta.total ?? 0;
  const totalPages = meta.total_pages || 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

        <div className="container relative mx-auto py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-4">
              {role.name} Jobs in{" "}
              <span className="text-primary">{location.name}</span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              {total > 0
                ? `${total.toLocaleString()} open ${role.name.toLowerCase()} positions in ${location.name}. Updated daily.`
                : `No ${role.name.toLowerCase()} jobs found in ${location.name} right now. Try a nearby location or different role.`}
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <span className="font-mono text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {total.toLocaleString()}
                  </span>{" "}
                  open positions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-mono text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Updated</span>{" "}
                  daily
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="container mx-auto py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)_360px]">
          {/* Left sidebar — facets */}
          <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <JobsFacetsSidebar
              domains={facets.domains}
              employmentTypes={facets.employment_types}
              experienceLevels={facets.experience_levels}
              appliedFilters={{
                domain: applied_filters.domain,
                employment_type: applied_filters.employment_type,
                experience_level: applied_filters.experience_level,
              }}
              onDomainClick={(slug) => handleFilterChange("domain")(slug)}
              onEmploymentTypeClick={(v) => handleFilterChange("employment_type")(v)}
              onExperienceLevelClick={(v) => handleFilterChange("experience_level")(v)}
            />
          </div>

          {/* Center — filters + job list */}
          <div className="min-w-0 space-y-6">
            {/* Role + Location selectors */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Role selector */}
                <Select value={role.slug} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-[220px] bg-secondary border-border rounded-lg">
                    <SelectValue placeholder="Job Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_ROLES.map((r) => (
                      <SelectItem key={r.slug} value={r.slug}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Location selector */}
                <Select value={location.slug} onValueChange={handleLocationChange}>
                  <SelectTrigger className="w-[180px] bg-secondary border-border rounded-lg">
                    <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_LOCATIONS.map((l) => (
                      <SelectItem key={l.slug} value={l.slug}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Secondary filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="font-mono tracking-wide">Filters</span>
                </div>

                <Select value={domain || "all"} onValueChange={handleFilterChange("domain")}>
                  <SelectTrigger className="w-[180px] bg-secondary border-border rounded-lg">
                    <SelectValue placeholder="Domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All domains</SelectItem>
                    {facets.domains.map((d) => (
                      <SelectItem key={d.slug} value={d.slug}>
                        {d.name} ({d.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={experienceLevel || "all"} onValueChange={handleFilterChange("experience_level")}>
                  <SelectTrigger className="w-[160px] bg-secondary border-border rounded-lg">
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All levels</SelectItem>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={employmentType || "all"} onValueChange={handleFilterChange("employment_type")}>
                  <SelectTrigger className="w-[140px] bg-secondary border-border rounded-lg">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    {EMPLOYMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground font-mono"
                  >
                    <X className="mr-1 h-3.5 w-3.5" />
                    Clear ({activeFiltersCount})
                  </Button>
                )}
              </div>

              {/* Active filter badges */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2">
                  {domain && domain !== "all" && (
                    <Badge
                      variant="secondary"
                      className="gap-1 font-mono text-xs cursor-pointer hover:bg-secondary/80"
                      onClick={() => handleFilterChange("domain")("all")}
                    >
                      Domain: {domain} <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {experienceLevel && experienceLevel !== "all" && (
                    <Badge
                      variant="secondary"
                      className="gap-1 font-mono text-xs cursor-pointer hover:bg-secondary/80"
                      onClick={() => handleFilterChange("experience_level")("all")}
                    >
                      {experienceLevel} <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {employmentType && employmentType !== "all" && (
                    <Badge
                      variant="secondary"
                      className="gap-1 font-mono text-xs cursor-pointer hover:bg-secondary/80"
                      onClick={() => handleFilterChange("employment_type")("all")}
                    >
                      {employmentType} <X className="h-3 w-3" />
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-mono text-foreground">
                  {meta.page * meta.limit > total
                    ? total
                    : (meta.page - 1) * meta.limit + jobs.length}
                </span>{" "}
                of{" "}
                <span className="font-mono text-foreground">
                  {total.toLocaleString()}
                </span>{" "}
                jobs
              </p>
            </div>

            {jobs.length > 0 ? (
              <div className="grid gap-4">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                  >
                    <JobCard job={job} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-border rounded-xl bg-card/40">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  No jobs match your filters
                </h3>
                <p className="mb-4 max-w-sm text-muted-foreground">
                  Try broadening your search or clearing some filters.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-mono text-sm text-primary hover:underline focus:outline-none"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="pt-6">
                <JobPagination
                  currentPage={meta.page}
                  totalPages={totalPages}
                  onPageChange={(p) => updateParams({ page: String(p) })}
                />
              </div>
            )}
          </div>

          {/* Right sidebar — live activity feed */}
          <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <JobViewFeed />
          </div>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd workway-next && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add workway-next/src/components/LocationSeoPage/LocationSeoPageClient.tsx
git commit -m "feat: add LocationSeoPageClient with role/location dropdown navigation"
```

---

## Task 4: SEO Detail Page (Server Component)

**Files:**
- Create: `workway-next/src/app/(site)/[locationSeoSlug]/page.tsx`

> ⚠️ **Architectural note:** `[locationSeoSlug]` is a root-level catch-all inside `(site)/`. All existing named routes (`/jobs`, `/companies`, etc.) take precedence automatically. Any future top-level route added to `(site)/` will also take precedence. The `notFound()` guard ensures unrecognised slugs return 404.

- [ ] **Step 1: Create the page file**

```typescript
// workway-next/src/app/(site)/[locationSeoSlug]/page.tsx
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
import { buildLocationSeoDetailBreadcrumb } from "@/lib/seo/breadcrumbs";
import {
  parseLocationSeoSlug,
  composeLocationSeoSlug,
} from "@/data/locationSeoData";
import type { JobListResponse } from "@/types/jobs";
import LocationSeoPageClient from "@/components/LocationSeoPage/LocationSeoPageClient";
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

function buildQuery(
  sp: Record<string, string | string[] | undefined>,
  roleName: string,
  locationName: string
): Record<string, string | number> {
  const page = Number(getSingleParam(sp.page, "1")) || 1;
  const domain = getSingleParam(sp.domain, "all");
  const employment_type = getSingleParam(sp.employment_type, "all");
  const experience_level = getSingleParam(sp.experience_level, "all");

  const query: Record<string, string | number> = {
    page,
    limit: 20,
    sort: "recent",
    domain,
    employment_type,
    experience_level,
    q: roleName,
    location: locationName,
  };
  return query;
}

export async function generateStaticParams() {
  // Pre-build first 10 roles × first 10 locations = 100 pages
  // Import inline to avoid circular issues at build time
  const { ALL_ROLES, ALL_LOCATIONS } = await import("@/data/locationSeoData");
  const top10Roles = ALL_ROLES.slice(0, 10);
  const top10Locations = ALL_LOCATIONS.slice(0, 10);
  return top10Roles.flatMap((r) =>
    top10Locations.map((l) => ({
      locationSeoSlug: composeLocationSeoSlug(r.slug, l.slug),
    }))
  );
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locationSeoSlug } = await params;
  const parsed = parseLocationSeoSlug(locationSeoSlug);
  if (!parsed) return buildPageMetadata({ title: "Jobs | WorkWay", description: "Find jobs on WorkWay.", path: "/" });

  const { role, location } = parsed;
  const sp = await searchParams;
  const query = buildQuery(sp, role.name, location.name);

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

  return buildPageMetadata({
    title,
    description,
    path: `/${locationSeoSlug}`,
    robots: shouldNoIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
  });
}

export default async function LocationSeoPage({ params, searchParams }: Props) {
  const { locationSeoSlug } = await params;
  const parsed = parseLocationSeoSlug(locationSeoSlug);
  if (!parsed) notFound();

  const { role, location } = parsed;
  const sp = await searchParams;
  const query = buildQuery(sp, role.name, location.name);

  const data = await backendGet<JobListResponse>("/api/job/list", {
    query: query as Record<string, string | number>,
    revalidate: 3600,
  }).catch(() => EMPTY_LIST_RESPONSE);

  const payload: JobListResponse =
    data?.jobs && Array.isArray(data.jobs)
      ? {
          jobs: data.jobs,
          meta: data.meta ?? EMPTY_LIST_RESPONSE.meta,
          applied_filters: data.applied_filters ?? {},
          facets: data.facets ?? EMPTY_LIST_RESPONSE.facets,
        }
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd workway-next && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Start dev server and verify the page renders**

```bash
cd workway-next && npm run dev
```

Open in browser: `http://localhost:3000/software-engineer-jobs-in-bangalore`

Expected:
- Page renders with hero "Software Engineer Jobs in Bangalore"
- Job cards appear (or empty state if no results)
- Role and location dropdowns show correct selected values
- Breadcrumb shows: Home → Location Jobs → Software Engineer Jobs in Bangalore

Also verify 404 for invalid slug: `http://localhost:3000/not-a-real-slug`
Expected: 404 page.

Also verify existing routes are unaffected:
- `http://localhost:3000/` — landing page ✓
- `http://localhost:3000/jobs` — jobs page ✓

- [ ] **Step 4: Commit**

```bash
git add "workway-next/src/app/(site)/[locationSeoSlug]/page.tsx"
git commit -m "feat: add location SEO detail page with ISR and noindex guards"
```

---

## Task 5: Internal Linking Hub Page

**Files:**
- Create: `workway-next/src/app/(site)/location-jobs/page.tsx`

- [ ] **Step 1: Create the hub page**

```typescript
// workway-next/src/app/(site)/location-jobs/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildLocationJobsBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import {
  ALL_ROLES,
  ALL_LOCATIONS,
  composeLocationSeoSlug,
} from "@/data/locationSeoData";

export const metadata: Metadata = buildPageMetadata({
  title: "Jobs by Role and Location | WorkWay",
  description:
    "Browse job listings by role and city. Find Software Engineer, Product Manager, Data Scientist roles in Bangalore, Remote, San Francisco and more.",
  path: "/location-jobs",
});

export default function LocationJobsHubPage() {
  const breadcrumbs = buildLocationJobsBreadcrumb();

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="mx-auto w-full max-w-6xl px-6 pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <main className="container mx-auto py-10 md:py-14">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl mb-3">
            Browse Jobs by Role & Location
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Explore curated job listings for every major role across top hiring cities and remote options.
          </p>
        </div>

        <div className="space-y-10">
          {ALL_ROLES.map((role) => (
            <section key={role.slug}>
              <h2 className="font-display text-xl font-semibold mb-4 text-foreground">
                {role.name} Jobs
              </h2>
              <div className="flex flex-wrap gap-3">
                {ALL_LOCATIONS.map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/${composeLocationSeoSlug(role.slug, loc.slug)}`}
                    className="inline-flex items-center rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-mono text-muted-foreground hover:text-foreground hover:bg-secondary/80 hover:border-primary/30 transition-colors"
                  >
                    {role.name} in {loc.name}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Verify in browser**

With dev server running: `http://localhost:3000/location-jobs`

Expected:
- Page renders with a grid of role+location links grouped by role
- Each link is clickable and navigates to the correct SEO page

- [ ] **Step 3: Commit**

```bash
git add "workway-next/src/app/(site)/location-jobs/page.tsx"
git commit -m "feat: add location jobs hub page for internal linking"
```

---

## Task 6: Backend Sitemap

**Files:**
- Modify: `WorkWay--BE/src/services/sitemapService.js`
- Modify: `WorkWay--BE/src/routes/sitemap.js`

The backend has no access to the frontend `locationSeoData.ts`. Duplicate the role+location arrays as plain JS constants in the service — note this in a comment so future maintainers know to keep them in sync with the frontend file.

- Also make sure to add only those urls from my set that have atleast 5 jobs under them
- [ ] **Step 1: Add location SEO constants and generator to `sitemapService.js`**

Open `WorkWay--BE/src/services/sitemapService.js`. After the existing imports at the top, add:

```javascript
// NOTE: These lists mirror workway-next/src/data/locationSeoData.ts
// Keep in sync when adding new roles or locations.
const SEO_ROLES = [
  "software-engineer", "frontend-engineer", "backend-engineer",
  "full-stack-engineer", "product-manager", "data-scientist",
  "devops-engineer", "machine-learning-engineer", "ui-ux-designer",
  "data-analyst", "ios-engineer", "android-engineer", "qa-engineer",
  "site-reliability-engineer", "engineering-manager", "product-designer",
  "business-analyst", "marketing-manager", "customer-success-manager",
  "technical-writer", "hr-manager", "finance-analyst",
  "operations-manager", "legal-counsel", "sales-engineer",
];

const SEO_LOCATIONS = [
  "bangalore", "remote", "san-francisco", "new-york", "london",
  "hyderabad", "mumbai", "delhi", "seattle", "austin",
  "singapore", "berlin", "toronto", "dubai", "pune",
  "chennai", "boston", "los-angeles", "chicago", "amsterdam",
  "paris", "sydney", "tokyo", "dublin", "bengaluru",
];
```

Then add the generator function after `generateDomainsSitemap()`:

```javascript
/* =========================
   LOCATION SEO PAGES
========================= */

export function generateLocationSeoSitemap() {
  const d = today();
  const items = SEO_ROLES.flatMap((role) =>
    SEO_LOCATIONS.map((loc) =>
      urlTag({
        loc: `/${role}-jobs-in-${loc}`,
        lastmod: d,
        changefreq: 'weekly',
        priority: 0.7,
      })
    )
  );
  return wrapUrlSet(items);
}
```

- [ ] **Step 2: Add `/location-jobs` to `generateStaticSitemap()`**

In the same file, inside the `urls` array in `generateStaticSitemap()`, add after the last entry (before the closing `]`):

```javascript
    { loc: '/location-jobs', changefreq: 'weekly', priority: 0.9 },
```

- [ ] **Step 3: Register the sitemap in `generateSitemapIndex()`**

In `generateSitemapIndex()`, add `sitemapTag('/sitemaps/location-seo.xml')` to the array:

```javascript
export function generateSitemapIndex() {
  return wrapSitemapIndex([
    sitemapTag('/sitemaps/static.xml'),
    sitemapTag('/sitemaps/companies.xml'),
    sitemapTag('/sitemaps/domains.xml'),
    sitemapTag('/sitemaps/jobs.xml'),
    sitemapTag('/sitemaps/skills.xml'),
    sitemapTag('/sitemaps/location-seo.xml'),  // ← add this line
  ]);
}
```

- [ ] **Step 4: Register the route in `sitemap.js`**

Open `WorkWay--BE/src/routes/sitemap.js`. Import the new function at the top (add to existing import):

```javascript
import {
  generateSitemapIndex,
  generateStaticSitemap,
  generateCompaniesSitemap,
  generateDomainsSitemap,
  generateJobsSitemap,
  generateSkillsSitemap,
  generateJobsSitemapIndex,
  generateJobsSitemapPage,
  generateLocationSeoSitemap,  // ← add this
} from '../services/sitemapService.js';
```

Then add the route handler after the existing routes:

```javascript
/* Location SEO pages */
router.get('/sitemaps/location-seo.xml', (req, res) => {
  const xml = generateLocationSeoSitemap();
  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(xml);
});
```

- [ ] **Step 5: Verify the sitemap renders**

Start the backend:
```bash
cd WorkWay--BE && npm run dev
```

Open: `http://localhost:<BE_PORT>/sitemaps/location-seo.xml`

Expected: valid XML with `<url>` entries like `<loc>https://www.workway.dev/software-engineer-jobs-in-bangalore</loc>`

Open: `http://localhost:<BE_PORT>/sitemaps/static.xml`

Expected: `/location-jobs` appears in the list.

Open: `http://localhost:<BE_PORT>/sitemap.xml`

Expected: `location-seo.xml` appears in the sitemap index.

- [ ] **Step 6: Commit**

```bash
git add WorkWay--BE/src/services/sitemapService.js WorkWay--BE/src/routes/sitemap.js
git commit -m "feat: add location SEO sitemap and register /location-jobs in static sitemap"
```

---

## Done

All 6 tasks complete. The feature is fully implemented:

- `/{role}-jobs-in-{location}` pages render filtered job listings with role+location dropdowns
- Invalid slugs return 404
- Paginated/filtered/empty views have `robots: noindex`
- `/location-jobs` hub provides internal linking to all combos
- Both sitemaps (`location-seo.xml` and `static.xml`) are updated
- No existing routes or backend endpoints were modified
