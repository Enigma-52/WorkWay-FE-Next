"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search, X, SlidersHorizontal, Users, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TalentCard } from "./TalentCard";
import { JobPagination } from "@/components/DomainPage/JobPagination";
import { track } from "@/lib/analytics";
import type { TalentSearchResponse } from "@/types/talent";
import {
  CATEGORIES,
  EXPERIENCE_LEVELS,
  AVAILABILITY_STATUSES,
  COMMON_SKILLS,
  COMMON_LANGUAGES,
} from "@/app/dashboard/seeker/talent-profile/constants";

type Props = {
  data: TalentSearchResponse;
};

function getParam(searchParams: URLSearchParams, key: string, fallback: string): string {
  return searchParams.get(key) ?? fallback;
}

export default function TalentsPageClient({ data }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = getParam(searchParams, "category", "all");
  const experienceLevel = getParam(searchParams, "experience_level", "all");
  const availabilityStatus = getParam(searchParams, "availability_status", "all");
  const country = getParam(searchParams, "country", "");
  const skills = getParam(searchParams, "skills", "all");
  const languages = getParam(searchParams, "languages", "all");
  const sort = getParam(searchParams, "sort", "newest");

  const [draftCountry, setDraftCountry] = useState(country);

  useEffect(() => setDraftCountry(country), [country]);

  const updateParams = useCallback(
    (next: Record<string, string | null>) => {
      const sp = new URLSearchParams(searchParams.toString());
      Object.entries(next).forEach(([k, v]) => {
        if (v === null || v === "" || v === "all") sp.delete(k);
        else sp.set(k, v);
      });
      const query = sp.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams]
  );

  const handleSearch = () => {
    updateParams({ country: draftCountry || null, page: "1" });
    track("Talents Filters Applied", { country: draftCountry || null });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const setFilter = (key: string) => (value: string) => {
    updateParams({ [key]: value, page: "1" });
    track("Talents Filters Applied", { [key]: value });
  };

  const clearFilters = () => {
    setDraftCountry("");
    updateParams({
      category: null,
      experience_level: null,
      availability_status: null,
      country: null,
      skills: null,
      languages: null,
      page: "1",
    });
  };

  const activeFiltersCount = [
    category !== "all",
    experienceLevel !== "all",
    availabilityStatus !== "all",
    country,
    skills !== "all",
    languages !== "all",
  ].filter(Boolean).length;

  const { profiles, total, page, totalPages } = data;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

        <div className="container relative mx-auto py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-4">
              Hire top <span className="text-primary">talent</span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Browse engineer, design, and product profiles ready for their next role.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-mono text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {total.toLocaleString()}
                  </span>{" "}
                  profiles
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-mono text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Updated</span> daily
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="container mx-auto py-8 md:py-12">
        <div className="space-y-6">
          {/* Filter bar */}
          <div className="space-y-5 md:space-y-4">
            <div className="flex flex-wrap items-center gap-y-4 gap-x-3 md:gap-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground w-full md:w-auto">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="font-mono tracking-wide">Filters</span>
              </div>

              <Select value={category} onValueChange={setFilter("category")}>
                <SelectTrigger className="w-full md:w-[190px] bg-secondary border-border rounded-lg" aria-label="Filter by job title">
                  <SelectValue placeholder="Job titles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={skills} onValueChange={setFilter("skills")}>
                <SelectTrigger className="w-full md:w-[160px] bg-secondary border-border rounded-lg" aria-label="Filter by skill">
                  <SelectValue placeholder="Skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All skills</SelectItem>
                  {COMMON_SKILLS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={languages} onValueChange={setFilter("languages")}>
                <SelectTrigger className="w-full md:w-[160px] bg-secondary border-border rounded-lg" aria-label="Filter by language">
                  <SelectValue placeholder="Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All languages</SelectItem>
                  {COMMON_LANGUAGES.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={experienceLevel} onValueChange={setFilter("experience_level")}>
                <SelectTrigger className="w-full md:w-[150px] bg-secondary border-border rounded-lg" aria-label="Filter by experience level">
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

              <Select value={availabilityStatus} onValueChange={setFilter("availability_status")}>
                <SelectTrigger className="w-full md:w-[170px] bg-secondary border-border rounded-lg" aria-label="Filter by availability">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any availability</SelectItem>
                  {AVAILABILITY_STATUSES.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative w-full md:flex-1 md:w-auto md:min-w-[140px] md:max-w-[200px]">
                <Input
                  placeholder="Location"
                  value={draftCountry}
                  onChange={(e) => setDraftCountry(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-secondary border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg py-2"
                />
              </div>

              <Button size="sm" onClick={handleSearch} className="font-mono w-full md:w-auto">
                <Search className="mr-1.5 h-3.5 w-3.5" />
                Search
              </Button>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground font-mono w-full md:w-auto"
                >
                  <X className="mr-1 h-3.5 w-3.5" />
                  Clear ({activeFiltersCount})
                </Button>
              )}

              <Select value={sort} onValueChange={setFilter("sort")}>
                <SelectTrigger className="w-full md:ml-auto md:w-[160px] bg-secondary border-border rounded-lg" aria-label="Sort by">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="name_asc">Name A-Z</SelectItem>
                  <SelectItem value="name_desc">Name Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Showing <span className="font-mono text-foreground">{profiles.length}</span> of{" "}
            <span className="font-mono text-foreground">{total.toLocaleString()}</span> profiles
          </p>

          {profiles.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile) => (
                <TalentCard key={profile.id} profile={profile} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-border rounded-xl bg-card/40">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                No talent profiles match your filters
              </h3>
              <p className="mb-4 max-w-sm text-muted-foreground">
                Try broadening your search or clearing some filters to see more results.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="font-mono text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
              >
                Clear all filters
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pt-6">
              <JobPagination
                currentPage={page}
                totalPages={totalPages}
                buildHref={(p) => {
                  const sp = new URLSearchParams(searchParams.toString());
                  if (p <= 1) sp.delete("page");
                  else sp.set("page", String(p));
                  const qs = sp.toString();
                  return qs ? `${pathname}?${qs}` : pathname;
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
