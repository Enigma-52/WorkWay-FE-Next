"use client";

import { Search, X, SlidersHorizontal, MapPin, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

const EXPERIENCE_LEVELS = [
  "Intern",
  "Junior",
  "Mid-level",
  "Senior",
  "Staff",
  "Lead",
  "Manager",
  "Director",
];
const EMPLOYMENT_TYPES = ["Full-Time", "Part-Time", "Contract"];
const POSTED_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "3d", label: "Last 3 days" },
  { value: "7d", label: "Last 1 week" },
  { value: "30d", label: "Last 1 month" },
];

export type AppliedFilters = {
  q: string;
  domain: string;
  employmentType: string;
  experienceLevel: string;
  location: string;
  posted: string;
};

export type JobsListFiltersProps = {
  // committed (URL) values — used for active badges
  q: string;
  domain: string;
  employmentType: string;
  experienceLevel: string;
  location: string;
  posted: string;
  onApply: (filters: AppliedFilters) => void;
  onClear: () => void;
  activeCount: number;
  domainOptions: { slug: string; name: string; count: number }[];
};

export function JobsListFilters({
  q,
  domain,
  employmentType,
  experienceLevel,
  location,
  posted,
  onApply,
  onClear,
  activeCount,
  domainOptions,
}: JobsListFiltersProps) {
  // Draft state — local until Search button is clicked
  const [draftQ, setDraftQ] = useState(q);
  const [draftDomain, setDraftDomain] = useState(domain || "all");
  const [draftEmploymentType, setDraftEmploymentType] = useState(employmentType || "all");
  const [draftExperienceLevel, setDraftExperienceLevel] = useState(experienceLevel || "all");
  const [draftLocation, setDraftLocation] = useState(location);
  const [draftPosted, setDraftPosted] = useState(posted || "all");

  // Sync draft when committed values change (e.g. after clear or external nav)
  useEffect(() => { setDraftQ(q); }, [q]);
  useEffect(() => { setDraftDomain(domain || "all"); }, [domain]);
  useEffect(() => { setDraftEmploymentType(employmentType || "all"); }, [employmentType]);
  useEffect(() => { setDraftExperienceLevel(experienceLevel || "all"); }, [experienceLevel]);
  useEffect(() => { setDraftLocation(location); }, [location]);
  useEffect(() => { setDraftPosted(posted || "all"); }, [posted]);

  const handleApply = () => {
    onApply({
      q: draftQ,
      domain: draftDomain,
      employmentType: draftEmploymentType,
      experienceLevel: draftExperienceLevel,
      location: draftLocation,
      posted: draftPosted,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleApply();
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by title or company..."
          value={draftQ}
          onChange={(e) => setDraftQ(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 bg-secondary border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl py-2.5"
        />
        {draftQ && (
          <button
            type="button"
            onClick={() => setDraftQ("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="font-mono tracking-wide">Filters</span>
        </div>

        <Select value={draftDomain} onValueChange={setDraftDomain}>
          <SelectTrigger className="w-[180px] bg-secondary border-border rounded-lg" aria-label="Filter by domain">
            <SelectValue placeholder="Domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All domains</SelectItem>
            {domainOptions.map((d) => (
              <SelectItem key={d.slug} value={d.slug}>
                {d.name} ({d.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={draftExperienceLevel} onValueChange={setDraftExperienceLevel}>
          <SelectTrigger className="w-[160px] bg-secondary border-border rounded-lg" aria-label="Filter by experience level">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            {EXPERIENCE_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={draftEmploymentType} onValueChange={setDraftEmploymentType}>
          <SelectTrigger className="w-[140px] bg-secondary border-border rounded-lg" aria-label="Filter by employment type">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {EMPLOYMENT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1 min-w-[160px] max-w-[220px]">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Location (e.g. Remote)"
            value={draftLocation}
            onChange={(e) => setDraftLocation(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 bg-secondary border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg py-2"
          />
        </div>

        <Select value={draftPosted} onValueChange={setDraftPosted}>
          <SelectTrigger className="w-[160px] bg-secondary border-border rounded-lg" aria-label="Filter by date posted">
            <Clock className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue placeholder="Date posted" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any time</SelectItem>
            {POSTED_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="sm"
          onClick={handleApply}
          className="font-mono"
        >
          <Search className="mr-1.5 h-3.5 w-3.5" />
          Search
        </Button>

        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground font-mono"
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Clear ({activeCount})
          </Button>
        )}
      </div>

      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {q && (
            <Badge
              variant="secondary"
              className="gap-1 font-mono text-xs cursor-pointer hover:bg-secondary/80"
              onClick={() => onApply({ q: "", domain, employmentType, experienceLevel, location, posted })}
            >
              {q}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {domain && domain !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 font-mono text-xs cursor-pointer hover:bg-secondary/80"
              onClick={() => onApply({ q, domain: "all", employmentType, experienceLevel, location, posted })}
            >
              Domain: {domain}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {experienceLevel && experienceLevel !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 font-mono text-xs cursor-pointer hover:bg-secondary/80"
              onClick={() => onApply({ q, domain, employmentType, experienceLevel: "all", location, posted })}
            >
              {experienceLevel}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {employmentType && employmentType !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 font-mono text-xs cursor-pointer hover:bg-secondary/80"
              onClick={() => onApply({ q, domain, employmentType: "all", experienceLevel, location, posted })}
            >
              {employmentType}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {location && (
            <Badge
              variant="secondary"
              className="gap-1 font-mono text-xs cursor-pointer hover:bg-secondary/80"
              onClick={() => onApply({ q, domain, employmentType, experienceLevel, location: "", posted })}
            >
              {location}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {posted && posted !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 font-mono text-xs cursor-pointer hover:bg-secondary/80"
              onClick={() => onApply({ q, domain, employmentType, experienceLevel, location, posted: "all" })}
            >
              {POSTED_OPTIONS.find((o) => o.value === posted)?.label ?? posted}
              <X className="h-3 w-3" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
