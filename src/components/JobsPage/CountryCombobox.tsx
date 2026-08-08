"use client";

import { useMemo, useRef, useState } from "react";
import { Globe, X } from "lucide-react";
import countries from "world-countries";

type CountryOption = { cca3: string; name: string };

const COUNTRY_OPTIONS: CountryOption[] = countries
  .map((c) => ({ cca3: c.cca3, name: c.name.common }))
  .sort((a, b) => a.name.localeCompare(b.name));

const BY_CODE = new Map(COUNTRY_OPTIONS.map((c) => [c.cca3, c.name]));

export type CountryComboboxProps = {
  value: string; // cca3 code, or "" for none
  onChange: (cca3: string | null) => void;
};

export function CountryCombobox({ value, onChange }: CountryComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedName = value ? (BY_CODE.get(value) ?? "") : "";

  const results = useMemo(() => {
    if (!query.trim()) return COUNTRY_OPTIONS.slice(0, 8);
    const q = query.trim().toLowerCase();
    return COUNTRY_OPTIONS.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  function handleSelect(option: CountryOption) {
    onChange(option.cca3);
    setQuery("");
    setOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(null);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative min-w-[160px] max-w-[220px] flex-1">
      <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={open ? query : selectedName}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Country"
        className="w-full rounded-lg border border-border bg-secondary py-2 pl-10 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {value && !open && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear country"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      {open && results.length > 0 && (
        <div className="absolute z-30 left-0 right-0 mt-1 max-h-64 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
          {results.map((c) => (
            <button
              key={c.cca3}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(c)}
              className={`block w-full truncate px-3 py-2 text-left text-sm transition-colors hover:bg-secondary ${
                c.cca3 === value ? "text-primary" : "text-foreground"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
