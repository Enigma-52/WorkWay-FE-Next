"use client";

import { useState, useEffect } from "react";
import { Building2, Globe, MapPin, Briefcase, Users, Bell, BellOff, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import AuthModal from "@/components/common/AuthModal";
import {
  type Company,
  getUniqueLocations,
  getUniqueDomains,
} from "@/data/companyData";

interface CompanyHeaderProps {
  company: Company;
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  const { data: session, status } = useSession();
  const locations = getUniqueLocations(company.jobListings);
  const domains = getUniqueDomains(company.jobListings);

  const [isFollowing, setIsFollowing] = useState(false);
  const [alertId, setAlertId] = useState<number | null>(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [checkDone, setCheckDone] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const stats = [
    { label: "Open Roles", value: company.jobListings.length, icon: Briefcase },
    { label: "Locations", value: locations.length, icon: MapPin },
    { label: "Domains", value: domains.length, icon: Users },
  ];

  // Check follow status once session loads
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.dbId || !(company as any).slug) {
      setCheckDone(true);
      return;
    }
    fetch(`/api/alerts?check=1&alert_type=company&company_slug=${encodeURIComponent((company as any).slug)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.exists) {
          setIsFollowing(true);
          setAlertId(d.alert?.id ?? null);
        }
      })
      .catch(() => {})
      .finally(() => setCheckDone(true));
  }, [session, status, (company as any).slug]);

  async function handleFollow() {
    if (!session) {
      setAuthOpen(true);
      return;
    }
    setFollowLoading(true);
    try {
      if (isFollowing && alertId) {
        await fetch(`/api/alerts/${alertId}`, { method: "DELETE" });
        setIsFollowing(false);
        setAlertId(null);
      } else {
        const res = await fetch("/api/alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            alert_type: "company",
            company_slug: (company as any).slug,
            company_name: company.name,
            company_logo_url: company.logo_url ?? null,
          }),
        });
        const data = await res.json();
        setIsFollowing(true);
        setAlertId(data.alert?.id ?? null);
      }
    } catch {
      // no-op
    } finally {
      setFollowLoading(false);
    }
  }

  return (
    <>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} callbackUrl={`/company/${(company as any).slug}`} />

      <header className="relative overflow-hidden border-b border-border">
        {/* Background glow effect */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

        <div className="relative container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* Company Info */}
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-4 mb-4">
                {company.logo_url ? (
                  <div className="w-20 h-20">
                    <img
                      src={company.logo_url}
                      alt={`${company.name} logo`}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl gradient-card border border-border flex items-center justify-center glow-subtle">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold tracking-tight gradient-text">
                    {company.name}
                  </h1>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-sm font-mono"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {company.website.replace("https://", "")}
                    </a>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-5">
                {company.description}
              </p>

              {/* Follow button */}
              <button
                onClick={handleFollow}
                disabled={followLoading || (status === "loading") || (!checkDone && !!session)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isFollowing
                    ? "bg-primary/10 text-primary border-primary/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                    : "bg-card text-foreground border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                }`}
              >
                {followLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isFollowing ? (
                  <BellOff className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="gradient-card border border-border rounded-xl px-6 py-4 min-w-[120px] border-glow"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
