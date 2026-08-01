"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { detectBot, track } from "@/lib/analytics";

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-PMBBRGCPM5";
const MIXPANEL_TOKEN =
  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "572f2bc3511f9a768d95e72b7e925c37";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    mixpanel?: {
      track: (event: string, props?: Record<string, unknown>) => void;
      register: (props: Record<string, unknown>) => void;
      identify: (id: string) => void;
      people: { set: (props: Record<string, unknown>) => void };
    };
  }
}

function trackPageView(path: string) {
  if (GA_MEASUREMENT_ID && typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GA_MEASUREMENT_ID, { page_path: path });
  }

  track("Page View", { path });
}

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mixpanelInitialized = useRef(false);

  const fullPath = useMemo(() => {
    const qs = searchParams?.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!MIXPANEL_TOKEN || mixpanelInitialized.current) return;

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
      window.mixpanel = mixpanel;

      const { isBot, reason } = detectBot();
      mixpanel.register({ is_bot: isBot, bot_reason: reason });

      mixpanelInitialized.current = true;
    });
  }, []);

  useEffect(() => {
    if (!fullPath) return;
    trackPageView(fullPath);
  }, [fullPath]);

  return GA_MEASUREMENT_ID ? (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script
        id="google-analytics-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
          `,
        }}
      />
    </>
  ) : null;
}
