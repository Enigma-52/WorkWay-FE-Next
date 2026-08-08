"use client";

import { useEffect, useState } from "react";
import { Mail, MessageSquareHeart, BarChart3, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type FeatureFlag = {
  flag_key: string;
  enabled: boolean;
  description: string | null;
  updated_at: string;
};

type EmailType = "welcome" | "feedback_7day" | "weekly_summary";

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
];

export default function AdminPanelClient() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [flagsLoading, setFlagsLoading] = useState(true);
  const [sendingType, setSendingType] = useState<EmailType | null>(null);
  const [togglingKey, setTogglingKey] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/feature-flags`)
      .then((r) => r.json())
      .then((d) => setFlags(d.flags ?? []))
      .catch(() => toast.error("Failed to load feature flags"))
      .finally(() => setFlagsLoading(false));
  }, []);

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

  return (
    <div className="max-w-3xl space-y-8">
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-0.5">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold">Admin</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Test lifecycle emails and control feature flags. Only visible to admin accounts.
        </p>
      </div>

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
    </div>
  );
}
