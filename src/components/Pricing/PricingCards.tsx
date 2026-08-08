"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/common/AuthModal";
import { isPro, hasPlan } from "@/lib/plans";
import { toast } from "sonner";
import { track } from "@/lib/analytics";

type Plan = {
  key: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  comingSoon?: boolean;
};

type LivePrice = {
  amount: number;
  currency: string;
  type: "recurring_price" | "one_time_price" | "usage_based_price";
  interval: "Day" | "Week" | "Month" | "Year" | null;
  intervalCount: number | null;
};

const INTERVAL_LABELS: Record<string, string> = { Day: "day", Week: "wk", Month: "mo", Year: "yr" };

// Formats a live Dodo price into the same {price, period} shape the static
// PLANS table below uses, so a price change in the Dodo dashboard shows up
// here without a frontend deploy — falls back to the hardcoded value above
// if this can't be fetched (Dodo hiccup, plan has no product yet, etc).
function formatLivePrice(price: LivePrice): { price: string; period?: string } {
  const amount = price.amount / 100;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency || "USD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
  const period =
    price.type === "recurring_price" && price.interval
      ? INTERVAL_LABELS[price.interval] ?? price.interval.toLowerCase()
      : undefined;
  return { price: formatted, period };
}

const PLANS: Plan[] = [
  {
    key: "free",
    name: "Free",
    price: "$0",
    description: "Everything you need to search and apply.",
    features: [
      "Search every job WorkWay tracks",
      "Save jobs & track applications",
      "Follow companies",
      "Public Talent Profile",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "$5",
    period: "mo",
    description: "For an active job search.",
    highlighted: true,
    features: [
      "Everything in Free",
      "Instant email alerts when followed companies post new roles",
      "Priority support",
      "Early access to new features",
    ],
  },
  {
    key: "lifetime",
    name: "Lifetime",
    price: "Coming soon",
    description: "One-time purchase, Pro forever.",
    comingSoon: true,
    features: [
      "Everything in Pro",
      "Pay once, no renewals",
      "Locked-in price as we add features",
    ],
  },
];

export default function PricingCards() {
  const { data: session } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [checkingOutKey, setCheckingOutKey] = useState<string | null>(null);
  const [livePrices, setLivePrices] = useState<Record<string, LivePrice | null>>({});

  useEffect(() => {
    fetch("/api/billing/plans")
      .then((r) => r.json())
      .then((d) => {
        const map: Record<string, LivePrice | null> = {};
        for (const p of d.plans ?? []) map[p.key] = p.price ?? null;
        setLivePrices(map);
      })
      .catch(() => {
        // Silent — the static PLANS table below is a perfectly good fallback.
      });
  }, []);

  const displayPlans = PLANS.map((plan) => {
    const live = livePrices[plan.key];
    if (!live || plan.comingSoon) return plan;
    return { ...plan, ...formatLivePrice(live) };
  });

  async function startCheckout(planKey: string) {
    track("Pricing Plan Clicked", { plan_key: planKey, signed_in: !!session });

    if (!session) {
      setPendingPlan(planKey);
      setAuthOpen(true);
      return;
    }
    setCheckingOutKey(planKey);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_key: planKey }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkout_url) throw new Error(data.error || "Failed to start checkout");
      track("Checkout Started", { plan_key: planKey });
      window.location.href = data.checkout_url;
    } catch (err) {
      toast.error("Couldn't start checkout", {
        description: err instanceof Error ? err.message : undefined,
      });
      track("Checkout Start Failed", {
        plan_key: planKey,
        reason: err instanceof Error ? err.message : "unknown",
      });
      setCheckingOutKey(null);
    }
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {displayPlans.map((plan) => {
          const isFreeCard = plan.key === "free";
          // Signed-in state fully determines the Free card too: current for a
          // free-tier user, "included" (non-actionable) for a Pro/Lifetime
          // user — never a "Get started" button that would just reopen the
          // sign-in modal for someone already authenticated.
          const isCurrent = session
            ? isFreeCard
              ? !isPro(session.user)
              : hasPlan(session.user, plan.key)
            : false;

          return (
            <div
              key={plan.key}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                plan.highlighted
                  ? "border-primary/50 bg-primary/[0.03] shadow-[0_0_40px_hsl(82_100%_55%/0.1)]"
                  : "border-border bg-card/60"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  <Sparkles className="h-3 w-3" />
                  Most popular
                </span>
              )}

              <h2 className="text-lg font-semibold">{plan.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                {plan.period && (
                  <span className="ml-1 text-sm text-muted-foreground">/{plan.period}</span>
                )}
              </div>

              <ul className="mb-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <Button size="sm" variant="outline" disabled className="w-full">
                  Current plan
                </Button>
              ) : plan.comingSoon ? (
                <Button size="sm" variant="outline" disabled className="w-full">
                  Coming soon
                </Button>
              ) : isFreeCard ? (
                session ? (
                  <Button size="sm" variant="outline" disabled className="w-full">
                    Included in {session.user.planKey === "lifetime" ? "Lifetime" : "Pro"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      track("Pricing Plan Clicked", { plan_key: plan.key, signed_in: false });
                      setAuthOpen(true);
                    }}
                  >
                    Get started
                  </Button>
                )
              ) : (
                <Button
                  size="sm"
                  className="w-full"
                  disabled={checkingOutKey === plan.key}
                  onClick={() => startCheckout(plan.key)}
                >
                  {checkingOutKey === plan.key ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <AuthModal
        open={authOpen}
        onOpenChange={(open) => {
          setAuthOpen(open);
          if (!open && pendingPlan) {
            // Signing in triggers a full page reload via NextAuth's redirect,
            // so we can't resume checkout in-place — send them back to
            // /pricing where they can click Subscribe again, now signed in.
            setPendingPlan(null);
          }
        }}
        callbackUrl="/pricing"
        source="pricing"
      />
    </>
  );
}
