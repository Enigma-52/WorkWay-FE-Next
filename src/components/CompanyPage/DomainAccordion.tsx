"use client";
import { useState } from "react";
import { Folder } from "lucide-react";
import { type JobListing } from "@/data/companyData";
import { JobCard } from "./CompanyPageJobCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const INITIAL_SHOW = 3;

interface DomainAccordionProps {
  jobsByDomain: Record<string, JobListing[]>;
}

function DomainJobList({ jobs }: { jobs: JobListing[] }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = jobs.length > INITIAL_SHOW;
  const visible = expanded ? jobs : jobs.slice(0, INITIAL_SHOW);

  return (
    <div className="border-t border-border">
      {visible.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="w-full py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors border-t border-border bg-secondary/20 hover:bg-secondary/40"
        >
          {expanded
            ? "Show fewer"
            : `Show all ${jobs.length} roles`}
        </button>
      )}
    </div>
  );
}

export function DomainAccordion({ jobsByDomain }: DomainAccordionProps) {
  const domains = Object.keys(jobsByDomain).sort(
    (a, b) => jobsByDomain[b].length - jobsByDomain[a].length,
  );

  if (domains.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No jobs match your filters.</p>
      </div>
    );
  }

  return (
    <Accordion type="multiple" defaultValue={domains} className="space-y-3">
      {domains.map((domain) => (
        <AccordionItem
          key={domain}
          value={domain}
          className="border border-border rounded-xl overflow-hidden gradient-card data-[state=open]:border-glow"
        >
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-secondary/30 transition-colors [&[data-state=open]>svg]:rotate-180">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Folder className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold">{domain}</span>
              <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {jobsByDomain[domain].length} roles
              </span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="pb-0">
            <DomainJobList jobs={jobsByDomain[domain]} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
