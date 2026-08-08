"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isPro, hasPlan } from "@/lib/plans";

type PlanGateProps = {
  children: React.ReactNode;
  /** Minimum required plan. "pro" also allows "lifetime" (see lib/plans.ts). Ignored if `plan` is set. */
  requirePro?: boolean;
  /** Exact plan key required (use for a specific tier, e.g. "lifetime"). */
  plan?: string;
  featureName?: string;
  /** Render nothing (instead of the upsell card) when access is denied. */
  hideWhenLocked?: boolean;
};

export default function PlanGate({
  children,
  requirePro = true,
  plan,
  featureName = "This feature",
  hideWhenLocked = false,
}: PlanGateProps) {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  const allowed = plan
    ? hasPlan(session?.user, plan)
    : requirePro
      ? isPro(session?.user)
      : true;

  if (allowed) return <>{children}</>;
  if (hideWhenLocked) return null;

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/40 px-6 py-8 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
        <Lock className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">{featureName} is a Pro feature</p>
      <p className="max-w-sm text-xs text-muted-foreground">
        Upgrade to unlock this and other premium features on WorkWay.
      </p>
      <Button size="sm" asChild>
        <Link href="/pricing">See plans</Link>
      </Button>
    </div>
  );
}
