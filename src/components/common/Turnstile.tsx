"use client";

import { useEffect, useId, useRef } from "react";
import Script from "next/script";

// WorkWay's real Turnstile site key, hardcoded as the default — same
// pattern as the Mixpanel/GA tokens elsewhere in this codebase. Safe to
// commit: Turnstile site keys (unlike the secret key, which stays in .env,
// never in code) are meant to be embedded client-side. This means the
// widget works correctly even on a build that forgot to pass
// --build-arg NEXT_PUBLIC_TURNSTILE_SITE_KEY, instead of silently falling
// back to a test key that shows Cloudflare's "for testing only" banner in
// production. Override via NEXT_PUBLIC_TURNSTILE_SITE_KEY if ever needed —
// e.g. set it to Cloudflare's public always-pass test key,
// "1x00000000000000000000AA", for local dev without hitting a real challenge.
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAACrzRt1Z9cZGoEY_";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

type TurnstileProps = {
  onVerify: (token: string) => void;
  onExpire?: () => void;
};

/**
 * Cloudflare Turnstile challenge, rendered once per mount. Resets itself if
 * the container is remounted (e.g. the auth modal closing and reopening) —
 * a token is single-use, so callers must re-verify each time the modal opens.
 */
export default function Turnstile({ onVerify, onExpire }: TurnstileProps) {
  const containerId = useId().replace(/:/g, "");
  const widgetIdRef = useRef<string | null>(null);
  const readyRef = useRef(false);

  function render() {
    if (!window.turnstile || readyRef.current) return;
    readyRef.current = true;
    widgetIdRef.current = window.turnstile.render(`#${containerId}`, {
      sitekey: SITE_KEY,
      callback: onVerify,
      "expired-callback": onExpire,
      theme: "dark",
    });
  }

  useEffect(() => {
    render();
    return () => {
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
      }
      readyRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
        onReady={render}
      />
      <div id={containerId} className="flex justify-center" />
    </>
  );
}
