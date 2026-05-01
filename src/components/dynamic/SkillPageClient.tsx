"use client";

import { Briefcase, Code2, TrendingUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { JobCard } from "@/components/DomainPage/JobCard";
import { JobFilters } from "@/components/DomainPage/JobFilters";
import { JobPagination } from "@/components/DomainPage/JobPagination";
import type { SkillJobsPayload } from "@/types/jobs";

type Props = {
  data: SkillJobsPayload;
};

export default function SkillPageClient({ data }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { skill, jobs, meta } = data;

  const experienceLevel = searchParams.get("employment_level") || "all";
  const employmentType = searchParams.get("employment_type") || "all";
  const location = searchParams.get("location") || "all";
  const currentPage = Number(searchParams.get("page") || "1");

  function updateParams(next: Record<string, string | null>) {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v === null || v === "" || v === "all") sp.delete(k);
      else sp.set(k, v);
    });
    router.push(`${pathname}?${sp.toString()}`);
  }

  const handleApply = (filters: { searchQuery: string; experienceLevel: string; employmentType: string; location: string }) => {
    updateParams({
      location: filters.searchQuery || filters.location || null,
      employment_level: filters.experienceLevel,
      employment_type: filters.employmentType,
      page: "1",
    });
  };

  const clearFilters = () => {
    updateParams({
      employment_level: null,
      employment_type: null,
      location: null,
      page: "1",
    });
  };

  const activeFiltersCount = [
    experienceLevel !== "all",
    employmentType !== "all",
    location !== "all",
  ].filter(Boolean).length;

  const totalPages = meta?.total_pages || 1;

  return (
    <div className="min-h-screen bg-background ">
      <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

        <div className="container relative mx-auto py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
              <Code2 className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm text-primary">{skill.name}</span>
            </div>

            <h2 className="mb-4 font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {skill.name} <span className="text-primary">Jobs</span>
            </h2>

            <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
              Browse latest {skill.name} roles across top companies.
            </p>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <span className="font-mono text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{meta.total}</span>{" "}
                  open positions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-mono text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Updated</span> daily
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto py-8 md:py-12">
        <div className="grid gap-8">
          <JobFilters
            searchQuery={location === "all" ? "" : location}
            experienceLevel={experienceLevel}
            employmentType={employmentType}
            location={location}
            onApply={handleApply}
            onClearFilters={clearFilters}
            activeFiltersCount={activeFiltersCount}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-mono text-foreground">{jobs.length}</span> jobs
            </p>
          </div>

          {jobs.length > 0 ? (
            <div className="grid gap-4">
              {jobs.map((job: any, index: number) => (
                <div key={job.id} style={{ animationDelay: `${index * 50}ms` }}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-secondary p-4">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 font-display text-xl font-semibold">No jobs found</h3>
              <p className="mb-4 text-muted-foreground">Try adjusting your filters</p>
              <button onClick={clearFilters} className="font-mono text-sm text-primary hover:underline">
                Clear all filters
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8">
              <JobPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => updateParams({ page: String(p) })}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

