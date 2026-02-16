"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import mixpanel from "mixpanel-browser";

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-PMBBRGCPM5";
const MIXPANEL_TOKEN =
  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "572f2bc3511f9a768d95e72b7e925c37";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    mixpanel?: typeof mixpanel;
  }
}

function trackPageView(path: string) {
  if (typeof window === "undefined") return;

  if (GA_MEASUREMENT_ID && typeof window.gtag === "function") {
    window.gtag("config", GA_MEASUREMENT_ID, { page_path: path });
  }

  if (window.mixpanel) {
    window.mixpanel.track("Page View", { path });
  }
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

    mixpanel.init(MIXPANEL_TOKEN, {
      autocapture: true,
      track_pageview: false,
      record_sessions_percent: 0,
    });

    window.mixpanel = mixpanel;
    mixpanelInitialized.current = true;
  }, []);

  useEffect(() => {
    if (!fullPath) return;
    trackPageView(fullPath);
  }, [fullPath]);

  return GA_MEASUREMENT_ID ? (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
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
