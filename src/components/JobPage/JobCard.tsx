"use client";
import Link from "next/link";
import { MapPin, Briefcase, Building2 } from "lucide-react";
import JobBadge from "./JobBadge";

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  location: string;
  company_logo_url?: string;
  employment_type: string;
  domain: string;
  slug: string;
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
}: JobCardProps) => {
  return (
    <Link href={`/job/${slug}`} className="group block">
      <div className="job-card h-full">
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
      </div>
    </Link>
  );
};

export default JobCard;
