"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Building2, Search, Bell, BellOff, X, Loader2, ArrowRight } from "lucide-react";

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

function CompanyLogo({ url, name, size = 8 }: { url: string | null; name: string; size?: number }) {
  const s = `h-${size} w-${size}`;
  return (
    <div className={`${s} shrink-0 flex items-center justify-center rounded-lg bg-secondary`}>
      {url ? (
        <img src={url} alt={name} className="max-h-[70%] max-w-[70%] object-contain" />
      ) : (
        <Building2 className="w-4 h-4 text-muted-foreground" />
      )}
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

  // Load existing alerts
  useEffect(() => {
    fetch("/api/alerts")
      .then((r) => r.json())
      .then((d) => {
        const list: Alert[] = d.alerts ?? [];
        setAlerts(list);
        const slugs = new Set(list.filter((a) => a.company_slug).map((a) => a.company_slug!));
        setFollowing(slugs);
      })
      .catch(() => {})
      .finally(() => setAlertsLoading(false));
  }, []);

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
      // find alert id
      const alert = alerts.find((a) => a.company_slug === company.slug);
      if (!alert) return;
      setFollowing((prev) => { const s = new Set(prev); s.delete(company.slug); return s; });
      setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
      await fetch(`/api/alerts/${alert.id}`, { method: "DELETE" }).catch(() => {});
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
          setAlerts((prev) => prev.map((a) => a.id === tempAlert.id ? data.alert : a));
        }
      } catch {
        // revert on failure
        setFollowing((prev) => { const s = new Set(prev); s.delete(company.slug); return s; });
        setAlerts((prev) => prev.filter((a) => a.id !== tempAlert.id));
      }
    }
  }

  async function handleRemoveAlert(alert: Alert) {
    setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    if (alert.company_slug) {
      setFollowing((prev) => { const s = new Set(prev); s.delete(alert.company_slug!); return s; });
    }
    await fetch(`/api/alerts/${alert.id}`, { method: "DELETE" }).catch(() => {});
  }

  const companyAlerts = alerts.filter((a) => a.alert_type === "company");

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-0.5">Companies</h1>
        <p className="text-muted-foreground text-sm">Follow companies to get alerted when they post new jobs.</p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
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
              onClick={() => { setQuery(""); setResults([]); setHasSearched(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        {hasSearched && (
          <div className="mt-2 bg-card border border-border rounded-xl overflow-hidden shadow-lg">
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No companies found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <ul>
                {results.map((company, i) => {
                  const isFollowing = following.has(company.slug);
                  return (
                    <li
                      key={company.id ?? company.slug}
                      className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <CompanyLogo url={company.logo_url} name={company.name} size={9} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{company.name}</p>
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
                            <><BellOff className="w-3.5 h-3.5" /> Following</>
                          ) : (
                            <><Bell className="w-3.5 h-3.5" /> Follow</>
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

      {/* Followed companies */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">
            Following
            {companyAlerts.length > 0 && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">{companyAlerts.length} {companyAlerts.length === 1 ? "company" : "companies"}</span>
            )}
          </h2>
        </div>

        {alertsLoading ? (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 border-b border-border last:border-0 animate-pulse bg-secondary/20" />
            ))}
          </div>
        ) : companyAlerts.length === 0 ? (
          <div className="bg-card border border-border rounded-xl px-6 py-10 text-center">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
              <Bell className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium mb-1">No companies followed yet</p>
            <p className="text-xs text-muted-foreground">Search for companies above and click Follow to get notified.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {companyAlerts.map((alert, i) => (
              <div
                key={alert.id}
                className="flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-0 hover:bg-secondary/20 transition-colors group"
              >
                <CompanyLogo url={alert.company_logo_url} name={alert.company_name ?? ""} size={9} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{alert.company_name ?? alert.company_slug}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Following since {new Date(alert.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                  {alert.company_slug && (
                    <Link
                      href={`/company/${alert.company_slug}`}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      target="_blank"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  <button
                    onClick={() => handleRemoveAlert(alert)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                    Unfollow
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
