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
  composeLocationOnlySlug,
  type SeoLocation,
} from "@/data/locationSeoData";
import type { JobListResponse } from "@/types/jobs";

const EXPERIENCE_LEVELS = [
  "Intern", "Junior", "Mid-level", "Senior", "Staff", "Lead", "Manager", "Director",
];
const EMPLOYMENT_TYPES = ["Full-Time", "Part-Time", "Contract"];

type Props = {
  data: JobListResponse;
  location: SeoLocation;
};

function getParam(searchParams: URLSearchParams, key: string, fallback: string): string {
  return searchParams.get(key) ?? fallback;
}

export default function LocationOnlyPageClient({ data, location }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const domain = getParam(searchParams, "domain", "all");
  const employmentType = getParam(searchParams, "employment_type", "all");
  const experienceLevel = getParam(searchParams, "experience_level", "all");

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

  // Selecting a role navigates to the role+location combined page
  const handleRoleChange = (newRoleSlug: string) => {
    if (newRoleSlug === "all") {
      router.push(`/${composeLocationOnlySlug(location.slug)}`);
    } else {
      router.push(`/${composeLocationSeoSlug(newRoleSlug, location.slug)}`);
    }
  };

  const handleLocationChange = (newLocationSlug: string) => {
    router.push(`/${composeLocationOnlySlug(newLocationSlug)}`);
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
              Jobs in{" "}
              <span className="text-primary">{location.name}</span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              {total > 0
                ? `${total.toLocaleString()} open positions in ${location.name}. Updated daily.`
                : `No jobs found in ${location.name} right now. Try a nearby location.`}
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
                {/* Role selector — "All roles" is the default for location-only pages */}
                <Select value="all" onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-[220px] bg-secondary border-border rounded-lg">
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
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
