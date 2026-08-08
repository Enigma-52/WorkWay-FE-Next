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

const LOCALHOST_HOST_PATTERN = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|.*\.local)$/i;
const LOCAL_DEBUG_OVERRIDE_KEY = "workway_mixpanel_local_debug";

/**
 * True for localhost/loopback/private dev hosts. Dev traffic was polluting
 * production Mixpanel reports (759+ events from `localhost:3001` alone), so
 * AnalyticsProvider skips loading the SDK entirely on these hosts unless a
 * developer explicitly opts in via `?mp_debug=1` (persisted so a full local
 * QA pass doesn't need the query param on every route).
 */
export function isLocalDevHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  if (LOCALHOST_HOST_PATTERN.test(host)) return true;
  // RFC1918 private ranges — covers LAN-IP dev servers (e.g. testing on a phone).
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)) return true;
  return false;
}

export function shouldLoadAnalytics(): boolean {
  if (typeof window === "undefined") return false;
  if (!isLocalDevHost()) return true;
  try {
    if (new URLSearchParams(window.location.search).get("mp_debug") === "1") {
      window.localStorage.setItem(LOCAL_DEBUG_OVERRIDE_KEY, "1");
    }
    return window.localStorage.getItem(LOCAL_DEBUG_OVERRIDE_KEY) === "1";
  } catch {
    return false;
  }
}

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

// The mixpanel bundle is loaded lazily (see AnalyticsProvider), so calls made
// before it arrives — the first page view, or a click on a fast-loading page —
// would otherwise be dropped. Queue them and replay once the SDK is present.
type MixpanelApi = NonNullable<Window["mixpanel"]>;
type QueuedOp = (mixpanel: MixpanelApi) => void;

const MAX_QUEUED_OPS = 100;
const queuedOps: QueuedOp[] = [];

function withMixpanel(op: QueuedOp) {
  if (typeof window === "undefined") return;
  if (window.mixpanel) {
    op(window.mixpanel);
    return;
  }
  if (queuedOps.length >= MAX_QUEUED_OPS) queuedOps.shift();
  queuedOps.push(op);
}

/** Replays everything captured before the SDK finished loading. */
export function flushQueuedAnalytics() {
  if (typeof window === "undefined" || !window.mixpanel) return;
  const mixpanel = window.mixpanel;
  const ops = queuedOps.splice(0, queuedOps.length);
  for (const op of ops) op(mixpanel);
}

export function track(event: string, props?: Record<string, unknown>) {
  withMixpanel((mixpanel) => mixpanel.track(event, props));
}

// Merges the visitor's anonymous event history onto a named profile.
// Only call this once we actually have a voluntarily-given identity
// (a signed-in user's stable db id, or an email from a feedback/contact
// form) — never guess or infer identity.
export function identify(distinctId: string, extra?: Record<string, unknown>) {
  withMixpanel((mixpanel) => {
    mixpanel.identify(distinctId);
    if (extra) mixpanel.people.set(extra);
  });
}

// Call on sign-out so the next login (possibly a different person on a
// shared machine) doesn't get attributed to the previous user's profile.
export function resetIdentity() {
  withMixpanel((mixpanel) => mixpanel.reset());
}
