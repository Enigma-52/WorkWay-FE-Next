"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Briefcase,
  Sparkles,
  TrendingUp,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import { JobCard } from "@/components/DomainPage/JobCard";
import { JobPagination } from "@/components/DomainPage/JobPagination";
import { JobsListFilters } from "./JobsListFilters";
import { JobsFacetsSidebar } from "./JobsFacetsSidebar";
import type { JobListResponse } from "@/types/jobs";

type Props = {
  data: JobListResponse;
};

function getParam(
  searchParams: URLSearchParams,
  key: string,
  fallback: string
): string {
  const v = searchParams.get(key);
  return v ?? fallback;
}

export default function JobsPageClient({ data }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const qParam = getParam(searchParams, "q", "");
  const [qLocal, setQLocal] = useState(qParam);
  const page = getParam(searchParams, "page", "1");
  const domain = getParam(searchParams, "domain", "all");
  const employmentType = getParam(searchParams, "employment_type", "all");
  const experienceLevel = getParam(searchParams, "experience_level", "all");
  const location = getParam(searchParams, "location", "");

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

  useEffect(() => {
    setQLocal(qParam);
  }, [qParam]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (qLocal !== qParam) {
        updateParams({ q: qLocal || null, page: "1" });
      }
    }, 400);
    return () => clearTimeout(t);
  }, [qLocal, qParam, updateParams]);

  const handleFilterChange = (key: string) => (value: string) => {
    updateParams({ [key]: value, page: "1" });
  };

  const clearFilters = () => {
    updateParams({
      q: null,
      domain: null,
      employment_type: null,
      experience_level: null,
      location: null,
      page: "1",
    });
  };

  const activeFiltersCount = [
    qParam,
    domain !== "all",
    employmentType !== "all",
    experienceLevel !== "all",
    location,
  ].filter(Boolean).length;

  const { jobs, meta, applied_filters, facets } = data;
  const totalPages = meta.total_pages || 1;
  const total = meta.total ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

        <div className="container relative mx-auto py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm text-primary">
                Job search
              </span>
            </div>

            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-4">
              Find your next <span className="text-primary">role</span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Search and filter thousands of jobs across top companies. One feed,
              no spam.
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
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar facets - hidden on small screens, show on lg */}
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
              onEmploymentTypeClick={(v) =>
                handleFilterChange("employment_type")(v)
              }
              onExperienceLevelClick={(v) =>
                handleFilterChange("experience_level")(v)
              }
            />
          </div>

          <div className="min-w-0 space-y-6">
            <JobsListFilters
              q={qLocal}
              onQChange={setQLocal}
              domain={domain}
              onDomainChange={handleFilterChange("domain")}
              employmentType={employmentType}
              onEmploymentTypeChange={handleFilterChange("employment_type")}
              experienceLevel={experienceLevel}
              onExperienceLevelChange={handleFilterChange("experience_level")}
              location={location}
              onLocationChange={(v) =>
                updateParams({ location: v || null, page: "1" })
              }
              onClear={clearFilters}
              activeCount={activeFiltersCount}
              domainOptions={facets.domains}
            />

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
                    transition={{
                      duration: 0.3,
                      delay: Math.min(index * 0.03, 0.3),
                    }}
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
                  Try broadening your search or clearing some filters to see more
                  results.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-mono text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
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
        </div>
      </main>
    </div>
  );
}
