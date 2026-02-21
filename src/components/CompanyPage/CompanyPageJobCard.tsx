"use client";
import { MapPin, Clock, ArrowUpRight } from "lucide-react";
import { type JobListing } from "@/data/companyData";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function normalizedSkills(skills: unknown): { name: string; slug: string }[] {
  if (!skills) return [];
  const raw = typeof skills === "string" ? (() => { try { return JSON.parse(skills); } catch { return []; } })() : skills;
  if (!Array.isArray(raw)) return [];
  return raw.filter((s): s is { name: string; slug: string } => s && typeof s === "object" && typeof (s as { name?: string }).name === "string" && typeof (s as { slug?: string }).slug === "string");
}

interface JobCardProps {
  job: JobListing;
}

export function JobCard({ job }: JobCardProps) {
  const skillsList = normalizedSkills(job.skills);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="group flex flex-col px-5 py-4 hover:bg-secondary/50 transition-all duration-200 border-b border-border last:border-b-0">
      <Link href={`/job/${job.slug}`} className="flex items-center justify-between flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
            {job.title}
          </h4>
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
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <span className="text-xs text-muted-foreground font-mono">
            {formatDate(job.updated_at)}
          </span>
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

      {skillsList.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {skillsList.slice(0, 5).map((s) => (
            <Link
              key={s.slug}
              href={`/skills/${s.slug}`}
              className="inline-flex items-center rounded-md border border-border bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {s.name}
            </Link>
          ))}
          {skillsList.length > 5 ? (
            <span className="text-xs text-muted-foreground py-0.5">
              +{skillsList.length - 5}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
