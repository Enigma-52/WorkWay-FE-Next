"use client";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface JobFiltersProps {
  // committed values
  searchQuery: string;
  selectedLocation: string;
  selectedExperience: string;
  onApply: (filters: { searchQuery: string; selectedLocation: string; selectedExperience: string }) => void;
  locations: string[];
  experienceLevels: string[];
  onReset: () => void;
}

export function JobFilters({
  searchQuery,
  selectedLocation,
  selectedExperience,
  onApply,
  locations,
  experienceLevels,
  onReset,
}: JobFiltersProps) {
  const [draftSearch, setDraftSearch] = useState(searchQuery);
  const [draftLocation, setDraftLocation] = useState(selectedLocation || "all");
  const [draftExperience, setDraftExperience] = useState(selectedExperience || "all");

  useEffect(() => { setDraftSearch(searchQuery); }, [searchQuery]);
  useEffect(() => { setDraftLocation(selectedLocation || "all"); }, [selectedLocation]);
  useEffect(() => { setDraftExperience(selectedExperience || "all"); }, [selectedExperience]);

  const handleApply = () => {
    onApply({ searchQuery: draftSearch, selectedLocation: draftLocation, selectedExperience: draftExperience });
  };

  const hasFilters = searchQuery || selectedLocation !== "all" || selectedExperience !== "all";

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search roles..."
          value={draftSearch}
          onChange={(e) => setDraftSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          className="pl-10 bg-secondary border-border focus:border-primary focus:ring-primary/20"
        />
      </div>

      {/* Location Filter */}
      <Select value={draftLocation} onValueChange={setDraftLocation}>
        <SelectTrigger className="w-[180px] bg-secondary border-border">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value="all">All Locations</SelectItem>
          {locations.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {loc}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Experience Filter */}
      <Select value={draftExperience} onValueChange={setDraftExperience}>
        <SelectTrigger className="w-[160px] bg-secondary border-border">
          <SelectValue placeholder="Experience" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value="all">All Levels</SelectItem>
          {experienceLevels.map((level) => (
            <SelectItem key={level} value={level}>
              {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button size="sm" onClick={handleApply} className="font-mono">
        <Search className="mr-1.5 w-3.5 h-3.5" />
        Search
      </Button>

      {/* Reset */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
