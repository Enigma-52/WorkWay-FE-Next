"use client";
import Link from "next/link";
import { MapPin, Briefcase, Building2 } from "lucide-react";
import JobBadge from "./JobBadge";

function normalizedSkills(skills: unknown): { name: string; slug: string }[] {
  if (!skills) return [];
  const raw = typeof skills === "string" ? (() => { try { return JSON.parse(skills); } catch { return []; } })() : skills;
  if (!Array.isArray(raw)) return [];
  return raw.filter((s): s is { name: string; slug: string } => s && typeof s === "object" && typeof (s as { name?: string }).name === "string" && typeof (s as { slug?: string }).slug === "string");
}

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  location: string;
  company_logo_url?: string;
  employment_type: string;
  domain: string;
  slug: string;
  skills?: { name: string; slug: string }[] | unknown;
}

const JobCard = ({
  id,
  title,
  slug,
  company_logo_url,
  company,
  location,
  employment_type,
  domain,
  skills,
}: JobCardProps) => {
  const skillsList = normalizedSkills(skills);

  return (
    <div className="job-card h-full group block">
      <Link href={`/job/${slug}`} className="block">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
            {company_logo_url ? (
              <img
                src={company_logo_url}
                alt={`${company} logo`}
                className="max-h-8 max-w-full object-contain"
              />
            ) : (
              <Building2 className="h-6 w-6 text-primary" />
            )}
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {company}
          </span>
        </div>

        <h4 className="mb-3 text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h4>

        <div className="flex flex-wrap gap-2">
          <JobBadge variant="primary">
            <MapPin className="mr-1 h-3 w-3" />
            {location}
          </JobBadge>
          <JobBadge>
            <Briefcase className="mr-1 h-3 w-3" />
            {employment_type}
          </JobBadge>
        </div>

        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">{domain}</span>
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
};

export default JobCard;
