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
import { useState, useEffect } from "react";

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

export type DomainAppliedFilters = {
  searchQuery: string;
  experienceLevel: string;
  employmentType: string;
  location: string;
};

interface JobFiltersProps {
  // committed values
  searchQuery: string;
  experienceLevel: string;
  employmentType: string;
  location: string;
  onApply: (filters: DomainAppliedFilters) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export function JobFilters({
  searchQuery,
  experienceLevel,
  employmentType,
  location,
  onApply,
  onClearFilters,
  activeFiltersCount,
}: JobFiltersProps) {
  const [draftSearch, setDraftSearch] = useState(searchQuery);
  const [draftExperience, setDraftExperience] = useState(experienceLevel || "all");
  const [draftEmployment, setDraftEmployment] = useState(employmentType || "all");
  const [draftLocation, setDraftLocation] = useState(location || "all");

  useEffect(() => { setDraftSearch(searchQuery); }, [searchQuery]);
  useEffect(() => { setDraftExperience(experienceLevel || "all"); }, [experienceLevel]);
  useEffect(() => { setDraftEmployment(employmentType || "all"); }, [employmentType]);
  useEffect(() => { setDraftLocation(location || "all"); }, [location]);

  const handleApply = () => {
    onApply({
      searchQuery: draftSearch,
      experienceLevel: draftExperience,
      employmentType: draftEmployment,
      location: draftLocation,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleApply();
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search jobs, companies..."
          value={draftSearch}
          onChange={(e) => setDraftSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 bg-secondary border-border focus:border-primary focus:ring-primary/20"
        />
        {draftSearch && (
          <button
            onClick={() => setDraftSearch("")}
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

        <Select value={draftExperience} onValueChange={setDraftExperience}>
          <SelectTrigger className="w-[160px] bg-secondary border-border">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {experienceLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={draftEmployment} onValueChange={setDraftEmployment}>
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

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Location (e.g. Remote)"
            value={draftLocation === "all" ? "" : draftLocation}
            onChange={(e) => setDraftLocation(e.target.value || "all")}
            onKeyDown={handleKeyDown}
            className="pl-10 w-[200px] bg-secondary border-border focus:border-primary focus:ring-primary/20"
          />
        </div>

        <Button size="sm" onClick={handleApply} className="font-mono">
          <Search className="mr-1.5 h-3.5 w-3.5" />
          Search
        </Button>

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
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              {searchQuery}
              <button onClick={() => onApply({ searchQuery: "", experienceLevel, employmentType, location })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {experienceLevel && experienceLevel !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {experienceLevel}
              <button onClick={() => onApply({ searchQuery, experienceLevel: "all", employmentType, location })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {employmentType && employmentType !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {employmentType}
              <button onClick={() => onApply({ searchQuery, experienceLevel, employmentType: "all", location })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {location && location !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {location}
              <button onClick={() => onApply({ searchQuery, experienceLevel, employmentType, location: "all" })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
