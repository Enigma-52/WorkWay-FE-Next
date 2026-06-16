"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  Bell,
  BellOff,
  X,
  Loader2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  MapPin,
  ExternalLink,
  Clock,
} from "lucide-react";

type Alert = {
  id: number;
  alert_type: string;
  company_slug: string | null;
  company_name: string | null;
  company_logo_url: string | null;
  created_at: string;
};

type CompanyResult = {
  id: number;
  slug: string;
  name: string;
  logo_url: string | null;
  jobs_open_count?: number;
  is_actively_hiring?: boolean;
};

type RecentJob = {
  slug: string;
  title: string;
  location: string;
  employment_type: string;
  url: string;
  created_at?: string;
  updated_at?: string;
};

type CompanyRecentJobs = {
  slug: string;
  name: string;
  logo_url: string | null;
  jobs: RecentJob[];
  totalOpenRoles: number;
};

const FOLLOWING_PER_PAGE = 5;
const RECENT_COMPANIES_PER_PAGE = 3;
const RECENT_JOBS_PER_COMPANY = 3;

function getTimeAgo(date: string): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Yesterday";
  if (diffD < 30) return `${diffD}d ago`;
  const diffM = Math.floor(diffD / 30);
  return `${diffM}mo ago`;
}

function CompanyLogo({
  url,
  name,
  size = 8,
}: {
  url: string | null;
  name: string;
  size?: number;
}) {
  const s = `h-${size} w-${size}`;
  return (
    <div
      className={`${s} shrink-0 flex items-center justify-center rounded-lg bg-secondary`}
    >
      {url ? (
        <img
          src={url}
          alt={name}
          className="max-h-[70%] max-w-[70%] object-contain"
        />
      ) : (
        <Building2 className="w-4 h-4 text-muted-foreground" />
      )}
    </div>
  );
}

