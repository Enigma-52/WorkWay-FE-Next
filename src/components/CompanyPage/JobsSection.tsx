"use client";
import { useState, useEffect, useCallback } from "react";
import { Briefcase, Loader2 } from "lucide-react";
import { JobCard } from "./CompanyPageJobCard";

const PAGE_SIZE = 5;

interface JobsSectionProps {
  companySlug: string;
  totalJobs: number;
}

export function JobsSection({ companySlug, totalJobs }: JobsSectionProps) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchJobs = useCallback(async (pageNum: number) => {
    const res = await fetch(
      `/api/company/jobs?slug=${encodeURIComponent(companySlug)}&page=${pageNum}&limit=${PAGE_SIZE}`
    );
    if (!res.ok) return;
    const data = await res.json();
    return data;
  }, [companySlug]);

  useEffect(() => {
    setLoading(true);
    fetchJobs(1).then((data) => {
      if (data) {
        setJobs(data.jobs);
        setHasNext(data.meta.has_next);
        setPage(1);
      }
      setLoading(false);
    });
  }, [fetchJobs]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    const data = await fetchJobs(nextPage);
    if (data) {
      setJobs((prev) => [...prev, ...data.jobs]);
      setHasNext(data.meta.has_next);
      setPage(nextPage);
    }
    setLoadingMore(false);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Open Positions</h2>
            <p className="text-sm text-muted-foreground">
              {jobs.length} of {totalJobs} roles
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No open positions found.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {hasNext && !loading && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loadingMore}
          className="w-full py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors border border-border rounded-xl bg-secondary/20 hover:bg-secondary/40 disabled:opacity-50"
        >
          {loadingMore ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </span>
          ) : (
            `Load more roles`
          )}
        </button>
      )}
    </section>
  );
}
