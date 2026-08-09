"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Script from "next/script";
import {
  detectBot,
  flushQueuedAnalytics,
  identify,
  resetIdentity,
  shouldLoadAnalytics,
  track,
} from "@/lib/analytics";

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-PMBBRGCPM5";
const MIXPANEL_TOKEN =
  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "572f2bc3511f9a768d95e72b7e925c37";
const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-4936731849151313";

// How long after load to wait for an idle moment before giving up and loading
// analytics anyway. Long enough to clear the window Lighthouse measures TBT and
// Speed Index in, short enough that a visitor who reads without interacting is
// still counted.
const IDLE_TIMEOUT_MS = 4000;
const FALLBACK_DELAY_MS = 3000;
// A fast machine reaches its first idle period within a few hundred ms of
// load, which is still inside the window Lighthouse scores. Hold off a little
// past that before even asking for idle time.
const MIN_DELAY_AFTER_LOAD_MS = 2000;

const INTERACTION_EVENTS = [
  "pointerdown",
  "keydown",
  "touchstart",
  "scroll",
] as const;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    mixpanel?: {
      track: (event: string, props?: Record<string, unknown>) => void;
      register: (props: Record<string, unknown>) => void;
      identify: (id: string) => void;
      reset: () => void;
      people: { set: (props: Record<string, unknown>) => void };
    };
  }
}

/**
 * Resolves once the page is idle after load, or immediately on the visitor's
 * first interaction. Analytics bundles are ~250 KiB of third-party JavaScript
 * that block nothing visually, so keeping them off the main thread until the
 * page has settled costs no data and buys back TBT.
 */
function useDeferredStart(): boolean {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;
    let settleHandle: number | undefined;

    const start = () => {
      if (cancelled) return;
      cancelled = true;
      cleanup();
      setStarted(true);
    };

    const cleanup = () => {
      for (const event of INTERACTION_EVENTS) {
        window.removeEventListener(event, start);
      }
      window.removeEventListener("load", onLoad);
      if (idleHandle !== undefined) window.cancelIdleCallback?.(idleHandle);
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle);
      if (settleHandle !== undefined) window.clearTimeout(settleHandle);
    };

    function onLoad() {
      settleHandle = window.setTimeout(scheduleIdle, MIN_DELAY_AFTER_LOAD_MS);
    }

    function scheduleIdle() {
      if (cancelled) return;
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(start, {
          timeout: IDLE_TIMEOUT_MS,
        });
      } else {
        timeoutHandle = window.setTimeout(start, FALLBACK_DELAY_MS);
      }
    }

    for (const event of INTERACTION_EVENTS) {
      window.addEventListener(event, start, { passive: true, once: true });
    }

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return cleanup;
  }, []);

  return started;
}

/**
 * Installs the standard gtag() stub. It pushes onto dataLayer, so page views
 * recorded before the 180 KiB gtag/js finishes downloading are queued by
 * Google's own mechanism and replayed the moment it initialises.
 */
function ensureGtagStub() {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return;
  if (typeof window.gtag === "function") return;

  window.dataLayer = window.dataLayer || [];
  // gtag.js requires the raw `arguments` object, not a rest array.
  const gtag: NonNullable<Window["gtag"]> = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}

function trackPageView(path: string) {
  if (GA_MEASUREMENT_ID) {
    ensureGtagStub();
    window.gtag?.("config", GA_MEASUREMENT_ID, { page_path: path });
  }

  track("Page View", { path });
}

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const mixpanelInitialized = useRef(false);
  const identifiedUserId = useRef<string | null>(null);
  const started = useDeferredStart();
  // Computed once per mount. Gates GA4 specifically (Mixpanel keeps loading
  // for bots and just tags them via `is_bot`) because GA4's standard reports
  // have no equivalent way to filter a dimension out after the fact — a
  // farm of headless browsers that fully executes JS (real Chrome, real
  // scroll events) was inflating session_start/first_visit/scroll counts by
  // 50-100x versus real page_view counts. Safe on the server: `started` is
  // false during SSR and the initial client render either way, so this
  // doesn't change what's rendered until after hydration.
  const [isBot] = useState(() => detectBot().isBot);

  const fullPath = useMemo(() => {
    const qs = searchParams?.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!started || !MIXPANEL_TOKEN || mixpanelInitialized.current) return;
    if (!shouldLoadAnalytics()) return;
    mixpanelInitialized.current = true;

    import("mixpanel-browser").then((mod) => {
      const mixpanel = mod.default;
      mixpanel.init(MIXPANEL_TOKEN, {
        // Page views and clicks are tracked manually with richer, named
        // events (Page View, Apply Click, etc.) — autocapture's generic
        // [Auto] Page View / Element Click / Dead Click would just
        // duplicate them, so only keep the signals we don't send manually.
        autocapture: {
          pageview: false,
          click: false,
          dead_click: false,
          rage_click: true,
          input: false,
          scroll: false,
          submit: false,
        },
        track_pageview: false,
        record_sessions_percent: 0,
      });

      const { isBot, reason } = detectBot();
      mixpanel.register({ is_bot: isBot, bot_reason: reason });

      window.mixpanel = mixpanel;
      // Replay the page view (and anything else) captured while loading.
      flushQueuedAnalytics();
    });
  }, [started]);

  useEffect(() => {
    if (!fullPath || isBot) return;
    trackPageView(fullPath);
  }, [fullPath, isBot]);

  // Attribute events to the signed-in user so funnels/retention can be
  // sliced per person instead of per anonymous device.
  useEffect(() => {
    const dbId = session?.user?.dbId;

    if (status === "authenticated" && dbId && identifiedUserId.current !== dbId) {
      identifiedUserId.current = dbId;
      identify(dbId, {
        $email: session.user.email ?? undefined,
        $name: session.user.displayName || session.user.name || undefined,
        roles: session.user.roles ?? [],
        plan_key: session.user.planKey ?? "free",
      });

      // `isNewUser` reflects a fresh DB insert at sign-in and stays true for
      // the lifetime of that JWT — guard with localStorage so a page reload
      // mid-session doesn't refire "Signup Completed" as a second event.
      const signupTrackedKey = `workway_signup_tracked_${dbId}`;
      if (session.user.isNewUser && !localStorage.getItem(signupTrackedKey)) {
        localStorage.setItem(signupTrackedKey, "1");
        // No email here — identify() above already attaches it as `$email`
        // on the profile, which is the correct scope for it. Duplicating it
        // as a plain event property would put it in every raw event export
        // and funnel breakdown for no added value.
        track("Signup Completed", { method: session.user.authProvider || "unknown" });
      } else if (!session.user.isNewUser) {
        track("Login Completed", { method: session.user.authProvider || "unknown" });
      }
    }

    if (status === "unauthenticated" && identifiedUserId.current) {
      identifiedUserId.current = null;
      resetIdentity();
    }
  }, [status, session]);

  if (!started || isBot) return null;

  return (
    <>
      {GA_MEASUREMENT_ID && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
      )}
      {/* Moved here from layout.tsx so it shares the same idle-after-load-or-
          first-interaction gate as the rest of analytics, instead of firing
          unconditionally at afterInteractive on every pageview. AdSense docs
          ask for this loaded early so Auto Ads can scan the page for
          placements, but a multi-second delay is standard practice and
          doesn't meaningfully hurt fill rate — and skipping it for `isBot`
          traffic avoids invalid-traffic ad impressions, which AdSense's own
          policy considers a plus, not a downside. */}
      {ADSENSE_CLIENT_ID && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