function Paginator({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-3 px-1">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Prev
      </button>
      <span className="text-xs text-muted-foreground">
        {page} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function CompaniesPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CompanyResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [following, setFollowing] = useState<Set<string>>(new Set());
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // pagination
  const [followPage, setFollowPage] = useState(1);
  const [recentPage, setRecentPage] = useState(1);

  // recent jobs per company
  const [recentJobs, setRecentJobs] = useState<CompanyRecentJobs[]>([]);
  const [recentLoading, setRecentLoading] = useState(false);
  const recentCacheRef = useRef<Map<string, CompanyRecentJobs>>(new Map());

  // Load existing alerts
  useEffect(() => {
    fetch("/api/alerts")
      .then((r) => r.json())
      .then((d) => {
        const list: Alert[] = d.alerts ?? [];
        setAlerts(list);
        const slugs = new Set(
          list.filter((a) => a.company_slug).map((a) => a.company_slug!)
        );
        setFollowing(slugs);
      })
      .catch(() => {})
      .finally(() => setAlertsLoading(false));
  }, []);

  const companyAlerts = alerts.filter((a) => a.alert_type === "company");
  const followTotalPages = Math.max(
    1,
    Math.ceil(companyAlerts.length / FOLLOWING_PER_PAGE)
  );
  const recentTotalPages = Math.max(
    1,
    Math.ceil(companyAlerts.length / RECENT_COMPANIES_PER_PAGE)
  );

  // clamp pages when alerts change
  useEffect(() => {
    if (followPage > followTotalPages) setFollowPage(followTotalPages);
  }, [followTotalPages, followPage]);
  useEffect(() => {
    if (recentPage > recentTotalPages) setRecentPage(recentTotalPages);
  }, [recentTotalPages, recentPage]);

  // Fetch recent jobs for the current page of companies
  useEffect(() => {
    if (companyAlerts.length === 0) {
      setRecentJobs([]);
      return;
    }

    const start = (recentPage - 1) * RECENT_COMPANIES_PER_PAGE;
    const pageAlerts = companyAlerts.slice(
      start,
      start + RECENT_COMPANIES_PER_PAGE
    );
    const slugs = pageAlerts
      .map((a) => a.company_slug)
      .filter(Boolean) as string[];

    if (slugs.length === 0) {
      setRecentJobs([]);
      return;
    }

    const allCached = slugs.every((s) => recentCacheRef.current.has(s));
    if (allCached) {
      setRecentJobs(slugs.map((s) => recentCacheRef.current.get(s)!));
      return;
    }

    setRecentLoading(true);

    Promise.all(
      slugs.map(async (slug) => {
        if (recentCacheRef.current.has(slug)) {
          return recentCacheRef.current.get(slug)!;
        }
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/company/details?slug=${encodeURIComponent(slug)}`
          );
          if (!res.ok) throw new Error("fetch failed");
          const data = await res.json();
          const jobs: RecentJob[] = (data.recentlyPostedJobs ?? [])
            .slice(0, RECENT_JOBS_PER_COMPANY)
            .map((j: any) => ({
              slug: j.slug,
              title: j.title,
              location: j.location,
              employment_type: j.employment_type,
              url: j.url,
              created_at: j.created_at,
              updated_at: j.updated_at,
            }));
          const entry: CompanyRecentJobs = {
            slug,
            name: data.name ?? slug,
            logo_url: data.logo_url ?? null,
            jobs,
            totalOpenRoles: data.jobListings?.length ?? 0,
          };
          recentCacheRef.current.set(slug, entry);
          return entry;
        } catch {
          const alert = pageAlerts.find((a) => a.company_slug === slug);
          return {
            slug,
            name: alert?.company_name ?? slug,
            logo_url: alert?.company_logo_url ?? null,
            jobs: [],
            totalOpenRoles: 0,
          };
        }
      })
    )
      .then(setRecentJobs)
      .finally(() => setRecentLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentPage, alerts.length, alertsLoading]);

  // Build a lookup of totalOpenRoles from cache
  function getOpenRoles(slug: string | null): number | null {
    if (!slug) return null;
    return recentCacheRef.current.get(slug)?.totalOpenRoles ?? null;
  }

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setSearching(true);
    setHasSearched(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/company/search?q=${encodeURIComponent(q)}`
      );
      const data = await res.json();
      setResults(data.companies ?? data ?? []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  function handleQueryChange(v: string) {
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(v), 300);
  }

  async function handleFollow(company: CompanyResult) {
    const isFollowing = following.has(company.slug);

    if (isFollowing) {
      const alert = alerts.find((a) => a.company_slug === company.slug);
      if (!alert) return;
      setFollowing((prev) => {
        const s = new Set(prev);
        s.delete(company.slug);
        return s;
      });
      setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
      recentCacheRef.current.delete(company.slug);
      await fetch(`/api/alerts/${alert.id}`, { method: "DELETE" }).catch(
        () => {}
      );
    } else {
      setFollowing((prev) => new Set(prev).add(company.slug));
      const tempAlert: Alert = {
        id: Date.now(),
        alert_type: "company",
        company_slug: company.slug,
        company_name: company.name,
        company_logo_url: company.logo_url ?? null,
        created_at: new Date().toISOString(),
      };
      setAlerts((prev) => [tempAlert, ...prev]);
      try {
        const res = await fetch("/api/alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            alert_type: "company",
            company_slug: company.slug,
            company_name: company.name,
            company_logo_url: company.logo_url ?? null,
          }),
        });
        const data = await res.json();
        if (data.alert) {
          setAlerts((prev) =>
            prev.map((a) => (a.id === tempAlert.id ? data.alert : a))
          );
        }
      } catch {
        setFollowing((prev) => {
          const s = new Set(prev);
          s.delete(company.slug);
          return s;
        });
        setAlerts((prev) => prev.filter((a) => a.id !== tempAlert.id));
      }
    }
  }

  async function handleRemoveAlert(alert: Alert) {
    setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    if (alert.company_slug) {
      setFollowing((prev) => {
        const s = new Set(prev);
        s.delete(alert.company_slug!);
        return s;
      });
      recentCacheRef.current.delete(alert.company_slug);
    }
    await fetch(`/api/alerts/${alert.id}`, { method: "DELETE" }).catch(
      () => {}
    );
  }

  const followStart = (followPage - 1) * FOLLOWING_PER_PAGE;
  const pagedAlerts = companyAlerts.slice(
    followStart,
    followStart + FOLLOWING_PER_PAGE
  );

  // Aggregate stats
  const totalJobs = recentJobs.reduce((sum, c) => sum + c.totalOpenRoles, 0);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-0.5">Companies</h1>
        <p className="text-muted-foreground text-sm">
          Follow companies to get alerted when they post new jobs.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-2xl">
        <div className="relative">
          {searching ? (
            <Loader2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin pointer-events-none" />
          ) : (
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search companies…"
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setHasSearched(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        {hasSearched && (
          <div className="absolute z-20 left-0 right-0 mt-2 bg-card border border-border rounded-xl overflow-hidden shadow-lg">
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No companies found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <ul>
                {results.map((company) => {
                  const isFollowing = following.has(company.slug);
                  return (
                    <li
                      key={company.id ?? company.slug}
                      className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <CompanyLogo
                        url={company.logo_url}
                        name={company.name}
                        size={9}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {company.name}
                        </p>
                        {company.jobs_open_count !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            {company.jobs_open_count > 0
                              ? `${company.jobs_open_count} open role${company.jobs_open_count !== 1 ? "s" : ""}`
                              : "No open roles"}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/company/${company.slug}`}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                          target="_blank"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleFollow(company)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            isFollowing
                              ? "bg-primary/10 text-primary border-primary/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                              : "bg-secondary text-muted-foreground border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                          }`}
                        >
                          {isFollowing ? (
                            <>
                              <BellOff className="w-3.5 h-3.5" /> Following
                            </>
                          ) : (
                            <>
                              <Bell className="w-3.5 h-3.5" /> Follow
                            </>
                          )}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Stats bar */}
      {!alertsLoading && companyAlerts.length > 0 && (
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-card border border-border">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{companyAlerts.length}</span>
            <span className="text-xs text-muted-foreground">
              {companyAlerts.length === 1 ? "company" : "companies"}
            </span>
          </div>
          {totalJobs > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-card border border-border">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{totalJobs}</span>
              <span className="text-xs text-muted-foreground">open roles</span>
            </div>
          )}
        </div>
      )}

      {/* Main layout: sidebar + feed */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Left sidebar: Following */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Following</h2>
          </div>

          {alertsLoading ? (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 border-b border-border last:border-0 animate-pulse bg-secondary/20"
                />
              ))}
            </div>
          ) : companyAlerts.length === 0 ? (
            <div className="bg-card border border-border rounded-xl px-5 py-8 text-center">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center mx-auto mb-2.5">
                <Bell className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">No companies yet</p>
              <p className="text-xs text-muted-foreground">
                Search above to follow companies.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                {pagedAlerts.map((alert) => {
                  const openRoles = getOpenRoles(alert.company_slug);
                  return (
                    <div
                      key={alert.id}
                      className="flex items-center gap-2.5 px-3.5 py-3 border-b border-border last:border-0 hover:bg-secondary/20 transition-colors group"
                    >
                      <CompanyLogo
                        url={alert.company_logo_url}
                        name={alert.company_name ?? ""}
                        size={8}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {alert.company_name ?? alert.company_slug}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {openRoles !== null && openRoles > 0 && (
                            <span className="text-[11px] text-primary font-medium">
                              {openRoles} open
                            </span>
                          )}
                          <span className="text-[11px] text-muted-foreground">
                            Since{" "}
                            {new Date(alert.created_at).toLocaleDateString(
                              "en-US",
                              { month: "short", year: "numeric" }
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                        {alert.company_slug && (
                          <Link
                            href={`/company/${alert.company_slug}`}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <button
                          onClick={() => handleRemoveAlert(alert)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                          title="Unfollow"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Paginator
                page={followPage}
                totalPages={followTotalPages}
                onPrev={() => setFollowPage((p) => Math.max(1, p - 1))}
                onNext={() =>
                  setFollowPage((p) => Math.min(followTotalPages, p + 1))
                }
              />
            </>
          )}
        </div>

        {/* Right: Recent Jobs feed */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Recent Jobs from Followed Companies</h2>
          </div>

          {alertsLoading || recentLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  <div className="h-12 bg-secondary/20 animate-pulse" />
                  <div className="divide-y divide-border">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-16 animate-pulse bg-secondary/10" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : companyAlerts.length === 0 ? (
            <div className="bg-card border border-border rounded-xl px-6 py-12 text-center">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">No recent jobs</p>
              <p className="text-xs text-muted-foreground">
                Follow companies to see their latest job postings here.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {recentJobs.map((company) => (
                  <div
                    key={company.slug}
                    className="bg-card border border-border rounded-xl overflow-hidden"
                  >
                    {/* Company header */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/20">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CompanyLogo
                          url={company.logo_url}
                          name={company.name}
                          size={7}
                        />
                        <Link
                          href={`/company/${company.slug}`}
                          className="text-sm font-medium truncate hover:text-primary transition-colors"
                        >
                          {company.name}
                        </Link>
                      </div>
                      {company.totalOpenRoles > 0 && (
                        <Link
                          href={`/company/${company.slug}`}
                          className="shrink-0 flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                        >
                          {company.totalOpenRoles} open role{company.totalOpenRoles !== 1 ? "s" : ""}
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>

                    {/* Jobs list */}
                    {company.jobs.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                        No recent jobs posted
                      </div>
                    ) : (
                      company.jobs.map((job) => {
                        const postedAgo = job.created_at
                          ? getTimeAgo(job.created_at)
                          : job.updated_at
                            ? getTimeAgo(job.updated_at)
                            : null;
                        return (
                          <div
                            key={job.slug}
                            className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/10 transition-colors group"
                          >
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/job/${job.slug}`}
                                className="text-sm font-medium truncate block hover:text-primary transition-colors"
                              >
                                {job.title}
                              </Link>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                {job.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 shrink-0" />
                                    <span className="truncate max-w-[180px]">
                                      {job.location}
                                    </span>
                                  </span>
                                )}
                                {job.employment_type && (
                                  <span className="shrink-0">{job.employment_type}</span>
                                )}
                                {postedAgo && (
                                  <span className="flex items-center gap-1 shrink-0 text-muted-foreground/70">
                                    <Clock className="w-3 h-3" />
                                    {postedAgo}
                                  </span>
                                )}
                              </div>
                            </div>
                            <a
                              href={job.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 p-1.5 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-secondary transition-all"
                              title="Apply"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        );
                      })
                    )}
                  </div>
                ))}
              </div>
              <Paginator
                page={recentPage}
                totalPages={recentTotalPages}
                onPrev={() => setRecentPage((p) => Math.max(1, p - 1))}
                onNext={() =>
                  setRecentPage((p) => Math.min(recentTotalPages, p + 1))
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
