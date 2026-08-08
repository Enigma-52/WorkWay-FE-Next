"use client";

import { Briefcase, TrendingUp, User } from "lucide-react";
import Link from "next/link";

export type JobsFacetsSidebarProps = {
  domains: { slug: string; name: string; count: number }[];
  employmentTypes: { value: string; count: number }[];
  experienceLevels: { value: string; count: number }[];
  appliedFilters: {
    domain?: string;
    employment_type?: string;
    experience_level?: string;
  };
  onDomainClick: (slug: string) => void;
  onEmploymentTypeClick: (value: string) => void;
  onExperienceLevelClick: (value: string) => void;
};

const TRENDING_DOMAIN_COUNT = 6;

export function JobsFacetsSidebar({
  domains,
  employmentTypes,
  experienceLevels,
  appliedFilters,
  onDomainClick,
  onEmploymentTypeClick,
  onExperienceLevelClick,
}: JobsFacetsSidebarProps) {
  const activeDomain = appliedFilters.domain || "all";
  const activeType = appliedFilters.employment_type || "all";
  const activeLevel = appliedFilters.experience_level || "all";

  // "Other" is a catch-all bucket, not a meaningful domain to feature as trending.
  const trendingDomains = domains
    .filter((d) => d.name.toLowerCase() !== "other")
    .slice(0, TRENDING_DOMAIN_COUNT);
  const maxDomainCount = trendingDomains[0]?.count || 1;

  return (
    <aside className="space-y-8">
      {/* Trending domains */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="font-mono text-xs font-semibold tracking-wider uppercase text-muted-foreground">
            Trending Domains
          </h3>
        </div>
        <ul className="space-y-1.5">
          {trendingDomains.map((d) => {
            const isActive = activeDomain === d.slug;
            const widthPct = Math.max(6, Math.round((d.count / maxDomainCount) * 100));
            return (
              <li key={d.slug}>
                <button
                  type="button"
                  onClick={() => onDomainClick(isActive ? "all" : d.slug)}
                  className={`relative w-full overflow-hidden rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? "border-primary/30 text-primary"
                      : "border-transparent text-foreground hover:border-border"
                  }`}
                >
                  <span
                    className={`absolute inset-y-0 left-0 rounded-lg transition-all ${
                      isActive ? "bg-primary/20" : "bg-secondary"
                    }`}
                    style={{ width: `${widthPct}%` }}
                    aria-hidden="true"
                  />
                  <span className="relative flex items-center justify-between gap-2">
                    <span className="truncate">{d.name}</span>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                      {d.count.toLocaleString()}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {activeDomain !== "all" && (
          <button
            type="button"
            onClick={() => onDomainClick("all")}
            className="mt-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear domain filter
          </button>
        )}
        <Link
          href="/domains"
          className="mt-3 block text-xs font-medium text-primary hover:underline"
        >
          Browse all domains
        </Link>
      </div>

      {/* Employment type */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Briefcase className="h-4 w-4 text-primary" />
          <h3 className="font-mono text-xs font-semibold tracking-wider uppercase text-muted-foreground">
            Type
          </h3>
        </div>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => onEmploymentTypeClick("all")}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors font-mono ${
                activeType === "all"
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-transparent"
              }`}
            >
              All
            </button>
          </li>
          {employmentTypes.map((t) => {
            const isActive = activeType === t.value;
            return (
              <li key={t.value}>
                <button
                  type="button"
                  onClick={() => onEmploymentTypeClick(t.value)}
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors flex items-center justify-between gap-2 ${
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-transparent"
                  }`}
                >
                  <span>{t.value}</span>
                  <span className="font-mono text-xs shrink-0 tabular-nums text-muted-foreground">
                    {t.count.toLocaleString()}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Experience level */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4 text-primary" />
          <h3 className="font-mono text-xs font-semibold tracking-wider uppercase text-muted-foreground">
            Experience
          </h3>
        </div>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => onExperienceLevelClick("all")}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors font-mono ${
                activeLevel === "all"
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-transparent"
              }`}
            >
              All
            </button>
          </li>
          {experienceLevels.map((e) => {
            const isActive = activeLevel === e.value;
            return (
              <li key={e.value}>
                <button
                  type="button"
                  onClick={() => onExperienceLevelClick(e.value)}
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors flex items-center justify-between gap-2 ${
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-transparent"
                  }`}
                >
                  <span>{e.value}</span>
                  <span className="font-mono text-xs shrink-0 tabular-nums text-muted-foreground">
                    {e.count.toLocaleString()}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
