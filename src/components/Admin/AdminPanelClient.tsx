"use client";

import { useEffect, useState } from "react";
import { Mail, MessageSquareHeart, BarChart3, ShieldCheck, Loader2, Crown, Bell, Clock, Play, Eye, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type FeatureFlag = {
  flag_key: string;
  enabled: boolean;
  description: string | null;
  updated_at: string;
};

type Plan = {
  key: string;
  name: string;
  description: string | null;
};

type Subscription = {
  id: number;
  plan_key: string;
  status: string;
  source: string;
  started_at: string;
  expires_at: string | null;
};

type UserResult = {
  id: string;
  email: string;
  display_name: string | null;
  roles: string[];
  plan_key: string;
};

type CronJobStatus = {
  tag: string;
  schedule: string;
  enabled: boolean;
  running: false | { runId: number; startedAt: string; runningFor: string };
  nextRunAt: string | null;
  nextRunInMinutes: number | null;
};

type AnalyticsTotals = { views: number; users: number };
type AnalyticsOverview = {
  configured: boolean;
  error?: string;
  last7Days: AnalyticsTotals | null;
  last30Days: AnalyticsTotals | null;
  mixpanelLast30Days: AnalyticsTotals | null;
};

type CronRun = {
  id: number;
  tag: string;
  status: string;
  dry_run: boolean;
  started_at: string;
  finished_at: string | null;
  duration_ms: number | null;
  result: Record<string, unknown> | null;
  error: string | null;
};

const DURATION_OPTIONS = [
  { value: "unlimited", label: "Unlimited" },
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "365", label: "365 days" },
];

type EmailType = "welcome" | "feedback_7day" | "weekly_summary" | "company_alert";

const EMAIL_TESTS: { type: EmailType; label: string; description: string; icon: React.ElementType }[] = [
  {
    type: "welcome",
    label: "Welcome email",
    description: "Sent automatically the moment a new user signs up.",
    icon: Mail,
  },
  {
    type: "feedback_7day",
    label: "7-day feedback email",
    description: "Sent to users 7 days after signup, once, asking for feedback.",
    icon: MessageSquareHeart,
  },
  {
    type: "weekly_summary",
    label: "Weekly summary email",
    description: "Saved jobs, applications, and trending domains from the last 7 days.",
    icon: BarChart3,
  },
  {
    type: "company_alert",
    label: "Company alert email",
    description: "Sample digest for the instant-alert Pro feature — uses synthetic company/job data, not real follows.",
    icon: Bell,
  },
];

