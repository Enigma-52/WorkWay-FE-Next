"use client";
import { Briefcase } from "lucide-react";
import { DomainAccordion } from "./DomainAccordion";

interface JobsSectionProps {
  companySlug: string;
  totalJobs: number;
  domainStats: { domain: string; count: number }[];
}

export function JobsSection({ companySlug, totalJobs, domainStats }: JobsSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Open Positions</h2>
          <p className="text-sm text-muted-foreground">
            {totalJobs} roles
          </p>
        </div>
      </div>

      <DomainAccordion companySlug={companySlug} domainStats={domainStats} />
    </section>
  );
}
