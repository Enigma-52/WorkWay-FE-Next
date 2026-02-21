"use client";
import {
  MapPin,
  Clock,
  Briefcase,
  ExternalLink,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const DESCRIPTION_PREVIEW_MAX_CHARS = 160;

function getDescriptionPreview(description: unknown): string | null {
  if (typeof description === "string" && description.trim()) return description;
  if (Array.isArray(description) && description.length > 0) {
    const first = description[0];
    return typeof first === "string" ? first : null;
  }
  return null;
}

function truncateDescription(text: string, maxChars: number): string {
  const t = text.trim();
  if (t.length <= maxChars) return t;
  return t.slice(0, maxChars).trim().replace(/\s+\S*$/, "") + "…";
}

interface JobCardProps {
  job: any;
}

export function JobCard({ job }: JobCardProps) {
  const descPreview = getDescriptionPreview(job.description);
  const displayDesc = descPreview ? truncateDescription(descPreview, DESCRIPTION_PREVIEW_MAX_CHARS) : null;

  const daysAgo = Math.floor(
    (Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24),
  );
  const timeAgo =
    daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`;

  return (
    <Link href={`/job/${job.slug}`} className="block">
      <article className="group relative rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:glow-subtle animate-fade-in">
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: Company logo + Info */}
          <div className="flex gap-4">
            {/* Company Logo */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
              {job.company_logo_url ? (
                <img
                  src={job.company_logo_url}
                  alt={`${job.company} logo`}
                  className="h-full w-full object-contain p-2"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.classList.remove(
                      "hidden",
                    );
                  }}
                />
              ) : null}
              <Building2
                className={`h-6 w-6 text-muted-foreground ${job.company_logo_url ? "hidden" : ""}`}
              />
            </div>

            {/* Job Info */}
            <div className="flex flex-col gap-2">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {timeAgo}
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  <Briefcase className="mr-1 h-3 w-3" />
                  {job.employment_type}
                </Badge>
                <Badge
                  variant="outline"
                  className="font-mono text-xs border-primary/30 text-primary"
                >
                  {job.experience_level}
                </Badge>
              </div>
            </div>
          </div>

          {/* Right: Apply button */}
          <div className="flex items-start">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="group/btn ..."
            >
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Apply
                <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Description preview */}
        {displayDesc ? (
          <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
            {displayDesc}
          </p>
        ) : null}
      </article>
    </Link>
  );
}
