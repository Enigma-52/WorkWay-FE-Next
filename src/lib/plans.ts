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
