"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Search, ExternalLink, Building2 } from "lucide-react";
import type { CompanyListItem } from "@/lib/api/contracts";

type PlatformResult = {
  name: string;
  slug: string;
  platform?: string;
  website: string | null;
  logo_url: string | null;
  totalJobs: number;
};

const ATS_LABELS: Record<string, string> = {
  greenhouse: "Greenhouse",
  lever: "Lever",
  ashby: "Ashby",
  workable: "Workable",
  ycombinator: "Y Combinator Jobs Board",
};

function atsLabel(platform?: string): string {
  if (!platform) return "Unknown";
  return ATS_LABELS[platform] || platform;
}

export default function AtsFinderClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CompanyListItem[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<PlatformResult | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestRef = useRef(0);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      requestRef.current += 1;
      setResults(null);
      setSearching(false);
      return;
    }
    const requestId = ++requestRef.current;
    setSearching(true);
    try {
      const res = await fetch(`/api/company/search?q=${encodeURIComponent(q)}`);
      if (requestId !== requestRef.current) return;
      if (res.ok) {
        const data: CompanyListItem[] = await res.json();
        setResults(data);
      }
    } catch {
      if (requestId === requestRef.current) setResults(null);
    } finally {
      if (requestId === requestRef.current) setSearching(false);
    }
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    setSelected(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      runSearch("");
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(() => runSearch(value), 250);
  }

  async function handleSelect(company: CompanyListItem) {
    setLookupLoading(true);
    setSelected(null);
    try {
      const res = await fetch(`/api/company/platform?slug=${encodeURIComponent(company.slug)}`);
      if (res.ok) {
        const data: PlatformResult = await res.json();
        setSelected(data);
      }
    } finally {
      setLookupLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search a company name, e.g. Airbnb, Figma, Stripe..."
          className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors"
          aria-label="Search for a company"
        />
      </div>

      {searching && (
        <p className="text-sm text-muted-foreground">Searching...</p>
      )}

      {!searching && results && results.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No company found matching &quot;{query}&quot;. Try a shorter or
          differently-spelled name.
        </p>
      )}

      {!searching && results && results.length > 0 && !selected && (
        <div className="divide-y divide-border border-t border-border">
          {results.slice(0, 8).map((company) => (
            <button
              key={company.slug}
              onClick={() => handleSelect(company)}
              className="w-full flex items-center gap-3 py-3 text-left hover:bg-background/60 transition-colors px-2 -mx-2 rounded-lg"
            >
              <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium">{company.name}</span>
              {typeof company.jobs_open_count === "number" && (
                <span className="ml-auto text-xs text-muted-foreground font-mono">
                  {company.jobs_open_count} open roles
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {lookupLoading && (
        <p className="text-sm text-muted-foreground mt-4">Looking up ATS...</p>
      )}

      {selected && (
        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-5">
          <p className="text-sm text-muted-foreground mb-1">
            {selected.name} hires through
          </p>
          <p className="text-xl font-semibold mb-4">{atsLabel(selected.platform)}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/company/${selected.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              View open roles on WorkWay
            </Link>
            {selected.website && (
              <a
                href={selected.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-primary/30 transition-colors"
              >
                Company website
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
