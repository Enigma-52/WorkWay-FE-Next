// Mirrors WorkWay--BE/src/utils/plans.js. Keep in sync — this is the single
// place that defines which plan keys count as "pro or better" on the client.
const PRO_TIER_PLANS = new Set(["pro", "lifetime"]);

type PlanKeyish = { planKey?: string | null } | string | null | undefined;

function resolvePlanKey(input: PlanKeyish): string | null | undefined {
  return typeof input === "string" ? input : input?.planKey;
}

export function isPro(userOrPlanKey: PlanKeyish): boolean {
  const planKey = resolvePlanKey(userOrPlanKey);
  return !!planKey && PRO_TIER_PLANS.has(planKey);
}

export function hasPlan(userOrPlanKey: PlanKeyish, planKey: string): boolean {
  return resolvePlanKey(userOrPlanKey) === planKey;
}

export type LivePrice = {
  amount: number;
  currency: string;
  type: "recurring_price" | "one_time_price" | "usage_based_price";
  interval: "Day" | "Week" | "Month" | "Year" | null;
  intervalCount: number | null;
};

const INTERVAL_LABELS: Record<string, string> = { Day: "day", Week: "wk", Month: "mo", Year: "yr" };

// Formats a live Dodo price (from GET /api/billing/plans) into a display
// string — shared by the pricing page's cards and the landing page's alerts
// spotlight, so a price change in the Dodo dashboard shows up everywhere
// without a frontend deploy. Callers should fall back to a hardcoded value
// if the fetch fails (Dodo hiccup, plan has no product yet, etc).
export function formatLivePrice(price: LivePrice): { price: string; period?: string } {
  const amount = price.amount / 100;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency || "USD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
  const period =
    price.type === "recurring_price" && price.interval
      ? INTERVAL_LABELS[price.interval] ?? price.interval.toLowerCase()
      : undefined;
  return { price: formatted, period };
}
