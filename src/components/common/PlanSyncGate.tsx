"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

/**
 * The session JWT caches `plan_key`/`roles` at sign-in and only changes when
 * the client explicitly calls `update()` — nothing does that automatically
 * after a Dodo checkout, an admin-panel grant, or a webhook event, so the
 * browser can keep showing "Free" for an account that's actually Pro in the
 * DB until the cookie is naturally re-issued (next full sign-in).
 *
 * Mounted app-wide: on every session load (fresh login, page reload, tab
 * refocus — whenever NextAuth re-hydrates the session) this checks the real
 * DB value via `/api/user/me` and calls `update()` if it's drifted, so the
 * fix lands everywhere `session.user.planKey`/`roles` are read, not just
 * one page.
 */
export default function PlanSyncGate() {
  const { data: session, status, update } = useSession();
  const lastChecked = useRef<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.dbId) return;
    // Once per dbId per mount is enough — this isn't meant to poll.
    if (lastChecked.current === session.user.dbId) return;
    lastChecked.current = session.user.dbId;

    fetch("/api/user/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((fresh) => {
        if (!fresh) return;
        const rolesChanged = JSON.stringify(fresh.roles ?? []) !== JSON.stringify(session.user.roles ?? []);
        const planChanged = fresh.plan_key && fresh.plan_key !== session.user.planKey;
        if (planChanged || rolesChanged) {
          update({ planKey: fresh.plan_key, roles: fresh.roles });
        }
      })
      .catch(() => {
        // Silent — worst case the session stays stale until next sign-in,
        // same as today.
      });
  }, [status, session, update]);

  return null;
}
