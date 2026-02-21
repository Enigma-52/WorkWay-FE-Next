"use client";

import { Briefcase, Layers, User } from "lucide-react";

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

  return (
    <aside className="space-y-8">
      {/* Domains */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-4 w-4 text-primary" />
          <h3 className="font-mono text-xs font-semibold tracking-wider uppercase text-muted-foreground">
            Domain
          </h3>
        </div>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => onDomainClick("all")}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors font-mono ${
                activeDomain === "all"
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-transparent"
              }`}
            >
              All
            </button>
          </li>
          {domains.slice(0, 14).map((d) => {
            const isActive = activeDomain === d.slug;
            return (
              <li key={d.slug}>
                <button
                  type="button"
                  onClick={() => onDomainClick(d.slug)}
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors flex items-center justify-between gap-2 ${
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-transparent"
                  }`}
                >
                  <span className="truncate">{d.name}</span>
                  <span className="font-mono text-xs shrink-0 tabular-nums">
                    {d.count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
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
                  <span className="font-mono text-xs shrink-0 tabular-nums">
                    {t.count}
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
                  <span className="font-mono text-xs shrink-0 tabular-nums">
                    {e.count}
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
