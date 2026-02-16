"use client";
import { MapPin, Clock, ArrowUpRight } from "lucide-react";
import { type JobListing } from "@/data/companyData";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface JobCardProps {
  job: JobListing;
}

export function JobCard({ job }: JobCardProps) {
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
    <Link href={`/job/${job.slug}`} className="block">
      <div className="group flex items-center justify-between px-5 py-4 hover:bg-secondary/50 transition-all duration-200 border-b border-border last:border-b-0">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
            {job.title}
          </h4>
          <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground">
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

        <div className="flex items-center gap-4">
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
      </div>
    </Link>
  );
}
