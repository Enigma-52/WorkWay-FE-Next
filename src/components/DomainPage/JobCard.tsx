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
import { truncateLocation } from "@/utils/helper";

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
  return (
    t
      .slice(0, maxChars)
      .trim()
      .replace(/\s+\S*$/, "") + "…"
  );
}

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
  job: any;
}

export function JobCard({ job }: JobCardProps) {
  const descPreview = getDescriptionPreview(job.description);
  const displayDesc = descPreview
    ? truncateDescription(descPreview, DESCRIPTION_PREVIEW_MAX_CHARS)
    : null;

  const timeAgo = (() => {
    const diffMs = Date.now() - new Date(job.updated_at).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "Just Now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minutes ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH} hours ago`;
    const diffD = Math.floor(diffH / 24);
    if (diffD === 1) return "Yesterday";
    return `${diffD} days ago`;
  })();

  const skillsList = normalizedSkills(job.skills);
  const platform = job.platform;

  return (
    <article className="group relative rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:glow-subtle animate-fade-in">
      <div className="pointer-events-none absolute inset-0 rounded-lg bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4 min-w-0 flex-1">
          {/* Company Logo */}
          <Link href={`/job/${job.slug}`} className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full">
            {job.company_logo_url ? (
              <img
                src={job.company_logo_url}
                alt={`${job.company} logo`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden",
                  );
                }}
              />
            ) : null}

            <Building2
              className={`h-7 w-7 text-muted-foreground ${job.company_logo_url ? "hidden" : ""}`}
            />
          </Link>
          {/* Job Info */}
          <div className="flex flex-col gap-2 min-w-0">
            <Link href={`/job/${job.slug}`}>
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-sm text-muted-foreground">{job.company}</p>
            </Link>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5" title={job.location}>
                <MapPin className="h-3.5 w-3.5" />
                {truncateLocation(job.location)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {timeAgo}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-mono text-xs">
                <Briefcase className="mr-1 h-3 w-3" />
                {job.employment_type}
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                {job.experience_level}
              </Badge>
              {job?.metadata?.compensation && (
                <Badge
                  variant="outline"
                  className="font-mono text-xs border-primary/30 text-primary"
                >
                  {job?.metadata?.compensation?.split("•")[0]?.trim()}
                </Badge>
              )}
              {job?.metadata?.compensation?.toLowerCase().includes("equity") && (
                <Badge
                  variant="outline"
                  className="font-mono text-xs border-green-500/30 text-green-600 dark:text-green-400"
                >
                  Offers Equity
                </Badge>
              )}
              {job?.metadata?.compensation?.toLowerCase().includes("bonus") && (
                <Badge
                  variant="outline"
                  className="font-mono text-xs border-amber-500/30 text-amber-600 dark:text-amber-400"
                >
                  Offers Bonus
                </Badge>
              )}
              <Badge
                variant="outline"
                className="font-mono text-xs border-primary/30 text-primary"
              >
                {job.platform?.charAt(0).toUpperCase() + job.platform?.slice(1)}
              </Badge>
            </div>

            {skillsList.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {skillsList.slice(0, 10).map((s) => (
                  <Link
                    key={s.slug}
                    href={`/skill/${s.slug}`}
                    className="inline-flex items-center rounded-md border border-border bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                  >
                    {s.name}
                  </Link>
                ))}
                {skillsList.length > 10 ? (
                  <span className="text-xs text-muted-foreground py-0.5">
                    +{skillsList.length - 10}
                  </span>
                ) : null}
              </div>
            ) : null}

            {displayDesc ? (
              <Link href={`/job/${job.slug}`} className="mt-4 block">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {displayDesc}
                </p>
              </Link>
            ) : null}
          </div>
        </div>

        <div className="flex items-start shrink-0">
          <Button asChild variant="outline" size="sm" className="group/btn ...">
            <a href={job.url} target="_blank" rel="noopener noreferrer">
              Apply
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
