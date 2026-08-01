// Central Mixpanel helpers: event tracking + lightweight bot detection.
// Bot detection is a heuristic signal (`is_bot` super property on every
// event), not a hard block — it lets Mixpanel reports be filtered by
// human vs. likely-bot traffic instead of guessing from raw UA strings.

const BOT_UA_PATTERN =
  /bot|crawl|spider|slurp|headless|phantom|puppeteer|playwright|selenium|curl|wget|python-requests|python-urllib|axios|got\/|node-fetch|postman|scrapy|semrush|ahrefs|mj12bot|dotbot|bytespider|gptbot|ccbot|claudebot|anthropic-ai|perplexitybot|facebookexternalhit|preview|monitor|pingdom|uptimerobot/i;

export type BotSignal = {
  isBot: boolean;
  reason: string | null;
};

export function detectBot(): BotSignal {
  if (typeof navigator === "undefined") {
    return { isBot: false, reason: null };
  }

  const ua = navigator.userAgent || "";

  if (BOT_UA_PATTERN.test(ua)) {
    return { isBot: true, reason: "user_agent" };
  }

  if (navigator.webdriver) {
    return { isBot: true, reason: "webdriver" };
  }

  if (typeof window !== "undefined" && !("chrome" in window) && /Chrome\//.test(ua) && !/Edg\/|OPR\//.test(ua)) {
    // A UA claiming Chrome but missing window.chrome is a common headless tell.
    return { isBot: true, reason: "missing_chrome_object" };
  }

  if (navigator.languages && navigator.languages.length === 0) {
    return { isBot: true, reason: "no_languages" };
  }

  return { isBot: false, reason: null };
}

export function track(event: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.mixpanel) return;
  window.mixpanel.track(event, props);
}

// Merges the visitor's anonymous event history onto a named profile.
// Only call this once we actually have a voluntarily-given email
// (e.g. a feedback or contact form) — never guess or infer identity.
export function identify(email: string, extra?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.mixpanel) return;
  window.mixpanel.identify(email);
  window.mixpanel.people.set({ $email: email, ...extra });
}
