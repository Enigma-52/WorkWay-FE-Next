"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FeatureShowcaseModal from "./FeatureShowcaseModal";
import { ONBOARDING_FEATURES } from "@/data/onboardingFeatures";
import { track } from "@/lib/analytics";

function seenKey(userId: string) {
  return `workway_onboarding_seen_${userId}`;
}

const PRO_FEATURE_INDEX = ONBOARDING_FEATURES.findIndex((f) => f.pro);

export default function OnboardingGate() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [variant, setVariant] = useState<"signup" | "checkout">("signup");

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.dbId) return;
    const userId = session.user.dbId;

    // Case 1: just completed a Dodo checkout — show the Pro feature front and center.
    if (searchParams.get("checkout") === "success") {
      setVariant("checkout");
      setStartIndex(PRO_FEATURE_INDEX >= 0 ? PRO_FEATURE_INDEX : 0);
      setOpen(true);
      localStorage.setItem(seenKey(userId), "1");
      track("Payment Completed", {
        subscription_id: searchParams.get("subscription_id") ?? undefined,
        status: searchParams.get("status") ?? undefined,
      });

      // Strip the checkout params so refreshing/sharing the URL doesn't re-trigger this.
      const params = new URLSearchParams(searchParams.toString());
      ["checkout", "subscription_id", "status", "email"].forEach((k) => params.delete(k));
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
      return;
    }

    // Case 2: first time this browser has seen this signed-in user — general tour.
    if (!localStorage.getItem(seenKey(userId))) {
      setVariant("signup");
      setStartIndex(0);
      setOpen(true);
    }
    // Only re-run when the user/session identity or checkout param changes, not on every nav.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.dbId, searchParams]);

  function handleClose() {
    setOpen(false);
    if (session?.user?.dbId) localStorage.setItem(seenKey(session.user.dbId), "1");
  }

  return (
    <FeatureShowcaseModal
      open={open}
      onClose={handleClose}
      startIndex={startIndex}
      title={variant === "checkout" ? "You're Pro now 🎉" : "Welcome to WorkWay"}
      subtitle={variant === "checkout" ? "Here's what just unlocked." : "Here's everything you can do."}
    />
  );
}
