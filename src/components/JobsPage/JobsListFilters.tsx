"use client";

import { Search, X, SlidersHorizontal, MapPin } from "lucide-react";
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

export type JobsListFiltersProps = {
  q: string;
  onQChange: (v: string) => void;
  domain: string;
  onDomainChange: (v: string) => void;
  employmentType: string;
  onEmploymentTypeChange: (v: string) => void;
  experienceLevel: string;
  onExperienceLevelChange: (v: string) => void;
  location: string;
  onLocationChange: (v: string) => void;
  onClear: () => void;
  activeCount: number;
  domainOptions: { slug: string; name: string; count: number }[];
};

export function JobsListFilters({
  q,
  onQChange,
  domain,
  onDomainChange,
  employmentType,
  onEmploymentTypeChange,
  experienceLevel,
  onExperienceLevelChange,
  location,
  onLocationChange,
  onClear,
  activeCount,
  domainOptions,
}: JobsListFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by title, company, or location..."
          value={q}
          onChange={(e) => onQChange(e.target.value)}
          className="pl-10 bg-secondary border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl py-2.5"
        />
        {q && (
          <button
            type="button"
            onClick={() => onQChange("")}
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

        <Select value={domain || "all"} onValueChange={onDomainChange}>
          <SelectTrigger className="w-[180px] bg-secondary border-border rounded-lg">
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

        <Select
          value={experienceLevel || "all"}
          onValueChange={onExperienceLevelChange}
        >
          <SelectTrigger className="w-[160px] bg-secondary border-border rounded-lg">
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

        <Select
          value={employmentType || "all"}
          onValueChange={onEmploymentTypeChange}
        >
          <SelectTrigger className="w-[140px] bg-secondary border-border rounded-lg">
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
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="pl-10 bg-secondary border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg py-2"
          />
        </div>

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
          {domain && domain !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 font-mono text-xs cursor-pointer hover:bg-secondary/80"
              onClick={() => onDomainChange("all")}
            >
              Domain: {domain}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {experienceLevel && experienceLevel !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 font-mono text-xs cursor-pointer hover:bg-secondary/80"
              onClick={() => onExperienceLevelChange("all")}
            >
              {experienceLevel}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {employmentType && employmentType !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 font-mono text-xs cursor-pointer hover:bg-secondary/80"
              onClick={() => onEmploymentTypeChange("all")}
            >
              {employmentType}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {location && (
            <Badge
              variant="secondary"
              className="gap-1 font-mono text-xs cursor-pointer hover:bg-secondary/80"
              onClick={() => onLocationChange("")}
            >
              {location}
              <X className="h-3 w-3" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