export default function AdminPanelClient() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [flagsLoading, setFlagsLoading] = useState(true);
  const [sendingType, setSendingType] = useState<EmailType | null>(null);
  const [togglingKey, setTogglingKey] = useState<string | null>(null);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [granting, setGranting] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
  const [lookingUp, setLookingUp] = useState(false);

  const [userQuery, setUserQuery] = useState("");
  const [userResults, setUserResults] = useState<UserResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [grantValue, setGrantValue] = useState(""); // "role:admin" or "plan:pro" etc
  const [durationDays, setDurationDays] = useState("unlimited");

  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const [cronJobs, setCronJobs] = useState<CronJobStatus[]>([]);
  const [cronJobsLoading, setCronJobsLoading] = useState(true);
  const [cronRuns, setCronRuns] = useState<CronRun[]>([]);
  const [cronRunsLoading, setCronRunsLoading] = useState(true);
  const [cronRunsFilter, setCronRunsFilter] = useState<string>("");
  const [togglingCronTag, setTogglingCronTag] = useState<string | null>(null);
  const [runningCronTag, setRunningCronTag] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/feature-flags`)
      .then((r) => r.json())
      .then((d) => setFlags(d.flags ?? []))
      .catch(() => toast.error("Failed to load feature flags"))
      .finally(() => setFlagsLoading(false));

    fetch(`/api/admin/plans`)
      .then((r) => r.json())
      .then((d) => setPlans(d.plans ?? []))
      .catch(() => toast.error("Failed to load plans"));

    fetch(`/api/admin/analytics`)
      .then((r) => r.json())
      .then((d) => setAnalytics(d))
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setAnalyticsLoading(false));

    loadCronStatus();
    loadCronRuns();
  }, []);

  function loadCronStatus() {
    setCronJobsLoading(true);
    fetch(`/api/admin/cron/status`)
      .then((r) => r.json())
      .then((d) => setCronJobs(Array.isArray(d) ? d : []))
      .catch(() => toast.error("Failed to load cron status"))
      .finally(() => setCronJobsLoading(false));
  }

  function loadCronRuns(tag?: string) {
    setCronRunsLoading(true);
    const qs = tag ? `?tag=${encodeURIComponent(tag)}` : "";
    fetch(`/api/admin/cron/runs${qs}`)
      .then((r) => r.json())
      .then((d) => setCronRuns(Array.isArray(d) ? d : []))
      .catch(() => toast.error("Failed to load cron run history"))
      .finally(() => setCronRunsLoading(false));
  }

  useEffect(() => {
    if (userQuery.trim().length < 2) {
      setUserResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      setSearching(true);
      fetch(`/api/admin/users/search?q=${encodeURIComponent(userQuery.trim())}`)
        .then((r) => r.json())
        .then((d) => setUserResults(d.users ?? []))
        .catch(() => setUserResults([]))
        .finally(() => setSearching(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [userQuery]);

  function selectUser(user: UserResult) {
    setSelectedUser(user);
    setUserQuery(user.email);
    setShowResults(false);
    lookupSubscriptions(user.email);
  }

  async function grant() {
    if (!selectedUser || !grantValue) return;
    setGranting(true);
    try {
      const isRole = grantValue.startsWith("role:");
      const endpoint = isRole ? "/api/admin/grant-role" : "/api/admin/grant-plan";
      const body = isRole
        ? { target_email: selectedUser.email, role: grantValue.replace("role:", "") }
        : {
            target_email: selectedUser.email,
            plan_key: grantValue.replace("plan:", ""),
            duration_days: durationDays === "unlimited" ? undefined : Number(durationDays),
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to grant");

      toast.success(`Granted ${grantValue.split(":")[1]} to ${selectedUser.email}`, {
        description: isRole ? undefined : `Effective plan: ${data.effectivePlan}`,
      });

      if (isRole && data.user) {
        setSelectedUser((prev) => (prev ? { ...prev, roles: data.user.roles } : prev));
      } else if (!isRole) {
        setSelectedUser((prev) => (prev ? { ...prev, plan_key: data.effectivePlan } : prev));
        lookupSubscriptions(selectedUser.email);
      }
    } catch (err) {
      toast.error("Failed to grant", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setGranting(false);
    }
  }

  async function lookupSubscriptions(email: string) {
    if (!email.trim()) return;
    setLookingUp(true);
    try {
      const res = await fetch(`/api/admin/subscriptions?target_email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setSubscriptions(data.subscriptions ?? []);
    } catch {
      setSubscriptions(null);
    } finally {
      setLookingUp(false);
    }
  }

  async function sendTestEmail(type: EmailType) {
    setSendingType(type);
    try {
      const res = await fetch(`/api/admin/test-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_type: type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      toast.success(`${type} email sent`, { description: `Check ${data.sent_to}` });
    } catch (err) {
      toast.error("Failed to send test email", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSendingType(null);
    }
  }

  async function toggleFlag(flag: FeatureFlag) {
    setTogglingKey(flag.flag_key);
    try {
      const res = await fetch(`/api/admin/feature-flags/${flag.flag_key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !flag.enabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update flag");
      setFlags((prev) => prev.map((f) => (f.flag_key === flag.flag_key ? data.flag : f)));
      toast.success(`${flag.flag_key} ${data.flag.enabled ? "enabled" : "disabled"}`);
    } catch (err) {
      toast.error("Failed to update flag", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setTogglingKey(null);
    }
  }

  async function toggleCron(job: CronJobStatus) {
    setTogglingCronTag(job.tag);
    try {
      const res = await fetch(`/api/admin/cron/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: job.tag, enabled: !job.enabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle job");
      toast.success(`${job.tag} ${data.enabled ? "enabled" : "disabled"}`);
      loadCronStatus();
    } catch (err) {
      toast.error("Failed to toggle job", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setTogglingCronTag(null);
    }
  }

  async function runCronNow(tag: string) {
    setRunningCronTag(tag);
    try {
      const res = await fetch(`/api/admin/cron/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to run job");
      toast.success(`${tag} ran`, {
        description: data.status === "completed" ? `Finished in ${data.durationMs}ms` : data.status,
      });
      loadCronStatus();
      loadCronRuns(cronRunsFilter || undefined);
    } catch (err) {
      toast.error("Failed to run job", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setRunningCronTag(null);
    }
  }

  function formatResult(run: CronRun): string {
    if (run.status === "failed") return run.error || "failed";
    if (!run.result || Object.keys(run.result).length === 0) return "—";
    return Object.entries(run.result)
      .map(([k, v]) => `${k}: ${v}`)
      .join(" · ");
  }

  return (
    <div className="max-w-7xl space-y-6">
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-0.5">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold">Admin</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Test lifecycle emails and control feature flags. Only visible to admin accounts.
        </p>
      </div>

      {/* Live site analytics: GA4 (raw) vs Mixpanel (bot-filtered) */}
      <section className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold mb-1">Site analytics</h2>
        <p className="text-xs text-muted-foreground mb-4">
          GA4 numbers are raw (include bot traffic). Mixpanel filters events tagged{" "}
          <code className="text-[11px]">is_bot</code> at collection time — treat it as the more
          trustworthy number until GA4&apos;s own bot gate (shipped 2026-08-09) ages the old data
          out.
        </p>
        {analyticsLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        ) : !analytics?.configured ? (
          <p className="text-xs text-muted-foreground">
            GA4 not configured — set <code className="text-[11px]">GA4_SERVICE_ACCOUNT_KEY</code> and{" "}
            <code className="text-[11px]">GA4_PROPERTY_ID</code> on the backend.
          </p>
        ) : analytics.error ? (
          <p className="text-xs text-destructive">{analytics.error}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "GA4 Views (7d)", value: analytics.last7Days?.views, icon: Eye },
              { label: "GA4 Users (7d)", value: analytics.last7Days?.users, icon: Users },
              { label: "GA4 Views (30d)", value: analytics.last30Days?.views, icon: Eye },
              { label: "GA4 Users (30d)", value: analytics.last30Days?.users, icon: Users },
              { label: "Mixpanel Views (30d)", value: analytics.mixpanelLast30Days?.views, icon: Eye },
              { label: "Mixpanel Users (30d)", value: analytics.mixpanelLast30Days?.users, icon: Users },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </div>
                <div className="text-xl font-bold tabular-nums">{(value ?? 0).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
      {/* Lifecycle email tests */}
      <section className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold mb-1">Test lifecycle emails</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Sends the real templated email to your own logged-in address, bypassing the feature flag below.
        </p>
        <div className="space-y-3">
          {EMAIL_TESTS.map(({ type, label, description, icon: Icon }) => (
            <div
              key={type}
              className="flex items-center gap-3 rounded-lg border border-border px-4 py-3"
            >
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={sendingType === type}
                onClick={() => sendTestEmail(type)}
              >
                {sendingType === type ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Send to me"
                )}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Feature flags */}
      <section className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold mb-1">Feature flags</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Master switches for scheduled sends to real users. Test sends above always work regardless of these.
        </p>
        {flagsLoading ? (
          <p className="text-xs text-muted-foreground">Loading...</p>
        ) : flags.length === 0 ? (
          <p className="text-xs text-muted-foreground">No feature flags found.</p>
        ) : (
          <div className="space-y-3">
            {flags.map((flag) => (
              <div
                key={flag.flag_key}
                className="flex items-center gap-3 rounded-lg border border-border px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium font-mono">{flag.flag_key}</p>
                  {flag.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{flag.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => toggleFlag(flag)}
                  disabled={togglingKey === flag.flag_key}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
                    flag.enabled ? "bg-primary" : "bg-secondary border border-border"
                  }`}
                  aria-pressed={flag.enabled}
                  aria-label={`Toggle ${flag.flag_key}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform ${
                      flag.enabled ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Grant access */}
      <section className="bg-card border border-border rounded-xl p-5 xl:col-span-2">
        <div className="flex items-center gap-2 mb-1">
          <Crown className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Grant access</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Search a user, then grant the admin role or a plan (with an optional expiry). Manual grants work before payments are wired up.
        </p>

        <div className="relative mb-3 max-w-sm">
          <Input
            placeholder="Search by email or name..."
            value={userQuery}
            onChange={(e) => {
              setUserQuery(e.target.value);
              setShowResults(true);
              if (selectedUser && e.target.value !== selectedUser.email) setSelectedUser(null);
            }}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 150)}
          />
          {showResults && (searching || userResults.length > 0) && (
            <div className="absolute z-20 left-0 right-0 mt-1 max-h-64 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
              {searching ? (
                <p className="px-3 py-2 text-xs text-muted-foreground">Searching...</p>
              ) : (
                userResults.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectUser(u)}
                    className="block w-full truncate px-3 py-2 text-left text-sm hover:bg-secondary transition-colors"
                  >
                    <span className="font-medium">{u.display_name || u.email}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{u.email}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {selectedUser && (
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Current:</span>
            <span className="rounded-full bg-secondary px-2 py-0.5 font-mono">{selectedUser.plan_key}</span>
            {selectedUser.roles.map((r) => (
              <span key={r} className="rounded-full bg-secondary px-2 py-0.5 font-mono">
                {r}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Select value={grantValue} onValueChange={setGrantValue}>
            <SelectTrigger className="w-[180px]" aria-label="What to grant">
              <SelectValue placeholder="Grant..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="role:admin">Role: Admin</SelectItem>
              {plans.map((p) => (
                <SelectItem key={p.key} value={`plan:${p.key}`}>
                  Plan: {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {grantValue.startsWith("plan:") && (
            <Select value={durationDays} onValueChange={setDurationDays}>
              <SelectTrigger className="w-[140px]" aria-label="Duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button size="sm" disabled={granting || !selectedUser || !grantValue} onClick={grant}>
            {granting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Grant"}
          </Button>
        </div>

        {lookingUp && <p className="text-xs text-muted-foreground">Loading subscription history...</p>}
        {subscriptions !== null && !lookingUp && (
          <div className="border-t border-border pt-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Subscription history</p>
            {subscriptions.length === 0 ? (
              <p className="text-xs text-muted-foreground">No subscriptions found.</p>
            ) : (
              <div className="space-y-2">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-xs"
                  >
                    <span className="font-mono">{sub.plan_key}</span>
                    <span className="text-muted-foreground">{sub.status} &middot; {sub.source}</span>
                    <span className="text-muted-foreground">
                      {new Date(sub.started_at).toLocaleDateString()}
                      {sub.expires_at ? ` – ${new Date(sub.expires_at).toLocaleDateString()}` : " (no expiry)"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
      </div>

      {/* Cron jobs */}
      <section className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Cron jobs</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Every scheduled job gets an explicit enabled/disabled row the moment it's
          registered — nothing here runs on an implicit default.
        </p>
        {cronJobsLoading ? (
          <p className="text-xs text-muted-foreground">Loading...</p>
        ) : cronJobs.length === 0 ? (
          <p className="text-xs text-muted-foreground">No cron jobs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
            {cronJobs.map((job) => (
              <div
                key={job.tag}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium font-mono truncate">{job.tag}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {job.running ? (
                      <span className="text-primary">running now</span>
                    ) : job.enabled && job.nextRunInMinutes != null ? (
                      <>next in {job.nextRunInMinutes}m</>
                    ) : (
                      "disabled"
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  title="Run now"
                  aria-label={`Run ${job.tag} now`}
                  disabled={runningCronTag === job.tag || !!job.running}
                  onClick={() => runCronNow(job.tag)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-primary hover:border-primary/40 disabled:opacity-50"
                >
                  {runningCronTag === job.tag ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => toggleCron(job)}
                  disabled={togglingCronTag === job.tag}
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
                    job.enabled ? "bg-primary" : "bg-secondary border border-border"
                  }`}
                  aria-pressed={job.enabled}
                  aria-label={`Toggle ${job.tag}`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform ${
                      job.enabled ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Run history */}
        <div className="border-t border-border pt-4 mt-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground">Recent runs</p>
            <Select
              value={cronRunsFilter || "all"}
              onValueChange={(v) => {
                const tag = v === "all" ? "" : v;
                setCronRunsFilter(tag);
                loadCronRuns(tag || undefined);
              }}
            >
              <SelectTrigger className="h-7 w-[220px] text-xs">
                <SelectValue placeholder="All jobs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All jobs</SelectItem>
                {cronJobs.map((job) => (
                  <SelectItem key={job.tag} value={job.tag} className="text-xs font-mono">
                    {job.tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {cronRunsLoading ? (
            <p className="text-xs text-muted-foreground">Loading...</p>
          ) : cronRuns.length === 0 ? (
            <p className="text-xs text-muted-foreground">No runs recorded yet.</p>
          ) : (
            <div className="space-y-1.5 max-h-96 overflow-y-auto">
              {cronRuns.map((run) => (
                <div
                  key={run.id}
                  className="flex items-start gap-3 rounded-lg border border-border px-3 py-2 text-xs"
                >
                  <span
                    className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      run.status === "completed"
                        ? "bg-primary"
                        : run.status === "failed"
                        ? "bg-destructive"
                        : "bg-muted-foreground"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="font-mono font-medium">{run.tag}</span>
                      <span className="text-muted-foreground">
                        {new Date(run.started_at).toLocaleString()}
                      </span>
                      {run.duration_ms != null && (
                        <span className="text-muted-foreground">&middot; {run.duration_ms}ms</span>
                      )}
                      {run.dry_run && <span className="text-muted-foreground">&middot; dry run</span>}
                    </div>
                    <p
                      className={`mt-0.5 font-mono truncate ${
                        run.status === "failed" ? "text-destructive" : "text-muted-foreground"
                      }`}
                    >
                      {formatResult(run)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
