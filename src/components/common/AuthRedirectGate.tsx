"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import AuthModal from "./AuthModal";
import { isSafeRedirectPath } from "@/lib/safeRedirect";

const DEFAULT_CALLBACK = "/dashboard";

/**
 * Mounted app-wide. Set by middleware.ts when an unauthenticated visitor
 * hits a protected /dashboard/* route (e.g. a Pro alert email linking
 * straight to /dashboard/seeker/alerts) — opens the sign-in modal with the
 * original destination as the callback, so both Google and magic-link
 * sign-in land back on the page the visitor actually wanted.
 */
export default function AuthRedirectGate() {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState(DEFAULT_CALLBACK);

  useEffect(() => {
    if (status === "loading") return;
    const target = searchParams.get("authRedirect");
    if (!target) return;

    const safeTarget = isSafeRedirectPath(target) ? target : DEFAULT_CALLBACK;

    if (status === "authenticated") {
      // Already signed in (e.g. link reopened in a session that's since
      // logged in another tab) — just go straight there.
      router.replace(safeTarget);
      return;
    }

    setCallbackUrl(safeTarget);
    setOpen(true);

    // Strip the param so refreshing or sharing the URL doesn't reopen this.
    const params = new URLSearchParams(searchParams.toString());
    params.delete("authRedirect");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, searchParams]);

  return (
    <AuthModal open={open} onOpenChange={setOpen} callbackUrl={callbackUrl} source="deep_link_redirect" />
  );
}
