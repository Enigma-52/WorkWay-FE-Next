"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, MapPin, Briefcase, ExternalLink, Bookmark, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SavedJob = {
  id: number;
  job_slug: string;
  job_title: string;
  company: string;
  company_logo_url: string | null;
  location: string | null;
  employment_type: string | null;
  job_url: string | null;
  saved_at: string;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/saved-jobs")
      .then((r) => r.json())
      .then((d) => setJobs(d.saved_jobs ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleUnsave(slug: string) {
    setRemoving(slug);
    setJobs((prev) => prev.filter((j) => j.job_slug !== slug));
    await fetch(`/api/saved-jobs/${slug}`, { method: "DELETE" }).catch(() => {});
    setRemoving(null);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-0.5">Saved Jobs</h1>
          <p className="text-muted-foreground text-sm">Jobs you've bookmarked for later.</p>
        </div>
        {jobs.length > 0 && (
          <span className="text-sm text-muted-foreground">{jobs.length} saved</span>
        )}
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 border-b border-border last:border-0 animate-pulse bg-secondary/20" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-card border border-border rounded-xl px-5 py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium mb-1">No saved jobs yet</p>
          <p className="text-xs text-muted-foreground mb-4">Bookmark jobs while browsing to find them here later.</p>
          <Button asChild size="sm" variant="outline">
            <Link href="/jobs">Browse jobs</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider w-[40%]">Job / Company</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Location</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider w-[120px]">Type</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider w-[100px]">Saved</th>
                <th className="px-4 py-3 w-[100px]" />
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, i) => (
                <tr
                  key={job.id}
                  className={cn(
                    "border-b border-border last:border-0 hover:bg-secondary/20 transition-colors group",
                    i % 2 === 1 && "bg-secondary/5"
                  )}
                >
                  {/* Job / Company */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                        {job.company_logo_url ? (
                          <img src={job.company_logo_url} alt={job.company} className="max-h-5 max-w-full object-contain" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/job/${job.job_slug}`}
                          className="font-medium text-sm hover:text-primary transition-colors truncate block leading-tight"
                        >
                          {job.job_title}
                        </Link>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{job.company}</p>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-4 py-3">
                    {job.location ? (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {job.location}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/40">—</span>
                    )}
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    {job.employment_type ? (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Briefcase className="w-3 h-3 shrink-0" />
                        {job.employment_type}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/40">—</span>
                    )}
                  </td>

                  {/* Saved */}
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {timeAgo(job.saved_at)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                      {job.job_url && (
                        <a
                          href={job.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                        >
                          Apply <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <button
                        onClick={() => handleUnsave(job.job_slug)}
                        disabled={removing === job.job_slug}
                        className="inline-flex items-center p-1.5 text-xs rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
