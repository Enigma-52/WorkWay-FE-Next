import { ArrowRight } from "lucide-react";
import Link from "next/link";
import RemoteLogo from "@/components/common/RemoteLogo";
import type { Company } from "@/types/company";

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div className="group relative rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:glow-subtle">
      <div className="flex items-start gap-4">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
          <RemoteLogo
            src={company.logo_url}
            alt={`${company.name} logo`}
            width={56}
            height={56}
            className="h-full w-full object-cover"
            fallback={
              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-primary">
                {company.name.slice(0, 2).toUpperCase()}
              </div>
            }
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-lg font-semibold text-foreground">
              {company.name}
            </h3>
            {company.is_actively_hiring && (company.jobs_open_count ?? 0) > 0 && (
              <span className="flex-shrink-0 rounded-full bg-primary/20 px-2 py-0.5 font-mono text-xs text-primary">
                Hiring
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {company.description && company.description.length > 50
              ? `${company.description.slice(0, 50)}...`
              : company.description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="font-mono text-sm text-muted-foreground">
          {company.jobs_open_count ?? 0} open jobs
        </span>
        <Link
          href={`/company/${company.slug}`}
          className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100"
        >
          View company
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
