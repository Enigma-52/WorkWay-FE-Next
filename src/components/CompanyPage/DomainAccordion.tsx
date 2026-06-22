"use client";
import { useState, useEffect, useCallback } from "react";
import { Folder, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { JobCard } from "./CompanyPageJobCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PAGE_SIZE = 5;

interface DomainAccordionProps {
  companySlug: string;
  domainStats: { domain: string; count: number }[];
}

function DomainJobList({
  companySlug,
  domain,
  totalCount,
}: {
  companySlug: string;
  domain: string;
  totalCount: number;
}) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const fetchPage = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/company/jobs?slug=${encodeURIComponent(companySlug)}&domain=${encodeURIComponent(domain)}&page=${p}&limit=${PAGE_SIZE}`
        );
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs);
        }
      } catch {
        // ignore
      }
      setLoading(false);
    },
    [companySlug, domain]
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const goTo = (p: number) => {
    setPage(p);
    fetchPage(p);
  };

  return (
    <div className="border-t border-border">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        jobs.map((job) => <JobCard key={job.id} job={job} />)
      )}

      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-3 py-3 border-t border-border bg-secondary/20">
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
            className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted-foreground font-mono">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
            className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export function DomainAccordion({ companySlug, domainStats }: DomainAccordionProps) {
  const sorted = [...domainStats].sort((a, b) => b.count - a.count);

  if (sorted.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No open positions found.</p>
      </div>
    );
  }

  return (
    <Accordion
      type="multiple"
      defaultValue={sorted.map((s) => s.domain)}
      className="space-y-3"
    >
      {sorted.map((stat) => (
        <AccordionItem
          key={stat.domain}
          value={stat.domain}
          className="border border-border rounded-xl overflow-hidden gradient-card data-[state=open]:border-glow"
        >
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-secondary/30 transition-colors [&[data-state=open]>svg]:rotate-180">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Folder className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold">{stat.domain}</span>
              <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {stat.count} roles
              </span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="pb-0">
            <DomainJobList
              companySlug={companySlug}
              domain={stat.domain}
              totalCount={stat.count}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
