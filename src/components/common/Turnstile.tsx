"use client";

import { useEffect, useId, useRef } from "react";
import Script from "next/script";

// Cloudflare's own documented always-passing test key — safe, non-secret
// fallback for local dev when a real site key isn't configured, so the
// widget still renders and the flow is testable without real Cloudflare
// credentials. Never use this in production; set NEXT_PUBLIC_TURNSTILE_SITE_KEY.
const TEST_SITE_KEY = "1x00000000000000000000AA";
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || TEST_SITE_KEY;

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
