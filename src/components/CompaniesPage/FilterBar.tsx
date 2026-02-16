"use client";

import { ChevronDown } from "lucide-react";

interface FilterBarProps {
  hiringFilter: string;
  onHiringFilterChange: (value: string) => void;
}

export default function FilterBar({
  hiringFilter,
  onHiringFilterChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <select
          value={hiringFilter}
          onChange={(e) => onHiringFilterChange(e.target.value)}
          className="cursor-pointer appearance-none rounded-lg border border-border bg-secondary px-4 py-2 pr-10 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          <option value="all">All Companies</option>
          <option value="hiring">Actively Hiring</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}

