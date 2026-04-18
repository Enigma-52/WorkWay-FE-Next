"use client";

import { MapPin, Clock, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { type JobListing } from "@/data/companyData";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SaveJobButton from "@/components/common/SaveJobButton";
import { useJobStatus } from "@/contexts/JobStatusContext";

function normalizedSkills(skills: unknown): { name: string; slug: string }[] {
  if (!skills) return [];
  const raw =
    typeof skills === "string"
      ? (() => {
          try {
            return JSON.parse(skills);
          } catch {
            return [];
          }
        })()
      : skills;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (s): s is { name: string; slug: string } =>
      s &&
      typeof s === "object" &&
      typeof (s as { name?: string }).name === "string" &&
      typeof (s as { slug?: string }).slug === "string",
  );
}

interface JobCardProps {
  job: JobListing;
}

export function JobCard({ job }: JobCardProps) {
  const { appliedSlugs } = useJobStatus();
  const isApplied = appliedSlugs.has(job.slug);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "Just Now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minutes ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH} hours ago`;
    const diffDays = Math.floor(diffH / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="group flex flex-col px-5 py-4 hover:bg-secondary/50 transition-all duration-200 border-b border-border last:border-b-0 relative">
      <Link
        href={`/job/${job.slug}`}
        className="flex items-center justify-between flex-1 min-w-0"
      >
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
              {job.title}
            </h4>
            {isApplied && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-500 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5 shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                Applied
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {job.experience_level}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-secondary">
              {job.employment_type}
            </span>
            {job?.metadata?.compensation && (
              <span className="text-xs font-mono px-2 py-0.5 rounded text-primary bg-secondary">
                {job?.metadata?.compensation}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground font-mono">
            {formatDate(job.updated_at)}
          </span>
          <SaveJobButton
            jobSlug={job.slug}
            jobTitle={job.title}
            company={job.company}
            companyLogoUrl={job.company_logo_url}
            location={job.location}
            employmentType={job.employment_type}
            jobUrl={job.url}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <Button
            size="sm"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
            asChild
          >
            <a href={job.url} target="_blank" rel="noopener noreferrer">
              Apply
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </a>
          </Button>
        </div>
      </Link>
    </div>
  );
}
