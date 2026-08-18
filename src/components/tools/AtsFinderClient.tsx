"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ExternalLink, Building2, AlertCircle, X } from "lucide-react";
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

function CompanyAvatar({ logoUrl, name, size = 32 }: { logoUrl: string | null; name: string; size?: number }) {
  const [broken, setBroken] = useState(false);
  if (!logoUrl || broken) {
    return (
      <span
        className="flex items-center justify-center rounded-full bg-secondary flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <Building2 className="w-4 h-4 text-muted-foreground" />
      </span>
    );
  }
  return (
    <span
      className="relative flex items-center justify-center rounded-full overflow-hidden flex-shrink-0 bg-secondary"
      style={{ width: size, height: size }}
    >
      <Image
        src={logoUrl}
        alt={name}
        width={size}
        height={size}
        unoptimized
        className="h-full w-full object-cover"
        onError={() => setBroken(true)}
      />
    </span>
  );
}

type LoadState = "idle" | "loading" | "error";

export default function AtsFinderClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CompanyListItem[] | null>(null);
  const [searchState, setSearchState] = useState<LoadState>("idle");
  const [selected, setSelected] = useState<PlatformResult | null>(null);
  const [lookupState, setLookupState] = useState<LoadState>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestRef = useRef(0);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      requestRef.current += 1;
      setResults(null);
      setSearchState("idle");
      return;
    }
    const requestId = ++requestRef.current;
    setSearchState("loading");
    try {
      const res = await fetch(`/api/company/search?q=${encodeURIComponent(q)}`);
      if (requestId !== requestRef.current) return;
      if (!res.ok) throw new Error("search failed");
      const data: CompanyListItem[] = await res.json();
      setResults(data);
      setSearchState("idle");
    } catch {
      if (requestId === requestRef.current) {
        setResults(null);
        setSearchState("error");
      }
    }
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    setSelected(null);
    setLookupState("idle");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      runSearch("");
      return;
    }
    setSearchState("loading");
    debounceRef.current = setTimeout(() => runSearch(value), 250);
  }

  async function handleSelect(company: CompanyListItem) {
    setLookupState("loading");
    setSelected(null);
    try {
      const res = await fetch(`/api/company/platform?slug=${encodeURIComponent(company.slug)}`);
      if (!res.ok) throw new Error("lookup failed");
      const data: PlatformResult = await res.json();
      setSelected(data);
      setLookupState("idle");
    } catch {
      setLookupState("error");
    }
  }

  function handleReset() {
    setSelected(null);
    setLookupState("idle");
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

      {searchState === "loading" && (
        <div className="divide-y divide-border border-t border-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3 animate-pulse">
              <span className="w-8 h-8 rounded-full bg-secondary" />
              <span className="h-3.5 w-32 rounded bg-secondary" />
            </div>
          ))}
        </div>
      )}

      {searchState === "error" && (
        <div className="flex items-center gap-2 text-sm text-destructive py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Search failed — check your connection and try again.</span>
        </div>
      )}

      {searchState === "idle" && results && results.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No company found matching &quot;{query}&quot;. Try a shorter or
          differently-spelled name.
        </p>
      )}

      {searchState === "idle" && results && results.length > 0 && !selected && (
        <div className="divide-y divide-border border-t border-border">
          {results.slice(0, 8).map((company) => (
            <button
              key={company.slug}
              onClick={() => handleSelect(company)}
              className="w-full flex items-center gap-3 py-3 text-left hover:bg-background/60 transition-colors px-2 -mx-2 rounded-lg"
            >
              <CompanyAvatar logoUrl={company.logo_url ?? null} name={company.name} />
              <span className="text-sm font-medium">{company.name}</span>
              {typeof company.jobs_open_count === "number" && (
                <span className="ml-auto text-xs text-muted-foreground font-mono">
                  {company.jobs_open_count.toLocaleString()} open roles
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {lookupState === "loading" && (
        <div className="mt-4 rounded-lg border border-border p-5 animate-pulse space-y-3">
          <div className="h-3 w-40 rounded bg-secondary" />
          <div className="h-6 w-28 rounded bg-secondary" />
        </div>
      )}

      {lookupState === "error" && (
        <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Couldn&apos;t look up that company&apos;s ATS — try again.</span>
        </div>
      )}

      {selected && lookupState === "idle" && (
        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <CompanyAvatar logoUrl={selected.logo_url} name={selected.name} size={40} />
              <div>
                <p className="text-sm text-muted-foreground leading-tight">
                  {selected.name} hires through
                </p>
                <p className="text-xl font-semibold leading-tight">{atsLabel(selected.platform)}</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              aria-label="Clear result"
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {selected.totalJobs > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              {selected.totalJobs.toLocaleString()} open role{selected.totalJobs === 1 ? "" : "s"} currently tracked on WorkWay.
            </p>
          )}
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
