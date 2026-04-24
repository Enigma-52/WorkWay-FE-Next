"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Award,
  Gift,
  Search,
  X,
  SlidersHorizontal,
  MapPin,
} from "lucide-react";
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
import { JobCard } from "@/components/DomainPage/JobCard";
import { JobPagination } from "@/components/DomainPage/JobPagination";
import type { SalaryInsightsData } from "./page";

function formatSalary(n: number) {
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

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

export default function SalaryInsightsClient({
  data,
}: {
  data: SalaryInsightsData;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParam = (key: string, fallback: string) =>
    searchParams.get(key) ?? fallback;

  const domain = getParam("domain", "all");
  const experienceLevel = getParam("experience_level", "all");
  const employmentType = getParam("employment_type", "all");
  const equity = getParam("equity", "all");
  const bonus = getParam("bonus", "all");
  const location = getParam("location", "");
  const sort = getParam("sort", "recent");

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

  const clearFilters = () => {
    router.push(pathname);
  };

  const { stats, salary_buckets, by_domain, by_experience_level, jobs, meta } =
    data;

  const maxBucket = Math.max(...Object.values(salary_buckets), 1);

  const activeCount = [
    domain !== "all",
    experienceLevel !== "all",
    employmentType !== "all",
    equity !== "all",
    bonus !== "all",
    location,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="container relative mx-auto py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl mb-4">
              Salary <span className="text-primary">Insights</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Compensation data from {stats.total_jobs.toLocaleString()} jobs
              with published salary ranges
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto py-8 md:py-12">
        {/* Stats Cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Average Salary",
              value: formatSalary(stats.avg_salary),
              icon: DollarSign,
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              label: "Median Salary",
              value: formatSalary(stats.median_salary),
              icon: TrendingUp,
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              label: "Offer Equity",
              value: `${stats.equity_count} (${Math.round((stats.equity_count / stats.total_jobs) * 100)}%)`,
              icon: Award,
              color: "text-green-600 dark:text-green-400",
              bg: "bg-green-500/10",
            },
            {
              label: "Offer Bonus",
              value: `${stats.bonus_count} (${Math.round((stats.bonus_count / stats.total_jobs) * 100)}%)`,
              icon: Gift,
              color: "text-amber-600 dark:text-amber-400",
              bg: "bg-amber-500/10",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}
                >
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-foreground font-mono">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Distribution + Breakdowns */}
        <div className="mb-10 grid gap-6 lg:grid-cols-3">
          {/* Salary Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl border border-border bg-card p-6 lg:col-span-1"
          >
            <h2 className="mb-5 text-base font-semibold text-foreground">
              Salary Distribution
            </h2>
            <div className="space-y-2.5">
              {Object.entries(salary_buckets).map(([bucket, count]) => (
                <div key={bucket} className="group flex items-center gap-3">
                  <span className="w-[5.5rem] shrink-0 text-xs font-mono text-muted-foreground">
                    {bucket}
                  </span>
                  <div className="flex-1 h-6 overflow-hidden rounded-md bg-muted">
                    <div
                      className="h-full rounded-md bg-primary/70 group-hover:bg-primary transition-colors duration-200"
                      style={{
                        width: `${Math.max((count / maxBucket) * 100, count > 0 ? 4 : 0)}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-xs font-mono font-medium text-foreground">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* By Domain */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h2 className="mb-4 text-base font-semibold text-foreground">
              By Domain
            </h2>
            <div className="space-y-2">
              {by_domain.slice(0, 10).map((d) => (
                <button
                  key={d.domain}
                  onClick={() =>
                    updateParams({ domain: d.domain, page: "1" })
                  }
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-secondary"
                >
                  <span className="text-sm text-foreground truncate">
                    {d.domain}
                  </span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {d.count}
                    </span>
                    <span className="font-mono text-sm font-semibold text-primary">
                      {formatSalary(d.avg_salary)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* By Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h2 className="mb-4 text-base font-semibold text-foreground">
              By Experience Level
            </h2>
            <div className="space-y-2">
              {by_experience_level.map((d) => (
                <button
                  key={d.level}
                  onClick={() =>
                    updateParams({
                      experience_level: d.level,
                      page: "1",
                    })
                  }
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-secondary"
                >
                  <span className="text-sm text-foreground">{d.level}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {d.count}
                    </span>
                    <span className="font-mono text-sm font-semibold text-primary">
                      {formatSalary(d.avg_salary)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="font-mono tracking-wide">Filters</span>
            </div>

            <Select
              value={domain}
              onValueChange={(v) =>
                updateParams({ domain: v, page: "1" })
              }
            >
              <SelectTrigger className="w-[180px] bg-secondary border-border rounded-lg">
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All domains</SelectItem>
                {by_domain.map((d) => (
                  <SelectItem key={d.domain} value={d.domain}>
                    {d.domain} ({d.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={experienceLevel}
              onValueChange={(v) =>
                updateParams({ experience_level: v, page: "1" })
              }
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
              value={employmentType}
              onValueChange={(v) =>
                updateParams({ employment_type: v, page: "1" })
              }
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

            <Select
              value={equity}
              onValueChange={(v) =>
                updateParams({ equity: v, page: "1" })
              }
            >
              <SelectTrigger className="w-[150px] bg-secondary border-border rounded-lg">
                <SelectValue placeholder="Equity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Equity: Any</SelectItem>
                <SelectItem value="yes">Offers Equity</SelectItem>
                <SelectItem value="no">No Equity</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={bonus}
              onValueChange={(v) =>
                updateParams({ bonus: v, page: "1" })
              }
            >
              <SelectTrigger className="w-[150px] bg-secondary border-border rounded-lg">
                <SelectValue placeholder="Bonus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bonus: Any</SelectItem>
                <SelectItem value="yes">Offers Bonus</SelectItem>
                <SelectItem value="no">No Bonus</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sort}
              onValueChange={(v) =>
                updateParams({ sort: v, page: "1" })
              }
            >
              <SelectTrigger className="w-[160px] bg-secondary border-border rounded-lg">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="salary_desc">Highest Salary</SelectItem>
                <SelectItem value="salary_asc">Lowest Salary</SelectItem>
              </SelectContent>
            </Select>

            {activeCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground font-mono"
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Clear ({activeCount})
              </Button>
            )}
          </div>

          {/* Active filter badges */}
          {activeCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {domain !== "all" && (
                <Badge
                  variant="secondary"
                  className="gap-1 font-mono text-xs cursor-pointer hover:bg-secondary/80"
                  onClick={() => updateParams({ domain: "all", page: "1" })}
                >
                  {domain}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {experienceLevel !== "all" && (
                <Badge
                  variant="secondary"
                  className="gap-1 font-mono text-xs cursor-pointer hover:bg-secondary/80"
                  onClick={() =>
                    updateParams({ experience_level: "all", page: "1" })
                  }
                >
                  {experienceLevel}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {employmentType !== "all" && (
                <Badge
                  variant="secondary"
                  className="gap-1 font-mono text-xs cursor-pointer hover:bg-secondary/80"
                  onClick={() =>
                    updateParams({ employment_type: "all", page: "1" })
                  }
                >
                  {employmentType}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {equity !== "all" && (
                <Badge
                  variant="secondary"
                  className="gap-1 font-mono text-xs cursor-pointer hover:bg-secondary/80 border-green-500/30"
                  onClick={() => updateParams({ equity: "all", page: "1" })}
                >
                  {equity === "yes" ? "Offers Equity" : "No Equity"}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {bonus !== "all" && (
                <Badge
                  variant="secondary"
                  className="gap-1 font-mono text-xs cursor-pointer hover:bg-secondary/80 border-amber-500/30"
                  onClick={() => updateParams({ bonus: "all", page: "1" })}
                >
                  {bonus === "yes" ? "Offers Bonus" : "No Bonus"}
                  <X className="h-3 w-3" />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-mono text-foreground">
              {Math.min(meta.page * meta.limit, meta.total)}
            </span>{" "}
            of{" "}
            <span className="font-mono text-foreground">
              {meta.total.toLocaleString()}
            </span>{" "}
            jobs with salary data
          </p>
        </div>

        {/* Job Cards - reuse existing DomainPage/JobCard */}
        {jobs.length > 0 ? (
          <div className="grid gap-4">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.03, 0.3),
                }}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-border rounded-xl bg-card/40">
            <DollarSign className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="font-display text-xl font-semibold mb-2">
              No jobs match your filters
            </h3>
            <p className="mb-4 max-w-sm text-muted-foreground">
              Try broadening your filters to see more results.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="font-mono text-sm text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {meta.total_pages > 1 && (
          <div className="pt-8">
            <JobPagination
              currentPage={meta.page}
              totalPages={meta.total_pages}
              onPageChange={(p) => updateParams({ page: String(p) })}
            />
          </div>
        )}
      </main>
    </div>
  );
}
