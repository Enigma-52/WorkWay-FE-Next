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

const experienceLevels = [
  "Intern",
  "Junior",
  "Mid-level",
  "Senior",
  "Staff",
  "Lead",
  "Manager",
  "Director",
];
const employmentTypes = ["Full-Time", "Part-Time", "Contract"];
const locations = ["Remote", "On-site", "Hybrid"];

interface JobFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  experienceLevel: string;
  onExperienceLevelChange: (value: string) => void;
  employmentType: string;
  onEmploymentTypeChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export function JobFilters({
  searchQuery,
  onSearchChange,
  experienceLevel,
  onExperienceLevelChange,
  employmentType,
  onEmploymentTypeChange,
  location,
  onLocationChange,
  onClearFilters,
  activeFiltersCount,
}: JobFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search jobs, companies..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-secondary border-border focus:border-primary focus:ring-primary/20"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="font-mono">Filters</span>
        </div>

        <Select value={experienceLevel} onValueChange={onExperienceLevelChange}>
          <SelectTrigger className="w-[160px] bg-secondary border-border">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {experienceLevels.map((level: any) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={employmentType} onValueChange={onEmploymentTypeChange}>
          <SelectTrigger className="w-[140px] bg-secondary border-border">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {employmentTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Location (e.g. Bangalore, Remote)"
            value={location === "all" ? "" : location}
            onChange={(e) => onLocationChange(e.target.value || "all")}
            className="pl-10 w-[220px] bg-secondary border-border focus:border-primary focus:ring-primary/20"
          />
          {location && location !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {location}
              <button onClick={() => onLocationChange("all")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div> */}

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 h-3 w-3" />
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Active filter badges */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {experienceLevel && experienceLevel !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {experienceLevel}
              <button onClick={() => onExperienceLevelChange("all")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {employmentType && employmentType !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {employmentType}
              <button onClick={() => onEmploymentTypeChange("all")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {location && location !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {location}
              <button onClick={() => onLocationChange("all")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
