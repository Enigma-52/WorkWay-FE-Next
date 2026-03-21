// workway-next/src/data/locationSeoData.ts

export type SeoRole = { name: string; slug: string };
export type SeoLocation = { name: string; slug: string };

// Top-traffic roles first (first 10 = pre-built at build time)
export const ALL_ROLES: SeoRole[] = [
  { name: "Software Engineer", slug: "software-engineer" },
  { name: "Frontend Engineer", slug: "frontend-engineer" },
  { name: "Backend Engineer", slug: "backend-engineer" },
  { name: "Full Stack Engineer", slug: "full-stack-engineer" },
  { name: "Product Manager", slug: "product-manager" },
  { name: "Data Scientist", slug: "data-scientist" },
  { name: "DevOps Engineer", slug: "devops-engineer" },
  { name: "Machine Learning Engineer", slug: "machine-learning-engineer" },
  { name: "UI/UX Designer", slug: "ui-ux-designer" },
  { name: "Data Analyst", slug: "data-analyst" },
  // On-demand (not pre-built at build time)
  { name: "iOS Engineer", slug: "ios-engineer" },
  { name: "Android Engineer", slug: "android-engineer" },
  { name: "QA Engineer", slug: "qa-engineer" },
  { name: "Site Reliability Engineer", slug: "site-reliability-engineer" },
  { name: "Engineering Manager", slug: "engineering-manager" },
  { name: "Product Designer", slug: "product-designer" },
  { name: "Business Analyst", slug: "business-analyst" },
  { name: "Marketing Manager", slug: "marketing-manager" },
  { name: "Customer Success Manager", slug: "customer-success-manager" },
  { name: "Technical Writer", slug: "technical-writer" },
  { name: "HR Manager", slug: "hr-manager" },
  { name: "Finance Analyst", slug: "finance-analyst" },
  { name: "Operations Manager", slug: "operations-manager" },
  { name: "Legal Counsel", slug: "legal-counsel" },
  { name: "Sales Engineer", slug: "sales-engineer" },
];

// Top-traffic locations first (first 10 = pre-built at build time)
export const ALL_LOCATIONS: SeoLocation[] = [
  { name: "Bangalore", slug: "bangalore" },
  { name: "Remote", slug: "remote" },
  { name: "San Francisco", slug: "san-francisco" },
  { name: "New York", slug: "new-york" },
  { name: "London", slug: "london" },
  { name: "Hyderabad", slug: "hyderabad" },
  { name: "Mumbai", slug: "mumbai" },
  { name: "Delhi", slug: "delhi" },
  { name: "Seattle", slug: "seattle" },
  { name: "Austin", slug: "austin" },
  // On-demand
  { name: "Singapore", slug: "singapore" },
  { name: "Berlin", slug: "berlin" },
  { name: "Toronto", slug: "toronto" },
  { name: "Dubai", slug: "dubai" },
  { name: "Pune", slug: "pune" },
  { name: "Chennai", slug: "chennai" },
  { name: "Boston", slug: "boston" },
  { name: "Los Angeles", slug: "los-angeles" },
  { name: "Chicago", slug: "chicago" },
  { name: "Amsterdam", slug: "amsterdam" },
  { name: "Paris", slug: "paris" },
  { name: "Sydney", slug: "sydney" },
  { name: "Tokyo", slug: "tokyo" },
  { name: "Dublin", slug: "dublin" },
  { name: "Bengaluru", slug: "bengaluru" },
];

// Pre-compute all valid slug combinations — O(1) lookup at request time
export const VALID_SEO_SLUGS: Set<string> = new Set(
  ALL_ROLES.flatMap((r) => ALL_LOCATIONS.map((l) => `${r.slug}-jobs-in-${l.slug}`))
);

export function composeLocationSeoSlug(roleSlug: string, locationSlug: string): string {
  return `${roleSlug}-jobs-in-${locationSlug}`;
}

/**
 * Parses a URL slug like "software-engineer-jobs-in-bangalore" into
 * the matching role and location objects from the curated lists.
 * Returns null if either part is not found — validates against lists, not just format.
 * NOTE: Role and location slugs must not contain "-jobs-in-" (delimiter).
 */
export function parseLocationSeoSlug(
  slug: string
): { role: SeoRole; location: SeoLocation } | null {
  const delimiter = "-jobs-in-";
  const idx = slug.indexOf(delimiter);
  if (idx === -1) return null;

  const roleSlug = slug.slice(0, idx);
  const locationSlug = slug.slice(idx + delimiter.length);

  const role = ALL_ROLES.find((r) => r.slug === roleSlug) ?? null;
  const location = ALL_LOCATIONS.find((l) => l.slug === locationSlug) ?? null;

  if (!role || !location) return null;
  return { role, location };
}
