"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Bell, Building2, MapPin, ArrowRight, Crown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isPro } from "@/lib/plans";
import { track } from "@/lib/analytics";

type AlertedJob = {
  slug: string;
  title: string;
  location: string | null;
  employment_type: string | null;
  company_name: string;
  company_slug: string;
  company_logo_url: string | null;
  sent_at: string;
};

function getTimeAgo(date: string): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD}d ago`;
  return new Date(date).toLocaleDateString();
}

function CompanyLogo({ url, name }: { url: string | null; name: string }) {
  return (
    <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg bg-secondary">
      {url ? (
        <img src={url} alt={name} className="max-h-[70%] max-w-[70%] object-contain" />
      ) : (
        <Building2 className="w-4 h-4 text-muted-foreground" />
      )}
    </div>
  );
}

function UpgradeTeaser() {
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/[0.03] p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <Bell className="h-6 w-6 text-primary" />
      </div>
      <h2 className="mb-2 flex items-center justify-center gap-2 text-lg font-semibold">
        Instant alerts are a Pro feature
        <Crown className="h-4 w-4 text-primary" />
      </h2>
      <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
        Follow a company and Pro emails you the moment they post a new role — no more
        refreshing career pages. Once you upgrade, every match shows up here too, with a
        direct link to apply.
      </p>
      <ul className="mx-auto mb-6 max-w-sm space-y-2 text-left text-sm">
        <li className="flex items-start gap-2.5">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          Instant email when a followed company posts
        </li>
        <li className="flex items-start gap-2.5">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          This feed of every alert you've been sent, in one place
        </li>
        <li className="flex items-start gap-2.5">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          Priority support &amp; early access to new features
        </li>
      </ul>
      <Button
        asChild
        onClick={() => track("Pricing Plan Clicked", { plan_key: "pro", signed_in: true, source: "alerts_tab_teaser" })}
      >
        <Link href="/pricing">
          See Pro pricing
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  );
}

export default function AlertsPage() {
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState<AlertedJob[] | null>(null);
  const [pro, setPro] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/alerts/recent")
      .then((r) => r.json())
      .then((d) => {
        setPro(!!d.pro);
        setJobs(d.jobs ?? null);
      })
      .catch(() => setPro(false))
      .finally(() => setLoading(false));
  }, [status]);

  const sessionIsPro = isPro(session?.user ?? null);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-0.5 flex items-center gap-2">
          Alerts
          {sessionIsPro && <Crown className="h-4 w-4 text-primary" />}
        </h1>
        <p className="text-muted-foreground text-sm">
          Today's instant alerts from companies you follow.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl border border-border bg-secondary/20 animate-pulse" />
          ))}
        </div>
      ) : !pro ? (
        <UpgradeTeaser />
      ) : !jobs || jobs.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-5 py-16 text-center">
          <Bell className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
          <p className="mb-2 text-sm text-muted-foreground">
            No new alerts today. Older postings from companies you follow are on the Companies page.
          </p>
          <Link href="/dashboard/seeker/companies" className="text-sm text-primary hover:underline">
            View followed companies →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <a
              key={`${job.company_slug}-${job.slug}`}
              href={`/job/${job.slug}`}
              onClick={() => track("Alert Job Clicked", { job_slug: job.slug, company_slug: job.company_slug })}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-secondary/20"
            >
              <CompanyLogo url={job.company_logo_url} name={job.company_name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{job.title}</p>
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                  {job.company_name}
                  {job.location && (
                    <>
                      <span aria-hidden>&middot;</span>
                      <MapPin className="h-3 w-3 shrink-0" />
                      {job.location}
                    </>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs text-muted-foreground">{getTimeAgo(job.sent_at)}</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
