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
import SaveJobButton from "@/components/common/SaveJobButton";
import { useJobStatus } from "@/contexts/JobStatusContext";
import { CheckCircle2 } from "lucide-react";

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
  const { appliedSlugs } = useJobStatus();
  const isApplied = appliedSlugs.has(job.slug);
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
      {/* Applied badge */}
      {isApplied && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-medium text-green-500 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5 z-10">
          <CheckCircle2 className="w-3 h-3" />
          Applied
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 rounded-lg bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <Link href={`/job/${job.slug}`} className="flex gap-4 min-w-0 flex-1">
          {/* Company Logo */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full">
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
          </div>
          {/* Job Info */}
          <div className="flex flex-col gap-2 min-w-0">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-sm text-muted-foreground">{job.company}</p>
            </div>

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
                  {job?.metadata?.compensation}
                </Badge>
              )}
              <Badge
                variant="outline"
                className="font-mono text-xs border-primary/30 text-primary"
              >
                {job.platform?.charAt(0).toUpperCase() + job.platform?.slice(1)}
              </Badge>
            </div>
            {/* Skill tags (separate links so no nested anchors) */}
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
        </Link>

        <div className="flex items-start gap-2 shrink-0">
          <SaveJobButton
            jobSlug={job.slug}
            jobTitle={job.title}
            company={job.company}
            companyLogoUrl={job.company_logo_url}
            location={job.location}
            employmentType={job.employment_type}
            jobUrl={job.url}
          />
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
