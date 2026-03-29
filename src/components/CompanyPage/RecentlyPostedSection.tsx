"use client";
import { useState } from "react";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { type JobListing } from "@/data/companyData";
import { JobCard } from "./CompanyPageJobCard";

const PAGE_SIZE = 5;

interface RecentlyPostedSectionProps {
  jobs: JobListing[];
}

export function RecentlyPostedSection({ jobs }: RecentlyPostedSectionProps) {
  const [page, setPage] = useState(0);

  if (!jobs || jobs.length === 0) return null;

  const totalPages = Math.ceil(jobs.length / PAGE_SIZE);
  const pageJobs = jobs.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Recently Posted</h2>
            <p className="text-sm text-muted-foreground">{jobs.length} new roles</p>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {pageJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}
